import { readFile } from 'node:fs/promises';

export async function readPublishedEstimation(source) {
  const data = JSON.parse(await readFile(source.publishedData, 'utf8'));
  const lines = (await readFile(source.dataset, 'utf8')).trim().split(/\r?\n/).slice(1);
  const rows = lines.map(line => {
    const [name, seats, percentage] = line.split('\t');
    return { key: name.trim() === 'Otros' ? 'otherParties' : name.trim(), value: Number(percentage.replace('%','').replace(',','.')), seats: Number(seats.trim()) };
  });
  if (JSON.stringify(rows) !== JSON.stringify(data.current) || data.period !== source.period || data.sourceUrl !== source.sourceUrl) throw new Error(`Published data mismatch: ${source.id}`);
  if (rows.some(row => !Number.isFinite(row.value) || row.value < 0 || row.value > 100 || !Number.isInteger(row.seats) || row.seats < 0)) throw new Error(`Invalid published values: ${source.id}`);
  const total = Math.round(rows.reduce((sum, row) => sum + row.value, 0) * 10) / 10;
  if (total !== data.publishedTotal || rows.reduce((sum,row) => sum + row.seats, 0) !== 350) throw new Error(`Invalid published totals: ${source.id}`);
  const election = data.election ?? [];
  if (election.length && (election.some(row => !Number.isFinite(row.value) || row.value < 0 || row.value > 100 || !Number.isInteger(row.seats) || row.seats < 0) || election.reduce((sum,row) => sum + row.seats, 0) !== 350 || Math.abs(election.reduce((sum,row) => sum + row.value, 0) - 100) > 0.2)) throw new Error(`Invalid historical results: ${source.id}`);
  return { current: rows, election, publishedTotal: total, incomplete: Math.abs(total - 100) > 0.2 };

}
