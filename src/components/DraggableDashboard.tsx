import React, { useEffect } from 'react';
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
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableStatCard } from './DraggableStatCard';
import { Users, Brain, Award, AlertTriangle } from 'lucide-react';
import { useDashboardStore } from '../store/dashboardStore';

interface DraggableDashboardProps {
  activeDriversCount?: number;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({ activeDriversCount = 0 }) => {
  const [cards, setCards] = React.useState([
    {
      id: '1',
      title: 'Score Médio da Frota',
      icon: Award,
      description: 'Pontuação média dos motoristas'
    },
    {
      id: '2',
      title: 'Condutores Ativos',
      icon: Users,
      description: 'Total de condutores'
    },
    {
      id: '3',
      title: 'Motoristas em Risco',
      icon: AlertTriangle,
      description: 'Score < 40 pontos'
    },
    {
      id: '4',
      title: 'Análises de IA',
      icon: Brain,
      description: 'Eventos analisados'
    },
  ]);
  
  const { metrics, calculateMetrics } = useDashboardStore();
  
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getCardValue = (id: string) => {
    switch (id) {
      case '1':
        return {
          value: `${metrics.fleetScore}`,
          trend: metrics.fleetScore > 75 ? '+5%' : '-3%',
          trendUp: metrics.fleetScore > 75
        };
      case '2':
        return {
          value: activeDriversCount.toString(),
          trend: '+12%',
          trendUp: true
        };
      case '3':
        return {
          value: metrics.driversAtRisk.toString(),
          trend: metrics.driversAtRisk > 10 ? '+8%' : '-8%',
          trendUp: false
        };
      case '4':
        return {
          value: metrics.aiAnalysis.toString(),
          trend: '+15%',
          trendUp: true
        };
      default:
        return { value: '0', trend: '0%', trendUp: false };
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SortableContext items={cards.map(card => card.id)} strategy={rectSortingStrategy}>
          {cards.map((card) => {
            const { value, trend, trendUp } = getCardValue(card.id);
            return (
              <DraggableStatCard
                key={card.id}
                id={card.id}
                title={card.title}
                value={value}
                icon={card.icon}
                trend={trend}
                trendUp={trendUp}
                description={card.description}
              />
            );
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default DraggableDashboard;