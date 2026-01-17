'use server';

import { db } from "@/src/db/index";
import { tenants } from "@/src/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import webpush from "web-push";
import { pushSubscriptions } from "@/src/db/schema";
import { eq } from "drizzle-orm";

import { userSettings } from "@/src/db/schema"; // Importar nueva tabla
import { systemModules } from "@/src/db/schema";

import { analyticsEvents } from "@/src/db/schema";
import { headers } from "next/headers";
import { userAgent } from "next/server";
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
      ownerId: userId,
      isActive: true,
      settings: {
        modules: {
          billing: false, // Empiezan sin facturación (Free Tier)
          reservations: false,
          ai_menu: false
        },
        theme: 'system'
      },
      
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

// ... imports existentes

export async function toggleUserModuleAction(moduleKey: string, isActive: boolean) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  // 1. Buscar configuración actual
  const existingConfig = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });

  // 2. Preparar el nuevo JSON
  const currentSettings = (existingConfig?.settings as any) || { 
    modules: { billing: false, reservations: false, ai_menu: false }, 
    theme: 'system' 
  };
  
  const newSettings = {
    ...currentSettings,
    modules: {
      ...currentSettings.modules,
      [moduleKey]: isActive,
    },
  };

  try {
    // 3. Guardar (Upsert: Insertar o Actualizar)
    await db.insert(userSettings).values({
      userId,
      settings: newSettings
    }).onConflictDoUpdate({
      target: userSettings.userId,
      set: { settings: newSettings }
    });
    
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar módulo" };
  }
}

// 1. CREAR MÓDULO (SOLO ADMIN)
export async function createSystemModuleAction(formData: FormData) {
  const { userId } = await auth();
  
  // Guard de Seguridad: Solo el Super Admin pasa
  if (userId !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ID) {
    return { error: "Acceso denegado: Nivel 4 requerido." };
  }

  const name = formData.get("name") as string;
  const key = formData.get("key") as string; // ej: "billing"
  const description = formData.get("description") as string;
  const iconKey = formData.get("iconKey") as string;
  const isPublic = formData.get("isPublic") === "on";

  if (!name || !key || !iconKey) return { error: "Faltan datos requeridos" };

  try {
    await db.insert(systemModules).values({
      key: key.toLowerCase().trim(),
      name,
      description,
      iconKey,
      isPublic
    });
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear módulo (quizás la Key ya existe)" };
  }
}

// 2. OBTENER MÓDULOS (La usaremos en el componente de UI)
// Nota: Esto también podría hacerse directo en el Server Component, 
// pero una acción nos da flexibilidad si queremos cargarla lazy.
export async function getSystemModulesAction() {
  const { userId } = await auth();
  const isAdmin = userId === process.env.NEXT_PUBLIC_SUPER_ADMIN_ID;

  // Si es admin, ve todos. Si no, solo los públicos.
  const modules = await db.select().from(systemModules);
  
  if (isAdmin) return modules;
  return modules.filter(m => m.isPublic);
}

// 👇 ACCIÓN PÚBLICA: Registrar Visita
export async function trackVisitAction(path: string) {
  // 1. Extraer datos del Request (Vercel nos da la info gratis en los headers)
  const headerList = await headers();
  const country = headerList.get('x-vercel-ip-country') || 'Unknown';
  
  // 2. Parsear el User Agent (Dispositivo)
  // Nota: En Next 15/16 userAgent() necesita el request object, pero en Server Actions 
  // podemos obtenerlo de los headers. Para simplificar, usaremos el header 'user-agent'.
  const uaString = headerList.get('user-agent') || '';
  
  // Análisis simple de dispositivo (puedes usar librerías más potentes si quieres)
  const isMobile = /mobile/i.test(uaString);
  const deviceType = isMobile ? "mobile" : "desktop";

  // 3. Guardar en DB (Fire and forget)
  try {
    await db.insert(analyticsEvents).values({
      path,
      country,
      device: deviceType,
      // browser y os requerirían un parser más complejo como 'ua-parser-js', 
      // por ahora lo dejamos simple o genérico
      browser: "chrome", 
      os: "generic"
    });
  } catch (e) {
    console.error("Error tracking visit:", e);
    // No lanzamos error para no romper la navegación del usuario
  }
}

type MetricData = { name: string; value: number };

export async function getMetricsAction() {
  const { userId } = await auth();
  
  // 1. Inicialización con tipos correctos
  if (!userId) return { totalViews: 0, viewsByCountry: [] as MetricData[] };

  try {
    const allEvents = await db.select().from(analyticsEvents);
    const totalViews = allEvents.length;

    // 2. Reducer TIPADO
    // Le decimos: "El acumulador es un objeto donde las llaves son strings y los valores son MetricData"
    const groupedByCountry = allEvents.reduce<Record<string, MetricData>>((acc, curr) => {
      const code = curr.country || 'Unknown';
      
      if (!acc[code]) {
        acc[code] = { name: code, value: 0 };
      }
      
      acc[code].value++;
      return acc;
    }, {});

    // 3. Convertir a Array (Ahora TS sabe que esto devuelve MetricData[])
    const viewsByCountry = Object.values(groupedByCountry);

    return { totalViews, viewsByCountry };
    
  } catch (error) {
    console.error("Error fetching metrics:", error);
    // En caso de error, devolver arrays vacíos para no romper la UI
    return { totalViews: 0, viewsByCountry: [] as MetricData[] };
  }
}


// ... (Tus imports existentes) ...
// Asegúrate de importar las nuevas tablas en el import de arriba:
import { projects, tasks } from "@/src/db/schema"; 

// --- ACTIONS PARA PROYECTOS ---

// 1. Crear Nuevo Proyecto
export async function createProjectAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const identity = formData.get("identity") as string; // Ej: "Trader"
  const priority = formData.get("priority") as string; // "high", "medium"...

  if (!name) return { error: "El nombre es obligatorio" };

  try {
    // Insertamos y devolvemos el ID para redireccionar si queremos
    const [newProject] = await db.insert(projects).values({
      userId,
      name,
      description,
      priority: priority as any || 'medium',
      status: 'planning',
      metadata: {
        identity: identity || 'General',
        version: 'v1.0'
      }
    }).returning({ id: projects.id });

    revalidatePath("/dashboard"); // Actualiza la vista principal
    revalidatePath("/projects");
    return { success: true, projectId: newProject.id };

  } catch (error) {
    console.error("Error creando proyecto:", error);
    return { error: "Error al guardar proyecto" };
  }
}

// 2. Agregar Tarea Rápida a un Proyecto
export async function createTaskAction(projectId: number, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;

  if (!title) return { error: "Título requerido" };

  try {
    await db.insert(tasks).values({
      projectId,
      title,
      priority: priority as any || 'medium',
      isDone: false
    });

    revalidatePath(`/projects/${projectId}`); // Actualiza solo ese proyecto
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear tarea" };
  }
}

// 3. Toggle Tarea (Marcar como hecha)
export async function toggleTaskAction(taskId: number, currentStatus: boolean) {
  const { userId } = await auth();
  if (!userId) return { error: "No autorizado" };

  try {
    await db.update(tasks)
      .set({ isDone: !currentStatus })
      .where(eq(tasks.id, taskId));

    revalidatePath("/projects"); 
    return { success: true };
  } catch (error) {
    return { error: "Error actualizando tarea" };
  }
}