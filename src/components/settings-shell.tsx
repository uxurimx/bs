"use client";

import { useState } from "react";
import { ModulesSelector } from "@/src/components/modules-selector";
import { PushToggle } from "@/src/components/push-toggle";
import { CreateTenantForm } from "@/src/components/create-tenant-form";
import { AdminModuleForm } from "@/src/components/admin-module-form";
import { Modal } from "@/src/components/ui/modal";
import { LayoutGrid, Globe, Bell, Plus, Settings2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

// Definimos las pestañas disponibles
const TABS = [
  { id: "modules", label: "Módulos", icon: LayoutGrid },
  { id: "domains", label: "Subdominios", icon: Globe },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "general", label: "General", icon: Settings2 },
];

interface SettingsShellProps {
  configData: any;
  availableModules: any[];
  userTenants: any[];
  isSuperAdmin: boolean;
}

export function SettingsShell({ 
  configData, 
  availableModules, 
  userTenants, 
  isSuperAdmin 
}: SettingsShellProps) {
  const [activeTab, setActiveTab] = useState("modules");
  
  // Estado para los modales
  const [isDomainModalOpen, setDomainModalOpen] = useState(false);
  const [isModuleModalOpen, setModuleModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      
      {/* 1. TABS HEADER */}
      <div className="border-b border-gray-200 dark:border-zinc-800 overflow-x-auto">
        <nav className="flex space-x-8" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap",
                  isActive
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-zinc-300"
                )}
              >
                <tab.icon className={cn(
                  "mr-2 h-5 w-5",
                  isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. TAB CONTENTS */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* --- PESTAÑA: MÓDULOS --- */}
        {activeTab === "modules" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">App Store</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Activa funcionalidades extra para tu panel.</p>
              </div>
              {isSuperAdmin && (
                <button 
                  onClick={() => setModuleModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Nuevo Módulo
                </button>
              )}
            </div>
            
            <ModulesSelector configData={configData} availableModules={availableModules} />
          </div>
        )}

        {/* --- PESTAÑA: SUBDOMINIOS --- */}
        {activeTab === "domains" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Mis Subdominios</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Gestiona los puntos de acceso a tu aplicación.</p>
              </div>
              <button 
                onClick={() => setDomainModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Nuevo Subdominio
              </button>
            </div>

            {/* Lista de subdominios existente */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
               {userTenants.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No tienes subdominios aún.</div>
               ) : (
                 <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                   {userTenants.map((tenant) => (
                     <li key={tenant.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                       <div>
                         <div className="font-medium text-gray-900 dark:text-zinc-200">{tenant.name}</div>
                         <a href={`http://${tenant.slug}.localhost:3000`} target="_blank" className="text-xs text-blue-500 hover:underline">
                           http://{tenant.slug}.localhost:3000
                         </a>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tenant.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                            {tenant.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
            </div>
          </div>
        )}

        {/* --- PESTAÑA: NOTIFICACIONES --- */}
        {activeTab === "notifications" && (
          <div className="max-w-xl space-y-6">
            <div>
               <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Alertas Push</h3>
               <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">Recibe actualizaciones importantes en este dispositivo.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
              <PushToggle />
            </div>
          </div>
        )}

        {/* --- PESTAÑA: GENERAL (Placeholder) --- */}
        {activeTab === "general" && (
          <div className="p-12 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
             <Settings2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500">Opciones generales próximamente...</p>
          </div>
        )}
      </div>

      {/* 3. MODALES GLOBALIZADOS */}
      <Modal 
        isOpen={isDomainModalOpen} 
        onClose={() => setDomainModalOpen(false)} 
        title="Crear Nuevo Espacio"
      >
        <CreateTenantForm onSuccess={() => setDomainModalOpen(false)} />
      </Modal>

      <Modal 
        isOpen={isModuleModalOpen} 
        onClose={() => setModuleModalOpen(false)} 
        title="Configurar Nuevo Módulo"
      >
        <AdminModuleForm onSuccess={() => setModuleModalOpen(false)} />
      </Modal>

    </div>
  );
}