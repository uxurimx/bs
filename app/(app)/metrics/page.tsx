import { getMetricsAction } from "@/app/(app)/actions";
// 👇 Importamos NUESTRO componente, no la librería directa
import { MetricsChart } from "@/src/components/metrics-chart"; 
// Si decidiste crear el componente Card, úsalo. Si no, usa divs como abajo.
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export default async function MetricsPage() {
  // 1. Esto sigue ejecutándose en el servidor (Rápido y Seguro)
  const { totalViews, viewsByCountry } = await getMetricsAction();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">Métricas de Tráfico</h1>
      
      {/* KPI Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">Visitas Totales</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold">{totalViews}</div>
           </CardContent>
        </Card>
      </div>

      {/* Gráfica */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Visitas por País</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[400px] w-full">
            {/* 👇 Aquí usamos el componente cliente */}
            <MetricsChart data={viewsByCountry} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}