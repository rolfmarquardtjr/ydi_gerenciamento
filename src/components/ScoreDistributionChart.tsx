import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

const ScoreDistributionChart = () => {
  const { metrics } = useDashboardStore();
  const { driverScores } = metrics;

  const total = Object.values(driverScores).reduce((sum, value) => sum + value, 0);

  const scoreRanges = [
    { 
      label: 'Excelente (80-100)', 
      value: driverScores.excellent,
      percentage: total ? Math.round((driverScores.excellent / total) * 100) : 0,
      color: 'bg-green-500' 
    },
    { 
      label: 'Bom (60-79)', 
      value: driverScores.good,
      percentage: total ? Math.round((driverScores.good / total) * 100) : 0,
      color: 'bg-blue-500' 
    },
    { 
      label: 'Regular (40-59)', 
      value: driverScores.regular,
      percentage: total ? Math.round((driverScores.regular / total) * 100) : 0,
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Ruim (20-39)', 
      value: driverScores.bad,
      percentage: total ? Math.round((driverScores.bad / total) * 100) : 0,
      color: 'bg-orange-500' 
    },
    { 
      label: 'Crítico (0-19)', 
      value: driverScores.critical,
      percentage: total ? Math.round((driverScores.critical / total) * 100) : 0,
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="space-y-4">
      {scoreRanges.map((range, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{range.label}</span>
            <span className="font-medium">{range.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${range.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${range.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreDistributionChart;