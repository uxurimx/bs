"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
// 👇 Importamos TODOS los iconos para poder elegir dinámicamente
import * as LucideIcons from "lucide-react"; 
import { ThemeToggle } from "@/src/components/theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

// Tipo de dato que esperamos del Layout
type NavItem = {
  name: string;
  href: string;
  iconKey: string;
};

export function Sidebar({ 
  children, 
  dynamicNavItems 
}: { 
  children: React.ReactNode, 
  dynamicNavItems: NavItem[] 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 1. ITEMS FIJOS (Siempre visibles)
  // Usamos iconos directos aquí porque son fijos
  const staticItems = [
    { name: "Dashboard", href: "/dashboard", iconKey: "LayoutDashboard" },
  ];

  const settingsItem = { name: "Configuración", href: "/settings", iconKey: "Settings" };

  // 2. FUSIONAR TODO
  const allItems = [
    ...staticItems,
    ...dynamicNavItems, // Los módulos que vienen de la DB
    settingsItem
  ];

  // Función auxiliar para renderizar el icono correcto
  const renderIcon = (iconKey: string, className: string) => {
    // Buscamos el icono en la librería. Si no existe, ponemos una caja (Box) por defecto
    // @ts-ignore
    const IconComponent = LucideIcons[iconKey] || LucideIcons.Box;
    return <IconComponent className={className} />;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-20 hover:w-64 transition-all duration-300 ease-in-out group z-20 shadow-sm">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-zinc-800 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3 px-4 w-full">
            <LucideIcons.Globe className="min-w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-800 dark:text-gray-100 delay-100">
              SaaS App
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
          {allItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group-hover:px-4",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {/* Renderizado Dinámico del Icono */}
                {renderIcon(item.iconKey, "min-w-6 h-6")}
                
                <span className="ml-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* ... (Resto del footer del sidebar igual) ... */}
         <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-4 items-center group-hover:items-start transition-all">
           <div className="flex items-center gap-3 overflow-hidden">
              <div className="min-w-10 flex justify-center">
                 <ThemeToggle /> 
              </div>
              <span className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
                Cambiar tema
              </span>
           </div>
        </div>
      </aside>

      {/* SIDEBAR MOBILE (Misma lógica) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-zinc-800">
          <span className="font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <LucideIcons.Globe className="w-5 h-5 text-blue-600"/> SaaS App
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <LucideIcons.X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {allItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              {renderIcon(item.iconKey, "w-5 h-5")}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-zinc-950">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
              <LucideIcons.Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
              / {pathname === '/' ? 'Dashboard' : pathname.replace('/', '')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
}