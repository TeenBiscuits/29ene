import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Document } from "@/components/landing/document";
import { isLocale } from "@/lib/locales";
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return <Document lang={lang}>{children}</Document>;
}
