import snapshot from '@/data/polls/pollcheck.json';

export const pollCheckSnapshot = snapshot;

const normalizeName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '');

const resultsByPollster = new Map(
  snapshot.results.map(result => [normalizeName(result.encuestadora), result] as const),
);

export function pollCheckForPollster(pollster: string) {
  return resultsByPollster.get(normalizeName(pollster)) ?? null;
}
