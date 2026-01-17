import { auth } from "@clerk/nextjs/server";
import { getProjectDetails } from "@/src/db/querys";
import { notFound, redirect } from "next/navigation";
import { ProjectTaskRow } from "@/src/components/project-task-row";
import { AddTaskInline } from "@/src/components/add-task-inline";
import { ArrowLeft, Calendar, Flag, MoreVertical, Hash } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Extraer ID de la URL
  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) notFound();

  // 2. Fetch de Datos (Server-Side)
  const project = await getProjectDetails(projectId);

  // Seguridad: Si no existe o no es tuyo (validar userId si querys no lo filtra)
  if (!project || project.userId !== userId) {
    return notFound(); 
  }

  // Cálculos rápidos de progreso
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.isDone).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER DE NAVEGACIÓN --- */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
        </Link>
        <span className="text-gray-300">/</span>
        <span className="uppercase tracking-widest text-xs font-semibold">{project.metadata?.identity}</span>
      </div>

      {/* --- TITULO Y METADATA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-8 dark:border-zinc-800">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
            {project.name}
          </h1>
          <p className="text-lg text-gray-500 dark:text-zinc-400 max-w-2xl">
            {project.description || "Sin descripción maestra."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
              ${project.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {project.status}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-zinc-800 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
        </div>
      </div>

      {/* --- GRID DE COMANDO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

        {/* COLUMNA IZQUIERDA: Contexto & KPIs */}
        <div className="space-y-8">
          
          {/* Tarjeta de Progreso */}
          <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Ejecución</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold">{progressPercent}%</span>
              <span className="text-sm text-gray-500">{completedTasks}/{totalTasks} Tareas</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
              <Calendar className="w-4 h-4" />
              <span>Creado: {project.createdAt?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
              <Hash className="w-4 h-4" />
              <span>Versión: {project.metadata?.version || 'v1.0'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-zinc-400">
              <Flag className="w-4 h-4" />
              <span>Prioridad: <span className="capitalize font-medium">{project.priority}</span></span>
            </div>
          </div>

          {/* Sección de Objetivos (KPIs) - Placeholder para futuro */}
          <div className="pt-6 border-t dark:border-zinc-800 opacity-60">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Objetivos (Coming Soon)</h3>
            <ul className="space-y-2 text-sm text-gray-500">
                {project.goals?.map((g: any) => (
                    <li key={g.id}>• {g.title}</li>
                ))}
                {project.goals?.length === 0 && <li>No hay KPIs definidos.</li>}
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA (2/3): Tareas y Acción */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Plan de Acción
            </h2>
            {/* Aquí podrías poner filtros de tareas */}
          </div>

          {/* Input rápido de tareas */}
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
             <AddTaskInline projectId={projectId} />
          </div>

          {/* Lista de Tareas */}
          <div className="space-y-2">
            {project.tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p>Tu mente está tranquila.</p>
                    <p className="text-sm">Agrega una tarea para comenzar el caos controlado.</p>
                </div>
            ) : (
                project.tasks.map((task: any) => (
                    <ProjectTaskRow key={task.id} task={task} />
                ))
            )}
          </div>

          {/* Sección Notas (Placeholder) */}
          <div className="mt-12 pt-8 border-t dark:border-zinc-800">
            <h2 className="text-lg font-bold mb-4 text-gray-400">Bitácora & Notas</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-500">
               El módulo de notas enriquecidas (Markdown) está en construcción en la fábrica.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}