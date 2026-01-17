import { Sidebar } from "@/src/components/sidebar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db/index";
import { userSettings, systemModules } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // 1. Obtener configuración del usuario (Qué tiene activado)
  const userConfig = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
  const activeModulesMap = (userConfig?.settings as any)?.modules || {};

  // 2. Obtener catálogo del sistema (Qué existe realmente)
  const allSystemModules = await db.select().from(systemModules);

  // 3. GENERAR EL MENÚ DINÁMICO
  // Cruzamos las dos listas: Solo agregamos al menú si existe en DB Y está activo por el usuario
  const dynamicNavItems = allSystemModules
    .filter((mod) => activeModulesMap[mod.key] === true) // ¿Está encendido?
    .map((mod) => ({
      name: mod.name,
      href: `/${mod.key}`, // Convención: Si la key es 'crm', la ruta es '/crm'
      iconKey: mod.iconKey,
    }));

  return (
    // Pasamos la lista ya procesada al Sidebar
    <Sidebar dynamicNavItems={dynamicNavItems}>
      {children}
    </Sidebar>
  );
}