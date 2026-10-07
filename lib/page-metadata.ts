import type { Metadata } from "next";
import { copy, localePath, type Locale } from "@/lib/locales";
export function pageMetadata(locale: Locale): Metadata {
  const title = `29N / ${copy[locale].guide}`;
  const description =
    "Web infográfica para ayudar a la ciudadanía a informarse sobre las elecciones generales en España";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: [
        {
          url: "/favicon-96x96.png?v=20261005",
          type: "image/png",
          sizes: "96x96",
        },
        { url: "/favicon.svg?v=20261005", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico?v=20261005",
      apple: { url: "/apple-touch-icon.png?v=20261005", sizes: "180x180" },
    },
    other: { "apple-mobile-web-app-title": "29N Guía electoral" },
    manifest: "/site.webmanifest?v=20261005",
    alternates: {
      canonical: localePath(locale),
      languages: { es: "/", gl: "/gl", ca: "/ca", eu: "/eu", "x-default": "/" },
    },
  };
}
