import {
  locales,
  languageNames,
  localePath,
  type Locale,
  copy,
} from "@/lib/locales";
export function LanguageSwitcher({
  locale,
  expanded = false,
  section,
}: {
  locale: Locale;
  expanded?: boolean;
  section?: "encuestas";
}) {
  return (
    <nav
      className={expanded ? "footer-languages" : "language-switcher"}
      aria-label={copy[locale].languages}
    >
      {expanded ? <span>{copy[locale].also}</span> : null}
      {locales.map((lang) => (
        <a
          key={lang}
          href={section ? `${localePath(lang).replace(/\/$/, "")}/${section}` : localePath(lang)}
          lang={lang}
          hrefLang={lang}
          aria-current={lang === locale ? "page" : undefined}
          aria-label={languageNames[lang]}
        >
          {expanded ? languageNames[lang] : lang.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
