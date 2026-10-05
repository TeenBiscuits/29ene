// Select the newest survey for each pollster, then the latest selected period.
// Different months never enter a weighted average together.
export function latestPollsterSources(sources) {
  const latest = new Map();
  for (const source of sources) {
    if (!latest.has(source.pollster) || latest.get(source.pollster).period < source.period) latest.set(source.pollster, source);
  }
  return [...latest.values()];
}
export function selectedPeriod(sources, selectedIds) {
  return sources.filter(source => selectedIds.includes(source.id)).map(source => source.period).sort().at(-1) ?? null;
}
export function hasPublishedValues(metrics, sheet, question) {
  return metrics.some(row => row.sheet === sheet && row.question === question && row.value !== null);
}
export function contributingSources(metrics, sources, sheet, question) {
  const ids = new Set(metrics.filter(row => row.sheet === sheet && row.question === question && row.value !== null).flatMap(row => row.contributors));
  return sources.filter(source => ids.has(source.id));
}
