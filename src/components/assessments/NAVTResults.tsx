import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Download } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNAVTAssessmentStore } from '../../store/navtAssessmentStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const NAVTResults = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getLatestResult } = useNAVTAssessmentStore();

  const result = user ? getLatestResult(user.id) : null;

  if (!result) {
    navigate('/driver/dashboard');
    return null;
  }

  const radarData = [
    { subject: 'Navegação (N)', value: (result.scores.N / 20) * 100 },
    { subject: 'Áudio (A)', value: (result.scores.A / 20) * 100 },
    { subject: 'Volante (V)', value: (result.scores.V / 20) * 100 },
    { subject: 'Teoria (T)', value: (result.scores.T / 20) * 100 },
  ];

  const getProfileDescription = (profile: string) => {
    switch (profile) {
      case 'EVA':
        return 'Explorador Visual-Auditivo: Aprende melhor através de recursos visuais e explicações verbais.';
      case 'PT':
        return 'Praticante Teórico: Combina experiência prática com fundamentação teórica.';
      case 'AAT':
        return 'Analista Auditivo-Teórico: Processa informações através de explicações verbais e análise teórica.';
      case 'VP':
        return 'Visionário Prático: Aprende visualizando e executando tarefas práticas.';
      default:
        return 'Perfil personalizado baseado em suas preferências de aprendizagem.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Seu Perfil de Aprendizagem NAVT
                </h1>
                <p className="text-gray-600">
                  Resultados baseados em suas respostas
                </p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700">
              <Download className="w-5 h-5 mr-2" />
              Baixar PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuição de Preferências
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar
                      name="Preferências"
                      dataKey="value"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profile Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfil Dominante
                </h3>
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="font-medium text-primary-900">
                    {result.dominantProfile}
                  </p>
                  <p className="text-sm text-primary-700 mt-1">
                    {getProfileDescription(result.dominantProfile)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfil Secundário
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {result.secondaryProfile}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getProfileDescription(result.secondaryProfile)}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 mr-2" />
                    <span className="text-yellow-800">
                      Priorize materiais visuais e explicações verbais durante o treinamento
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 mr-2" />
                    <span className="text-yellow-800">
                      Combine teoria com prática para melhor absorção do conhecimento
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 mr-2" />
                    <span className="text-yellow-800">
                      Utilize simulações e exercícios práticos para reforçar o aprendizado
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => navigate('/driver/dashboard')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NAVTResults;