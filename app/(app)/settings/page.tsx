import { db } from "@/src/db/index";
import { tenants, userSettings } from "@/src/db/schema";
import { getSystemModulesAction } from "@/app/(app)/actions";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
// 👇 Importamos el nuevo Shell
import { SettingsShell } from "@/src/components/settings-shell";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return <div>No autorizado</div>;

  const isSuperAdmin = userId === process.env.NEXT_PUBLIC_SUPER_ADMIN_ID;

  // 1. Cargar Config de Usuario
  const userConfig = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
  const configData = { settings: userConfig?.settings || { modules: {} } };

  // 2. Cargar Tenants (Subdominios)
  const userTenants = await db
    .select()
    .from(tenants)
    .where(eq(tenants.ownerId, userId));

  // 3. Cargar Módulos Disponibles
  const availableModules = await getSystemModulesAction();

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header General */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">Configuración</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Gestiona todos los aspectos de tu cuenta y negocio.</p>
      </div>

      {/* Renderizamos el Shell Interactivo */}
      <SettingsShell 
        configData={configData}
        availableModules={availableModules}
        userTenants={userTenants}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}