import React from 'react';
import { Users, Brain, AlertTriangle, TrendingUp, MapPin, Activity, CheckCircle } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useCandidateStore } from '../../store/candidateStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import { useRiskAnalysisStore } from '../../store/riskAnalysisStore';
import RiskEventMap from '../RiskEventMap';
import TelemetryStats from '../TelemetryStats';
import DriverRiskList from '../DriverRiskList';

const ManagerDashboard = () => {
  const { user: currentUser } = useAuthStore();
  const getUsersByCompany = useUserStore((state) => state.getUsersByCompany);
  const getCandidatesByCompany = useCandidateStore((state) => state.getCandidatesByCompany);
  const getEventsByCompany = useTelemetryStore((state) => state.getEventsByCompany);

  // Get company data
  const companyUsers = currentUser?.companyId ? getUsersByCompany(currentUser.companyId) : [];
  const candidates = currentUser?.companyId ? getCandidatesByCompany(currentUser.companyId) : [];
  const events = currentUser?.companyId ? getEventsByCompany(currentUser.companyId) : [];
  
  const drivers = companyUsers.filter(user => user.perfil === 'Condutor');
  const activeDrivers = drivers.length;

  // Calculate driver performance metrics
  const driverScores = drivers.map(driver => {
    const driverEvents = events.filter(e => e.id_operador === driver.id_operador);
    const analysis = useRiskAnalysisStore.getState().analyzeRisk(driverEvents, driver.id_operador);
    return analysis.score;
  });

  // Drivers by performance level
  const excellentDrivers = driverScores.filter(score => score >= 80).length;
  const criticalDrivers = driverScores.filter(score => score < 40).length;

  // Calculate recruitment metrics
  const approvedCandidates = candidates.filter(c => c.status === 'approved').length;
  const pendingCandidates = candidates.filter(c => c.status === 'pending').length;

  // Calculate risk metrics
  const criticalEvents = events.filter(event => 
    event.evento === 'Excesso de Velocidade' || event.evento === 'Frenagem Brusca'
  ).length;

  const riskRate = Math.round((criticalEvents / events.length) * 100) || 0;

  const metrics = [
    {
      id: '1',
      title: 'Score da Frota',
      value: `${Math.round(driverScores.reduce((a, b) => a + b, 0) / driverScores.length || 0)}`,
      icon: Activity,
      trend: `${excellentDrivers} excelentes`,
      trendUp: true,
      description: `${criticalDrivers} críticos`
    },
    {
      id: '2',
      title: 'Eventos Críticos',
      value: criticalEvents.toString(),
      icon: AlertTriangle,
      trend: `${riskRate}% da frota`,
      trendUp: false,
      description: 'Últimos 30 dias'
    },
    {
      id: '3',
      title: 'Recrutamento',
      value: pendingCandidates.toString(),
      icon: Users,
      trend: `${approvedCandidates} aprovados`,
      trendUp: true,
      description: 'Candidatos em processo'
    },
    {
      id: '4',
      title: 'Condutores Ativos',
      value: activeDrivers.toString(),
      icon: CheckCircle,
      trend: 'Total monitorado',
      trendUp: true,
      description: 'Em operação'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Painel de Controle
          </h1>
          <p className="text-gray-600 mt-1">
            Análise de desempenho e indicadores
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-primary-600" />
              </div>
              <span className={`text-sm font-medium ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Risk Map and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Map */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Mapa de Eventos de Risco</h2>
          <div className="h-[400px]">
            <RiskEventMap events={events} />
          </div>
        </div>

        {/* Telemetry Stats */}
        <div>
          <TelemetryStats events={events} />
        </div>
      </div>

      {/* Driver Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Risk List */}
        <div className="lg:col-span-2">
          <DriverRiskList drivers={drivers} />
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Análise de Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Excelente (80-100)</span>
                <span className="font-medium text-green-600">{excellentDrivers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(excellentDrivers / drivers.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Regular (40-79)</span>
                <span className="font-medium text-yellow-600">
                  {driverScores.filter(score => score >= 40 && score < 80).length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(driverScores.filter(score => score >= 40 && score < 80).length / drivers.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Crítico (0-39)</span>
                <span className="font-medium text-red-600">{criticalDrivers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(criticalDrivers / drivers.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Insights IA</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {criticalEvents > 0 ? 
                    `${criticalEvents} eventos críticos requerem atenção imediata` :
                    'Nenhum evento crítico registrado no período'
                  }
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {criticalDrivers > 0 ?
                    `${criticalDrivers} condutores precisam de reciclagem` :
                    'Todos os condutores com performance adequada'
                  }
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {pendingCandidates > 0 ?
                    `${pendingCandidates} candidatos aguardando avaliação` :
                    'Nenhum candidato pendente de avaliação'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;