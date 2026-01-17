"use client";

import { createSystemModuleAction } from "@/app/(app)/actions";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
// Usamos LucideIcons para el preview si quieres, aquí simplificado
const ALLOWED_ICONS = ["CreditCard", "CalendarDays", "Bot", "Zap", "BarChart", "Users", "Settings"];

const initialState = { error: "", success: false };

export function AdminModuleForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
      const result = await createSystemModuleAction(formData);
      if (result?.error) return { error: result.error, success: false };
      return { error: "", success: true };
  }, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Módulo creado exitosamente");
      if (onSuccess) onSuccess(); // <--- CERRAMOS EL MODAL AQUÍ
    }
    if (state.error) toast.error(state.error);
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4">
        {/* ... inputs iguales que antes, solo quitamos el contenedor externo con borde ... */}
        <input name="name" placeholder="Nombre (ej: CRM)" required className="bg-gray-50 dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700" />
        <input name="key" placeholder="Key (ej: crm_v1)" required className="bg-gray-50 dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700" />
        <textarea name="description" placeholder="Descripción corta" className="bg-gray-50 dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700 resize-none h-20" />
        
        <div className="grid grid-cols-2 gap-4">
            <select name="iconKey" className="bg-gray-50 dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700">
            {ALLOWED_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 p-2 rounded border border-gray-200 dark:border-zinc-700 px-4">
            <input type="checkbox" name="isPublic" id="isPublic" className="w-4 h-4" />
            <label htmlFor="isPublic" className="text-sm">¿Público?</label>
            </div>
        </div>

        <button disabled={isPending} className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90 p-2.5 rounded-lg font-bold mt-2">
          {isPending ? "Creando..." : "Guardar Módulo"}
        </button>
    </form>
  );
}