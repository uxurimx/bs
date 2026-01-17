"use client";

import { createSystemModuleAction } from "@/app/(app)/actions";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
// Importamos iconos para mostrar un preview o lista simple
import * as LucideIcons from "lucide-react";

// Lista de iconos permitidos para elegir (puedes ampliarla)
const ALLOWED_ICONS = ["CreditCard", "CalendarDays", "Bot", "Zap", "BarChart", "Users", "Settings"];

const initialState = { error: "", success: false };

export function AdminModuleForm() {
  const [state, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
      const result = await createSystemModuleAction(formData);
      if (result?.error) return { error: result.error, success: false };
      return { error: "", success: true };
  }, initialState);

  useEffect(() => {
    if (state.success) toast.success("Módulo creado exitosamente");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <LucideIcons.ShieldAlert className="text-red-500 w-5 h-5" />
        <h3 className="font-bold text-white">Panel Super Admin: Crear Módulo</h3>
      </div>
      
      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Nombre (ej: CRM)" required className="bg-zinc-800 p-2 rounded text-white" />
        <input name="key" placeholder="Key (ej: crm_v1)" required className="bg-zinc-800 p-2 rounded text-white" />
        <input name="description" placeholder="Descripción corta" className="bg-zinc-800 p-2 rounded text-white md:col-span-2" />
        
        <select name="iconKey" className="bg-zinc-800 p-2 rounded text-white">
          {ALLOWED_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
        </select>

        <div className="flex items-center gap-2 bg-zinc-800 p-2 rounded">
          <input type="checkbox" name="isPublic" id="isPublic" />
          <label htmlFor="isPublic" className="text-white text-sm">¿Hacer Público?</label>
        </div>

        <button disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded md:col-span-2 font-bold">
          {isPending ? "Creando..." : "Crear Módulo"}
        </button>
      </form>
    </div>
  );
}