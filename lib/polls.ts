import history from "./poll-history.json";

// Transcribed from encuesta1.html. Its SVG coordinates encode monthly
// estimates on a linear 0–36% axis. Missing months remain missing.
export const pollHistory = history;
export const pollPublished = "2026-10-05";
export const electionDate = "2023-07-23";
export const pollSources = {
  pollster: "https://40db.es/",
  article:
    "https://elpais.com/espana/2026-10-05/el-tiron-de-vox-mantiene-al-bloque-de-la-derecha-en-el-50-en-plena-conmocion-por-maricarmen.html",
};

export const latestPoll = [
  ...history.map((party) => ({
    name: party.name,
    color: party.color,
    value: party.points.at(-1)!.value,
    change: party.election === undefined
      ? null
      : Math.round((party.points.at(-1)!.value - party.election) * 10) / 10,
  })),
  { name: "Otros", color: "#99998e", value: 11.5, change: null },
];
