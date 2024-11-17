import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AssessmentConfig } from '../../store/assessmentTypes';

interface LocationState {
  finalScore: number;
  scores: Record<string, number>;
  configs: AssessmentConfig[];
}

const AssessmentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { finalScore, scores, configs } = state;

  const getTestName = (type: string) => {
    switch (type) {
      case 'knowledge':
        return 'Conhecimento';
      case 'reaction':
        return 'Tempo de Reação';
      case 'risk':
        return 'Análise de Riscos';
      case 'maintenance':
        return 'Manutenção';
      default:
        return type;
    }
  };

  const getScoreColor = (score: number, minScore: number) => {
    if (score >= minScore) return 'text-green-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number, minScore: number) => {
    if (score >= minScore) return CheckCircle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon(finalScore, configs[0]?.passingScore || 70);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="mb-6">
              <ScoreIcon className={`w-16 h-16 mx-auto ${
                getScoreColor(finalScore, configs[0]?.passingScore || 70)
              }`} />
            </div>

            <h1 className="text-2xl font-bold mb-2">Avaliação Concluída</h1>
            <p className="text-gray-600">
              Resultado final do processo seletivo
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <div className={`text-5xl font-bold mb-2 ${
              getScoreColor(finalScore, configs[0]?.passingScore || 70)
            }`}>
              {Math.round(finalScore)}%
            </div>
            <p className="text-gray-600">
              {finalScore >= (configs[0]?.passingScore || 70)
                ? 'Parabéns! Você foi aprovado no processo seletivo.'
                : 'Infelizmente você não atingiu a pontuação mínima necessária.'}
            </p>
          </div>

          {/* Individual Test Results */}
          <div className="space-y-4">
            {configs.map(config => {
              const score = scores[config.type] || 0;
              return (
                <div key={config.type} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {getTestName(config.type)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Peso: {config.weight}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Mínimo: {config.passingScore}%
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      getScoreColor(score, config.passingScore)
                    }`}>
                      {Math.round(score)}%
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        score >= config.passingScore ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/candidate/dashboard')}
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

export default AssessmentResult;