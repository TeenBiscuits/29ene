import { ImageResponse } from "next/og";
import { copy, type Locale } from "@/lib/locales";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_CONTENT_TYPE = "image/png";

const seatColors = ["#946bc5", "#e869a0", "#e74f58", "#72b641", "#3b91df"];
const seatRows = [35, 40, 45, 50, 55, 60, 65];
const seatRadius = 4.5;

const seats = seatRows.flatMap((count, row) =>
  Array.from({ length: count }, (_, column) => {
    const angle = Math.PI - (column / (count - 1)) * Math.PI;
    const radius = 137 + row * 25;

    return {
      x: 320 + Math.cos(angle) * radius - seatRadius,
      y: 312 - Math.sin(angle) * radius - seatRadius,
      angle: column / (count - 1),
    };
  }),
);

const seatColorsByPosition = new Array<string>(seats.length);
const leftToRightSeats = [...seats.keys()].sort(
  (a, b) => seats[a].angle - seats[b].angle,
);
leftToRightSeats.forEach((seat, rank) => {
  seatColorsByPosition[seat] = seatColors[Math.floor(rank / 70)];
});

export function socialImageAlt(locale: Locale) {
  return `29N / ${copy[locale].guide}. ${copy[locale].hemicycle}`;
}

export function generateSocialImage(locale: Locale) {
  const labels = copy[locale];

  return new ImageResponse(
    (
      <div
        style={{
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: "28px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#252522",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 640,
            height: 340,
            display: "flex",
          }}
        >
          {seats.map((seat, index) => (
            <span
              key={index}
              style={{
                position: "absolute",
                left: seat.x,
                top: seat.y,
                width: seatRadius * 2,
                height: seatRadius * 2,
                borderRadius: "50%",
                backgroundColor: seatColorsByPosition[index],
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          29N
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            fontSize: 24,
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#a0a098" }}>/</span>
          <span style={{ color: "#696961" }}>{labels.guide}</span>
        </div>
      </div>
    ),
    SOCIAL_IMAGE_SIZE,
  );
}
