'use server';

import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import webpush from "web-push";
import { pushSubscriptions } from "@/src/db/schema";
import { eq } from "drizzle-orm";

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

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:test@test.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// 1. Guardar Suscripción
export async function subscribeUserAction(sub: any) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  try {
    await db.insert(pushSubscriptions).values({
      userId,
      subscription: JSON.stringify(sub),
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar suscripción" };
  }
}

// 2. Eliminar Suscripción (Unsubscribe)
export async function unsubscribeUserAction() {
   const { userId } = await auth();
   if (!userId) return;
   // Nota: En producción idealmente borras solo la suscripción específica del dispositivo actual
   await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
   return { success: true };
}

// 3. Enviar Notificación de Prueba
export async function sendTestNotificationAction() {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  // Buscar todas las suscripciones del usuario
  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  if (subs.length === 0) return { error: "No hay dispositivos suscritos" };

  const payload = JSON.stringify({
    title: "¡Hola Mundo! 👋",
    body: "Esta es tu primera notificación push desde el SaaS.",
    url: "/dashboard",
  });

  // Enviar a todos los dispositivos registrados
  let successCount = 0;
  for (const record of subs) {
    try {
      const sub = JSON.parse(record.subscription);
      await webpush.sendNotification(sub, payload);
      successCount++;
    } catch (error) {
      console.error("Error enviando push:", error);
      // Si falla (ej: 410 Gone), deberíamos borrar la suscripción de la DB
    }
  }

  return { success: true, count: successCount };
}