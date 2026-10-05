import type { PollObservation } from './aggregation.mjs';
export const ageCategories: { key: string; color: string; responses: string[] }[];
export function groupAgeObservations(observations: PollObservation[], sheetName?: string): PollObservation[];
