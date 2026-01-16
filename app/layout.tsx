import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que tengas
import "./globals.css";
// 1. Importamos el Provider de Clerk
import { ClerkProvider } from '@clerk/nextjs';

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
    <ClerkProvider>
      <html lang="es">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}