import { test } from 'node:test';
import assert from 'node:assert/strict';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };
import { groupAgeObservations, ageCategories } from '../../lib/polls/demographics.mjs';
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';

test('age-chart groups partition every published response and preserve totals', () => {
  const responses = ageCategories.flatMap(category => category.responses);
  assert.equal(new Set(responses).size, responses.length);
  const groups = groupAgeObservations(data.observations);
  for (const segment of ['Total', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']) {
    for (const source of data.sources) {
      const original = data.observations.filter(row => row.source === source.id && row.sheet === 'Edad' && row.question === 'P3' && row.segment === segment);
      const grouped = groups.filter(row => row.source === source.id && row.segment === segment);
      assert.equal(grouped.length, original.length ? 8 : 0);
      assert.ok(Math.abs(original.reduce((sum, row) => sum + (row.value ?? 0), 0) - grouped.reduce((sum, row) => sum + (row.value ?? 0), 0)) < 0.00001);
    }
  }
  // These values are sums of published cells, not rounded values from the HTML example.
  assert.equal(groups.find(row => row.source === '40db-2026-10' && row.segment === 'Total' && row.response === 'regional').value, 7);
  assert.equal(groups.find(row => row.source === '40db-2026-10' && row.segment === 'Total' && row.response === 'other').value, 22.7);
});
test('all missing grouped cells stay missing and unexpected responses fail explicitly', () => {
  const row = { source: 'a', period: '2026-10', sheet: 'Edad', question: 'P3', segment: '18-24', response: 'Otro', value: null };
  assert.equal(groupAgeObservations([row])[0].value, null);
  assert.throws(() => groupAgeObservations([{ ...row, response: 'Unknown party' }]), /Unmapped/);
});
test('grouping happens before combining pollsters, preserving their weights', () => {
  const row = { source: 'a', period: '2026-10', sheet: 'Edad', question: 'P3', segment: '18-24', response: 'Otro', value: 10 };
  const observations = [row, { ...row, response: 'No votaría', value: 20 }, { ...row, source: 'b', value: 50 }];
  const sources = [{ id: 'a', period: '2026-10', pollster: 'A', weight: 1 }, { id: 'b', period: '2026-10', pollster: 'B', weight: 3 }];
  assert.equal(aggregatePolls(groupAgeObservations(observations), sources, '2026-10')[0].value, 45);
});

test('sex groups preserve published totals and stay separate from age groups', () => {
  const groups = groupAgeObservations(data.observations, 'Sexo');
  for (const segment of ['Total', 'Hombre', 'Mujer']) {
    const original = data.observations.filter(row => row.sheet === 'Sexo' && row.segment === segment);
    const grouped = groups.filter(row => row.segment === segment);
    assert.equal(grouped.length, 8);
    assert.ok(grouped.every(row => row.sheet === 'Sexo'));
    assert.ok(Math.abs(original.reduce((sum, row) => sum + (row.value ?? 0), 0) - grouped.reduce((sum, row) => sum + (row.value ?? 0), 0)) < 0.00001);
  }
  assert.equal(groups.find(row => row.segment === 'Hombre' && row.response === 'PSOE').value, 19.8);
  assert.equal(groups.find(row => row.segment === 'Mujer' && row.response === 'PSOE').value, 24.8);
});
