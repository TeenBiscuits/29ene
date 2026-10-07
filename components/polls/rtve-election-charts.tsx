'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
  type BarShapeProps,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Locale } from '@/lib/locales';
import { rtveChartCopy } from '@/lib/polls/rtve-copy';

const articleUrl = 'https://www.rtve.es/noticias/20261005/encuestas-elecciones-generales-29n-pp-vox-diputados/17253873.shtml';
const absoluteMajority = 176;

const seatsParties = [
  { key: 'pp', name: 'PP', seats: 137, color: '#1D84CE' },
  { key: 'psoe', name: 'PSOE', seats: 104, color: '#EF1C27' },
  { key: 'vox', name: 'Vox', seats: 65, color: '#69A93B' },
  { key: 'sumar', name: 'Sumar', seats: 10, color: '#F83063' },
  { key: 'erc', name: 'ERC', seats: 8, color: '#FFB232' },
  { key: 'bildu', name: 'Bildu', seats: 7, color: '#00AC8E' },
  { key: 'pnv', name: 'PNV', seats: 6, color: '#4AAE4A' },
  { key: 'junts', name: 'Junts', seats: 4, color: '#00C7AE' },
  { key: 'podemos', name: 'Podemos', seats: 3, color: '#9269F5' },
  { key: 'adelante', name: 'Adelante Andalucía', seats: 2, color: '#24C87E' },
  { key: 'bng', name: 'BNG', seats: 2, color: '#ADCFEF' },
  { key: 'cca', name: 'CCA', seats: 1, color: '#FFD700' },
  { key: 'upn', name: 'UPN', seats: 1, color: '#00599B' },
] as const;

const voteData = [
  { key: 'pp', name: 'PP', votes: 32.5, votes2023: 33.1, seats: 137, seats2023: 137, color: '#1D84CE' },
  { key: 'psoe', name: 'PSOE', votes: 26.3, votes2023: 31.7, seats: 104, seats2023: 121, color: '#EF1C27' },
  { key: 'vox', name: 'Vox', votes: 18.7, votes2023: 12.4, seats: 65, seats2023: 33, color: '#69A93B' },
  { key: 'sumar', name: 'Sumar', votes: 6.3, votes2023: 12.3, seats: 10, seats2023: 31, color: '#F83063' },
  { key: 'podemos', name: 'Podemos', votes: 3.4, votes2023: null, seats: 3, seats2023: null, color: '#9269F5' },
  { key: 'erc', name: 'ERC', votes: 2.2, votes2023: 1.9, seats: 8, seats2023: 7, color: '#FFB232' },
  { key: 'salf', name: 'SALF', votes: 1.9, votes2023: null, seats: 0, seats2023: null, color: '#785A46' },
  { key: 'bildu', name: 'Bildu', votes: 1.4, votes2023: 1.4, seats: 7, seats2023: 6, color: '#00AC8E' },
  { key: 'junts', name: 'Junts', votes: 1.2, votes2023: 1.7, seats: 4, seats2023: 7, color: '#00C7AE' },
  { key: 'pnv', name: 'PNV', votes: 1, votes2023: 1.1, seats: 6, seats2023: 5, color: '#4AAE4A' },
  { key: 'adelante', name: 'Adelante Andalucía', votes: 1, votes2023: null, seats: 2, seats2023: null, color: '#24C87E' },
  { key: 'bng', name: 'BNG', votes: 0.9, votes2023: 0.6, seats: 2, seats2023: 1, color: '#ADCFEF' },
  { key: 'cca', name: 'CCA', votes: 0.5, votes2023: 0.5, seats: 1, seats2023: 1, color: '#FFD700' },
  { key: 'upn', name: 'UPN', votes: 0.2, votes2023: 0.2, seats: 1, seats2023: 1, color: '#00599B' },
] as const;

type Metric = 'votes' | 'seats';
type ComparisonRow = {
  party: string;
  value: number;
  previous: number | null;
  color: string;
  fill: string;
};
type MajorityRow = { label: string; total: number; [partyKey: string]: string | number };

const majorityChartConfig = Object.fromEntries(
  seatsParties.map((party) => [party.key, { label: party.name, color: party.color }])
) as ChartConfig;

