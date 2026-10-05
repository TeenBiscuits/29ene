import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pollCopy, pollsPath } from "@/lib/polls/copy";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown02Icon, ArrowUpRight01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { copy, type Locale } from "@/lib/locales";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hemicycle } from "@/components/landing/hemicycle";
import { ElectoralCalendar } from "@/components/landing/electoral-calendar";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { ShareButton } from "@/components/landing/share-button";
import { PollChart } from "@/components/landing/poll-chart";

export function LandingPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  return (
    <>
      <a className="skip-link" href="#contenido">
        {c.skip}
      </a>
      <SiteHeader locale={locale} />
      <main id="contenido">
        <section id="inicio" className="hero">
          <div className="hero-emblem">
            <Hemicycle title={c.hemicycle} />
            <h1>
              <span className="hero-date">29N</span>
              <span className="hero-title">{c.election}</span>
            </h1>
          </div>
          <p className="hero-subtitle">{c.guide}</p>
          <a className="scroll-cue" href="#cronologia" aria-label={c.discover}>
            <span className="scroll-cue-motion">
              <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={1.3} aria-hidden="true" />
            </span>
          </a>
        </section>
        <ScrollReveal>
          <section id="cronologia" className="chronology">
            <div className="section-heading">
              <span className="section-kicker">{c.urns}</span>
              <h2>{c.calendarTitle}</h2>
              <p>{c.calendarSubtitle}</p>
            </div>
            <ElectoralCalendar locale={locale} />
          </section>
        </ScrollReveal>
        <section id="por-venir" className="upcoming">
          <article id="encuestas" className="future-section">
            <span className="section-kicker">{c.pollsKicker}</span>
            <h2>{c.pollsTitle}</h2>
            <PollChart locale={locale} />
            <Button nativeButton={false} render={<Link href={pollsPath(locale)} />} variant="outline" size="lg">{pollCopy[locale].link}</Button>
          </article>
          <article className="future-section proposals">
            <span className="section-kicker">{c.proposalsKicker}</span>
            <h2>{c.proposalsTitle}</h2>
            <span className="sr-only">{c.soon}</span>
            <div className="proposal-preview" aria-hidden="true">
              <div className="proposal-top">
                <span />
                {Array.from({ length: 5 }, (_, i) => (
                  <div className="party-silhouette" key={i}>
                    <HugeiconsIcon icon={UserIcon} strokeWidth={1.2} />
                    <span />
                  </div>
                ))}
              </div>
              {Array.from({ length: 5 }, (_, i) => (
                <div className="proposal-row" key={i}>
                  <span />
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} />
                  ))}
                </div>
              ))}
              <span className="coming-label">{c.soon}</span>
            </div>
            <p className="future-description">{c.proposalsDescription}</p>
          </article>
        </section>
        <section className="share-section">
          <span className="section-kicker">{c.freedom}</span>
          <h2>
            {c.motto[0]}
            <br />
            {c.motto[1]}
          </h2>
          <ShareButton
            labels={{
              guide: c.guide,
              motto: c.motto.join(" "),
              share: c.share,
              copied: c.copied,
              error: c.copyError,
            }}
          />
          <a
            className="github-link"
            href="https://github.com/TeenBiscuits/29ene/issues"
          >
            {c.github} <HugeiconsIcon icon={ArrowUpRight01Icon} className="external-link-icon" aria-hidden="true" />
          </a>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
