import React from 'react';
import { AlertTriangle, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { useTelemetryStore } from '../store/telemetryStore';

const TelemetryAnalysis = () => {
  const analysis = useTelemetryStore((state) => state.analysis);

  if (!analysis) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        Nenhum dado de telemetria importado
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Eventos',
      value: analysis.totalEvents.toString(),
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      title: 'Eventos Críticos',
      value: analysis.criticalEvents.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Velocidade Média',
      value: `${Math.round(analysis.averageSpeed)} km/h`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Score de Risco',
      value: Math.round(analysis.riskScore).toString(),
      icon: AlertCircle,
      color: analysis.riskScore >= 80 ? 'text-green-600' : 
             analysis.riskScore >= 60 ? 'text-blue-600' :
             analysis.riskScore >= 40 ? 'text-yellow-600' : 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg').replace('600', '100')}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-sm text-gray-600">{stat.title}</h3>
            <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Eventos</h3>
        <div className="space-y-4">
          {Object.entries(analysis.eventsByType).map(([type, count], index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{type}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(count / analysis.totalEvents) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelemetryAnalysis;