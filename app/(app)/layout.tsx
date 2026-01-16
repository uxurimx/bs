'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  Globe 
} from "lucide-react";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils"; // Si no tienes lib/utils, puedes quitar 'cn' y usar template strings normales o instalar clsx

// Tip: Si no tienes la función 'cn', simplemente usa `className={`... ${condicion ? '...' : ''}`}`
// O crea src/lib/utils.ts con: 
// import { clsx, type ClassValue } from "clsx"; import { twMerge } from "tailwind-merge"; 
// export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Facturación", href: "/billing", icon: CreditCard },
    { name: "Configuración", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* ========================================
        SIDEBAR DESKTOP (Hover Expandable)
        ========================================
      */}
      <aside 
        className="hidden md:flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 
                   w-20 hover:w-64 transition-all duration-300 ease-in-out group z-20 shadow-sm"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-zinc-800 overflow-hidden whitespace-nowrap">
          {/* Logo Icono Visible siempre */}
          <div className="flex items-center gap-3 px-4 w-full">
            <Globe className="min-w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-800 dark:text-gray-100 delay-100">
              SaaS App
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group-hover:px-4
                  ${isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
              >
                <item.icon className="min-w-6 h-6" />
                <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-4 items-center group-hover:items-start transition-all">
           {/* Theme Toggle en sidebar */}
           <div className="flex items-center gap-3 overflow-hidden">
              <div className="min-w-10 flex justify-center">
                 <ThemeToggle /> 
              </div>
              <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
              </span>
           </div>
           
           <div className="text-xs text-gray-400 text-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 whitespace-nowrap">
             v1.0.0
           </div>
        </div>
      </aside>

      {/* ========================================
        SIDEBAR MOBILE (Slide Over)
        ========================================
      */}
      {/* Overlay Oscuro */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Panel Deslizante */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-zinc-800">
          <span className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600"/> SaaS App
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${pathname === item.href 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-sm text-gray-500">Tema</span>
            <ThemeToggle />
        </div>
      </div>

      {/* ========================================
        CONTENIDO PRINCIPAL
        ========================================
      */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-zinc-950">
        {/* Header Superior */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa (Solo Mobile) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9"
                }
              }}
            />
          </div>
        </header>

        {/* Área Scrollable */}
        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
}