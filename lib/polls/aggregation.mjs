// Sources are included only in the selected period. Missing values do not
// contribute either a zero or a weight to that metric's denominator.
export function aggregatePolls(
  observations, sources, period,
  selectedIds = sources.map(source => source.id),
) {
  const selected = new Set(selectedIds);
  const weights = new Map(sources.filter(source => selected.has(source.id) && source.period === period).map(source => [source.id, source.weight]));
  for (const weight of weights.values()) {
    if (!Number.isFinite(weight) || weight <= 0) throw new Error('Poll weights must be finite and positive');
  }
  const grouped = new Map();
  for (const row of observations) {
    const weight = weights.get(row.source);
    if (row.period !== period || weight === undefined) continue;
    const key = JSON.stringify([row.sheet, row.question, row.response, row.segment]);
    const group = grouped.get(key) ?? {
      metric: { period, sheet: row.sheet, question: row.question, response: row.response, segment: row.segment, value: null, contributors: [] },
      numerator: 0, denominator: 0,
    };
    if (row.value !== null) {
      group.numerator += row.value * weight;
      group.denominator += weight;
      group.metric.contributors.push(row.source);
    }
    grouped.set(key, group);
  }
  return [...grouped.values()].map(({ metric, numerator, denominator }) => ({
    ...metric, value: denominator ? Math.round(numerator / denominator * 1000) / 1000 : null,
  }));
}
