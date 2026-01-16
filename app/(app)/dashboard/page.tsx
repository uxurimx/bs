import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
// Importamos el nuevo componente
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-12">
      {/* CAMBIOS APLICADOS:
        1. dark:bg-zinc-900 -> Gris oscuro en vez de blanco.
        2. dark:border-zinc-800 -> Borde casi invisible en dark.
      */}
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 max-w-lg transition-colors duration-300">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✨
        </div>
        
        {/* Textos con colores adaptativos */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
          Bienvenido a tu SaaS
        </h1>
        
        <p className="text-gray-500 dark:text-zinc-400 mb-6">
          Este es el dashboard principal. Aquí irán las métricas, gráficos o la funcionalidad principal de tu aplicación.
        </p>

        {/* Caja de Tip interna */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg text-sm text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
          Tip: Ve a <strong className="text-gray-900 dark:text-white">Configuración</strong> para crear tus subdominios (Slugs).
        </div>
      </div>
    </div>
  );
}