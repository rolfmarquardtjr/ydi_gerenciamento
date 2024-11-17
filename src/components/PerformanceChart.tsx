import React from 'react';

const PerformanceChart = () => {
  return (
    <div className="relative">
      <div className="h-64 flex items-end space-x-2">
        {[75, 82, 90, 85, 88, 95, 78].map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-primary-600 rounded-t-lg transition-all duration-300 hover:bg-primary-700"
              style={{ height: `${value}%` }}
            ></div>
            <span className="text-xs text-gray-600 mt-2">Grupo {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;