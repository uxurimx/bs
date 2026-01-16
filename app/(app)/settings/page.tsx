import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return <div>No autorizado</div>;

  const userTenants = await db
    .select()
    .from(tenants)
    .where(eq(tenants.ownerId, userId));

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">Configuración</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Gestiona tu cuenta y tus espacios de trabajo.</p>
      </div>

      <hr className="border-gray-200 dark:border-zinc-800" />

      {/* Sección Slugs */}
      <section id="slugs" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Mis Subdominios</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Estos son los puntos de acceso a tu aplicación.
          </p>
        </div>

        <div className="col-span-2 space-y-6">
          
          {/* CARD LISTA DE SLUGS */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors">
             {userTenants.length === 0 ? (
                <div className="p-6 text-center text-gray-400 dark:text-zinc-500 text-sm">
                  No tienes subdominios creados aún.
                </div>
             ) : (
               <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                 {userTenants.map((tenant) => (
                   <li key={tenant.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                     <div>
                       <div className="font-medium text-gray-900 dark:text-zinc-200">{tenant.name}</div>
                       <div className="text-xs text-blue-500 dark:text-blue-400">http://{tenant.slug}.localhost:3000</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
          </div>

          {/* CARD FORMULARIO (Requiere que el componente interno también use clases dark) */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors">
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wide text-gray-500 dark:text-zinc-400">Crear Nuevo Slug</h4>
            {/* Nota: Asegúrate de que los inputs dentro de CreateTenantForm tengan 'dark:bg-zinc-800 dark:text-white' */}
            <CreateTenantForm />
          </div>

        </div>
      </section>
    </div>
  );
}