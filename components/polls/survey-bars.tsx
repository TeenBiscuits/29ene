"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import type { Locale } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { pollNumbers } from '@/lib/polls/formatters';

export function SurveyBars({ rows, config, locale, title, single = false, stacked = false, compact = false }: {
  rows: { group: string; [key: string]: string | number | null }[];
  config: ChartConfig; locale: Locale; title: string; single?: boolean; stacked?: boolean; compact?: boolean;
}) {
  const number = pollNumbers[locale];
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const stackMax = Math.max(100, ...rows.map(row => Object.keys(config).reduce((total, key) => total + (typeof row[key] === 'number' ? row[key] : 0), 0)));
  return <ChartContainer config={config} className={cn("w-full aspect-auto", stacked ? compact ? "survey-stacked-chart survey-sex-chart" : "survey-stacked-chart" : "h-[380px]")} aria-label={title} onPointerLeave={() => setActiveKey(null)}>
    <BarChart title={title} data={rows} layout="vertical" accessibilityLayer margin={{ left: 0, right: stacked ? 5 : single ? 45 : 15, top: 10, bottom: 5 }}>
      <CartesianGrid horizontal={false} />
      <XAxis type="number" domain={[0, stacked ? stackMax : single ? 100 : 40]} ticks={stacked ? [0,50,100] : single ? [0,25,50,75,100] : [0,10,20,30,40]} tickFormatter={value => `${value}%`} axisLine={false} tickLine={false} />
      <YAxis type="category" dataKey="group" width={single ? 115 : compact ? 80 : 65} axisLine={false} tickLine={false} tick={stacked ? ({ x, y, payload }) => <text x={x} y={y} dy={4} textAnchor="end" className="survey-stack-age" fill="var(--foreground)" fontWeight={!compact && payload.index === 0 ? 700 : 400}>{payload.value}</text> : undefined} />
      <ChartTooltip shared={stacked ? false : undefined} cursor={stacked ? false : undefined} content={props => <ChartTooltipContent active={props.active} label={props.label} labelFormatter={(_, payload) => payload[0]?.payload?.group} payload={props.payload?.map(item => ({ ...item, color: item.payload?.fill ?? item.color, value: typeof item.value === 'number' ? `${number.format(item.value)}%` : item.value }))} />} />
      {!single ? <ChartLegend verticalAlign={stacked ? "top" : "bottom"} itemSorter={null} content={<ChartLegendContent activeKey={activeKey} onItemEnter={stacked ? setActiveKey : undefined} onItemLeave={stacked ? () => setActiveKey(null) : undefined} verticalAlign={stacked ? "top" : "bottom"} className={cn("flex-wrap gap-x-3 gap-y-2", stacked && "survey-stack-legend justify-start")} />} /> : null}
      {Object.keys(config).map(key => <Bar key={key} dataKey={key} fill={`var(--color-${key})`} stackId={stacked ? "responses" : undefined} radius={stacked ? 0 : [0,3,3,0]} barSize={stacked ? 38 : undefined} isAnimationActive={false} activeBar={false} opacity={stacked && activeKey && activeKey !== key ? 0.2 : 1} onMouseEnter={stacked ? () => setActiveKey(key) : undefined} onMouseLeave={stacked ? () => setActiveKey(null) : undefined}>
        {single ? rows.map(row => <Cell key={row.group} fill={typeof row.fill === 'string' ? row.fill : `var(--color-${key})`} />) : null}
        {stacked ? <LabelList dataKey={key} content={({ viewBox, value }) => {
          if (!viewBox || !('width' in viewBox) || typeof value !== 'number') return <g />;
          const { x, y, width, height } = viewBox;
          if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number' || width < 44) return <g />;
          return <text x={x + 7} y={y + height / 2} textAnchor="start" dominantBaseline="central" fill={key === 'other' || key === 'regional' ? 'var(--foreground)' : 'var(--background)'} className="survey-stack-label" opacity={activeKey && activeKey !== key ? 0.2 : 1}>{Math.round(value)}%</text>;
        }} /> : null}
        {single ? <LabelList dataKey={key} position="right" formatter={(value: unknown) => typeof value === 'number' ? `${number.format(value)}%` : ''} /> : null}
      </Bar>)}
    </BarChart>
  </ChartContainer>;
}
