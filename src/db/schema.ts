// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';

// Definimos la tabla 'tenants' (restaurantes)
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(), // ID único autoincrementable
  name: text('name').notNull(),  // Nombre del negocio (ej: "Pizzería Don Pepe")
  slug: text('slug').notNull().unique(), // El subdominio (ej: "donpepe")
  customDomain: text('custom_domain'), // Por si compran su propio dominio después
  isActive: boolean('is_active').default(true), // Para "apagar" clientes que no pagan
  ownerId: text('owner_id').notNull(),
  settings: json('settings').$type<{
    modules: {
      billing: boolean;
      reservations: boolean;
      ai_menu: boolean;
    };
    theme: string;
  }>().default({ 
    modules: { billing: false, reservations: false, ai_menu: false }, 
    theme: 'system' 
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Vinculado a Clerk
  // Guardamos todo el objeto de suscripción como JSON para flexibilidad
  subscription: text('subscription_json').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
})

export const userSettings = pgTable('user_settings', {
  userId: text('user_id').primaryKey(), // Usamos el ID de Clerk como llave primaria
  settings: json('settings').$type<{
    modules: {
      billing: boolean;
      reservations: boolean;
      ai_menu: boolean;
    };
    theme: string;
  }>().default({ 
    modules: { billing: false, reservations: false, ai_menu: false }, 
    theme: 'system' 
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const systemModules = pgTable('system_modules', {
  key: text('key').primaryKey(), // ID único: 'billing', 'crm'
  name: text('name').notNull(),
  description: text('description'),
  iconKey: text('icon_key').notNull(), // Guardamos el nombre del icono: 'CreditCard', 'Bot'
  isPublic: boolean('is_public').default(false), // true = todos lo ven, false = solo admin
  createdAt: timestamp('created_at').defaultNow(),
});