import type { ReactNode } from "react";
import { Document } from "@/components/landing/document";
export default function Layout({ children }: { children: ReactNode }) {
  return <Document lang="es">{children}</Document>;
}
