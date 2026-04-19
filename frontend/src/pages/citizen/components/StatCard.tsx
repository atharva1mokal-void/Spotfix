import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  delay?: number;
  color?: "orange" | "green" | "blue" | "yellow";
}

const colorMap = {
  orange: { border: "border-l-accent", icon: "bg-accent/10 text-accent", glow: "rgba(255,153,51,0.12)" },
  green:  { border: "border-l-accent-secondary", icon: "bg-accent-secondary/10 text-accent-secondary", glow: "rgba(19,136,8,0.1)" },
  blue:   { border: "border-l-blue-500", icon: "bg-blue-500/10 text-blue-500", glow: "rgba(59,130,246,0.1)" },
  yellow: { border: "border-l-yellow-500", icon: "bg-yellow-500/10 text-yellow-600", glow: "rgba(234,179,8,0.1)" },
};

export function StatCard({ label, value, icon, delay = 0, color = "orange" }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`bg-card-bg backdrop-blur-md rounded-2xl p-5 border border-card-border border-l-4 ${c.border} hover:border-l-4 transition-all duration-300 shadow-sm hover:-translate-y-1 relative overflow-hidden group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-[10px] mb-1.5 uppercase tracking-widest font-black">{label}</p>
          <p className="text-text-primary text-4xl font-black tracking-tighter">{value}</p>
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon} shadow-sm`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
