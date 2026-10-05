"use client";

import { useState } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { pollNumbers } from '@/lib/polls/formatters';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/locales';

export function VoteHemicycle({ rows, previous, config, locale, title, currentLabel, previousLabel, noHistoricalLabel, seatLabel }: {
  rows: { key: string; value: number | null; seats?: number | null }[]; previous: { key: string; value: number; seats?: number }[]; currentLabel: string; previousLabel: string; noHistoricalLabel: string; seatLabel: string; config: ChartConfig; locale: Locale; title: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const number = pollNumbers[locale];
  const data = rows.filter(row => row.value !== null).map(row => ({ ...row, series: currentLabel }));
  const total = data.reduce((sum, row) => sum + (row.value ?? 0), 0);
  // Transparent geometry preserves published angular percentages, without
  // attributing the missing portion to a response or normalizing to 100.
  const sectors = total < 99.8 ? [...data, { key: '__unpublished__', value: 100 - total, series: currentLabel }] : data;
  const historical = previous.map(row => ({ ...row, series: previousLabel }));
  return <div onMouseLeave={() => setActive(null)}>
    <ChartContainer config={config} className="survey-hemicycle" aria-label={title}>
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={props => <ChartTooltipContent active={props.active && props.payload?.[0]?.payload?.key !== '__unpublished__'} labelFormatter={(_, payload) => payload[0]?.payload?.series} nameKey="key" payload={props.payload?.map(item => ({ ...item, value: typeof item.value === 'number' ? `${number.format(item.value)}%` : item.value }))} />} />
        <Pie data={sectors} dataKey="value" nameKey="key" startAngle={180} endAngle={0} cx="50%" cy="95%" innerRadius="125%" outerRadius="180%" stroke="var(--background)" strokeWidth={2} isAnimationActive={false} onMouseEnter={(_, index) => setActive(sectors[index]?.key === '__unpublished__' ? null : sectors[index]?.key ?? null)} onMouseLeave={() => setActive(null)}>
          {sectors.map(row => <Cell key={row.key} fill={row.key === '__unpublished__' ? 'transparent' : config[row.key].color} stroke={row.key === '__unpublished__' ? 'transparent' : undefined} opacity={active && active !== row.key ? 0.2 : 1} />)}
        </Pie>
        {historical.length ? <Pie data={historical} dataKey="value" nameKey="key" startAngle={180} endAngle={0} cx="50%" cy="95%" innerRadius="45%" outerRadius="105%" stroke="var(--background)" strokeWidth={2} isAnimationActive={false} onMouseEnter={(_, index) => setActive(historical[index]?.key ?? null)} onMouseLeave={() => setActive(null)}>
          {historical.map(row => <Cell key={row.key} fill={config[row.key].color} opacity={active && active !== row.key ? 0.2 : 1} />)}
        </Pie> : null}
      </PieChart>
    </ChartContainer>
    <p className="survey-comparison-label">{currentLabel}</p>
    <div className={cn("survey-hemicycle-values", rows.filter(row => row.value !== null).length > 8 && "survey-detailed-values")}>
      {rows.filter(row => row.value !== null).map(row => <div key={row.key} onMouseEnter={() => setActive(row.key)} onMouseLeave={() => setActive(null)} style={{ opacity: active && active !== row.key ? 0.25 : 1 }}>
        <span className="survey-hemicycle-swatch" style={{ backgroundColor: config[row.key].color }} aria-hidden="true" />
        <span>{config[row.key].label}</span><strong>{row.value === null ? '·' : `${number.format(row.value)}%${row.seats != null ? ` (${row.seats})` : ''}`}</strong>
      </div>)}
    </div>
    {rows.some(row => row.seats != null) ? <p className="survey-age-note">{seatLabel}</p> : null}
    <p className="survey-comparison-label">{previousLabel}</p>
    {!previous.length ? <p className="survey-age-note">{noHistoricalLabel}</p> : null}
    <div className={cn("survey-hemicycle-values", previous.length > 8 && "survey-detailed-values")}>
      {previous.map(row => <div key={row.key} onMouseEnter={() => setActive(row.key)} onMouseLeave={() => setActive(null)} style={{ opacity: active && active !== row.key ? 0.25 : 1 }}>
        <span className="survey-hemicycle-swatch" style={{ backgroundColor: config[row.key].color }} aria-hidden="true" /><span>{config[row.key].label}</span><strong>{number.format(row.value)}%{row.seats != null ? ` (${row.seats})` : ''}</strong>
      </div>)}
    </div>
  </div>;
}
