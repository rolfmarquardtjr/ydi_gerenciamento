import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableStatCardProps {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  description: string;
}

export const DraggableStatCard: React.FC<DraggableStatCardProps> = ({
  id,
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
}) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-6 rounded-lg shadow-sm relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-move transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      
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
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};