'use server';

import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Agregamos 'prevState: any' como primer argumento
// ... imports

export async function createTenantAction(prevState: any, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  // 1. SANITIZACIÓN BÁSICA (Convertir a slug válido)
  // "Mi Pizzería" -> "mi-pizzeria"
  slug = slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  if (!name || !slug) return { error: "Datos inválidos" };

  try {
    await db.insert(tenants).values({
      name,
      slug,
      ownerId: userId, // <--- ¡ESTO FALTABA!
      isActive: true,
    });
  } catch (error: any) { // Tipar error como any o un tipo específico de error de DB
    console.error(error);
    // Detectar duplicados (código de error de Postgres para unique violation es 23505)
    if (error.code === '23505') {
       return { error: "Este subdominio ya está ocupado. Prueba otro." };
    }
    return { error: "Error al crear el espacio de trabajo." };
  }

  revalidatePath("/settings"); // Revalidar settings, no dashboard
  redirect("/settings"); // Mantener al usuario en settings para que vea su nuevo slug
}