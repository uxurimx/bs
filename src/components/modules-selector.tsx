"use client";

import { useState } from "react";
import { toggleUserModuleAction } from "@/app/(app)/actions";
import { toast } from "sonner";
import { CreditCard, CalendarDays, Bot, Check, Lock } from "lucide-react";
import { cn } from "@/src/lib/utils";

// Definición de los módulos disponibles
const AVAILABLE_MODULES = [
  {
    key: "billing",
    name: "Facturación",
    description: "Emite facturas fiscales automáticamente.",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    key: "reservations",
    name: "Reservas",
    description: "Gestión de mesas y citas.",
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    key: "ai_menu",
    name: "Menú IA",
    description: "Optimización de precios con Inteligencia Artificial.",
    icon: Bot,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

type ModulesSelectorProps = {
  configData: {
    settings: any; 
  }
};

// 👇 CORRECCIÓN AQUÍ: Recibimos 'configData' en lugar de 'tenant'
export function ModulesSelector({ configData }: ModulesSelectorProps) {
  
  // 👇 CORRECCIÓN AQUÍ: Leemos de 'configData.settings'
  const [modules, setModules] = useState(configData.settings?.modules || {});
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(moduleKey: string, currentValue: boolean) {
    const newValue = !currentValue;
    setLoading(moduleKey);

    // 1. Optimistic Update (Cambiar visualmente YA)
    setModules((prev: any) => ({ ...prev, [moduleKey]: newValue }));

    // 2. Server Action
    const result = await toggleUserModuleAction(moduleKey, newValue);

    if (result?.error) {
      // Revertir si falló
      setModules((prev: any) => ({ ...prev, [moduleKey]: currentValue }));
      toast.error(result.error);
    } else {
      toast.success(`Módulo ${newValue ? 'activado' : 'desactivado'} correctamente`);
    }
    setLoading(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {AVAILABLE_MODULES.map((mod) => {
        const isActive = modules[mod.key];
        const isLoading = loading === mod.key;

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
            {/* Icono */}
            <div className={cn("p-3 rounded-lg shrink-0", mod.color)}>
              <mod.icon className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  {mod.name}
                </h3>
                
                {/* Switch Toggle */}
                <button
                  onClick={() => handleToggle(mod.key, isActive)}
                  disabled={!!loading}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    isActive ? "bg-blue-600" : "bg-gray-200 dark:bg-zinc-700"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isActive ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                {mod.description}
              </p>

              {/* Indicador de Estado */}
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