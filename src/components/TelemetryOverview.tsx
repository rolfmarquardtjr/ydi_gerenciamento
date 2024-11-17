import React from 'react';
import { TelemetryEvent } from '../store/telemetryStore';
import { User } from '../store/userStore';
import { Brain, AlertTriangle, TrendingUp, Activity, HelpCircle } from 'lucide-react';
import { useRiskAnalysisStore } from '../store/riskAnalysisStore';
import Tooltip from './Tooltip';

interface TelemetryOverviewProps {
  events: TelemetryEvent[];
  drivers: User[];
}

const TelemetryOverview: React.FC<TelemetryOverviewProps> = ({ events, drivers }) => {
  const analyzeRisk = useRiskAnalysisStore((state) => state.analyzeRisk);

  // Calculate overall fleet metrics
  const totalEvents = events.length;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

  // Events in last 30 days
  const eventsLast30Days = events.filter(event => {
    const eventDate = new Date(event.data);
    return eventDate >= thirtyDaysAgo;
  });

  // Events in previous 30 days
  const eventsPrevious30Days = events.filter(event => {
    const eventDate = new Date(event.data);
    return eventDate >= sixtyDaysAgo && eventDate < thirtyDaysAgo;
  });

  // Calculate fleet risk score
  const fleetRiskScore = drivers.reduce((acc, driver) => {
    const driverEvents = events.filter(event => event.id_operador === driver.id_operador);
    const riskAnalysis = analyzeRisk(driverEvents, driver.id_operador);
    return acc + riskAnalysis.score;
  }, 0) / (drivers.length || 1);

  // Calculate trend
  const eventsTrend = eventsPrevious30Days.length === 0 ? 0 :
    ((eventsLast30Days.length - eventsPrevious30Days.length) / eventsPrevious30Days.length) * 100;

  // Calculate critical events (high severity events)
  const criticalEvents = events.filter(e => 
    e.evento === 'Excesso de Velocidade' || 
    e.evento === 'Frenagem Brusca'
  );
  const criticalEventsLast30Days = criticalEvents.filter(event => {
    const eventDate = new Date(event.data);
    return eventDate >= thirtyDaysAgo;
  });

  const metrics = [
    {
      title: 'Score da Frota',
      value: Math.round(fleetRiskScore),
      icon: Brain,
      trend: eventsTrend > 0 ? `+${eventsTrend.toFixed(1)}%` : `${eventsTrend.toFixed(1)}%`,
      trendUp: eventsTrend <= 0,
      description: 'Média de risco da frota',
      tooltip: 'Score calculado com base na média ponderada dos scores individuais dos condutores, considerando frequência de eventos, severidade, horários e locais de risco.'
    },
    {
      title: 'Eventos Totais',
      value: totalEvents,
      icon: Activity,
      trend: `${eventsLast30Days.length} nos últimos 30 dias`,
      trendUp: eventsLast30Days.length < eventsPrevious30Days.length,
      description: 'Total de eventos registrados',
      tooltip: 'Soma de todos os eventos de telemetria registrados, incluindo excesso de velocidade, frenagem brusca, curvas acentuadas e aceleração rápida.'
    },
    {
      title: 'Condutores Ativos',
      value: drivers.length,
      icon: TrendingUp,
      trend: '100% monitorados',
      trendUp: true,
      description: 'Condutores com telemetria',
      tooltip: 'Número total de condutores ativos com telemetria sendo monitorada no período atual.'
    },
    {
      title: 'Alertas Críticos',
      value: criticalEvents.length,
      icon: AlertTriangle,
      trend: `${criticalEventsLast30Days.length} nos últimos 30 dias`,
      trendUp: false,
      description: 'Eventos de alta severidade',
      tooltip: 'Eventos considerados de alta severidade: excesso de velocidade e frenagem brusca. Estes eventos têm maior impacto no score de risco.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <metric.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </span>
              <Tooltip content={metric.tooltip}>
                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help opacity-0 group-hover:opacity-100 transition-opacity" />
              </Tooltip>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
          <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TelemetryOverview;