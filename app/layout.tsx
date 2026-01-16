import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que tengas
import "./globals.css";
// 1. Importamos el Provider de Clerk
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/src/components/theme-provider"; // <--- Importar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Menu SaaS",
  description: "Plataforma de menús digitales",
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
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}