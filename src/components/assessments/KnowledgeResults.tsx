import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Download, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useKnowledgeAssessmentStore } from '../../store/knowledgeAssessmentStore';

const KnowledgeResults = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getLatestResult, getConfig } = useKnowledgeAssessmentStore();

  const result = user ? getLatestResult(user.id) : null;
  const config = user?.companyId ? getConfig(user.companyId) : null;

  if (!result || !config) {
    navigate('/driver/dashboard');
    return null;
  }

  const passed = result.score >= config.passingScore;
  const timeSpentMinutes = Math.floor(result.timeSpent / 60);
  const timeSpentSeconds = result.timeSpent % 60;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resultado da Avaliação
                </h1>
                <p className="text-gray-600">
                  {new Date(result.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700">
              <Download className="w-5 h-5 mr-2" />
              Baixar PDF
            </button>
          </div>

          {/* Score Overview */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              {passed ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-2 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.round(result.score)}%
              </h2>
              <p className="text-gray-600">
                Nota mínima para aprovação: {config.passingScore}%
              </p>
              <p className={`text-lg font-medium mt-4 ${
                passed ? 'text-green-800' : 'text-red-800'
              }`}>
                {passed ? 'Aprovado' : 'Não atingiu a pontuação mínima'}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Tempo Total
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {String(timeSpentMinutes).padStart(2, '0')}:
                {String(timeSpentSeconds).padStart(2, '0')}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Questões Respondidas
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(result.answers).length}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Próxima Tentativa
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {config.allowRetake 
                  ? `${config.retakeInterval} dias`
                  : 'Não permitido'}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Recomendações
            </h3>
            <div className="space-y-3">
              {passed ? (
                <>
                  <p className="text-blue-800">
                    Parabéns pela aprovação! Para manter seu conhecimento atualizado:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Continue estudando as atualizações da legislação de trânsito
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Pratique regularmente as boas práticas de direção defensiva
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Compartilhe seu conhecimento com outros condutores
                      </span>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-blue-800">
                    Para melhorar seu desempenho na próxima tentativa:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Revise o material de estudo fornecido
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Foque nos tópicos onde teve mais dificuldade
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2" />
                      <span className="text-blue-800">
                        Pratique com questões similares antes da próxima tentativa
                      </span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Back Button */}
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

export default KnowledgeResults;