"use client"; // 👈 ESTO ES LA CLAVE. Marca este archivo como Cliente.

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface MetricsChartProps {
  data: { name: string; value: number }[];
}

export function MetricsChart({ data }: MetricsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`} 
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{ 
            backgroundColor: '#18181b', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#fff' 
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index % 2 === 0 ? '#2563eb' : '#3b82f6'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}