import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import ScoreDistributionChart from './ScoreDistributionChart';

interface DraggablePanelProps {
  id: string;
  title: string;
  type: string;
  data?: any;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ id, title, type, data }) => {
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

  const renderContent = () => {
    switch (type) {
      case 'score-distribution':
        return <ScoreDistributionChart />;
      case 'drivers-risk':
        return (
          <div className="space-y-4">
            {data.map((driver: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                  <p className="text-xs text-gray-500">Última atualização: {driver.lastUpdate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">Score: {driver.score}</p>
                  <p className="text-xs text-gray-500">{driver.status}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-6 rounded-lg shadow-sm relative group"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-move transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default DraggablePanel;