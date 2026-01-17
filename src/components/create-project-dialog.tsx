"use client";

import { useState } from "react";
import { createProjectAction } from "@/app/(app)/actions";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createProjectAction(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("¡Proyecto inicializado!");
      setIsOpen(false);
      // Opcional: router.push(`/projects/${result.projectId}`);
    }
  }

  // Si no quieres instalar componentes de UI complejos todavía, 
  // aquí tienes un Modal manual con Tailwind puro y duro:
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all font-medium text-sm"
      >
        <Plus className="w-4 h-4" /> Nuevo Proyecto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Crear Proyecto</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Proyecto</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Ej: Lanzar SaaS v1" 
                  required
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Identidad / Área</label>
                <select name="identity" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                  <option value="Negocios">Negocios</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Personal">Personal</option>
                  <option value="Salud">Salud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="priority" value="medium" defaultChecked /> 
                    <span className="text-sm">Normal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="priority" value="high" /> 
                    <span className="text-sm font-bold text-orange-600">Alta</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="priority" value="critical" /> 
                    <span className="text-sm font-bold text-red-600">Crítica</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción (Opcional)</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Crear Proyecto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}