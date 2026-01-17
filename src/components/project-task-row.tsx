"use client";

import { useState } from "react";
import { toggleTaskAction } from "@/app/(app)/actions"; // Asegúrate que esta ruta sea correcta
import { cn } from "@/src/lib/utils";
import { Check, Circle } from "lucide-react";
import { toast } from "sonner";

export function ProjectTaskRow({ task }: { task: any }) {
  const [isDone, setIsDone] = useState(task.isDone);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    // 1. Optimistic Update (Cambio visual inmediato)
    const newState = !isDone;
    setIsDone(newState);
    setLoading(true);

    // 2. Server Action
    const result = await toggleTaskAction(task.id, isDone);
    
    // 3. Rollback si falla
    if (result?.error) {
      setIsDone(!newState);
      toast.error("Error de conexión");
    }
    setLoading(false);
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group",
      isDone 
        ? "bg-gray-50 border-gray-100 dark:bg-zinc-800/30 dark:border-zinc-800/50" 
        : "bg-white border-gray-200 hover:border-blue-300 dark:bg-zinc-900 dark:border-zinc-800"
    )}>
      <button 
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
          isDone 
            ? "bg-blue-600 border-blue-600 text-white" 
            : "border-gray-300 text-transparent hover:border-blue-500"
        )}
      >
        <Check className="w-3 h-3" strokeWidth={3} />
      </button>

      <span className={cn(
        "flex-grow text-sm transition-all duration-200",
        isDone ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200"
      )}>
        {task.title}
      </span>

      {/* Badge de Prioridad Discreto */}
      {task.priority === 'high' && (
        <span className="w-2 h-2 rounded-full bg-orange-500" title="Alta Prioridad" />
      )}
      {task.priority === 'critical' && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Crítica" />
      )}
    </div>
  );
}