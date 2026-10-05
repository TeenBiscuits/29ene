import { notFound } from 'next/navigation';
import { PollsPage } from '@/components/polls/polls-page';
import { isLocale } from '@/lib/locales';
import { pollsMetadata } from '@/lib/polls/metadata';
export const dynamicParams = false;
export function generateStaticParams() { return [{ lang: 'gl' }, { lang: 'ca' }, { lang: 'eu' }]; }
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === 'es') notFound();
  return pollsMetadata(lang);
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === 'es') notFound();
  return <PollsPage locale={lang} />;
}
