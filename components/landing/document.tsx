import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import type { Locale } from "@/lib/locales";
import "@/app/globals.css";
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export function Document({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Locale;
}) {
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
