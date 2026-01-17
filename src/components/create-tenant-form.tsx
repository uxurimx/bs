"use client";

import { useActionState, useEffect } from "react";
import { createTenantAction } from "@/app/(app)/actions";
import { toast } from "sonner";

const initialState = {
  error: "",
};

// Aceptamos una prop opcional para cerrar el modal si es necesario
// (Aunque este form hace redirect, es buena práctica tenerlo)
export function CreateTenantForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, isPending] = useActionState(createTenantAction, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    // Si la acción tuviera éxito sin redirect, aquí llamaríamos a onSuccess()
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Nombre del Restaurante
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Ej: Pizzería Don Pepe"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
          Slug (URL)
        </label>
        <div className="flex rounded-lg shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 text-sm">
            http://
          </span>
          <input
            type="text"
            name="slug"
            id="slug"
            required
            placeholder="donpepe"
            className="flex-1 min-w-0 block w-full px-4 py-2 rounded-none border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 text-sm">
            .localhost
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
      >
        {isPending ? "Creando..." : "🚀 Crear Restaurante"}
      </button>
    </form>
  );
}