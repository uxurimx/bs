import { db } from './index';
import { tenants } from './schema';
import { eq } from 'drizzle-orm';
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