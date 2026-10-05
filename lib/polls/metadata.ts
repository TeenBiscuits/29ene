import type { Metadata } from 'next';
import { locales, type Locale } from '../locales';
import { pollCopy, pollsPath } from './copy';
export function pollsMetadata(locale: Locale): Metadata {
  const title = `${pollCopy[locale].title} · 29N`;
  const description = pollCopy[locale].intro;
  return { title, description, openGraph: { title, description }, twitter: { title, description }, alternates: { canonical: pollsPath(locale), languages: Object.fromEntries([...locales.map(lang => [lang, pollsPath(lang)]), ['x-default', pollsPath('es')]]) } };
}
