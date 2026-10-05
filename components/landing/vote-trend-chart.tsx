"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { locales, type Locale } from "@/lib/locales";
import { electionDate, pollHistory } from "@/lib/polls";

const config = Object.fromEntries(
  pollHistory.map((party) => [party.name, { label: party.name, color: party.color }]),
) satisfies ChartConfig;
const months = [...new Set(pollHistory.flatMap((party) => party.points.map((point) => point.date)))].sort();
const start = Date.parse(electionDate);
// Separate series keep election results in the tooltip without connecting
// them to the subsequent survey estimates.
const chartData = [
  {
    timestamp: start,
    ...Object.fromEntries(pollHistory.flatMap((party) => [
      [party.name, null],
      [`${party.name}_23J`, party.election ?? null],
    ])),
  },
  ...months.map((date) => ({
    timestamp: Date.parse(date),
    ...Object.fromEntries(pollHistory.map((party) => [
      party.name,
      party.points.find((point) => point.date === date)?.value ?? null,
    ])),
  })),
];
const end = chartData.at(-1)!.timestamp;
const ticks = [start, ...["2024-01-01", "2025-01-01", "2026-01-01"].map(Date.parse), end];
const formatters = new Map(locales.map((locale) => [locale, {
  number: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
  month: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
  shortMonth: new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }),
  date: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
}]));

export function VoteTrendChart({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const { number, month, shortMonth, date } = formatters.get(locale)!;

  return (
    <ChartContainer
      config={config}
      className="h-[340px] w-full aspect-auto"
      aria-labelledby="poll-title"
      aria-describedby="poll-description"
    >
      <LineChart
        data={chartData}
        accessibilityLayer
        title={title}
        margin={{ top: 12, right: 20, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="timestamp"
          type="number"
          scale="time"
          domain={[start, end]}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tickMargin={12}
          height={48}
          minTickGap={16}
          tickFormatter={(value: number) => value === start
            ? shortMonth.format(start)
            : value === end ? shortMonth.format(value) : String(new Date(value).getUTCFullYear())}
        />
        <YAxis
          domain={[0, 40]}
          ticks={[0, 10, 20, 30, 40]}
          axisLine={false}
          tickLine={false}
          width={38}
          tickMargin={8}
          tickFormatter={(value: number) => value === 40 ? "40%" : String(value)}
        />
        <ReferenceLine x={start} stroke="var(--muted-foreground)" strokeDasharray="3 5" />
        {pollHistory.map((party) => party.election !== undefined ? (
          <Line
            key={party.name}
            dataKey={`${party.name}_23J`}
            name={party.name}
            legendType="none"
            stroke={`var(--color-${party.name})`}
            dot={{ r: 3.5, fill: `var(--color-${party.name})`, stroke: "var(--background)" }}
            activeDot={{ r: 4, strokeWidth: 2 }}
            isAnimationActive={false}
          />
        ) : null)}
        <ChartTooltip
          isAnimationActive={false}
          itemSorter={(item) => -Number(item.value)}
          position={{ x: 48, y: 16 }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const timestamp = payload[0].payload.timestamp;
                return timestamp === start ? date.format(timestamp) : month.format(timestamp);
              }}
              formatter={(value, name, item) => (
                <>
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{name}</span>
                  <span className="ml-auto font-medium tabular-nums">{number.format(Number(value))}%</span>
                </>
              )}
            />
          }
        />
        {pollHistory.map((party) => (
          <Line
            key={party.name}
            dataKey={party.name}
            type="linear"
            stroke={`var(--color-${party.name})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
        <ChartLegend
          itemSorter={(item) => pollHistory.findIndex((party) => party.name === item.dataKey)}
          content={<ChartLegendContent className="flex-wrap" />}
        />
      </LineChart>
    </ChartContainer>
  );
}
