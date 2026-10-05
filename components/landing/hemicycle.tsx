"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const colors = ["#946bc5", "#e869a0", "#e74f58", "#72b641", "#3b91df"];
const seats = [35, 40, 45, 50, 55, 60, 65].flatMap((count, row) =>
  Array.from({ length: count }, (_, column) => {
    const angle = Math.PI - (column / (count - 1)) * Math.PI;
    const radius = 137 + row * 25;
    return {
      x: +(320 + Math.cos(angle) * radius).toFixed(2),
      y: +(312 - Math.sin(angle) * radius).toFixed(2),
      angle: column / (count - 1),
      row,
    };
  }),
);
// Exactly 70 seats per color in the final illustrative arrangement.
const equalRanks = [...seats.keys()].sort(
  (a, b) => seats[a].angle - seats[b].angle,
);
const finalColors = new Map(
  equalRanks.map((seat, rank) => [seat, colors[Math.floor(rank / 70)]]),
);
const colonies = [
  { x: 82, y: 245, delay: 0 },
  { x: 190, y: 130, delay: 0.12 },
  { x: 300, y: 70, delay: 0.04 },
  { x: 350, y: 170, delay: 0.18 },
  { x: 460, y: 130, delay: 0.08 },
  { x: 540, y: 255, delay: 0.16 },
];
const sproutDelays = seats.map((seat, index) =>
  Math.min(...colonies.map((colony) =>
    colony.delay + Math.hypot(seat.x - colony.x, seat.y - colony.y) * 0.005,
  )) + ((index * 47) % 101) / 101 * 0.12,
);

export function Hemicycle({ title }: { title: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          full: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const dots = gsap.utils.toArray<SVGCircleElement>(
            ".hemicycle-seat",
            root.current!,
          );
          const grayDots = gsap.utils.toArray<SVGCircleElement>(
            ".hemicycle-gray-seat",
            root.current!,
          );

          if (context.conditions?.reduced) {
            gsap.fromTo(dots, { opacity: 0 }, {
              opacity: 1,
              duration: 0.2,
              ease: "power3.out",
            });
            return;
          }

          gsap.set(dots, {
            opacity: 0,
            scale: 0.18,
            transformOrigin: "50% 50%",
          });
          const timeline = gsap.timeline({
            delay: 0.08,
            defaults: { ease: "power3.inOut" },
          });
          gsap.set(grayDots, {
            opacity: 0,
            rotation: (index: number) => -seats[index].angle * 180,
            svgOrigin: "320 312",
          });
          grayDots.forEach((dot, index) => {
            const fanAt = seats[index].angle * 0.16 + seats[index].row * 0.01;
            timeline.to(dot, {
              opacity: 1,
              duration: 0.14,
              ease: "power3.out",
            }, fanAt);
            timeline.to(dot, {
              rotation: 0,
              duration: 0.75,
            }, fanAt);
          });
          // Finish opening every gray seat before the colored colonies sprout.
          timeline.addLabel("sprout", ">+=0.06");

          dots.forEach((dot, index) => {
            // Colonies sprout independently, spreading to their nearest dots.
            // Deterministic timing keeps the organic pattern stable on hydration.
            const sproutAt = timeline.labels.sprout + sproutDelays[index];
            const vertical = index % 2 === 0;
            timeline.to(dot, {
              opacity: 1,
              duration: 0.16,
              ease: "power3.out",
            }, sproutAt);
            // The colored dot covers its gray seat before the latter fades.
            timeline.to(grayDots[index], {
              opacity: 0,
              duration: 0.18,
              ease: "power3.out",
            }, sproutAt + 0.23);
            // Each dot grows around its own fixed center, already in final color.
            timeline.to(dot, {
              scaleX: vertical ? 1.08 : 1.24,
              scaleY: vertical ? 1.24 : 1.08,
              duration: 0.45,
              ease: "power3.out",
            }, sproutAt);
            timeline.to(dot, {
              scaleX: vertical ? 0.98 : 0.9,
              scaleY: vertical ? 0.9 : 0.98,
              duration: 0.18,
            }, sproutAt + 0.45);
            timeline.to(dot, {
              scaleX: 1,
              scaleY: 1,
              duration: 0.22,
              ease: "power3.out",
            }, sproutAt + 0.63);
          });
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="hemicycle">
      <svg
        viewBox="0 0 640 340"
        role="img"
        aria-labelledby="hemicycle-title"
        className="hemicycle-svg"
      >
        <title id="hemicycle-title">{title}</title>
        <defs>
          <filter id="soft-seats">
            <feGaussianBlur stdDeviation="0.55" />
          </filter>
        </defs>
        <g filter="url(#soft-seats)" aria-hidden="true">
          {seats.map((seat, index) => (
            <circle
              key={index}
              className="hemicycle-gray-seat"
              cx={seat.x}
              cy={seat.y}
              r="4.5"
              fill="#aaa9a2"
            />
          ))}
        </g>
        <g filter="url(#soft-seats)" aria-hidden="true">
          {seats.map((seat, index) => (
            <circle
              key={index}
              className="hemicycle-seat"
              cx={seat.x}
              cy={seat.y}
              r="4.5"
              fill={finalColors.get(index)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
