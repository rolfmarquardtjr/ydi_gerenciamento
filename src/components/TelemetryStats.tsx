import React from 'react';
import { TelemetryEvent } from '../store/telemetryStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface TelemetryStatsProps {
  events: TelemetryEvent[];
}

const TelemetryStats: React.FC<TelemetryStatsProps> = ({ events }) => {
  // Calculate event statistics
  const eventStats = events.reduce((acc: Record<string, number>, event) => {
    acc[event.evento] = (acc[event.evento] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for chart
  const chartData = Object.entries(eventStats)
    .map(([event, count]) => ({
      name: event,
      value: count,
      percentage: ((count / events.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const tooltipContent = `
    Análise detalhada da distribuição de eventos por tipo. O gráfico mostra a frequência absoluta de cada tipo de evento,
    enquanto as barras de progresso mostram a proporção relativa. Esta visualização ajuda a identificar os tipos de eventos
    mais comuns e priorizar ações corretivas.
  `;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Estatísticas de Eventos</h3>
        <Tooltip content={tooltipContent}>
          <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
        </Tooltip>
      </div>
      
      {/* Bar Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-2 rounded shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-gray-600">Quantidade: {data.value}</p>
                      <p className="text-gray-600">Percentual: {data.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {chartData.map(({ name, value, percentage }) => (
          <div key={name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{name}</span>
              <div className="text-right">
                <span className="font-medium">{value}</span>
                <span className="text-gray-500 ml-2">({percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryStats;