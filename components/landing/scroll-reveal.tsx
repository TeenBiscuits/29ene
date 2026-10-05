"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add({
        desktop: "(min-width: 641px)",
        mobile: "(max-width: 640px)",
        motion: "(prefers-reduced-motion: no-preference)",
      }, (context) => {
        if (!context.conditions?.motion) return;
        const svg = root.current!.querySelector<SVGSVGElement>(
          context.conditions.mobile ? ".calendar-svg-mobile" : ".calendar-svg-desktop",
        );
        const path =
          svg?.querySelector<SVGPathElement>(".calendar-path");
        if (path) {
          const length = path.getTotalLength();
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: svg,
              start: "top 75%",
              end: "bottom 75%",
              scrub: true,
            },
          });
          timeline.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1, ease: "none" },
            0,
          );
          // Sample in the SVG's coordinate system, including the path transform.
          const matrix = path.transform.baseVal.consolidate()!.matrix;
          const samples = Array.from({ length: 2001 }, (_, index) => {
            const progress = index / 2000;
            const point = path.getPointAtLength(progress * length);
            return { progress, point: point.matrixTransform(matrix) };
          });
          const progressAt = (x: number, y: number) => {
            let nearest = samples[0];
            let distance = Infinity;
            for (const sample of samples) {
              const nextDistance = Math.hypot(sample.point.x - x, sample.point.y - y);
              if (nextDistance < distance) {
                nearest = sample;
                distance = nextDistance;
              }
            }
            return nearest.progress;
          };
          svg!.querySelectorAll<SVGGraphicsElement>(".calendar-block").forEach((block) => {
            const box = block.getBBox();
            const y = box.y + box.height / 2;
            const left = progressAt(box.x, y);
            const right = progressAt(box.x + box.width, y);
            const isBand = block.tagName === "rect";
            timeline.fromTo(
              block,
              isBand
                ? { clipPath: left < right ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }
                : { opacity: 0.25, scale: 0.94, svgOrigin: `${box.x + box.width / 2} ${y}` },
              isBand
                ? { clipPath: "inset(0 0% 0 0%)", duration: Math.abs(right - left), ease: "none" }
                : { opacity: 1, scale: 1, duration: 0.025, ease: "none" },
              Math.min(left, right),
            );
          });
        }
        gsap.from(".calendar-legend", {
          opacity: 0,
          y: 12,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".calendar-legend",
            start: "top 90%",
            once: true,
          },
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
