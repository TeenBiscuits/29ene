"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { copy, type Locale } from "@/lib/locales";

gsap.registerPlugin(useGSAP);

const dots = [5, 7, 9].flatMap((count, row) =>
  Array.from({ length: count }, (_, column) => {
    const angle = column / (count - 1);
    return {
      x: 16 - Math.cos(Math.PI * angle) * (6 + row * 4),
      y: 19 - Math.sin(Math.PI * angle) * (6 + row * 4),
      angle,
    };
  }),
);

export function Brand({ locale }: { locale: Locale }) {
  const root = useRef<HTMLAnchorElement>(null);
  useGSAP((_, contextSafe) => {
    if (!contextSafe) return;
    const safe = contextSafe;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const link = root.current!;
      const seats = gsap.utils.toArray<SVGCircleElement>("circle", link);
      let fan: gsap.core.Timeline | undefined;
      gsap.set(seats, { svgOrigin: "16 19" });

      const enter = safe(() => {
        fan?.kill();
        gsap.killTweensOf(seats);
        fan = gsap.timeline().to(seats, {
          rotation: (index: number) => -dots[index].angle * 155,
          duration: 0.12,
          ease: "power3.inOut",
        }).to(seats, {
          rotation: 0,
          duration: 0.3,
          stagger: (index: number) => dots[index].angle * 0.04,
          ease: "power3.out",
        });
      });
      const leave = safe(() => {
        fan?.kill();
        gsap.to(seats, {
          rotation: 0,
          duration: 0.18,
          overwrite: true,
          ease: "power3.out",
        });
      });
      link.addEventListener("pointerenter", enter);
      link.addEventListener("pointerleave", leave);
      return () => {
        link.removeEventListener("pointerenter", enter);
        link.removeEventListener("pointerleave", leave);
        fan?.kill();
        gsap.killTweensOf(seats);
        gsap.set(seats, { clearProps: "transform,transformOrigin" });
      };
    });
    return () => media.revert();
  }, { scope: root });

  const c = copy[locale];
  return (
    <a ref={root} href="#inicio" className="brand" aria-label={`29N, ${c.home}`}>
      <svg viewBox="0 0 32 22" aria-hidden="true">
        {dots.map((dot, index) => (
          <circle key={index} cx={dot.x} cy={dot.y} r="1.2" />
        ))}
      </svg>
      <span>29N</span>
      <span className="brand-divider">/</span>
      <span className="brand-description">{c.guide}</span>
    </a>
  );
}
