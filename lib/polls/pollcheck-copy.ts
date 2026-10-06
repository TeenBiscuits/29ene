import type { Locale } from '../locales';

export const pollCheckCopy = {
  es: {
    title: 'PollCheck®',
    description: 'Es el índice de Electomanía que puntúa de 0 a 10 la precisión histórica de las encuestadoras.',
    moreInfo: 'Más información sobre PollCheck',
    updated: 'Datos consultados el',
  },
  gl: {
    title: 'PollCheck®',
    description: 'É o índice de Electomanía que puntúa de 0 a 10 a precisión histórica das enquisadoras.',
    moreInfo: 'Máis información sobre PollCheck',
    updated: 'Datos consultados o',
  },
  ca: {
    title: 'PollCheck®',
    description: 'És l’índex d’Electomanía que puntua de 0 a 10 la precisió històrica de les enquestadores.',
    moreInfo: 'Més informació sobre PollCheck',
    updated: 'Dades consultades el',
  },
  eu: {
    title: 'PollCheck®',
    description: 'Electomaniaren indizea da, inkesta-etxeen zehaztasun historikoa 0tik 10era neurtzen duena.',
    moreInfo: 'PollCheck-i buruzko informazio gehiago',
    updated: 'Kontsulta-data:',
  },
} satisfies Record<Locale, { title: string; description: string; moreInfo: string; updated: string }>;
