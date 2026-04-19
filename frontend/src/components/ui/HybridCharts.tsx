import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ETHNIC_COLORS = {
  submitted: '#000080',
  resolved: '#138808',
  saffron: '#FF9933',
  turmeric: '#FFA500',
  accent: '#E67E22',
  green: '#138808',
  navy: '#000080',
};

interface GlowingLineChartProps {
  data: any[];
}

export function GlowingLineChart({ data }: GlowingLineChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="var(--text-secondary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontWeight: 600, fill: 'var(--text-secondary)' }}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fontWeight: 600, fill: 'var(--text-secondary)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px var(--card-shadow)',
              color: 'var(--text-primary)'
            }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Line
            type="monotone"
            dataKey="submitted"
            stroke={ETHNIC_COLORS.submitted}
            strokeWidth={3}
            dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: ETHNIC_COLORS.submitted }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke={ETHNIC_COLORS.resolved}
            strokeWidth={3}
            dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: ETHNIC_COLORS.resolved }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface NeonDonutChartProps {
  data: any[];
}

export function NeonDonutChart({ data }: NeonDonutChartProps) {
  const chartColors = [ETHNIC_COLORS.saffron, ETHNIC_COLORS.green, ETHNIC_COLORS.navy, ETHNIC_COLORS.turmeric, ETHNIC_COLORS.accent];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={chartColors[index % chartColors.length]} 
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px var(--card-shadow)',
              color: 'var(--text-primary)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full px-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: chartColors[index % chartColors.length] }} 
            />
            <span className="text-[10px] text-text-secondary uppercase tracking-widest font-black transition-colors">
              {item.category}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
