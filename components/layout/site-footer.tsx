import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { Brand } from '@/components/landing/brand';
import { LanguageSwitcher } from '@/components/landing/language-switcher';
import { copy, localePath, type Locale } from '@/lib/locales';

export function SiteFooter({ locale, section }: { locale: Locale; section?: 'encuestas' }) {
  const c = copy[locale];
  return <footer className="site-footer">
    <div className="footer-top">
      <Brand locale={locale} href={section ? localePath(locale) : '#inicio'} />
      <LanguageSwitcher locale={locale} expanded section={section} />
    </div>
    <div className="footer-bottom">
      <span>{c.by} Pablo Portal López</span>
      <span>{c.independent} {c.journalismBasis}</span>
      <a href="https://github.com/TeenBiscuits/29ene">{c.code} <HugeiconsIcon icon={ArrowUpRight01Icon} className="external-link-icon" aria-hidden="true" /></a>
    </div>
  </footer>;
}
