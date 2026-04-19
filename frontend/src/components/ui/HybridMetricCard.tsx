import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface HybridMetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: 'saffron' | 'green' | 'navy' | 'turmeric';
  onClick?: () => void;
}

const colorMap = {
  saffron: 'var(--saffron)',
  green: 'var(--green)',
  navy: 'var(--navy)',
  turmeric: 'var(--turmeric)',
};

export function HybridMetricCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color,
  onClick
}: HybridMetricCardProps) {
  const ethnicColor = colorMap[color];

  return (
    <div 
      onClick={onClick}
      className={`ethnic-glass p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-2xl hover:border-saffron/40 hover:-translate-y-1' : ''
      }`}
    >
      {/* Subtle Background Icon Decoration */}
      <div className="absolute -bottom-4 -right-4 text-text-primary/10 group-hover:text-text-primary/20 transition-colors duration-500">
        <Icon size={120} strokeWidth={0.5} />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-black text-text-secondary uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-4xl font-black tracking-tighter" style={{ color: ethnicColor }}>
            {value}
          </h3>
        </div>
        <div 
          className="p-4 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm"
          style={{ color: ethnicColor }}
        >
          <Icon size={24} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 relative z-10 text-xs font-black uppercase tracking-wide">
        {change && (
          <span className={`${isPositive ? 'text-accent-secondary' : 'text-red-500'} bg-white/50 dark:bg-black/20 px-2 py-1 rounded-md`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        <span className="text-text-secondary/60">Metric Ledger</span>
      </div>
    </div>
  );
}
