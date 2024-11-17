import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DriverScoreChartProps {
  id: string;
  title: string;
}

const DriverScoreChart: React.FC<DriverScoreChartProps> = ({ id, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const scoreRanges = [
    { label: 'Excelente (80-100)', value: 25, color: 'bg-green-500' },
    { label: 'Bom (60-79)', value: 40, color: 'bg-blue-500' },
    { label: 'Regular (40-59)', value: 20, color: 'bg-yellow-500' },
    { label: 'Ruim (20-39)', value: 10, color: 'bg-orange-500' },
    { label: 'Crítico (0-19)', value: 5, color: 'bg-red-500' },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-6 rounded-lg shadow-sm"
      {...attributes}
      {...listeners}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {scoreRanges.map((range, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{range.label}</span>
              <span className="font-medium">{range.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${range.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${range.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverScoreChart;