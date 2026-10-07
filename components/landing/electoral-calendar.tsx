import { copy, locales, type Locale } from "@/lib/locales";
import drawing from "@/lib/calendar-drawing.json";
import { electoralCalendar } from "@/lib/electoral-calendar";
import { TodayMarker } from "@/components/landing/today-marker";

const path =
  "M16 59 H589 A12 12 0 0 1 601 71 V189 A12 12 0 0 1 589 201 H16 A12 12 0 0 0 4 213 V297 A12 12 0 0 0 16 309 H589 A12 12 0 0 1 601 321 V439 A12 12 0 0 1 589 451 H16 A12 12 0 0 0 4 463 V581 A12 12 0 0 0 16 593 H589 A12 12 0 0 1 601 605 V726 A12 12 0 0 1 589 738 H16 A12 12 0 0 0 4 750 V944 A12 12 0 0 0 16 956 H589 A12 12 0 0 1 601 968 V1052 A12 12 0 0 1 589 1064 H16 A12 12 0 0 0 4 1076 V1160 A12 12 0 0 0 16 1172 H589";
const legend = [
  ["#292929", "Disolución y convocatoria"],
  ["#b2b2b2", "Presentación de candidaturas"],
  ["#646464", "Proclamación de candidatos"],
  ["#f3a0a5", "Campaña electoral"],
  ["#f9d24c", "Fin de la solicitud y del envío del voto por correo"],
  ["#ffe7a0", "Voto desde el extranjero (CERA)"],
  ["#92baff", "Último día para publicar sondeos"],
  ["#ffffff", "Jornada de reflexión"],
  ["#f34c4b", "Elecciones"],
  ["#4488f4", "Límite para constituir las Cortes"],
];
const formatters = Object.fromEntries(
  locales.map((locale) => [
    locale,
    {
      date: new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        weekday: "short",
        timeZone: "UTC",
      }),
      short: new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    },
  ]),
) as Record<Locale, { date: Intl.DateTimeFormat; short: Intl.DateTimeFormat }>;
const monthByHeading: Record<string, string> = {
  "Octubre 2026": "2026-10",
  "Noviembre 2026": "2026-11",
  "Diciembre 2026": "2026-12",
};
const calendarDayPositions = (() => {
  const positions: { iso: string; x: number; y: number }[] = [];
  let month: string | undefined;

  for (const item of drawing) {
    if (item.kind === "cl-mon") {
      month = monthByHeading[item.text];
      continue;
    }
    if (item.kind === "cl-d" && month) {
      positions.push({
        iso: `${month}-${item.text.padStart(2, "0")}`,
        x: item.left + 17,
        y: item.top,
      });
    }
  }

  return positions;
})();

