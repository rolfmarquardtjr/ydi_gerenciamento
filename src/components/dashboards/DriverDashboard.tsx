import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, ChevronRight, Award, AlertTriangle, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNAVTAssessmentStore } from '../../store/navtAssessmentStore';
import { useKnowledgeAssessmentStore } from '../../store/knowledgeAssessmentStore';
import { useTelemetryStore } from '../../store/telemetryStore';
import { useRiskAnalysisStore } from '../../store/riskAnalysisStore';

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getConfig: getNAVTConfig, getLatestResult: getLatestNAVTResult } = useNAVTAssessmentStore();
  const { getConfig: getKnowledgeConfig, getLatestResult: getLatestKnowledgeResult, canTakeAssessment } = useKnowledgeAssessmentStore();
  const getEventsByOperator = useTelemetryStore(state => state.getEventsByOperator);
  const analyzeRisk = useRiskAnalysisStore(state => state.analyzeRisk);

  // Get configurations and results
  const navtConfig = user?.companyId ? getNAVTConfig(user.companyId) : null;
  const knowledgeConfig = user?.companyId ? getKnowledgeConfig(user.companyId) : null;
  const navtResult = user ? getLatestNAVTResult(user.id) : null;
  const knowledgeResult = user ? getLatestKnowledgeResult(user.id) : null;
  const canTakeKnowledgeAssessment = user?.companyId ? canTakeAssessment(user.id, user.companyId) : false;

  // Get telemetry data
  const driverEvents = user ? getEventsByOperator(user.id) : [];
  const riskAnalysis = driverEvents.length > 0 ? analyzeRisk(driverEvents, user?.id || '') : null;

  // Calculate recent events
  const recentEvents = driverEvents
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Meu Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe seu desempenho e avaliações
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <span className={`text-sm font-medium ${
              (riskAnalysis?.score || 0) >= 70 ? 'text-green-600' : 'text-red-600'
            }`}>
              {riskAnalysis?.score ? `${riskAnalysis.score}%` : 'N/A'}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Score Geral</h3>
          <p className="text-xs text-gray-500 mt-1">Baseado em telemetria</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {driverEvents.length}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Eventos Registrados</h3>
          <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Brain className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-primary-600">
              {navtResult ? 'Completo' : 'Pendente'}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Perfil NAVT</h3>
          <p className="text-xs text-gray-500 mt-1">Estilo de aprendizagem</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-primary-600">
              {knowledgeResult ? `${knowledgeResult.score}%` : 'Pendente'}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Conhecimento</h3>
          <p className="text-xs text-gray-500 mt-1">Avaliação teórica</p>
        </div>
      </div>

      {/* NAVT Assessment Section */}
      {navtConfig?.enabled && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold">Avaliação NAVT</h2>
                <p className="text-gray-600">
                  Descubra seu perfil de aprendizagem
                </p>
              </div>
            </div>
          </div>

          {!navtResult ? (
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-primary-900 mb-4">
                Descubra como você aprende melhor através da avaliação NAVT.
              </p>
              <button
                onClick={() => navigate('/driver/navt-assessment')}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Iniciar Avaliação
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-900 font-medium">
                    Perfil: {navtResult.dominantProfile}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Realizado em {new Date(navtResult.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/driver/navt-results')}
                  className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700"
                >
                  Ver Resultados
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Knowledge Assessment Section */}
      {knowledgeConfig?.enabled && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold">Avaliação de Conhecimento</h2>
                <p className="text-gray-600">
                  Teste seus conhecimentos sobre direção segura
                </p>
              </div>
            </div>
          </div>

          {!knowledgeResult ? (
            <div className="bg-primary-50 rounded-lg p-6">
              <p className="text-primary-900 mb-4">
                Avalie seus conhecimentos sobre direção segura, legislação e boas práticas.
              </p>
              <button
                onClick={() => navigate('/driver/knowledge-assessment')}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Iniciar Avaliação
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-900 font-medium">
                    Pontuação: {knowledgeResult.score}%
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Realizado em {new Date(knowledgeResult.date).toLocaleDateString()}
                  </p>
                </div>
                {canTakeKnowledgeAssessment && (
                  <button
                    onClick={() => navigate('/driver/knowledge-assessment')}
                    className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700"
                  >
                    Refazer Avaliação
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Eventos Recentes</h2>
          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.evento}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.data).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.evento.includes('Excesso') || event.evento.includes('Brusca')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.evento.includes('Excesso') || event.evento.includes('Brusca')
                    ? 'Crítico'
                    : 'Alerta'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;