import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { CreateTenantForm } from "@/src/components/create-tenant-form"; 
import { ModulesSelector } from "@/src/components/modules-selector"; // <--- Importar
import { PushToggle } from "@/src/components/push-toggle"; // Si ya lo tenías
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
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">Configuración</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Gestiona tu cuenta, notificaciones y módulos.</p>
      </div>

      <hr className="border-gray-200 dark:border-zinc-800" />

      {/* SECCIÓN 1: SLUGS (Existente) */}
      <section id="slugs" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Mis Subdominios</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Gestiona los puntos de acceso a tu aplicación.
          </p>
        </div>
        <div className="col-span-2 space-y-6">
           {/* ... Tu código de lista de slugs y formulario ... */}
           {/* (Pego un resumen para contexto, mantén tu código aquí) */}
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
             <CreateTenantForm />
           </div>
        </div>
      </section>

      <hr className="border-gray-200 dark:border-zinc-800" />

      {/* SECCIÓN 2: MÓDULOS (NUEVA) */}
      <section id="modules" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">App Store / Módulos</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Activa o desactiva funcionalidades para personalizar tu experiencia.
          </p>
        </div>

        <div className="col-span-2 space-y-8">
          {userTenants.length === 0 ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
              Crea un subdominio primero para configurar sus módulos.
            </div>
          ) : (
            userTenants.map((tenant) => (
              <div key={tenant.id} className="space-y-4">
                {/* Título del Tenant si tiene más de uno */}
                {userTenants.length > 1 && (
                  <h4 className="font-medium text-gray-900 dark:text-zinc-200 border-b border-gray-100 dark:border-zinc-800 pb-2">
                    Configurando: {tenant.name}
                  </h4>
                )}
                
                {/* Selector de Módulos */}
                <ModulesSelector tenant={tenant} />
              </div>
            ))
          )}
        </div>
      </section>

       <hr className="border-gray-200 dark:border-zinc-800" />

       {/* SECCIÓN 3: NOTIFICACIONES (Existente) */}
       <section id="notifications" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Notificaciones</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Gestiona alertas Push en este dispositivo.
            </p>
          </div>
          <div className="col-span-2">
             <PushToggle />
          </div>
       </section>

    </div>
  );
}