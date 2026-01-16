'use client'; // <--- Esto lo hace interactivo

import { useActionState } from "react";
import { createTenantAction } from "@/app/(app)/actions";
const initialState = {
  error: "",
};

export function CreateTenantForm() {
  // useActionState conecta tu Server Action con el estado del formulario
  const [state, formAction, isPending] = useActionState(createTenantAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Input NOMBRE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
        <input 
          name="name" 
          type="text" 
          placeholder="Tío Sam" 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required 
        />
      </div>

      {/* Input SLUG */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Subdominio)</label>
        <div className="flex items-center">
          <input 
            name="slug" 
            type="text" 
            placeholder="tiosam" 
            className="flex-1 p-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required 
          />
          <span className="bg-gray-100 p-2 border border-l-0 rounded-r-lg text-gray-500">.yumm.lat</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Solo letras minúsculas, sin espacios.</p>
      </div>

      {/* MENSAJE DE ERROR (Si el servidor responde algo malo) */}
      {state.error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
          ⚠️ {state.error}
        </div>
      )}

      {/* BOTÓN SUBMIT (Con estado de carga) */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-bold transition disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}