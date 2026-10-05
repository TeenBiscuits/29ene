import { notFound } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { isLocale } from "@/lib/locales";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "gl" }, { lang: "ca" }, { lang: "eu" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return pageMetadata(lang);
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return <LandingPage locale={lang} />;
}
