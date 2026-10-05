import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { locales, type Locale } from "@/lib/locales";
import { VoteTrendChart } from "./vote-trend-chart";
import {
  latestPoll,
  pollHistory,
  pollPublished,
  pollSources,
} from "@/lib/polls/landing";

const labels = {
  es: {
    title: "Estimación de voto",
    subtitle: "Porcentaje sobre el voto válido",
    published: "Publicado el",
    election: "Generales 23-J",
    change: "Variación en puntos desde el 23-J de 2023",
    noComparison: "Sin comparación separada en el 23-J",
    other: "Otros",
    latest: "Octubre de 2026",
    history: "Ver los datos de la evolución",
    month: "Mes",
    caption: "Estimación de voto por mes, en porcentaje. Las casillas vacías corresponden a datos no disponibles en la fuente.",
    description: "Evolución de las estimaciones de 40dB desde septiembre de 2023 hasta octubre de 2026. Los puntos separados indican el resultado de las generales del 23 de julio de 2023.",
    note: "En el 23-J, Podemos formó parte de Sumar. Otros agrupa al resto de candidaturas.",
    sources: "Fuentes",
  },
  gl: {
    title: "Estimación de voto",
    subtitle: "Porcentaxe sobre o voto válido",
    published: "Publicado o",
    election: "Xerais 23-X",
    change: "Variación en puntos desde o 23-X de 2023",
    noComparison: "Sen comparación separada no 23-X",
    other: "Outros",
    latest: "Outubro de 2026",
    history: "Ver os datos da evolución",
    month: "Mes",
    caption: "Estimación de voto por mes, en porcentaxe. As celas baleiras corresponden a datos non dispoñibles na fonte.",
    description: "Evolución das estimacións de 40dB desde setembro de 2023 ata outubro de 2026. Os puntos separados indican o resultado das xerais do 23 de xullo de 2023.",
    note: "No 23-X, Podemos formou parte de Sumar. Outros agrupa o resto de candidaturas.",
    sources: "Fontes",
  },
  ca: {
    title: "Estimació de vot",
    subtitle: "Percentatge sobre el vot vàlid",
    published: "Publicat el",
    election: "Generals 23-J",
    change: "Variació en punts des del 23-J de 2023",
    noComparison: "Sense comparació separada el 23-J",
    other: "Altres",
    latest: "Octubre de 2026",
    history: "Veure les dades de l’evolució",
    month: "Mes",
    caption: "Estimació de vot per mes, en percentatge. Les cel·les buides corresponen a dades no disponibles a la font.",
    description: "Evolució de les estimacions de 40dB des del setembre de 2023 fins a l’octubre de 2026. Els punts separats indiquen el resultat de les generals del 23 de juliol de 2023.",
    note: "El 23-J, Podemos va formar part de Sumar. Altres agrupa la resta de candidatures.",
    sources: "Fonts",
  },
  eu: {
    title: "Boto estimazioa",
    subtitle: "Baliozko botoen ehunekoa",
    published: "Argitaratze data",
    election: "23-U orokorrak",
    change: "Puntu aldaketa 2023ko uztailaren 23tik",
    noComparison: "Uztailaren 23an ez dago alderaketa bereizirik",
    other: "Besteak",
    latest: "2026ko urria",
    history: "Ikusi bilakaeraren datuak",
    month: "Hilabetea",
    caption: "Hileko boto estimazioa, ehunekotan. Gelaxka hutsek iturrian eskuragarri ez dauden datuak adierazten dituzte.",
    description: "40dBren estimazioen bilakaera 2023ko irailetik 2026ko urrira. Puntu bereiziek 2023ko uztailaren 23ko hauteskunde orokorren emaitza adierazten dute.",
    note: "Uztailaren 23an, Podemos Sumarren parte izan zen. Besteak gainerako hautagai zerrendak biltzen ditu.",
    sources: "Iturriak",
  },
};

const months = [...new Set(pollHistory.flatMap((party) => party.points.map((point) => point.date)))].sort();
const formatters = new Map(locales.map((locale) => [locale, {
  number: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
  date: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  month: new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }),
}]));

export function PollChart({ locale }: { locale: Locale }) {
  const c = labels[locale];
  const { number, date, month } = formatters.get(locale)!;

  return (
    <figure className="poll-chart">
      <figcaption className="poll-heading">
        <div>
          <h3 id="poll-title">{c.title}</h3>
          <p>{c.subtitle}</p>
        </div>
        <p className="poll-publication">40dB. / EL PAÍS<br />{c.published} <time dateTime={pollPublished}>{date.format(new Date(pollPublished))}</time></p>
      </figcaption>
      <p id="poll-description" className="sr-only">{c.description}</p>
      <div className="poll-drawing">
        <VoteTrendChart locale={locale} title={c.title} />
      </div>
      <p className="poll-election-key"><span aria-hidden="true" />{c.election}</p>
      <div className="poll-latest">
        <h4>{c.latest}</h4>
        <p className="poll-change-caption">{c.change}</p>
        <dl className="poll-results">
          {latestPoll.map((party) => (
            <div key={party.name} className="poll-result" style={{ "--party-color": party.color } as CSSProperties}>
              <dt><span aria-hidden="true" />{party.name === "Otros" ? c.other : party.name}</dt>
              <dd className="poll-value">{number.format(party.value)}<span>%</span></dd>
              <dd className="poll-change">{party.change === null ? <span aria-label={c.noComparison}>·</span> : `${party.change > 0 ? "+" : "−"}${number.format(Math.abs(party.change))}`}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="poll-note">{c.note}</p>
      <Accordion className="poll-data">
        <AccordionItem value="data">
          <AccordionTrigger>{c.history}</AccordionTrigger>
          <AccordionContent>
            <div className="poll-table-scroll" role="region" aria-label={c.history} tabIndex={0}>
              <table>
                <caption>{c.caption}</caption>
                <thead><tr><th scope="col">{c.month}</th>{pollHistory.map((party) => <th scope="col" key={party.name}>{party.name}</th>)}</tr></thead>
                <tbody>
                  <tr><th scope="row">{c.election}</th>{pollHistory.map((party) => <td key={party.name}>{party.election === undefined ? "" : `${number.format(party.election)}%`}</td>)}</tr>
                  {months.map((period) => <tr key={period}><th scope="row">{month.format(new Date(period))}</th>{pollHistory.map((party) => {
                    const point = party.points.find((point) => point.date === period);
                    return <td key={party.name}>{point ? `${number.format(point.value)}%` : ""}</td>;
                  })}</tr>)}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="poll-sources">
        {c.sources}: <a href={pollSources.pollster}>40dB. <HugeiconsIcon icon={ArrowUpRight01Icon} className="external-link-icon" aria-hidden="true" /></a>
        <span aria-hidden="true"> / </span>
        <a href={pollSources.article}>El País <HugeiconsIcon icon={ArrowUpRight01Icon} className="external-link-icon" aria-hidden="true" /></a>
      </p>
    </figure>
  );
}
