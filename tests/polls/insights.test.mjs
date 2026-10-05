import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import data from '../../lib/polls/generated/details.json' with { type: 'json' };
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';

// Independently compare every new extracted cell with the original workbook.
test('new electoral insights preserve published cells and missing values', async () => {
  const book = new ExcelJS.Workbook();
  await book.xlsx.readFile('data/polls/raw/40db/2026-10/04_Tablas_octubre_2026.xlsx');
  const added = data.observations.filter(row => row.source === '40db-2026-10' && (['Ideología 7', 'Sexo - Generación'].includes(row.sheet) || ['P4','P5_1','P5_2','P5_3','P5_4','P5_5','P5_6'].includes(row.question)));
  assert.equal(added.length, 1065);
  for (const row of added) assert.equal(row.value, book.getWorksheet(row.sheet).getCell(row.cell).value, `${row.sheet}!${row.cell}`);
  const rejection = added.filter(row => row.segment === 'Total' && row.response === '0 No le votaría nunca');
  assert.deepEqual(rejection.map(row => row.value), [38.1,38.5,47.4,47.3,50.5,57.1]);
});

test('profile charts keep all eight groups and respect source deselection', () => {
  for (const observations of [data.ideologyObservations, data.sexGenerationObservations]) {
    assert.equal(new Set(observations.filter(row => row.segment !== 'Total').map(row => row.segment)).size, 8);
    const selected = aggregatePolls(observations, data.sources, '2026-10', ['40db-2026-10','sigma-dos-2026-10']);
    assert.ok(selected.length > 0);
    assert.ok(selected.filter(row => row.value !== null).every(row => row.contributors.length === 1 && row.contributors[0] === '40db-2026-10'));
    assert.deepEqual(aggregatePolls(observations, data.sources, '2026-10', ['sigma-dos-2026-10']), []);
  }
});
