import type { Locale } from '@/lib/locales';

type RtveChartCopy = {
  majorityTitle: string;
  majorityDescription: string;
  voteSeatsTitle: string;
  voteSeatsDescription: string;
  partySelectorLabel: string;
  partySelectorHint: string;
  clearSelection: string;
  rightBlock: string;
  investitureBlock: string;
  customBlock: string;
  scenarioTotals: string;
  emptySelection: string;
  majorityReached: string;
  majorityAbove: string;
  majorityMissing: string;
  seat: string;
  seats: string;
  votePercent: string;
  metricLabel: string;
  rtveAverage: string;
  election2023: string;
  majorityMarker: string;
  sourceNote: string;
  sourceLink: string;
};

export const rtveChartCopy = {
  es: {
    majorityTitle: 'Posibles mayorías',
    majorityDescription: 'Escaños por bloque según la media de las encuestadoras. La mayoría absoluta está en 176 escaños.',
    voteSeatsTitle: 'Voto y escaños por partido',
    voteSeatsDescription: 'Promedio RTVE frente al resultado de las generales de 2023. La marca vertical señala el resultado de 2023.',
    partySelectorLabel: 'Partidos para construir una mayoría',
    partySelectorHint: 'Pulsa los partidos para construir tu mayoría.',
    clearSelection: 'Borrar selección',
    rightBlock: 'PP + Vox + UPN',
    investitureBlock: 'Bloque de investidura',
    customBlock: 'Tu selección',
    scenarioTotals: 'Escaños por bloque',
    emptySelection: 'Selecciona partidos para sumar sus escaños.',
    majorityReached: 'Se alcanza la mayoría absoluta.',
    majorityAbove: '{count} por encima de la mayoría absoluta.',
    majorityMissing: 'Faltan {count} para la mayoría absoluta.',
    seat: 'escaño',
    seats: 'escaños',
    votePercent: '% de voto',
    metricLabel: 'Medida',
    rtveAverage: 'Promedio RTVE',
    election2023: 'Resultado de las generales de 2023',
    majorityMarker: 'Línea vertical: mayoría absoluta, 176 escaños.',
    sourceNote: 'Fuente: DatosRTVE, promedio de encuestas con datos a 5 de octubre de 2026.',
    sourceLink: 'RTVE: «Encuestas elecciones generales 29N: PP y Vox podrían gobernar con más de 200 diputados»',
  },
  gl: {
    majorityTitle: 'Posibles maiorías',
    majorityDescription: 'Escanos por bloque segundo a media das enquisadoras. A maioría absoluta está en 176 escanos.',
    voteSeatsTitle: 'Voto e escanos por partido',
    voteSeatsDescription: 'Media de RTVE fronte ao resultado das xerais de 2023. A marca vertical sinala o resultado de 2023.',
    partySelectorLabel: 'Partidos para construír unha maioría',
    partySelectorHint: 'Preme nos partidos para construír a túa maioría.',
    clearSelection: 'Borrar selección',
    rightBlock: 'PP + Vox + UPN',
    investitureBlock: 'Bloque de investidura',
    customBlock: 'A túa selección',
    scenarioTotals: 'Escanos por bloque',
    emptySelection: 'Selecciona partidos para sumar os seus escanos.',
    majorityReached: 'Alcánzase a maioría absoluta.',
    majorityAbove: '{count} por riba da maioría absoluta.',
    majorityMissing: 'Faltan {count} para a maioría absoluta.',
    seat: 'escano',
    seats: 'escanos',
    votePercent: '% de voto',
    metricLabel: 'Medida',
    rtveAverage: 'Media de RTVE',
    election2023: 'Resultado das xerais de 2023',
    majorityMarker: 'Liña vertical: maioría absoluta, 176 escanos.',
    sourceNote: 'Fonte: DatosRTVE, media de enquisas con datos a 5 de outubro de 2026.',
    sourceLink: 'RTVE: «Encuestas elecciones generales 29N: PP y Vox podrían gobernar con más de 200 diputados»',
  },
  ca: {
    majorityTitle: 'Possibles majories',
    majorityDescription: 'Escons per bloc segons la mitjana de les enquestadores. La majoria absoluta és de 176 escons.',
    voteSeatsTitle: 'Vot i escons per partit',
    voteSeatsDescription: 'Mitjana de RTVE en comparació amb el resultat de les generals del 2023. La marca vertical indica el resultat del 2023.',
    partySelectorLabel: 'Partits per construir una majoria',
    partySelectorHint: 'Prem els partits per construir la teva majoria.',
    clearSelection: 'Esborra la selecció',
    rightBlock: 'PP + Vox + UPN',
    investitureBlock: 'Bloc d’investidura',
    customBlock: 'La teva selecció',
    scenarioTotals: 'Escons per bloc',
    emptySelection: 'Selecciona partits per sumar-ne els escons.',
    majorityReached: 'S’assoleix la majoria absoluta.',
    majorityAbove: '{count} per sobre de la majoria absoluta.',
    majorityMissing: 'En falten {count} per arribar a la majoria absoluta.',
    seat: 'escó',
    seats: 'escons',
    votePercent: '% de vot',
    metricLabel: 'Mesura',
    rtveAverage: 'Mitjana RTVE',
    election2023: 'Resultat de les generals del 2023',
    majorityMarker: 'Línia vertical: majoria absoluta, 176 escons.',
    sourceNote: 'Font: DatosRTVE, mitjana d’enquestes amb dades del 5 d’octubre de 2026.',
    sourceLink: 'RTVE: «Encuestas elecciones generales 29N: PP y Vox podrían gobernar con más de 200 diputados»',
  },
  eu: {
    majorityTitle: 'Balizko gehiengoak',
    majorityDescription: 'Bloke bakoitzeko eserlekuak inkesta etxeen batezbestekoaren arabera. Gehiengo osoa 176 eserlekutan dago.',
    voteSeatsTitle: 'Botoa eta eserlekuak alderdi bakoitzeko',
    voteSeatsDescription: 'RTVEren batezbestekoa eta 2023ko hauteskunde orokorren emaitza. Marka bertikalak 2023ko emaitza adierazten du.',
    partySelectorLabel: 'Gehiengoa osatzeko alderdiak',
    partySelectorHint: 'Sakatu alderdiak zure gehiengoa osatzeko.',
    clearSelection: 'Garbitu hautapena',
    rightBlock: 'PP + Vox + UPN',
    investitureBlock: 'Inbestidura-blokea',
    customBlock: 'Zure hautapena',
    scenarioTotals: 'Bloke bakoitzeko eserlekuak',
    emptySelection: 'Hautatu alderdiak eserlekuak batzeko.',
    majorityReached: 'Gehiengo osoa lortu da.',
    majorityAbove: '{count} eserleku gehiengo osotik gora.',
    majorityMissing: '{count} eserleku falta dira gehiengo osoa lortzeko.',
    seat: 'eserleku',
    seats: 'eserleku',
    votePercent: 'Botoaren %',
    metricLabel: 'Neurria',
    rtveAverage: 'RTVEren batezbestekoa',
    election2023: '2023ko hauteskunde orokorren emaitza',
    majorityMarker: 'Marra bertikala: gehiengo osoa, 176 eserleku.',
    sourceNote: 'Iturria: DatosRTVE, inkesten batezbestekoa 2026ko urriaren 5eko datuekin.',
    sourceLink: 'RTVE: «Encuestas elecciones generales 29N: PP y Vox podrían gobernar con más de 200 diputados»',
  },
} satisfies Record<Locale, RtveChartCopy>;
