import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractVoteComparison } from '../../scripts/polls/extract-vote-comparison.mjs';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };

test('comparison extracts both published series from the original report', async () => {
  const source = data.sources.find(source => source.id === '40db-2026-10');
  const comparison = await extractVoteComparison(source.voteReport);
  assert.equal(comparison.page, 8);
  assert.equal(comparison.electionDate, '2023-07-23');
  assert.deepEqual(comparison.election.map(row => row.value), [33.1,31.7,12.4,12.3,10.5]);
  assert.deepEqual(comparison.current.map(row => row.value), [31.6,27.4,18.4,5.6,2.7,2,12.3]);
  assert.ok(!comparison.election.some(row => row.key === 'Podemos'));
  assert.deepEqual(data.voteComparisons[0].current, comparison.current);
});
