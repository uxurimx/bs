import { auth } from "@clerk/nextjs/server";
import { getProjectDetails } from "@/src/db/querys";
import { notFound, redirect } from "next/navigation";
import { ProjectWarRoom } from "@/src/components/project-war-room"; // <--- Importamos el componente
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) notFound();

  // Fetch de Datos
  const project = await getProjectDetails(projectId);

  if (!project || project.userId !== userId) {
    return notFound(); 
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Header Simple de Navegación */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Mis Proyectos
            </Link>
            <span className="text-gray-300">/</span>
            <span className="uppercase tracking-widest text-xs font-semibold text-blue-600">
                {project.name}
            </span>
        </div>
        
        {/* Indicador de Status Rápido */}
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
            ${project.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {project.status}
        </div>
      </div>

      {/* --- AQUÍ CARGAMOS EL WAR ROOM --- */}
      <ProjectWarRoom project={project} />

    </div>
  );
}