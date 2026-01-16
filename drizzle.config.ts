import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Antes era 'driver: pg'
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Antes era 'connectionString'
  },
});