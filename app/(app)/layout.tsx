import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Barra Lateral) */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Menu SaaS</h2>
        </div>
<nav className="p-4 space-y-2">
  {/* ANTES: href="/dashboard" */}
  {/* AHORA: href="/" (La raíz es el dashboard) */}
  <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
    🏠 Mis Restaurantes
  </Link>
  
  {/* Si creas estas páginas en el futuro, recuerda que la ruta real será /dashboard/billing, 
      pero la URL pública será /billing */}
  <Link href="/billing" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
    💳 Facturación
  </Link>
  <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
    ⚙️ Configuración
  </Link>
</nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Barra Superior) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div className="font-semibold text-gray-500">Panel de Control</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hola, Dueño</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* El contenido de la página (page.tsx) se renderiza aquí */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}