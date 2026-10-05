import { readPublishedEstimation } from './read-published-estimation.mjs';
import { extractVoteComparison } from './extract-vote-comparison.mjs';
import ExcelJS from 'exceljs';
import { groupAgeObservations } from '../../lib/polls/demographics.mjs';
import { aggregatePolls } from '../../lib/polls/aggregation.mjs';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Only combine the same question, response, segment and period. Blank cells
// remain unavailable: they are never converted into invented zeroes.
const sources = JSON.parse(await readFile('data/polls/sources.json', 'utf8'));
const observations = [];
const voteComparisons = [];
for (const source of sources) {
  if (!(source.weight > 0) || !Number.isFinite(source.weight)) throw new Error(`Invalid weight: ${source.id}`);
  await mkdir(`public/polls/${source.id}`, { recursive: true });
  if (source.adapter === 'published-json') {
    voteComparisons.push({ source: source.id, period: source.period, ...await readPublishedEstimation(source) });
    const published = JSON.parse(await readFile(source.publishedData, 'utf8'));
    const responses = { PSOE: 'PSOE (Partido Socialista Obrero Español)', PP: 'PP (Partido Popular)' };
    for (const [segment, destinations] of Object.entries(published.transfer ?? {})) {
      for (const destination of ['PP','PSOE','Vox','Sumar','Podemos','No votaría','Otros (Sigma Dos)','Indecisos (Sigma Dos)']) {
        const value = destinations[destination] ?? null;
        if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) throw new Error(`Invalid transfer value: ${source.id}`);
        observations.push({ source: source.id, period: source.period, sheet: 'Recuerdo de voto - Generales', question: 'P3', response: responses[destination] ?? destination, segment, value, cell: `transfer-original.jpg#${segment}/${destination}`, base: 'Porcentaje de votantes según recuerdo de voto en 2023' });
      }
    }
    if (source.originalVote) await copyFile(source.originalVote, `public/polls/${source.id}/vote-original.jpg`);
    if (source.originalTransfer) await copyFile(source.originalTransfer, `public/polls/${source.id}/transfer-original.jpg`);
    await copyFile(source.publishedData, `public/polls/${source.id}/published-data.json`);
    await copyFile(source.dataset, `public/polls/${source.id}/estimation.tsv`);
    continue;
  }
  if (source.voteReport) voteComparisons.push({ source: source.id, period: source.period, ...await extractVoteComparison(source.voteReport) });
  const bytes = await readFile(source.tables);
  source.sha256 = createHash('sha256').update(bytes).digest('hex');
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(bytes);
  for (const [sheetName, questions] of [['Recuerdo de voto - Generales', ['P2', 'P3', 'P4', 'P5_1', 'P5_2', 'P5_3', 'P5_4', 'P5_5', 'P5_6']], ['Edad', ['P3']], ['Sexo', ['P3']], ['Ideología 7', ['P3']], ['Sexo - Generación', ['P3']]]) {
    const sheet = book.getWorksheet(sheetName);
    if (!sheet) throw new Error(`Missing worksheet ${sheetName}`);
    for (const question of questions) {
      const header = sheet.getRows(1, sheet.rowCount).find(row => row.getCell(2).value === question);
      if (!header) throw new Error(`Missing ${question} in ${sheetName}`);
      for (let r = header.number + 1; r <= sheet.rowCount; r++) {
        const row = sheet.getRow(r);
        const response = row.getCell(2).value;
        if (response === null) break;
        for (let col = 3; col <= (sheetName === 'Sexo' ? 5 : ['Ideología 7', 'Sexo - Generación'].includes(sheetName) ? 11 : 9); col++) {
          const segment = col === 3 ? 'Total' : sheet.getRow(3).getCell(col).value;
          const value = row.getCell(col).value;
          if (value !== null && (typeof value !== 'number' || value < 0 || value > 100)) throw new Error(`Invalid percentage ${sheetName}!${row.getCell(col).address}`);
          observations.push({ source: source.id, period: source.period, sheet: sheetName, question, response: String(response), segment, value,
            cell: row.getCell(col).address, base: String(header.getCell(col).value) });
        }
      }
    }
  }
  await mkdir(`public/polls/${source.id}`, { recursive: true });
  await copyFile(source.tables, `public/polls/${source.id}/tables.xlsx`);
  if (source.voteReport) await copyFile(source.voteReport, `public/polls/${source.id}/vote-report.pdf`);
  await copyFile(source.methodology, `public/polls/${source.id}/methodology.pdf`);
}
const latest = sources.map(s => s.period).sort().at(-1);
const metrics = aggregatePolls(observations, sources, latest);
const ageObservations = groupAgeObservations(observations);
const sexObservations = groupAgeObservations(observations, 'Sexo');
const ideologyObservations = groupAgeObservations(observations, 'Ideología 7');
const sexGenerationObservations = groupAgeObservations(observations, 'Sexo - Generación');
const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const columns = ['source','period','sheet','question','response','segment','value','cell','base'];
await mkdir('public/polls', { recursive: true });
await writeFile('public/polls/observations.csv', [columns.join(','), ...observations.map(row => columns.map(col => quote(row[col])).join(','))].join('\n') + '\n');
for (const source of sources) {
  const rows = observations.filter(row => row.source === source.id);
  if (!rows.length) continue;
  await writeFile(`public/polls/${source.id}/observations.csv`, [columns.join(','), ...rows.map(row => columns.map(col => quote(row[col])).join(','))].join('\n') + '\n');
}
await mkdir('lib/polls/generated', { recursive: true });
await writeFile('lib/polls/generated/details.json', JSON.stringify({ period: latest, sources, observations, ageObservations, sexObservations, ideologyObservations, sexGenerationObservations, voteComparisons, metrics }, null, 2) + '\n');
console.log(`Extracted ${observations.length} source cells; ${metrics.length} comparable metrics for ${latest}.`);
