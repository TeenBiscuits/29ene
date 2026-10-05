import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';
import { latestPollsterSources, selectedPeriod, hasPublishedValues, contributingSources } from '../../lib/polls/coverage.mjs';
import { readPublishedEstimation } from '../../scripts/polls/read-published-estimation.mjs';

const sources = latestPollsterSources(data.sources);
const observations = data.voteComparisons.flatMap(comparison => comparison.current.map(row => ({ source: comparison.source, period: comparison.period, sheet: 'Estimate', question: 'Vote', segment: 'Total', response: row.key, value: row.value })));

test('GAD3 data matches the original published dataset without filling the 5.2 point discrepancy', async () => {
  const source = sources.find(source => source.pollster === 'GAD3');
  const result = await readPublishedEstimation(source);
  assert.equal(result.publishedTotal, 94.8);
  assert.equal(result.incomplete, true);
  assert.equal(result.current.find(row => row.key === 'PP').value, 31.1);
  assert.equal(result.current.find(row => row.key === 'PP').seats, 133);
  assert.equal(result.current.reduce((sum,row) => sum + row.seats, 0), 350);
  assert.equal(result.election.length, 0);
  assert.ok(!result.current.some(row => row.key === 'Podemos'));
});

test('selecting only GAD3 has estimate data and no demographic or participation data', () => {
  const ids = ['gad3-2026-09'];
  const period = selectedPeriod(sources, ids);
  assert.equal(period, '2026-09');
  const metrics = aggregatePolls(data.observations, sources, period, ids);
  for (const [sheet, question] of [['Edad','P3'],['Sexo','P3'],['Recuerdo de voto - Generales','P2'],['Recuerdo de voto - Generales','P3']]) assert.equal(hasPublishedValues(metrics,sheet,question),false);
  const estimates = aggregatePolls(observations,sources,period,ids);
  assert.equal(hasPublishedValues(estimates,'Estimate','Vote'),true);
  assert.deepEqual(contributingSources(estimates,sources,'Estimate','Vote').map(source => source.pollster),['GAD3']);
});

test('all sources use the latest selected period, never mixing September and October', () => {
  const ids = sources.map(source => source.id);
  const period = selectedPeriod(sources,ids);
  assert.equal(period,'2026-10');
  const estimates = aggregatePolls(observations,sources,period,ids);
  assert.equal(estimates.find(row => row.response === 'PP').value,32.1);
  assert.deepEqual(contributingSources(estimates,sources,'Estimate','Vote').map(source => source.pollster),['40dB.','Sigma Dos']);
  const only40db = aggregatePolls(data.ageObservations,sources,period,['40db-2026-10']);
  assert.equal(hasPublishedValues(only40db,'Edad','P3'),true);
});

test('availability distinguishes published zero from missing data and keeps the newest source per pollster', () => {
  const row = { sheet:'s',question:'q',value:0,contributors:['a'] };
  assert.equal(hasPublishedValues([row],'s','q'),true);
  assert.equal(hasPublishedValues([{...row,value:null}],'s','q'),false);
  assert.equal(selectedPeriod(sources,[]),null);
  assert.deepEqual(latestPollsterSources([{id:'a',pollster:'X',period:'2026-09'},{id:'b',pollster:'X',period:'2026-10'}]).map(source=>source.id),['b']);
});
