import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { pollMethodologies } from '@/lib/polls/methodologies';
import { DownloadLinks } from './download-links';
import { PollExplorer } from './poll-explorer';
import { pollSelectorCopy } from '@/lib/polls/selector-copy';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { copy, localePath, type Locale } from '@/lib/locales';
import { pollCopy } from '@/lib/polls/copy';
import { pollDetails } from '@/lib/polls/details';

export function PollsPage({ locale }: { locale: Locale }) {
  const c = pollCopy[locale];
  return <>
    <a className="skip-link" href="#contenido">{copy[locale].skip}</a>
    <SiteHeader locale={locale} section="encuestas" />
    <main id="contenido" className="survey-page">
      <PollExplorer locale={locale} breadcrumb={<Breadcrumb aria-label={c.breadcrumbLabel}>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink render={<Link href={localePath(locale)} />}>{c.breadcrumbHome}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{c.breadcrumbCurrent}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>}>
        <div className="survey-intro"><span className="section-kicker">{c.kicker}</span><h1>{c.title}</h1><p>{c.intro}</p></div>
      </PollExplorer>
      <section className="survey-methods">
        <h2>{c.methods}</h2><p>{c.note}</p><p>{pollSelectorCopy[locale].formula}</p><p>{c.rounding}</p>
        <h3>{c.methodologyTitle}</h3>
        <Accordion defaultValue={[]} className="survey-methodology-accordion">
          {pollDetails.sources.map(source => <AccordionItem key={source.id} value={source.id}>
            <AccordionTrigger>{source.pollster} · {source.period}</AccordionTrigger>
            <AccordionContent>
              <p>{source.pollster} · {c.commissionedFor} {source.commissionedBy.join(' / ')}. <a href={source.sourceUrl} target="_blank" rel="noreferrer">{c.originalPublication}</a></p>
              {source.articleUrl ? <p><a href={source.articleUrl} target="_blank" rel="noreferrer">{c.articlePublication}</a></p> : null}
              {pollMethodologies[source.id]?.[locale] ? <p>{pollMethodologies[source.id][locale]}</p> : null}
              <h4 className="survey-download-heading">{c.sources}</h4>
              <DownloadLinks links={[
                ...(source.methodology ? [{ href: `/polls/${source.id}/methodology.pdf`, label: c.methodology }] : []),
                ...(source.tables ? [{ href: `/polls/${source.id}/tables.xlsx`, label: c.tables }, { href: `/polls/${source.id}/observations.csv`, label: c.csv }] : []),
                ...(source.publishedData ? [{ href: `/polls/${source.id}/published-data.json`, label: c.publishedJson }, { href: `/polls/${source.id}/estimation.tsv`, label: c.publishedTsv }] : []),
                ...(source.originalVote ? [{ href: `/polls/${source.id}/vote-original.jpg`, label: c.originalVote }] : []),
                ...(source.originalTransfer ? [{ href: `/polls/${source.id}/transfer-original.jpg`, label: c.originalTransfer }, { href: `/polls/${source.id}/observations.csv`, label: c.csv }] : []),
                ...(source.voteReport ? [{ href: `/polls/${source.id}/vote-report.pdf`, label: c.voteReport }] : []),
              ]} />
            </AccordionContent>
          </AccordionItem>)}
        </Accordion>

      </section>
    </main>
    <SiteFooter locale={locale} section="encuestas" />
  </>;
}