export function ElectoralCalendar({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const { date: dateFormat, short: shortFormat } = formatters[locale];
  const labelOrder = [0, 1, 2, 3, 4, 10, 9, 8, 7, 6, 5, 12, 11];
  const calendarDate = (index: number) => {
    const event = electoralCalendar[index];
    return event.end
      ? `${shortFormat.format(new Date(event.iso))}–${shortFormat.format(new Date(event.end))}`
      : dateFormat.format(new Date(event.iso));
  };
  const renderDrawing = (verticalScale: number, mobile: boolean) => (
        <svg viewBox={`0 0 605 ${mobile ? 1637 : 1250 * verticalScale}`} className={`calendar-svg calendar-svg-${mobile ? "mobile" : "desktop"}`} aria-hidden="true">
          <path
            className="calendar-path"
            d={path}
            transform={`translate(0 ${17 - 17 * verticalScale}) scale(1 ${verticalScale})`}
            fill="none"
            stroke="#777772"
            strokeWidth="2"
          />
          {drawing
            .filter((item) => item.kind === "cl-band")
            .map((item, i) => (
              <rect
                key={`band-${i}`}
                className="calendar-block"
                x={item.left}
                y={item.top * verticalScale}
                width={item.width}
                height={item.height}
                rx="17"
                fill={item.color}
              />
            ))}
          {drawing
            .filter((item) => item.kind === "cl-d")
            .map((item, i) => {
              const dark =
                item.color === "rgb(32, 32, 32)" ||
                item.color === "rgb(77, 77, 77)" ||
                item.color === "rgb(252, 54, 54)" ||
                item.color === "rgb(33, 133, 255)";
              return (
                <g key={`day-${i}`} className="calendar-day">
                  <circle
                    className={item.color && !item.classes.includes("is-band") ? "calendar-block" : undefined}
                    cx={item.left + 17}
                    cy={item.top * verticalScale + 17}
                    r="17"
                    fill={item.color ?? "white"}
                    fillOpacity={item.classes.includes("is-band") ? 0 : 1}
                    stroke={
                      item.color === "rgb(255, 255, 255)" ? "#555" : "none"
                    }
                    strokeWidth="1.5"
                  />
                  <text
                    x={item.left + 17}
                    y={item.top * verticalScale + 22}
                    textAnchor="middle"
                    fill={
                      dark
                        ? "white"
                        : item.classes.includes("is-out")
                          ? "#b7b7b1"
                          : "#333"
                    }
                    fontSize="15"
                    fontWeight={item.classes.includes("is-key") ? 600 : 400}
                  >
                    {item.text}
                  </text>
                </g>
              );
            })}
          {drawing
            .filter((item) => item.kind === "cl-lead")
            .map((item, i) => (
              <line
                key={`lead-${i}`}
                x1={item.left}
                x2={item.left}
                y1={item.top * verticalScale}
                y2={(item.top + item.height!) * verticalScale}
                stroke="#aaaaa3"
              />
            ))}
          {drawing
            .filter((item) => item.kind === "cl-mon" || item.kind === "cl-wd")
            .map((item, i) => (
              <text
                key={`heading-${i}`}
                x={item.kind === "cl-mon" && item.text.startsWith("Noviembre") ? 589 : item.left}
                textAnchor={item.kind === "cl-mon" && item.text.startsWith("Noviembre") ? "end" : "start"}
                y={item.top * verticalScale + (item.kind === "cl-mon" || mobile ? 18 : 9)}
                fontSize={item.kind === "cl-mon" ? 19 : 9}
                fontWeight={item.kind === "cl-mon" ? 600 : 400}
                fill={item.kind === "cl-mon" ? "#272727" : "#88887f"}
              >
                {item.kind === "cl-wd"
                  ? c.monday
                  : c.months[
                      item.text.startsWith("Octubre")
                        ? 0
                        : item.text.startsWith("Noviembre")
                          ? 1
                          : 2
                    ]}
              </text>
            ))}
          {drawing
            .filter((item) => item.kind === "cl-lab")
            .map((item, i) => {
              const eventIndex = labelOrder[i];
              const date = calendarDate(eventIndex);
              const label = c.events[eventIndex];
              return (
                <foreignObject
                  key={`label-${i}`}
                  x={item.left + (i === 10 ? 20 : 0)}
                  y={item.top * verticalScale}
                  width={item["max-width"] ?? 170}
                  height="140"
                  className="calendar-label-box"
                >
                  <div className="calendar-label" lang={locale}>
                    <strong>{date}</strong>
                    <span>{label}</span>
                  </div>
                </foreignObject>
              );
            })}
        </svg>
  );
  return (
    <>
      <ul className="calendar-legend" aria-label={c.legend}>
        {legend.map(([color, label], index) => (
          <li key={label}>
            <span style={{ background: color }} aria-hidden="true" />
            {c.legends[index]}
          </li>
        ))}
      </ul>
      <div className="calendar-drawing">
        <TodayMarker positions={calendarDayPositions} />
        {renderDrawing(1.6, false)}
        {renderDrawing(1.3, true)}
        <ol className="sr-only">
          {electoralCalendar.map((event, index) => (
            <li key={event.iso}>
              <time dateTime={event.iso}>{calendarDate(index)}</time>
              {event.end ? (
                <>
                  {" "}
                  {c.until} <time dateTime={event.end}>{event.end}</time>
                </>
              ) : null}
              . {c.events[index]}.
            </li>
          ))}
        </ol>
      </div>
      <div className="calendar-note">
        <p>{c.legalNote}</p>
        <p className="calendar-sources">
          <strong>{c.sources}:</strong>{" "}
          <a href="https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672">
            LOREG
          </a>{" "}
          /{" "}
          <a href="https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a99">
            {c.constitution}
          </a>{" "}
          /{" "}
          <a href="https://www.abc.es/espana/sanchez-convoca-elecciones-agitando-malestar-vivienda-20261005090835-nt.html">
            ABC
          </a>
        </p>
        <p className="calendar-disclaimer">{c.disclaimer}</p>
      </div>
    </>
  );
}
