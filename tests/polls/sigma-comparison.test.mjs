import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };
import { prepareComparison } from '../../lib/polls/comparison.mjs';
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';
import { readPublishedEstimation } from '../../scripts/polls/read-published-estimation.mjs';
import { contributingSources, hasPublishedValues } from '../../lib/polls/coverage.mjs';

const sigma = data.sources.find(source => source.pollster === 'Sigma Dos');

test('Sigma Dos preserves all published current and historical percentages and seats', async () => {
  const series = await readPublishedEstimation(sigma);
  for (const rows of [series.current, series.election]) {
    assert.equal(rows.reduce((sum,row) => sum + row.seats, 0),350);
    assert.ok(Math.abs(rows.reduce((sum,row) => sum + row.value, 0) - 100) < 0.2);
  }
  assert.equal(Math.round(series.election.reduce((sum,row) => sum + row.value,0) * 10) / 10,100.1);
  assert.deepEqual(series.current.find(row => row.key === 'PP'),{key:'PP',value:32.6,seats:140});
  assert.deepEqual(series.current.find(row => row.key === 'sigmaOther'),{key:'sigmaOther',value:4.3,seats:0});
  assert.equal(series.election.find(row => row.key === 'PSOE').seats,121);
  assert.equal(sigma.sample,2116);
});

test('October comparison groups published categories before averaging to preserve 100 percent', () => {
  const prepared = prepareComparison(data.voteComparisons,['40db-2026-10',sigma.id],'2026-10');
  assert.equal(prepared.grouped,true);
  assert.deepEqual(prepared.keys,['PP','PSOE','Vox','Sumar','Podemos','remainingVotes']);
  const metrics = aggregatePolls(prepared.observations,data.sources,'2026-10');
  assert.equal(metrics.find(row => row.response === 'PP').value,32.1);
  assert.equal(metrics.find(row => row.response === 'PSOE').value,26.5);
  assert.equal(metrics.find(row => row.response === 'remainingVotes').value,13.95);
  assert.equal(metrics.reduce((sum,row) => sum + row.value,0),100);
  assert.ok(prepared.election.every(row => !('seats' in row)));
  assert.ok(Math.abs(prepared.election.reduce((sum,row) => sum + row.value,0)-100)<0.0001);
});

test('Sigma single selection keeps detailed categories and missing transfer cells remain absent', () => {
  const prepared = prepareComparison(data.voteComparisons,[sigma.id],'2026-10');
  assert.equal(prepared.grouped,false);
  assert.ok(prepared.keys.includes('ERC'));
  assert.ok(!prepared.keys.includes('SALF'));
  assert.equal(prepared.election.find(row => row.key === 'PP').seats,137);
  const metrics = aggregatePolls(data.observations,data.sources,'2026-10',[sigma.id]);
  const sheet = 'Recuerdo de voto - Generales';
  assert.equal(hasPublishedValues(metrics,sheet,'P3'),true);
  assert.equal(hasPublishedValues(metrics,sheet,'P2'),false);
  assert.equal(hasPublishedValues(metrics,'Edad','P3'),false);
  assert.equal(hasPublishedValues(metrics,'Sexo','P3'),false);
  assert.equal(metrics.find(row => row.segment === 'PP' && row.response === 'PP (Partido Popular)').value,73.3);
  assert.equal(metrics.find(row => row.segment === 'PP' && row.response === 'PSOE (Partido Socialista Obrero Español)').value,null);
  assert.deepEqual(contributingSources(metrics,data.sources,sheet,'P3').map(source=>source.id),[sigma.id]);
});

test('weighted transfer excludes the missing Sigma cell from its denominator', () => {
  const sheet='Recuerdo de voto - Generales';
  const response='PSOE (Partido Socialista Obrero Español)';
  const individual=aggregatePolls(data.observations,data.sources,'2026-10',['40db-2026-10']);
  const combined=aggregatePolls(data.observations,data.sources,'2026-10',['40db-2026-10',sigma.id]);
  const match = row => row.sheet===sheet && row.question==='P3' && row.segment==='PP' && row.response===response;
  assert.equal(combined.find(match).value,individual.find(match).value);
  assert.deepEqual(combined.find(match).contributors,['40db-2026-10']);
});
