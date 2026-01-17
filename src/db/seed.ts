// src/db/seed.ts
import 'dotenv/config';
import { db } from "./index";
import { systemModules } from "./schema";
import { CORE_MODULES } from "@/src/lib/modules-manifest"; 
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 Sembrando módulos en la Base de Datos...");

  // Validamos que haya algo que insertar para evitar errores de array vacío
  if (CORE_MODULES.length === 0) {
    console.log("⚠️ No hay módulos en el manifiesto para sembrar.");
    return;
  }
  
  try {
    // UPSERT: Insertar, y si la llave ("key") ya existe, actualizar los campos
    await db.insert(systemModules)
      .values(CORE_MODULES)
      .onConflictDoUpdate({ 
          target: systemModules.key, // La columna que detecta el conflicto (Primary Key)
          set: { 
              // Actualizamos estos campos con los valores "nuevos" (excluded)
              name: sql`excluded.name`, 
              description: sql`excluded.description`,
              iconKey: sql`excluded.icon_key`,
              isPublic: sql`excluded.is_public`
          } 
      });

    console.log(`✅ Éxito: ${CORE_MODULES.length} módulos sincronizados con el código.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sembrar la base de datos:", error);
    process.exit(1);
  }
}

main();