function ComparisonBar(props: BarShapeProps) {
  const row = props.payload as ComparisonRow;
  const x = props.x;
  const y = props.y;
  const width = props.width;
  const height = props.height;
  const markerX = row.value > 0 && row.previous !== null
    ? x + (width * row.previous) / row.value
    : null;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={row.color} />
      {markerX !== null ? (
        <line
          x1={markerX}
          x2={markerX}
          y1={y - 2}
          y2={y + height + 2}
          stroke="var(--muted-foreground)"
          strokeWidth={1.25}
          strokeOpacity={0.75}
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </g>
  );
}

export function RtveElectionCharts({ locale }: { locale: Locale }) {
  const copy = rtveChartCopy[locale];
  const [selectedPartyKeys, setSelectedPartyKeys] = useState<string[]>([]);
  const [metric, setMetric] = useState<Metric>('seats');
  const wholeNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const voteNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const displayedNumber = metric === 'votes' ? voteNumber : wholeNumber;
  const unit = metric === 'votes' ? copy.votePercent : copy.seats;

  const scenarios = [
    { label: copy.rightBlock, keys: ['pp', 'vox', 'upn'] },
    { label: copy.investitureBlock, keys: ['psoe', 'sumar', 'erc', 'bildu', 'pnv', 'junts', 'podemos', 'bng', 'cca'] },
    { label: copy.customBlock, keys: selectedPartyKeys },
  ];
  const majorityRows = scenarios.map((scenario) => {
    const total = seatsParties.reduce(
      (sum, party) => sum + (scenario.keys.includes(party.key) ? party.seats : 0),
      0
    );
    const row: MajorityRow = { label: scenario.label, total };

    for (const party of seatsParties) {
      row[party.key] = scenario.keys.includes(party.key) ? party.seats : 0;
    }

    return row;
  });
  const selectedSeats = seatsParties.reduce(
    (sum, party) => sum + (selectedPartyKeys.includes(party.key) ? party.seats : 0),
    0
  );
  const selectionStatus = selectedPartyKeys.length === 0
    ? copy.emptySelection
    : selectedSeats === absoluteMajority
      ? copy.majorityReached
      : selectedSeats > absoluteMajority
      ? copy.majorityAbove.replace('{count}', wholeNumber.format(selectedSeats - absoluteMajority))
      : copy.majorityMissing.replace('{count}', wholeNumber.format(absoluteMajority - selectedSeats));
  const scenarioStatus = (total: number) => total === absoluteMajority
    ? copy.majorityReached
    : total > absoluteMajority
      ? copy.majorityAbove.replace('{count}', wholeNumber.format(total - absoluteMajority))
      : copy.majorityMissing.replace('{count}', wholeNumber.format(absoluteMajority - total));
  const comparisonRows: ComparisonRow[] = voteData.map((party) => ({
    party: party.name,
    value: metric === 'votes' ? party.votes : party.seats,
    previous: metric === 'votes' ? party.votes2023 : party.seats2023,
    color: party.color,
    fill: party.color,
  }));
  const comparisonConfig: ChartConfig = {
    value: { label: copy.rtveAverage, color: 'var(--chart-1)' },
  };

  return (
    <div className="survey-wide flex flex-col gap-6">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="min-w-0 shadow-sm ring-0">
          <CardHeader>
            <CardTitle>
              <h3>{copy.majorityTitle}</h3>
            </CardTitle>
            <CardDescription>{copy.majorityDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{copy.partySelectorHint}</p>
              <div role="group" aria-label={copy.partySelectorLabel} className="flex flex-wrap gap-2">
                {seatsParties.map((party) => {
                  const isSelected = selectedPartyKeys.includes(party.key);
                  return (
                    <Button
                      key={party.key}
                      type="button"
                      variant={isSelected ? 'secondary' : 'outline'}
                      size="sm"
                      aria-pressed={isSelected}
                      aria-label={party.name + ', ' + wholeNumber.format(party.seats) + ' ' + (party.seats === 1 ? copy.seat : copy.seats)}
                      onClick={() => setSelectedPartyKeys((previous) => (
                        previous.includes(party.key)
                          ? previous.filter((key) => key !== party.key)
                          : [...previous, party.key]
                      ))}
                    >
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: party.color }} aria-hidden="true" />
                      <span>{party.name}</span>
                      <span className="tabular-nums text-muted-foreground">{wholeNumber.format(party.seats)}</span>
                    </Button>
                  );
                })}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={selectedPartyKeys.length === 0}
                  onClick={() => setSelectedPartyKeys([])}
                >
                  {copy.clearSelection}
                </Button>
              </div>
              <p aria-live="polite" className="text-sm font-medium">
                {selectedPartyKeys.length === 0
                  ? selectionStatus
                  : wholeNumber.format(selectedSeats) + ' ' + (selectedSeats === 1 ? copy.seat : copy.seats) + '. ' + selectionStatus}
              </p>
            </div>

            <ChartContainer
              config={majorityChartConfig}
              className="min-h-[250px] w-full"
              role="group"
              aria-label={copy.majorityTitle}
            >
              <BarChart
                accessibilityLayer
                data={majorityRows}
                layout="vertical"
                margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
                barCategoryGap={18}
              >
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis
                  type="number"
                  domain={[0, 350]}
                  ticks={[0, 100, 200, 300]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => wholeNumber.format(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                {seatsParties.map((party) => (
                  <Bar
                    key={party.key}
                    dataKey={party.key}
                    stackId="seats"
                    fill={party.color}
                    isAnimationActive={false}
                    radius={0}
                  />
                ))}
                <ReferenceLine
                  x={absoluteMajority}
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.5}
                  strokeOpacity={0.75}
                  strokeDasharray="3 4"
                />
              </BarChart>
            </ChartContainer>

            <dl aria-label={copy.scenarioTotals} className="grid gap-2 sm:grid-cols-3">
              {majorityRows.map((row) => (
                <div key={row.label} className="rounded-xl bg-muted/40 p-3">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {row.label === copy.customBlock && selectedPartyKeys.length === 0
                      ? copy.emptySelection
                      : wholeNumber.format(row.total) + ' ' + (row.total === 1 ? copy.seat : copy.seats)}
                  </dd>
                  {row.label === copy.customBlock && selectedPartyKeys.length === 0
                    ? null
                    : <dd className="mt-1 text-xs text-muted-foreground">{scenarioStatus(row.total)}</dd>}
                </div>
              ))}
            </dl>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            {copy.majorityMarker}
          </CardFooter>
        </Card>

        <Card className="min-w-0 shadow-sm ring-0">
          <CardHeader>
            <CardTitle>
              <h3>{copy.voteSeatsTitle}</h3>
            </CardTitle>
            <CardDescription>{copy.voteSeatsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ToggleGroup
              multiple={false}
              value={[metric]}
              onValueChange={(values) => {
                const value = values[0];
                if (value === 'votes' || value === 'seats') setMetric(value);
              }}
              variant="outline"
              size="sm"
              spacing={0}
              aria-label={copy.metricLabel}
            >
              <ToggleGroupItem value="votes">{copy.votePercent}</ToggleGroupItem>
              <ToggleGroupItem value="seats">{copy.seats}</ToggleGroupItem>
            </ToggleGroup>

            <ChartContainer
              config={comparisonConfig}
              className="min-h-[500px] w-full"
              role="group"
              aria-label={copy.voteSeatsTitle + ', ' + unit}
            >
              <BarChart
                accessibilityLayer
                data={comparisonRows}
                layout="vertical"
                margin={{ top: 8, right: 20, bottom: 20, left: 0 }}
                barCategoryGap={8}
              >
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis
                  type="number"
                  dataKey="value"
                  domain={metric === 'votes' ? [0, 40] : [0, 200]}
                  ticks={metric === 'votes' ? [0, 10, 20, 30, 40] : [0, 50, 100, 150, 200]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => displayedNumber.format(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="party"
                  width={132}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => displayedNumber.format(Number(value)) + ' ' + unit}
                    />
                  }
                />
                <Bar
                  dataKey="value"
                  shape={ComparisonBar}
                  isAnimationActive={false}
                  barSize={16}
                  fill="var(--chart-1)"
                >
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(value) => displayedNumber.format(Number(value))}
                    fill="var(--foreground)"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-sm bg-foreground" aria-hidden="true" />
              {copy.rtveAverage}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-0 border-l border-muted-foreground/70" aria-hidden="true" />
              {copy.election2023}
            </span>
          </CardFooter>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        {copy.sourceNote}{' '}
        <a href={articleUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          {copy.sourceLink}
        </a>
      </p>
    </div>
  );
}
