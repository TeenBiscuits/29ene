"use client";

import { DataTable } from "./data-table";
import { PollInsights } from "./poll-insights";
import { useMemo, useState, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { pollNumbers } from '@/lib/polls/formatters';
import { pollCopy } from '@/lib/polls/copy';
import { pollSelectorCopy } from '@/lib/polls/selector-copy';
import { RtveElectionCharts } from './rtve-election-charts';
import { parties, percentage, pollDetails } from '@/lib/polls/details';
import { ageCategories } from '@/lib/polls/demographics.mjs';
import { aggregatePolls, type PollMetric } from '@/lib/polls/aggregation.mjs';
import { prepareComparison } from '@/lib/polls/comparison.mjs';
import { latestPollsterSources, selectedPeriod, hasPublishedValues, contributingSources } from '@/lib/polls/coverage.mjs';
import type { Locale } from '@/lib/locales';
const VoteHemicycle = dynamic(() => import('./vote-hemicycle').then(module => module.VoteHemicycle));
const SurveyBars = dynamic(() => import('./survey-bars').then(module => module.SurveyBars));
const availableSources = latestPollsterSources(pollDetails.sources);
const allIds = availableSources.map(source => source.id);

const recall = 'Recuerdo de voto - Generales';
const ages = ['18-24','25-34','35-44','45-54','55-64','65+'];
const voters = ['PSOE','PP','Vox','Sumar'];


export function PollExplorer({ locale, breadcrumb, children }: { locale: Locale; breadcrumb: ReactNode; children: ReactNode }) {
  const c = pollCopy[locale];
  const labels = pollSelectorCopy[locale];
  const [selectedIds, setSelectedIds] = useState(allIds);
  const [rtveSelected, setRtveSelected] = useState(true);
  const activeIds = selectedIds;
  const period = selectedPeriod(availableSources, activeIds) ?? pollDetails.period;
  const sources = availableSources.filter(source => activeIds.includes(source.id));
  const metrics = useMemo(() => aggregatePolls(pollDetails.observations, availableSources, period, activeIds), [activeIds, period]);
  const periodSources = sources.filter(source => source.period === period);
  const totalWeight = periodSources.reduce((sum, source) => sum + source.weight, 0);
  const sourceNote = (rows: PollMetric[], sheet: string, question: string) => contributingSources(rows, availableSources, sheet, question).map(source => `${source.pollster} · ${source.period}`).join(' / ');
  const empty = <div className="survey-empty" role="status"><p>{c.noData}</p><span>{c.noDataDescription}</span></div>;
  const turnoutResponse = pollDetails.observations.find(row => row.sheet === recall && row.question === 'P2' && row.response.startsWith('10 '))?.response;
  const participationResponse = turnoutResponse ?? '';
  const turnoutRows = ['Total',...voters].map(segment => ({ group: segment === 'Total' ? c.total : segment === 'Hombre' ? c.men : segment === 'Mujer' ? c.women : segment, percentage: percentage(recall, 'P2', participationResponse, segment, metrics), fill: ageCategories.find(category => category.key === segment)?.color ?? 'var(--muted-foreground)' }));
  const ageMetrics = aggregatePolls(pollDetails.ageObservations, availableSources, period, activeIds);
  const ageConfig = Object.fromEntries(ageCategories.map(category => [category.key, { label: category.key === 'regional' ? c.regional : category.key === 'other' ? c.otherResponses : category.key, color: category.color }]));
  const ageRows = ['Total', ...ages].map(segment => ({ group: segment === 'Total' ? c.ageTotal : segment, ...Object.fromEntries(ageCategories.map(category => [category.key, percentage('Edad', 'P3', category.key, segment, ageMetrics)])) }));
  const comparison = prepareComparison(pollDetails.voteComparisons, activeIds, period);
  const comparisonMetrics = aggregatePolls(comparison.observations, availableSources, period, activeIds);
  const currentRows = comparison.keys.map(key => ({ key, value: percentage('Estimación electoral', 'Estimación', key, 'Total', comparisonMetrics) }));
  const activeComparisons = comparison.active;
  const previousRows = comparison.election;
  const singleCurrent = activeComparisons.length === 1 ? activeComparisons[0].current : [];
  const displayRows = currentRows.map(row => ({ ...row, seats: singleCurrent.find(item => item.key === row.key)?.seats ?? null }));
  const incompleteEstimate = activeComparisons.some(comparison => comparison.incomplete);
  const comparisonConfig = {
    ...ageConfig,
    ...Object.fromEntries(['ERC','Bildu','Junts','PNV','AC','BNG','AA','CC','UPN'].map(key => [key, { label: key === 'AA' ? 'Adelante Andalucía' : key === 'CC' ? 'Coalición Canaria' : key, color: '#f2b800' }])),
    electoralOther: { label: c.electoralOther, color: '#dce1e5' }, otherParties: { label: c.otherParties, color: '#dce1e5' }, sigmaOther: { label: c.otherParties, color: '#dce1e5' }, remainingVotes: { label: c.remainingVotes, color: '#dce1e5' },
  };
  const transferGroups = [...new Set(metrics.filter(row => row.sheet === recall && row.question === 'P3' && row.segment !== 'Total').map(row => row.segment))];
  const sexMetrics = aggregatePolls(pollDetails.sexObservations, availableSources, period, activeIds);
  const sexRows = ['Hombre', 'Mujer'].map(segment => ({ group: segment === 'Hombre' ? c.men : c.women, ...Object.fromEntries(ageCategories.map(category => [category.key, percentage('Sexo', 'P3', category.key, segment, sexMetrics)])) }));
  return <>
    <div className="survey-toolbar">
      {breadcrumb}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />} aria-label={labels.title}>
          {labels.trigger}<HugeiconsIcon icon={ArrowDown01Icon} data-icon="inline-end" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="survey-company-menu">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{labels.companies}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setSelectedIds(allIds); setRtveSelected(true); }}>{labels.all}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {availableSources.map(source => {
              const checked = selectedIds.includes(source.id);
              return <DropdownMenuCheckboxItem key={source.id} checked={checked} disabled={checked && selectedIds.length === 1} closeOnClick={false}
                onCheckedChange={value => setSelectedIds(previous => value ? [...new Set([...previous, source.id])] : previous.length > 1 ? previous.filter(id => id !== source.id) : previous)}>
                {source.pollster} · {source.period}
              </DropdownMenuCheckboxItem>;
            })}
            <DropdownMenuCheckboxItem checked={rtveSelected} closeOnClick={false} onCheckedChange={checked => setRtveSelected(checked)}>
              {labels.rtveSource}
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <p className="survey-menu-help">{labels.help}</p>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="survey-overview">
      {children}
      <div aria-live="polite" aria-atomic="true" className="survey-selection-status">
        <p>{labels.weights}: {periodSources.map(source => `${source.pollster} ${pollNumbers[locale].format(source.weight / totalWeight * 100)}%`).join(' / ')} · {period}</p>
        {new Set(sources.map(source => source.period)).size > 1 ? <p>{c.periodSelection} {sources.filter(source => source.period !== period).map(source => `${source.pollster} · ${source.period}`).join(' / ')}</p> : null}
        {availableSources.length === 1 ? <p>{labels.onlyOne}</p> : null}
      </div>
    </div>
      <div className="survey-grid">
        <Card className="survey-wide survey-current-card">
          <CardHeader>
            <CardTitle><h2>{previousRows.length ? c.current : c.currentOnly}</h2></CardTitle>
            <CardDescription>{previousRows.length ? c.currentDescription : c.currentOnlyDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasPublishedValues(comparisonMetrics, 'Estimación electoral', 'Estimación') ? <>
              <VoteHemicycle rows={displayRows} previous={previousRows} config={comparisonConfig} locale={locale} title={c.current} currentLabel={c.currentSeries} previousLabel={c.electionSeries} noHistoricalLabel={c.noHistorical} seatLabel={c.seatNote} />
              {comparison.grouped ? <p className="survey-age-note">{c.comparisonGrouping}</p> : null}
              {incompleteEstimate ? <p className="survey-age-note">{c.publishedTotal}: {pollNumbers[locale].format(displayRows.reduce((sum, row) => sum + (row.value ?? 0), 0))}%. {c.incompleteEstimate}</p> : null}
            </> : empty}
          </CardContent>
          <CardFooter>{sourceNote(comparisonMetrics, 'Estimación electoral', 'Estimación')}</CardFooter>
        </Card>
        {rtveSelected ? <RtveElectionCharts locale={locale} /> : null}
        <Card><CardHeader><CardTitle><h2>{c.turnout}</h2></CardTitle><CardDescription>{c.turnoutDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(metrics, recall, 'P2') ? <><SurveyBars rows={turnoutRows} config={{ percentage: { label: c.turnout, color: 'var(--chart-1)' } }} locale={locale} title={c.turnout} single height={320} /><DataTable metrics={metrics} locale={locale} sheet={recall} question="P2" segments={['Total',...voters]} turnout /></> : empty}</CardContent><CardFooter>{sourceNote(metrics, recall, 'P2')}</CardFooter></Card>
        <PollInsights locale={locale} metrics={metrics} sourceIds={activeIds} period={period} sources={availableSources} />
        <Card className="survey-wide survey-age-card"><CardHeader><CardTitle><h2>{c.age}</h2></CardTitle><CardDescription>{c.ageDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(ageMetrics, 'Edad', 'P3') ? <><SurveyBars rows={ageRows} config={ageConfig} locale={locale} title={c.age} stacked /><DataTable metrics={metrics} locale={locale} sheet="Edad" question="P3" segments={['Total', ...ages]} /></> : empty}</CardContent><CardFooter>{sourceNote(ageMetrics, 'Edad', 'P3')}</CardFooter></Card>
        <Card className="survey-wide survey-sex-card"><CardHeader><CardTitle><h2>{c.sex}</h2></CardTitle><CardDescription>{c.sexDescription}</CardDescription></CardHeader><CardContent>{hasPublishedValues(sexMetrics, 'Sexo', 'P3') ? <><SurveyBars rows={sexRows} config={ageConfig} locale={locale} title={c.sex} stacked compact /><DataTable metrics={metrics} locale={locale} sheet="Sexo" question="P3" segments={['Hombre', 'Mujer']} /></> : empty}</CardContent><CardFooter>{sourceNote(sexMetrics, 'Sexo', 'P3')}</CardFooter></Card>
        <Card className="survey-wide"><CardHeader><CardTitle><h2>{c.transfer}</h2></CardTitle><CardDescription>{c.transferDescription} {c.selected}</CardDescription></CardHeader><CardContent>{hasPublishedValues(metrics, recall, 'P3') ? <><div className="transfer-grid">{transferGroups.map(group => <div key={group}><h3>{group} · 2023</h3><SurveyBars rows={parties.map(party => ({ group: party.key, percentage: percentage(recall, 'P3', party.response, group, metrics), fill: party.color }))} config={{ percentage: { label: c.transfer, color: parties.find(party => party.key === group)?.color ?? 'var(--chart-1)' } }} locale={locale} title={`${group}: ${c.transfer}`} single /></div>)}</div><DataTable metrics={metrics} locale={locale} sheet={recall} question="P3" segments={transferGroups} /></> : empty}</CardContent><CardFooter>{sourceNote(metrics, recall, 'P3')}</CardFooter></Card>
      </div>
  </>;
}
