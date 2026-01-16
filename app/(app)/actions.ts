'use server';

import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Agregamos 'prevState: any' como primer argumento
export async function createTenantAction(prevState: any, formData: FormData) {

    const session = await auth();
  console.log("🕵️‍♂️ ID de Usuario:", session.userId);
  console.log("🕵️‍♂️ Datos del Form:", Object.fromEntries(formData));

  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" }; // Cambié throw por return para manejarlo en el front

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) return { error: "Faltan datos" };

  try {
    await db.insert(tenants).values({
      name,
      slug,
      isActive: true,
    });
  } catch (error) {
    console.error(error);
    return { error: "Error creando restaurante (quizás el slug ya existe)" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}