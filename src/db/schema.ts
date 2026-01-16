// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Definimos la tabla 'tenants' (restaurantes)
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(), // ID único autoincrementable
  name: text('name').notNull(),  // Nombre del negocio (ej: "Pizzería Don Pepe")
  slug: text('slug').notNull().unique(), // El subdominio (ej: "donpepe")
  customDomain: text('custom_domain'), // Por si compran su propio dominio después
  isActive: boolean('is_active').default(true), // Para "apagar" clientes que no pagan
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Aquí iremos agregando más tablas luego (productos, categorías, etc.)