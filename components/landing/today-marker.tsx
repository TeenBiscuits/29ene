"use client";

import { useEffect, useState } from "react";

type DayPosition = {
  iso: string;
  x: number;
  y: number;
};

export function TodayMarker({ positions }: { positions: DayPosition[] }) {
  const [today, setToday] = useState<string>();

  useEffect(() => {
    let timeout: number | undefined;

    const updateToday = () => {
      const now = new Date();
      const iso = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");
      setToday(iso);

      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      timeout = window.setTimeout(
        updateToday,
        tomorrow.getTime() - now.getTime(),
      );
    };

    updateToday();
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  if (!today) return null;

  const position = positions.find((day) => day.iso === today);
  if (!position) return null;

  const renderMarker = (
    verticalScale: number,
    mobile: boolean,
    height: number,
  ) => {
    const centerY = position.y * verticalScale + 17;

    return (
      <svg
        key={mobile ? "mobile" : "desktop"}
        viewBox={`0 0 605 ${height}`}
        className={`calendar-svg calendar-today-overlay calendar-svg-${
          mobile ? "mobile" : "desktop"
        }`}
        aria-hidden="true"
      >
        <g>
          <circle
            cx={position.x}
            cy={centerY}
            r="22"
            fill="none"
            stroke="#b34642"
            strokeWidth="2"
          />
        </g>
      </svg>
    );
  };

  return (
    <>
      {renderMarker(1.6, false, 2000)}
      {renderMarker(1.3, true, 1637)}
    </>
  );
}
