import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentProgressStore } from '../store/assessmentProgressStore';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AssessmentResult = () => {
  const navigate = useNavigate();
  const progress = useAssessmentProgressStore((state) => state.currentProgress);
  const resetProgress = useAssessmentProgressStore((state) => state.resetProgress);

  if (!progress || !progress.isComplete) {
    navigate('/');
    return null;
  }

  const handleFinish = () => {
    resetProgress();
    navigate('/');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertCircle;
    return XCircle;
  };

  const ScoreIcon = getScoreIcon(progress.score || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <ScoreIcon className={`w-16 h-16 mx-auto ${getScoreColor(progress.score || 0)}`} />
          </div>

          <h1 className="text-2xl font-bold mb-2">Avaliação Concluída</h1>
          <p className="text-gray-600 mb-6">
            Você completou a avaliação de conhecimento
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-4xl font-bold mb-2 ${getScoreColor(progress.score || 0)}">
              {Math.round(progress.score || 0)}%
            </div>
            <p className="text-gray-600">
              {progress.score && progress.score >= 70
                ? 'Parabéns! Você foi aprovado na avaliação.'
                : 'Infelizmente você não atingiu a pontuação mínima necessária.'}
            </p>
          </div>

          <div className="space-y-4 text-left mb-8">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total de Questões</span>
              <span className="font-medium">{progress.questions.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Respostas Corretas</span>
              <span className="font-medium text-green-600">
                {Object.entries(progress.answers).reduce((acc, [questionId, answerIndex]) => {
                  const question = progress.questions.find(q => q.id === questionId);
                  return acc + (question?.alternativaCorreta === answerIndex ? 1 : 0);
                }, 0)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tempo Total</span>
              <span className="font-medium">
                {Math.floor((progress.questions.length * 2) - (progress.timeRemaining / 60))} minutos
              </span>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;