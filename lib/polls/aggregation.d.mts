export type PollSource = { id: string; period: string; weight: number; pollster: string };
export type PollObservation = {
  source: string; period: string; sheet: string; question: string;
  response: string; segment: string; value: number | null;
};
export type PollMetric = Omit<PollObservation, 'source'> & { contributors: string[] };

export function aggregatePolls(
  observations: PollObservation[], sources: PollSource[], period: string,
  selectedIds?: string[],
): PollMetric[];
