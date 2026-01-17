"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisitAction } from "@/app/(app)/actions";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Esperamos un poco para no bloquear el hilo principal
    const timer = setTimeout(() => {
      trackVisitAction(pathname);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // Es invisible
}