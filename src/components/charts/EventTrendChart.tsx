import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EventTrendChartProps {
  id: string;
  title: string;
}

const EventTrendChart: React.FC<EventTrendChartProps> = ({ id, title }) => {
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

  const data = [65, 72, 68, 75, 82, 78, 85];
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-6 rounded-lg shadow-sm"
      {...attributes}
      {...listeners}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <div className="h-full flex items-end space-x-2">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-600 rounded-t-lg transition-all duration-300 hover:bg-primary-700"
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-gray-600 mt-2">{days[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventTrendChart;