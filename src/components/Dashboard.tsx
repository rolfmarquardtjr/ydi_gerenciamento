import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableDashboard from './DraggableDashboard';
import DraggablePanel from './DraggablePanel';
import ImportTelemetryModal from './ImportTelemetryModal';
import { useTelemetryStore } from '../store/telemetryStore';

const initialPanels = [
  {
    id: 'score-distribution',
    title: 'Distribuição de Score',
    type: 'score-distribution',
  },
  {
    id: 'drivers-risk',
    title: 'Motoristas em Risco',
    type: 'drivers-risk',
    data: [
      { name: 'João Silva', score: 35, status: 'Crítico', lastUpdate: '2 dias atrás' },
      { name: 'Maria Santos', score: 38, status: 'Crítico', lastUpdate: '3 dias atrás' },
      { name: 'Pedro Oliveira', score: 39, status: 'Ruim', lastUpdate: '1 dia atrás' },
      { name: 'Ana Costa', score: 37, status: 'Ruim', lastUpdate: '4 dias atrás' },
    ],
  },
];

const Dashboard = () => {
  const [panels, setPanels] = useState(initialPanels);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const generateReport = useTelemetryStore((state) => state.generateReport);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPanels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Central de Monitoramento
          </h1>
          <p className="text-gray-600 mt-1">
            Análise de Score e Comportamento dos Motoristas
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-4">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Importar Telemetria
          </button>
          <button
            onClick={generateReport}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Draggable Stats Grid */}
      <DraggableDashboard />

      {/* Draggable Panels */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SortableContext items={panels.map(panel => panel.id)} strategy={rectSortingStrategy}>
            {panels.map((panel) => (
              <DraggablePanel
                key={panel.id}
                id={panel.id}
                title={panel.title}
                type={panel.type}
                data={panel.data}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <ImportTelemetryModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;