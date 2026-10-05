const majorParties = ['PP','PSOE','Vox','Sumar','Podemos','SALF'];

// A weighted arc must represent one shared partition of all published votes.
// Keep detailed source categories in single-source mode; group the rest from
// explicit published values before averaging multiple sources.
export function prepareComparison(comparisons, selectedIds, period) {
  const active = comparisons.filter(source => selectedIds.includes(source.source) && source.period === period);
  const common = majorParties.filter(key => active.length && active.every(source => source.current.some(row => row.key === key)));
  const grouped = active.length > 1;
  function partition(rows) {
    if (!grouped) return rows;
    const rest = rows.filter(row => !common.includes(row.key));
    return [...rows.filter(row => common.includes(row.key)).map(({ key, value }) => ({ key, value })), ...(rest.length ? [{ key: 'remainingVotes', value: Math.round(rest.reduce((sum,row) => sum + row.value, 0) * 1000) / 1000 }] : [])];
  }
  const observations = active.flatMap(source => partition(source.current).map(row => ({ source: source.source, period: source.period, sheet: 'Estimación electoral', question: 'Estimación', response: row.key, segment: 'Total', value: row.value })));
  const historical = active.find(source => source.election.length)?.election ?? [];
  return { active, grouped, observations, election: partition(historical), keys: [...new Set(observations.map(row => row.response))] };
}
