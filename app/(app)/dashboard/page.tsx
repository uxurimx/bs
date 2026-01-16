import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
// Importamos el nuevo componente
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-12">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✨
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a tu SaaS</h1>
        <p className="text-gray-500 mb-6">
          Este es el dashboard principal. Aquí irán las métricas, gráficos o la funcionalidad principal de tu aplicación.
        </p>
        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
          Tip: Ve a <strong>Configuración</strong> para crear tus subdominios (Slugs).
        </div>
      </div>
    </div>
  );
}