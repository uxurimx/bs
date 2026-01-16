import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          {/* Nombre Genérico de la Plantilla */}
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            SaaS Starter
          </h2>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">📊</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/billing" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
             <span className="text-gray-400 group-hover:text-blue-600 transition-colors">💳</span>
             <span className="font-medium">Facturación</span>
          </Link>

          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
             <span className="text-gray-400 group-hover:text-blue-600 transition-colors">⚙️</span>
             <span className="font-medium">Configuración</span>
          </Link>
        </nav>
        
        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          v1.0.0 Template
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          {/* Breadcrumb o Título de página dinámico */}
          <div className="font-medium text-gray-500">/ App</div>
          
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Scroll Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}