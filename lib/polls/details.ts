import data from './generated/details.json';
import { ageCategories } from './demographics.mjs';
import type { PollMetric } from './aggregation.mjs';
export const pollDetails = data;
const partyResponses = [
  { key: 'PSOE', response: 'PSOE (Partido Socialista Obrero Español)' },
  { key: 'PP', response: 'PP (Partido Popular)' },
  { key: 'Vox', response: 'Vox' },
  { key: 'Sumar', response: 'Sumar' },
  { key: 'Podemos', response: 'Podemos' },
];
export const parties = partyResponses.map(party => ({
  ...party,
  color: ageCategories.find(category => category.key === party.key)!.color,
}));
export function percentage(sheet: string, question: string, response: string, segment: string, metrics: PollMetric[] = data.metrics) {
  return metrics.find(row => row.sheet === sheet && row.question === question && row.response === response && row.segment === segment)?.value ?? null;
}
