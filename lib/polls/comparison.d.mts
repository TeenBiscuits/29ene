import type { PollObservation } from './aggregation.mjs';
export type VoteRow = { key: string; value: number; seats?: number };
export type VoteComparison = { source: string; period: string; current: VoteRow[]; election: VoteRow[]; incomplete?: boolean };
export function prepareComparison(comparisons: VoteComparison[], selectedIds: string[], period: string): {
  active: VoteComparison[]; grouped: boolean; observations: PollObservation[]; election: VoteRow[]; keys: string[];
};
