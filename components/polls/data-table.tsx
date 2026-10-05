"use client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { pollCopy, responseLabel } from "@/lib/polls/copy";
import { percentage } from "@/lib/polls/details";
import { pollNumbers } from "@/lib/polls/formatters";
import type { PollMetric } from "@/lib/polls/aggregation.mjs";
import type { Locale } from "@/lib/locales";
export function DataTable({ locale, sheet, question, segments, turnout = false, metrics, caption, triggerLabel }: {
  locale: Locale; sheet: string; question: string; segments: string[]; turnout?: boolean; metrics: PollMetric[]; caption?: string; triggerLabel?: string;
}) {
  const c = pollCopy[locale];
  const responses = [...new Set(metrics.filter(row => row.sheet === sheet && row.question === question && (!turnout || row.response.startsWith('10 '))).map(row => row.response))];
  const number = pollNumbers[locale];
  return <Accordion className="poll-data">
      <AccordionItem value="data">
    <AccordionTrigger>{triggerLabel ?? c.data}</AccordionTrigger>
      <AccordionContent>
    <div className="poll-table-scroll" role="region" aria-label={c.data} tabIndex={0}>
      <table><caption>{caption ?? (turnout ? c.turnoutDescription : sheet === 'Sexo' ? c.sexDescription : sheet === 'Edad' ? c.ageDescription : c.transferDescription)}</caption>
        <thead><tr><th scope="col">{c.response}</th>{segments.map(segment => <th scope="col" key={segment}>{segment === 'Total' ? c.total : segment === 'Hombre' ? c.men : segment === 'Mujer' ? c.women : segment}</th>)}</tr></thead>
        <tbody>{responses.map(response => <tr key={response}><th scope="row">{turnout ? '10 / 10' : responseLabel(response, locale)}</th>{segments.map(segment => {
          const value = percentage(sheet, question, response, segment, metrics);
          return <td key={segment}>{value === null ? <span aria-label={c.missing}>·</span> : `${number.format(value)}%`}</td>;
        })}</tr>)}</tbody>
      </table>
    </div>
  </AccordionContent>
      </AccordionItem>
    </Accordion>;
}

