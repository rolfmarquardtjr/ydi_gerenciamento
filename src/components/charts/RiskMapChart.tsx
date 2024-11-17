import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MapPin } from 'lucide-react';

interface RiskMapChartProps {
  id: string;
  title: string;
}

const RiskMapChart: React.FC<RiskMapChartProps> = ({ id, title }) => {
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

  const hotspots = [
    { id: 1, name: 'Região A', events: 25, severity: 'high' },
    { id: 2, name: 'Região B', events: 18, severity: 'medium' },
    { id: 3, name: 'Região C', events: 12, severity: 'low' },
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
        {hotspots.map((hotspot) => (
          <div key={hotspot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <MapPin className={`w-5 h-5 mr-3 ${
                hotspot.severity === 'high' ? 'text-red-500' :
                hotspot.severity === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} />
              <div>
                <p className="font-medium">{hotspot.name}</p>
                <p className="text-sm text-gray-500">{hotspot.events} eventos</p>
              </div>
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              hotspot.severity === 'high' ? 'bg-red-100 text-red-700' :
              hotspot.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {hotspot.severity === 'high' ? 'Alto Risco' :
               hotspot.severity === 'medium' ? 'Médio Risco' :
               'Baixo Risco'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMapChart;