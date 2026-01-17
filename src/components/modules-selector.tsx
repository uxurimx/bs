"use client";

import { useState } from "react";
import { toggleUserModuleAction } from "@/app/(app)/actions";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
import * as LucideIcons from "lucide-react"; // Importamos todos para mapear
import { cn } from "@/src/lib/utils";

// Definimos el tipo que viene de la DB
type SystemModule = {
  key: string;
  name: string;
  description: string | null;
  iconKey: string;
  isPublic: boolean | null;
};

type ModulesSelectorProps = {
  configData: { settings: any };
  availableModules: SystemModule[]; // Lista que vendrá del servidor
};

export function ModulesSelector({ configData, availableModules }: ModulesSelectorProps) {
  // Estado local
  const [modules, setModules] = useState(configData.settings?.modules || {});
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(moduleKey: string, currentValue: boolean) {
    const newValue = !currentValue;
    setLoading(moduleKey);

    // Optimistic Update
    setModules((prev: any) => ({ ...prev, [moduleKey]: newValue }));

    const result = await toggleUserModuleAction(moduleKey, newValue);

    if (result?.error) {
      setModules((prev: any) => ({ ...prev, [moduleKey]: currentValue }));
      toast.error(result.error);
    } else {
      toast.success(`Módulo ${newValue ? 'activado' : 'desactivado'}`);
    }
    setLoading(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableModules.length === 0 && (
         <p className="text-gray-500 col-span-2 text-center py-4">No hay módulos disponibles en el sistema.</p>
      )}

      {availableModules.map((mod) => {
        const isActive = modules[mod.key];
        
        // Mapeo Dinámico de Iconos: Buscamos el string en la librería Lucide
        // @ts-ignore - Lucide tiene muchos iconos, asumimos que iconKey es válido o fallback
        const IconComponent = LucideIcons[mod.iconKey] || LucideIcons.Box; 

        return (
          <div 
            key={mod.key}
            className={cn(
              "group relative flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200",
              isActive 
                ? "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10" 
                : "border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700"
            )}
          >
            {/* Icono Dinámico */}
            <div className="p-3 rounded-lg shrink-0 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
              <IconComponent className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    {mod.name}
                    </h3>
                    {/* Badge de Privado para Admin */}
                    {!mod.isPublic && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                            PRIVADO
                        </span>
                    )}
                </div>
                
                <button
                  onClick={() => handleToggle(mod.key, isActive)}
                  disabled={!!loading}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isActive ? "bg-blue-600" : "bg-gray-200 dark:bg-zinc-700"
                  )}
                >
                  <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", isActive ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                {mod.description || "Sin descripción"}
              </p>

              {/* Estado */}
              <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                {isActive ? (
                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Activo
                  </span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600" /> Inactivo
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}