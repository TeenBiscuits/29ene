import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';
// Synthetic values exercise the calculation only; they are never published.
const sources = [
  { id: 'a', pollster: 'A', period: '2026-10', weight: 1 },
  { id: 'b', pollster: 'B', period: '2026-10', weight: 3 },
  { id: 'old', pollster: 'Old', period: '2026-09', weight: 100 },
];
const observation = (source, value, overrides = {}) => ({ source, value, period: '2026-10', sheet: 'Edad', question: 'P3', response: 'PP', segment: '18-24', ...overrides });
const rows = [observation('a', 20), observation('b', 40), observation('old', 90, { period: '2026-09' })];
test('a single selected company keeps its published percentage', () => {
  assert.equal(aggregatePolls(rows, sources, '2026-10', ['a'])[0].value, 20);
});
test('selected companies and all companies use their relative weights', () => {
  const selected = aggregatePolls(rows, sources, '2026-10', ['a', 'b']);
  assert.equal(selected[0].value, 35);
  assert.deepEqual(selected, aggregatePolls(rows, sources, '2026-10'));
  assert.deepEqual(selected[0].contributors, ['a', 'b']);
});
test('missing data does not dilute the available percentage; zero is valid', () => {
  assert.equal(aggregatePolls([observation('a', null), observation('b', 40)], sources, '2026-10')[0].value, 40);
  assert.equal(aggregatePolls([observation('a', null), observation('b', null)], sources, '2026-10')[0].value, null);
  assert.equal(aggregatePolls([observation('a', 0), observation('b', 40)], sources, '2026-10')[0].value, 30);
});
test('periods and segments stay separate, including an empty selection', () => {
  assert.equal(aggregatePolls(rows, sources, '2026-09')[0].value, 90);
  assert.equal(aggregatePolls([...rows, observation('a', 10, { segment: '65+' })], sources, '2026-10').length, 2);
  assert.deepEqual(aggregatePolls(rows, sources, '2026-10', []), []);
});
test('invalid editorial weights are rejected', () => {
  assert.throws(() => aggregatePolls(rows, [{ ...sources[0], weight: 0 }], '2026-10'));
});
