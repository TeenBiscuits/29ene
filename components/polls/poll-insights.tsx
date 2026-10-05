"use client";

import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { DataTable } from './data-table';
import { pollDetails, parties, percentage } from '@/lib/polls/details';
import { ageCategories } from '@/lib/polls/demographics.mjs';
import { aggregatePolls, type PollMetric, type PollSource } from '@/lib/polls/aggregation.mjs';
import { hasPublishedValues, contributingSources } from '@/lib/polls/coverage.mjs';
import { pollCopy } from '@/lib/polls/copy';
import { insightsCopy, ideologyLabels } from '@/lib/polls/insights-copy';
import { pollNumbers } from '@/lib/polls/formatters';
import type { Locale } from '@/lib/locales';
const SurveyBars = dynamic(() => import('./survey-bars').then(module => module.SurveyBars));
const recall = 'Recuerdo de voto - Generales';
const insightParties = [...parties, { key: 'SALF', response: 'Se acabó la fiesta', color: ageCategories.find(category => category.key === 'SALF')!.color }];
const ideologySegments = ideologyLabels.es;
const generationSegments = ['Hombre - Generación Z','Mujer - Generación Z','Hombre - Millenials','Mujer - Millenials','Hombre - Generacíón X','Mujer - Generación X','Hombre - Baby Boomers/Silent Generation','Mujer - Baby Boomers/Silent Generation'];
const generationLabels = ['Gen. Z','Millennials','Gen. X','Boomers / Silent'];

export function PollInsights({ locale, metrics, sourceIds, period, sources }: { locale: Locale; metrics: PollMetric[]; sourceIds: string[]; period: string; sources: PollSource[] }) {
  const c = pollCopy[locale];
  const i = insightsCopy[locale];
  const config = Object.fromEntries(ageCategories.map(category => [category.key, { label: category.key === 'regional' ? c.regional : category.key === 'other' ? c.otherResponses : category.key, color: category.color }]));
  const ideology = aggregatePolls(pollDetails.ideologyObservations, sources, period, sourceIds);
  const generations = aggregatePolls(pollDetails.sexGenerationObservations, sources, period, sourceIds);
  const note = (rows: PollMetric[], sheet: string, question: string) => contributingSources(rows, sources, sheet, question).map(source => `${source.pollster} · ${source.period}`).join(' / ');
  const empty = <div className="survey-empty" role="status"><p>{c.noData}</p><span>{c.noDataDescription}</span></div>;
  const rejection = insightParties.map((party, index) => ({ group: party.key, percentage: percentage(recall, `P5_${index + 1}`, '0 No le votaría nunca', 'Total', metrics), fill: party.color }));
  const sympathy = insightParties.map(party => ({ group: party.key, sympathy: percentage(recall, 'P4', party.response, 'Total', metrics), intention: percentage(recall, 'P3', party.response, 'Total', metrics), fill: party.color }));
  const stackedRow = (sheet: string, segment: string, label: string, rows: PollMetric[]) => ({ group: label, ...Object.fromEntries(ageCategories.map(category => [category.key, percentage(sheet, 'P3', category.key, segment, rows)])) });
  return <>
    <Card><CardHeader><CardTitle><h2>{i.rejection}</h2></CardTitle><CardDescription>{i.rejectionDescription}</CardDescription></CardHeader><CardContent>{rejection.some(row => row.percentage !== null) ? <><SurveyBars rows={rejection} config={{ percentage: { label: i.rejection, color: 'var(--chart-1)' } }} locale={locale} title={i.rejection} single height={320} /><Accordion className="poll-data"><AccordionItem value="rejection"><AccordionTrigger>{c.data}</AccordionTrigger><AccordionContent><div className="poll-table-scroll"><table><caption>{i.rejectionDescription}</caption><thead><tr><th scope="col">{c.response}</th><th scope="col">%</th></tr></thead><tbody>{rejection.map(row => <tr key={row.group}><th scope="row">{row.group}</th><td>{row.percentage === null ? c.missing : `${pollNumbers[locale].format(row.percentage)}%`}</td></tr>)}</tbody></table></div></AccordionContent></AccordionItem></Accordion></> : empty}</CardContent><CardFooter>{note(metrics, recall, 'P5_1')}</CardFooter></Card>
    <Card className="survey-wide"><CardHeader><CardTitle><h2>{i.sympathy}</h2></CardTitle><CardDescription>{i.sympathyDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(metrics, recall, 'P4') ? <><SurveyBars rows={sympathy} config={{ sympathy: { label: i.sympathySeries, color: 'var(--muted-foreground)' }, intention: { label: i.intentionSeries, color: 'var(--foreground)' } }} locale={locale} title={i.sympathy} paired height={380} labelWidth={80} /><DataTable locale={locale} metrics={metrics} sheet={recall} question="P4" segments={['Total']} caption={i.sympathySeries} triggerLabel={`${c.data} · ${i.sympathySeries}`} /><DataTable locale={locale} metrics={metrics} sheet={recall} question="P3" segments={['Total']} caption={i.intentionSeries} triggerLabel={`${c.data} · ${i.intentionSeries}`} /></> : empty}</CardContent><CardFooter>{note(metrics, recall, 'P4')}</CardFooter></Card>
    <Card className="survey-wide"><CardHeader><CardTitle><h2>{i.ideology}</h2></CardTitle><CardDescription>{i.ideologyDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(ideology, 'Ideología 7', 'P3') ? <><p className="survey-scroll-hint">{i.scroll}</p><div className="survey-profile-scroll" role="region" aria-label={i.ideology} tabIndex={0}><SurveyBars rows={ideologySegments.map((segment, index) => stackedRow('Ideología 7', segment, ideologyLabels[locale][index], ideology))} config={config} locale={locale} title={i.ideology} stacked labelWidth={135} height={520} /></div><p className="survey-age-note">{c.ageNote}</p><DataTable locale={locale} metrics={metrics} sheet="Ideología 7" question="P3" segments={ideologySegments} caption={i.ideologyDescription} /></> : empty}</CardContent><CardFooter>{note(ideology, 'Ideología 7', 'P3')}</CardFooter></Card>
    <Card className="survey-wide"><CardHeader><CardTitle><h2>{i.generation}</h2></CardTitle><CardDescription>{i.generationDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(generations, 'Sexo - Generación', 'P3') ? <><div className="survey-generation-grid">{[c.men,c.women].map((sex, sexIndex) => <section key={sex} aria-label={sex}><h3>{sex}</h3><div className="survey-profile-scroll" role="region" aria-label={`${i.generation}: ${sex}`} tabIndex={0}><SurveyBars rows={generationLabels.map((label, index) => stackedRow('Sexo - Generación', generationSegments[index * 2 + sexIndex], label, generations))} config={config} locale={locale} title={`${i.generation}: ${sex}`} stacked compact labelWidth={115} height={350} /></div></section>)}</div><p className="survey-age-note">{c.ageNote}</p><DataTable locale={locale} metrics={metrics} sheet="Sexo - Generación" question="P3" segments={generationSegments} caption={i.generationDescription} /></> : empty}</CardContent><CardFooter>{note(generations, 'Sexo - Generación', 'P3')}</CardFooter></Card>
  </>;
}
