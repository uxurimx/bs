import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return <div>No autorizado</div>;

  // 🔒 SEGURIDAD: Solo mostramos los slugs de este usuario
  // (Asegúrate de haber agregado 'ownerId' a tu schema como hablamos antes)
  // Si aún no tienes ownerId, usa: const userTenants = await db.select().from(tenants);
  const userTenants = await db
    .select()
    .from(tenants)
    .where(eq(tenants.ownerId, userId));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Sección Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-2">Gestiona tu cuenta y tus espacios de trabajo.</p>
      </div>

      <hr className="border-gray-200" />

      {/* SECCIÓN: Gestión de Slugs (Antes estaba en Dashboard) */}
      <section id="slugs" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-gray-900">Mis Subdominios (Slugs)</h3>
          <p className="text-sm text-gray-500 mt-1">
            Estos son los puntos de acceso a tu aplicación. Cada slug representa un entorno separado.
          </p>
        </div>

        <div className="col-span-2 space-y-6">
          
          {/* Lista de Slugs Existentes */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
             {userTenants.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No tienes subdominios creados aún.
                </div>
             ) : (
               <ul className="divide-y divide-gray-100">
                 {userTenants.map((tenant) => (
                   <li key={tenant.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                     <div>
                       <div className="font-medium text-gray-900">{tenant.name}</div>
                       <div className="text-xs text-blue-500">http://{tenant.slug}.localhost:3000</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>

          {/* Formulario de Creación */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wide text-gray-500">Crear Nuevo Slug</h4>
            <CreateTenantForm />
          </div>

        </div>
      </section>
      
      {/* Aquí puedes agregar más secciones en el futuro: Facturación, Perfil, API Keys... */}
    </div>
  );
}