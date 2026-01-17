"use client";

import { useRef } from "react";
import { createTaskAction } from "@/app/(app)/actions";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AddTaskInline({ projectId }: { projectId: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    // Llamamos a la server action pasando el ID + los datos del form
    const result = await createTaskAction(projectId, formData);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      formRef.current?.reset(); // Limpiamos el input
      toast.success("Tarea agregada");
    }
  }

  return (
    <form ref={formRef} action={clientAction} className="flex gap-2 items-center mt-2">
      <div className="relative flex-grow">
        <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          name="title"
          type="text" 
          placeholder="Agregar nueva tarea..." 
          required
          className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border-b border-gray-200 dark:border-zinc-700 focus:border-blue-500 outline-none transition-colors"
          autoComplete="off"
        />
      </div>
      
      {/* Selector de prioridad mini */}
      <select name="priority" className="text-xs bg-transparent text-gray-500 outline-none cursor-pointer">
        <option value="medium">Normal</option>
        <option value="high">Alta</option>
        <option value="critical">Crítica</option>
      </select>
      
      <button type="submit" className="sr-only">Guardar</button>
    </form>
  );
}