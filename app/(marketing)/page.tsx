import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowRight, Check, Globe, LayoutDashboard, Menu, X } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex flex-col">
      
      {/* 1. NAVBAR (Navegación) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <span>MirrorQ</span>
          </div>

          {/* Menú Derecha (Auth) */}
          <div className="flex items-center gap-4">
            
            {/* Si NO ha iniciado sesión: Muestra botones de Login */}
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors hidden sm:block"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
              >
                Comenzar Gratis
              </Link>
            </SignedOut>

            {/* Si YA inició sesión: Muestra acceso al Dashboard y Avatar */}
            <SignedIn>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Portada) */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Nuevo: Analíticas en tiempo real
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Tu SaaS Multi-Tenant <br className="hidden sm:block"/> en cuestión de minutos.
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Crea, gestiona y escala tu plataforma con subdominios automáticos, autenticación lista y módulos flexibles. La infraestructura que soñabas, lista hoy.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
             href="/sign-up"
             className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Crear mi cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
             href="https://github.com" 
             target="_blank"
             className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
          >
            Ver Documentación
          </Link>
        </div>

        {/* Features Grid pequeña */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto text-left">
           {[
             { title: "Subdominios", desc: "Cada cliente tiene su propia URL única automáticamente." },
             { title: "Autenticación", desc: "Login seguro y gestión de usuarios con Clerk." },
             { title: "Modular", desc: "Activa o desactiva funciones por cliente." }
           ].map((feature, i) => (
             <div key={i} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
               <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                 <Check className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.desc}</p>
             </div>
           ))}
        </div>

      </main>

      {/* Footer simple */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-600 border-t border-gray-100 dark:border-zinc-900">
        © 2024 MirrorQ SaaS. Todos los derechos reservados.
      </footer>
    </div>
  );
}