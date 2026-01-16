// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Leemos la URL de la base de datos
const sql = neon(process.env.DATABASE_URL!);

// Inicializamos Drizzle con el esquema
export const db = drizzle(sql, { schema });