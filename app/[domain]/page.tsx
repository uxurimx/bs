import { getTenantBySlug } from "@/src/db/querys";
import { notFound } from "next/navigation";

interface MenuPageProps {
  params: Promise<{ domain: string }>;
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { domain } = await params;

  // --- EL FIX ESTÁ AQUÍ ---
  // El "domain" llega como "demo.localhost".
  // Necesitamos quitarle la parte del dominio raíz para quedarnos solo con el slug "demo".
  
  // 1. Decodificamos por si hay caracteres raros
  const host = decodeURIComponent(domain);
  
  // 2. Lógica de limpieza:
  // Si estamos en local, quitamos ".localhost".
  // En producción, aquí quitarías ".tudominio.com"
  const slug = host.replace(".localhost", "").replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");

  // DEBUG MEJORADO: Verás que ahora sí coinciden
  console.log("🔍 Host recibido:", host);
  console.log("✨ Slug limpio para DB:", slug);

  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    return notFound(); 
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="border p-10 rounded-xl shadow-xl bg-white text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {tenant.name}
        </h1>
        <p className="text-gray-500">
          ID: {tenant.id} | Slug: {tenant.slug}
        </p>
        <div className="mt-8 px-6 py-3 bg-green-100 text-green-800 rounded-full inline-block font-semibold">
          {tenant.isActive ? "🟢 Local Abierto" : "🔴 Local Cerrado"}
        </div>
      </div>
    </div>
  );
}