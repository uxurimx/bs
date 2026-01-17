import { Inter } from "next/font/google"; // O la fuente que tengas
import "./globals.css";
// 1. Importamos el Provider de Clerk
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/src/components/theme-provider"; // <--- Importar
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsTracker } from "@/src/components/analytics-tracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Menu SaaS",
  description: "Plataforma de menús digitales",
};

export const viewport: Viewport = {
  themeColor: "#09090b", // Zinc 950 para integrarse con el dark mode
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Sensación nativa (evita zoom accidental en inputs)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Envolvemos TODO el HTML en ClerkProvider
    <ClerkProvider >
      <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <AnalyticsTracker />
            <Toaster position="bottom-right" richColors theme="system" />
            <Analytics />
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}