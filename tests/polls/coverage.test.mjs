import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';
import { latestPollsterSources, selectedPeriod, hasPublishedValues, contributingSources } from '../../lib/polls/coverage.mjs';

const sources = latestPollsterSources(data.sources);
const observations = data.voteComparisons.flatMap(comparison => comparison.current.map(row => ({ source: comparison.source, period: comparison.period, sheet: 'Estimate', question: 'Vote', segment: 'Total', response: row.key, value: row.value })));

test('the current sources contribute to the selected estimate', () => {
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
