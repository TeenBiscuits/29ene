// Every P3 response belongs to exactly one displayed category. These groups
// sum published percentages, never a residual calculated as 100 minus parties.
export const ageCategories = [
  { key: 'Podemos', color: '#9169f4', responses: ['Podemos'] },
  { key: 'Sumar', color: '#ed6f91', responses: ['Sumar'] },
  { key: 'PSOE', color: '#ed1c24', responses: ['PSOE (Partido Socialista Obrero Español)'] },
  { key: 'regional', color: '#f2b800', responses: [
    'ERC (Esquerra Republicana de Catalunya)',
    'JxCAT – Junts (Junts per Catalunya – Junts)',
    'EAJ – PNV (Euzko Alderdi Jeltzalea – Partido Nacionalista Vasco)',
    'EH Bildu (Euskal Herria Bildu)', 'Coalición Canaria',
    'Nueva Canarias – Bloque Canarista', 'BNG (Bloque Nacionalista Galego)',
    'CUP – PR (Candidatura D’Unitat Popular – Per la Ruptura)',
    'España Vaciada', 'UPN (Unión del Pueblo Navarro)', 'UPL (Unión del Pueblo Leonés)',
  ] },
  { key: 'other', color: '#dce1e5', responses: [
    'Otro', 'Votaría en blanco', 'Votaría nulo', 'No votaría', 'No lo sé', 'Prefiero no contestar',
  ] },
  { key: 'PP', color: '#0055a7', responses: ['PP (Partido Popular)'] },
  { key: 'SALF', color: '#576060', responses: ['Se acabó la fiesta'] },
  { key: 'Vox', color: '#5ac035', responses: ['Vox'] },
];

export function groupAgeObservations(observations, sheetName = 'Edad') {
  const responseGroups = new Map(ageCategories.flatMap(category => category.responses.map(response => [response, category.key])));
  const grouped = new Map();
  for (const row of observations.filter(row => row.sheet === sheetName && row.question === 'P3')) {
    const category = responseGroups.get(row.response);
    if (!category) throw new Error(`Unmapped age-chart response: ${row.response}`);
    const key = JSON.stringify([row.source, row.period, row.segment, category]);
    const group = grouped.get(key) ?? { ...row, response: category, value: null };
    if (row.value !== null) group.value = Math.round(((group.value ?? 0) + row.value) * 1000) / 1000;
    grouped.set(key, group);
  }
  return [...grouped.values()].map(({ source, period, sheet, question, response, segment, value }) => ({ source, period, sheet, question, response, segment, value }));
}
