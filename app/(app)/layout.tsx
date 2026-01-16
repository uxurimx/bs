import { Sidebar } from "@/src/components/sidebar"; // Importamos el componente nuevo
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // 1. Obtener la configuración del usuario
  // NOTA: Como aún no tenemos "selección de tenant" en el layout,
  // tomaremos el primer tenant del usuario para leer su configuración.
  // En el futuro, esto debería leer el tenant seleccionado en la URL o cookies.
  const userTenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, userId),
  });

  // 2. Extraer los módulos (o usar defaults si no tiene tenant aún)
  const defaultModules = { billing: false, reservations: false, ai_menu: false };
  
  // TypeScript hack seguro: casteamos el JSON al tipo correcto
  const modules = userTenant?.settings 
    ? (userTenant.settings as any).modules 
    : defaultModules;

  return (
    // Pasamos la configuración al componente cliente
    <Sidebar modules={modules}>
      {children}
    </Sidebar>
  );
}