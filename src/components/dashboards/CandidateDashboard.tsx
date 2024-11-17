import React from 'react';
import { Brain, CheckCircle, Clock, AlertTriangle, Wrench, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCandidateStore } from '../../store/candidateStore';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';
import { AssessmentType } from '../../store/assessmentTypes';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isTestCompleted, getAssessmentProgress } = useCandidateStore();
  const configs = useAssessmentConfigStore(state => 
    user?.companyId ? state.getConfigsByCompany(user.companyId) : []
  );

  // Filter only enabled tests and sort by order
  const enabledTests = configs
    .filter(config => config.enabled)
    .sort((a, b) => a.order - b.order);

  // Get first incomplete test
  const getNextTest = () => {
    if (!user) return null;
    return enabledTests.find(test => !isTestCompleted(user.id, test.type));
  };

  const currentTest = getNextTest();

  const getTestStatus = (type: AssessmentType) => {
    if (!user) return 'pending';
    const completed = isTestCompleted(user.id, type);
    if (completed) return 'completed';
    const progress = getAssessmentProgress(user.id, type);
    if (progress && !progress.isCompleted) return 'in-progress';
    return 'pending';
  };

  const startTest = (type: AssessmentType) => {
    navigate(`/assessment/${type}`);
  };

  const getTestInfo = (type: AssessmentType) => {
    switch (type) {
      case 'knowledge':
        return {
          title: 'Conhecimento de Trânsito',
          description: 'Avalie seu conhecimento sobre regras e legislação de trânsito.',
          icon: CheckCircle,
          duration: '20 minutos',
          questions: 'Múltipla escolha'
        };
      case 'reaction':
        return {
          title: 'Tempo de Reação',
          description: 'Teste seus reflexos e capacidade de resposta rápida.',
          icon: Clock,
          duration: '5 minutos',
          questions: 'Teste prático'
        };
      case 'risk':
        return {
          title: 'Análise de Riscos',
          description: 'Avalie situações de risco e tome decisões adequadas.',
          icon: AlertTriangle,
          duration: '15 minutos',
          questions: 'Cenários práticos'
        };
      case 'maintenance':
        return {
          title: 'Manutenção Preventiva',
          description: 'Demonstre seu conhecimento sobre cuidados com o veículo.',
          icon: Wrench,
          duration: '10 minutos',
          questions: 'Múltipla escolha'
        };
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Processo Seletivo
        </h1>
        <p className="text-gray-600 mt-1">
          Complete todas as etapas da avaliação para concorrer à vaga
        </p>
      </div>

      {/* Current Test Card */}
      {currentTest && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">Próxima Avaliação</h2>
                <p className="text-gray-600">Continue seu processo seletivo</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-primary-900">
                  {getTestInfo(currentTest.type)?.title}
                </h3>
                <p className="text-primary-700 mt-1">
                  {getTestInfo(currentTest.type)?.description}
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-primary-600 mr-1" />
                    <span className="text-sm text-primary-700">
                      {Math.floor(currentTest.timeLimit / 60)} minutos
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-primary-600 mr-1" />
                    <span className="text-sm text-primary-700">
                      {getTestInfo(currentTest.type)?.questions}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => startTest(currentTest.type)}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Iniciar Avaliação
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Etapas do Processo</h2>
        <div className="space-y-6">
          {enabledTests.map((test, index) => {
            const info = getTestInfo(test.type);
            const Icon = info?.icon || Brain;
            const status = getTestStatus(test.type);
            const progress = getAssessmentProgress(user?.id || '', test.type);

            return (
              <div key={test.type} className="relative">
                {/* Progress Line */}
                {index < enabledTests.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                )}

                <div className="flex items-start relative">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === 'completed' ? 'bg-green-100' :
                    status === 'in-progress' ? 'bg-yellow-100' :
                    status === 'pending' && test === currentTest ? 'bg-primary-100' :
                    'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      status === 'completed' ? 'text-green-600' :
                      status === 'in-progress' ? 'text-yellow-600' :
                      status === 'pending' && test === currentTest ? 'text-primary-600' :
                      'text-gray-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        status === 'completed' ? 'text-green-600' :
                        status === 'in-progress' ? 'text-yellow-600' :
                        status === 'pending' && test === currentTest ? 'text-primary-600' :
                        'text-gray-500'
                      }`}>
                        {info?.title}
                      </h3>
                      {progress?.score !== undefined && (
                        <span className={`text-sm font-medium ${
                          progress.score >= test.passingScore ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(progress.score)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {info?.description}
                    </p>
                    {status === 'completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        Concluído
                      </span>
                    )}
                    {status === 'in-progress' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                        Em andamento
                      </span>
                    )}
                    {status === 'pending' && test === currentTest && (
                      <button
                        onClick={() => startTest(test.type)}
                        className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Iniciar agora →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;