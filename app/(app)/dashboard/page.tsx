import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
// Importamos el nuevo componente
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 

export default async function DashboardPage() {
  const allTenants = await db.select().from(tenants);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mis Restaurantes</h1>

      {/* Grid de Restaurantes Existentes (Igual que antes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {allTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="font-bold text-xl mb-2">{tenant.name}</h3>
            <p className="text-sm text-gray-500 mb-4">subdominio: {tenant.slug}</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-xs text-gray-400">{tenant.isActive ? 'Activo' : 'Inactivo'}</span>
            </div>
            <a 
              href={`http://${tenant.slug}.localhost:3000`} 
              target="_blank"
              className="mt-4 block text-center text-blue-600 text-sm font-medium hover:underline"
            >
              Ver Menú &rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Formulario de Creación (Ahora es un componente) */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <h2 className="text-xl font-bold mb-4">🚀 Crear Nuevo Restaurante</h2>
        {/* Aquí renderizamos el componente Cliente */}
        <CreateTenantForm />
      </div>
    </div>
  );
}