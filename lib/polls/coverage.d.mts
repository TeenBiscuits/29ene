import type { PollSource, PollMetric } from './aggregation.mjs';
export function latestPollsterSources<T extends PollSource>(sources: T[]): T[];
export function selectedPeriod(sources: PollSource[], selectedIds: string[]): string | null;
export function hasPublishedValues(metrics: PollMetric[], sheet: string, question: string): boolean;
export function contributingSources<T extends PollSource>(metrics: PollMetric[], sources: T[], sheet: string, question: string): T[];
