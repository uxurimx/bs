// src/scripts/switch-env.ts
import fs from 'fs';
import path from 'path';

const targetEnv = process.argv[2]; // 'main' o 'mirrorq'

if (!targetEnv) {
  console.error("❌ Error: Debes especificar el entorno (main o mirrorq)");
  process.exit(1);
}

const sourceFile = path.resolve(process.cwd(), `.env.${targetEnv}`);
const destFile = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Error: No existe el archivo fuente: .env.${targetEnv}`);
  process.exit(1);
}

// Copiamos el archivo maestro al archivo activo .env
fs.copyFileSync(sourceFile, destFile);

console.log(`
🔄 CAMBIO DE CONTEXTO REALIZADO:
   📂 Origen: .env.${targetEnv}
   ✨ Destino: .env activo
   
   🚀 Ahora estás operando en el universo: ${targetEnv.toUpperCase()}
`);