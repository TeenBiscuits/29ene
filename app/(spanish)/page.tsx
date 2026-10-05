import { LandingPage } from "@/components/landing/landing-page";
import { pageMetadata } from "@/lib/page-metadata";
export const metadata = pageMetadata("es");
export default function Home() {
  return <LandingPage locale="es" />;
}
