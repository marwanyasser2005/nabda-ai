import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
  color?: 'primary' | 'danger' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendValue, icon: Icon, color = 'primary' }) => {
  const trendColor = trend === 'up' ? 'text-nabda-danger' : trend === 'down' ? 'text-nabda-success' : 'text-slate-400';
  const IconComponent = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  // Map color prop to tailwind classes
  const iconColorClass = {
    primary: 'text-nabda-primary',
    danger: 'text-nabda-danger',
    warning: 'text-nabda-warning',
    success: 'text-nabda-success',
  }[color];

  return (
    <div className="bg-nabda-card border border-nabda-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800 ${iconColorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center text-xs">
        <span className={`flex items-center font-medium ${trendColor} mr-2`}>
          <IconComponent className="w-3 h-3 mr-1" />
          {trendValue}
        </span>
        <span className="text-slate-500">vs last week</span>
      </div>
    </div>
  );
};
