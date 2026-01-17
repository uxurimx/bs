import { auth } from "@clerk/nextjs/server";
import { getUserProjects } from "@/src/db/querys";
import { CreateProjectDialog } from "@/src/components/create-project-dialog";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";

export default async function ProjectsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const projects = await getUserProjects(userId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Proyectos Activos</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            Gestiona tu imperio. Tienes {projects.length} proyectos en curso.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Grid de Proyectos */}
      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl dark:border-zinc-800">
          <p className="text-gray-400">No hay nada aquí aún. Es hora de construir.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.id}`}
              className="group relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                  ${project.priority === 'critical' ? 'bg-red-100 text-red-700' : 
                    project.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                    'bg-blue-50 text-blue-600'}`}>
                  {project.priority}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {project.metadata?.identity || 'General'}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                {project.description || "Sin descripción definida."}
              </p>

              {/* Métricas Rápidas */}
              <div className="flex items-center gap-4 text-sm text-gray-400 border-t pt-4 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{project.goals.length} KPIs</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{project.tasks.filter(t => t.isDone).length}/{project.tasks.length}</span>
                </div>
              </div>

              {/* Flecha decorativa */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}