import { db } from './index';
import { tenants } from './schema';
import { projects, tasks, goals } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { cache } from 'react';

export const getTenantBySlug = cache(async (slug: string) => {
  // DEBUG: ¿Qué slug estamos buscando?
  console.log("🔍 Buscando slug:", slug);

  const result = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  // DEBUG: ¿Qué encontró la DB?
  console.log("📦 Resultado DB:", result);

  return result[0];
});

// src/db/querys.ts


// ... (tus imports anteriores)

// Obtener todos los proyectos del usuario (Dashboard Principal)
export async function getUserProjects(userId: string) {
  return await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: [desc(projects.updatedAt)], // Los más recientes primero
    with: {
      // Traemos un resumen de tareas y objetivos para mostrar barras de progreso
      tasks: true, 
      goals: true 
    }
  });
}

// Obtener un proyecto individual con TODO su detalle (Vista Detallada)
export async function getProjectDetails(projectId: number) {
  return await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      tasks: {
        orderBy: [desc(tasks.priority)], // Tareas urgentes arriba
      },
      goals: true,
      notes: true
    }
  });
}