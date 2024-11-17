import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;