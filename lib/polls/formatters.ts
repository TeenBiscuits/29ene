import { locales } from '../locales';
export const pollNumbers = Object.fromEntries(locales.map(locale => [locale, new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })]));
