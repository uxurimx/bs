"use client";

import { useState } from "react";
import { ProjectTaskRow } from "./project-task-row";
import { AddTaskInline } from "./add-task-inline";
import { releaseVersionAction } from "@/app/(app)/actions"; // Importa la acción
import { toast } from "sonner";
import { 
  LayoutDashboard, Target, CheckSquare, FileText, Info, 
  Rocket, ShieldCheck, Users, Mail 
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// Tipos básicos para TypeScript (ajusta según tu schema real)
type Project = any; 

export function ProjectWarRoom({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Función para manejar el "Release" manual
  async function handleRelease() {
    toast.promise(releaseVersionAction(project.id), {
      loading: 'Compilando versión estable...',
      success: '¡Versión Stable Lanzada! 🚀',
      error: 'Error al lanzar versión'
    });
  }

  // --- COMPONENTES DE LAS PESTAÑAS (Internal Components) ---

  const TabDashboard = () => {
    // Cálculo de progreso
    const completed = project.tasks.filter((t:any) => t.isDone).length;
    const total = project.tasks.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Tarjeta Versión */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Versión Actual</h3>
            <div className="text-4xl font-black tracking-tighter mb-4 font-mono">
              {project.metadata?.version || "v0.0.0"}
            </div>
            <button 
              onClick={handleRelease}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Rocket className="w-3 h-3" /> RELEASE V{parseInt(project.metadata?.version?.split('.')[0].replace('v','') || '0') + 1}.0.0
            </button>
          </div>
          <Rocket className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
        </div>

        {/* Tarjeta Progreso */}
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 p-6 rounded-xl shadow-sm col-span-2">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Estado del Sistema</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold">{progress}%</span>
              <span className="text-sm text-gray-400">{completed}/{total} Tareas completadas</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
        </div>

        {/* Resumen Tareas Urgentes */}
        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                Acciones Inmediatas
            </h3>
            <div className="space-y-2">
                {project.tasks.slice(0, 3).map((task:any) => (
                    <ProjectTaskRow key={task.id} task={task} />
                ))}
                <AddTaskInline projectId={project.id} />
            </div>
        </div>
      </div>
    );
  };

  const TabInfo = () => (
    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-8 space-y-8 animate-in fade-in">
        
        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Visión (El Norte)</h3>
                <p className="text-lg font-medium leading-relaxed">
                    {project.metadata?.vision || "Convertir esta idea abstracta en un sistema tangible que opere sin fricción."}
                </p>
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Misión (El Camino)</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.metadata?.mission || "Ejecutar iteraciones rápidas, fallar barato y consolidar una versión estable antes del Q4."}
                </p>
            </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-zinc-800" />

        {/* El Equipo */}
        <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">El Equipo (Roles)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { role: "CEO / Architect", name: "Torres", icon: ShieldCheck, color: "text-purple-500" },
                    { role: "Lead Dev", name: "Torres (Mode: Deep Work)", icon: CheckSquare, color: "text-blue-500" },
                    { role: "Marketing", name: "Torres (Mode: Social)", icon: Users, color: "text-pink-500" },
                    { role: "Contacto", name: "system@kairos.mx", icon: Mail, color: "text-green-500" },
                ].map((member) => (
                    <div key={member.role} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-zinc-800/50 dark:border-zinc-700">
                        <member.icon className={`w-5 h-5 ${member.color}`} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">{member.role}</p>
                            <p className="font-medium text-sm">{member.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const TabTasks = () => (
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Backlog Maestro</h3>
            <div className="text-xs text-gray-400 font-mono">Total: {project.tasks.length}</div>
          </div>
          
          <div className="space-y-2 mb-6">
            {project.tasks.map((task:any) => (
                <div key={task.id} className="group relative">
                    <ProjectTaskRow task={task} />
                    {/* Botón flotante para convertir (visible en hover) */}
                    <button 
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white border shadow-sm px-2 py-1 text-[10px] rounded text-gray-500 hover:text-blue-600 transition-all"
                        onClick={() => toast.info("Función de convertir a Objetivo próximamente...")}
                    >
                        Promover a Objetivo
                    </button>
                </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-lg border border-dashed dark:border-zinc-700">
             <AddTaskInline projectId={project.id} />
          </div>
      </div>
  );

  const TabsMenu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "goals", label: "Objetivos", icon: Target },
    { id: "tasks", label: "Tareas", icon: CheckSquare },
    { id: "notes", label: "Notas", icon: FileText },
    { id: "info", label: "Info & Visión", icon: Info },
  ];

  return (
    <div className="space-y-6">
        {/* --- NAVEGACIÓN DE PESTAÑAS --- */}
        <div className="flex overflow-x-auto pb-2 border-b dark:border-zinc-800 gap-1 no-scrollbar">
            {TabsMenu.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all border-b-2 whitespace-nowrap",
                        activeTab === tab.id
                            ? "border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- CONTENIDO DINÁMICO --- */}
        <div className="min-h-[500px]">
            {activeTab === "dashboard" && <TabDashboard />}
            {activeTab === "info" && <TabInfo />}
            {activeTab === "tasks" && <TabTasks />}
            {activeTab === "goals" && (
                <div className="p-10 text-center text-gray-400 border-2 border-dashed rounded-xl">
                    <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Módulo de Objetivos (OKRs) en construcción...</p>
                    <p className="text-xs mt-2">Al completarse un objetivo, la versión subirá +0.1.0</p>
                </div>
            )}
            {activeTab === "notes" && (
                <div className="p-10 text-center text-gray-400 border-2 border-dashed rounded-xl">
                     <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                     <p>Módulo de Notas en construcción...</p>
                </div>
            )}
        </div>
    </div>
  );
}