// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean, json, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  path: text('path'),            // Qué página vio (ej: /pizzeria-don-pepe)
  country: text('country'),      // País (MX, US, ES)
  device: text('device'),        // mobile, desktop
  browser: text('browser'),      // chrome, safari
  os: text('os'),                // ios, android, windows
  timestamp: timestamp('timestamp').defaultNow(),
  // Opcional: Si quieres relacionarlo con un tenant específico
  // tenantId: text('tenant_id'), 
});

// ==========================================
// 🚀 NUEVO: MÓDULO DE PROYECTOS & EJECUCIÓN
// ==========================================

// Enums para estandarizar (Postgres manejará esto como tipos nativos)
export const statusEnum = pgEnum('status', ['idea', 'planning', 'active', 'paused', 'completed', 'archived']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);

// TABLA MAESTRA DE PROYECTOS
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Vinculado a Clerk
  
  name: text('name').notNull(),
  description: text('description'), // El "Por qué"
  
  status: statusEnum('status').default('planning'),
  priority: priorityEnum('priority').default('medium'),
  
  startDate: timestamp('start_date'),
  dueDate: timestamp('due_date'), // Deadline final
  completedAt: timestamp('completed_at'),

  // Metadatos flexibles: Aquí guardas la "Identidad" ("Programador", "Padre")
  metadata: json('metadata').$type<{
    icon?: string;
    color?: string; 
    identity?: string; 
    version?: string; 
  }>(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// OBJETIVOS (KPIs)
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  
  title: text('title').notNull(), 
  type: text('type').default('milestone'), // 'milestone' o 'numeric'
  
  // Para barras de progreso (Ej: Leer 10 libros)
  targetValue: integer('target_value'), 
  currentValue: integer('current_value').default(0), 
  unit: text('unit'), // "%", "USD", "kg"

  deadline: timestamp('deadline'),
  isCompleted: boolean('is_completed').default(false),
});

// TAREAS (Acciones)
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  
  title: text('title').notNull(),
  isDone: boolean('is_done').default(false),
  
  priority: priorityEnum('priority').default('medium'),
  dueDate: timestamp('due_date'),
  
  reminderAt: timestamp('reminder_at'), // Para WebPush

  createdAt: timestamp('created_at').defaultNow(),
});

// NOTAS (Contexto)
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  
  title: text('title'),
  content: text('content'), // Markdown
  tags: json('tags').$type<string[]>(), 
  
  createdAt: timestamp('created_at').defaultNow(),
});

// RELACIONES (Para que Drizzle sepa armar los joins automáticos)
export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  goals: many(goals),
  notes: many(notes),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  project: one(projects, {
    fields: [goals.projectId],
    references: [projects.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
}));