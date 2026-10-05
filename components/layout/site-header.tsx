import { Brand } from '@/components/landing/brand';
import { LanguageSwitcher } from '@/components/landing/language-switcher';
import { localePath, type Locale } from '@/lib/locales';
import { cn } from '@/lib/utils';

export function SiteHeader({ locale, section }: { locale: Locale; section?: 'encuestas' }) {
  return <header className={cn('site-header', section && 'site-header-in-flow')}>
    <Brand locale={locale} href={section ? localePath(locale) : '#inicio'} />
    <LanguageSwitcher locale={locale} section={section} />
  </header>;
}
