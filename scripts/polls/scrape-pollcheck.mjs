import { readFile, writeFile } from 'node:fs/promises';

// This is the public Spain dataset loaded by Electomanía's PollCheck embed.
const sourceUrl = 'https://electomania.es/pollchek/';
const apiUrl = 'https://api.em-data.es/api/es/pollcheck';
const outputPath = 'data/polls/pollcheck.json';

const normalizeName = value => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '');

const response = await fetch(apiUrl, {
  headers: { accept: 'application/json' },
  signal: AbortSignal.timeout(15_000),
});

if (!response.ok) throw new Error(`PollCheck request failed: HTTP ${response.status}`);

const payload = await response.json();
if (!Array.isArray(payload.results) || payload.results.length === 0) {
  throw new Error('PollCheck returned no results; the stored snapshot was not changed.');
}

for (const result of payload.results) {
  const score = Number(result.poll_check);
  if (typeof result.encuestadora !== 'string' || !Number.isFinite(score) || score < 0 || score > 10) {
    throw new Error(`Invalid PollCheck result: ${JSON.stringify(result)}`);
  }
}

const sources = JSON.parse(await readFile('data/polls/sources.json', 'utf8'));
const availablePollsters = new Set(payload.results.map(result => normalizeName(result.encuestadora)));
const missing = [...new Set(sources.map(source => source.pollster))]
  .filter(pollster => !availablePollsters.has(normalizeName(pollster)));

if (missing.length > 0) {
  throw new Error(`PollCheck did not return these project pollsters: ${missing.join(', ')}`);
}

const snapshot = {
  sourceUrl,
  apiUrl,
  fetchedAt: new Date().toISOString(),
  count: payload.count ?? payload.results.length,
  results: payload.results,
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Saved ${snapshot.results.length} PollCheck entries to ${outputPath}.`);
