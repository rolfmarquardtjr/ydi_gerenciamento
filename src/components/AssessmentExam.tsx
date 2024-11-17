import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentProgressStore } from '../store/assessmentProgressStore';
import { Timer, AlertTriangle } from 'lucide-react';

const AssessmentExam = () => {
  const navigate = useNavigate();
  const progress = useAssessmentProgressStore((state) => state.currentProgress);
  const { answerQuestion, updateTimeRemaining, completeAssessment } = useAssessmentProgressStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  useEffect(() => {
    if (!progress) {
      navigate('/');
      return;
    }

    // Timer
    const timer = setInterval(() => {
      if (progress.timeRemaining > 0) {
        updateTimeRemaining(progress.timeRemaining - 1);
        
        // Show warning when 5 minutes remaining
        if (progress.timeRemaining === 300) {
          setShowTimeWarning(true);
        }
      } else {
        completeAssessment();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [progress, updateTimeRemaining, completeAssessment, navigate]);

  useEffect(() => {
    // Reset selected answer when question changes
    setSelectedAnswer(null);
  }, [progress?.currentQuestion]);

  if (!progress) return null;

  const currentQuestion = progress.questions[progress.currentQuestion];
  const timeRemaining = progress.timeRemaining;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    answerQuestion(currentQuestion.id, selectedAnswer);
    
    // If it's the last question or time's up, complete the assessment
    if (progress.currentQuestion === progress.questions.length - 1 || timeRemaining <= 0) {
      completeAssessment();
      navigate('/assessment-result');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Avaliação de Conhecimento</h1>
            <p className="text-sm text-gray-600">
              Questão {progress.currentQuestion + 1} de {progress.questions.length}
            </p>
          </div>
          <div className={`flex items-center ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-600'}`}>
            <Timer className="w-5 h-5 mr-2" />
            <span className="font-mono text-xl">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Time Warning */}
        {showTimeWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-700">
              Atenção: Restam apenas 5 minutos para concluir a avaliação!
            </p>
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <span className="text-sm font-medium text-primary-600 mb-2 block">
              {currentQuestion.tipo}
            </span>
            <p className="text-lg text-gray-900">{currentQuestion.questao}</p>
          </div>

          {/* Alternatives */}
          <div className="space-y-4">
            {currentQuestion.alternativas.map((alternativa, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedAnswer === index
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center border-2 rounded-full mr-3 ${
                    selectedAnswer === index
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300'
                  }">
                    {['A', 'B', 'C', 'D'][index]}
                  </span>
                  <span className="text-gray-700">{alternativa}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {progress.currentQuestion + 1} de {progress.questions.length} questões
          </div>
          <button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 rounded-lg ${
              selectedAnswer === null
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white`}
          >
            {progress.currentQuestion === progress.questions.length - 1 ? 'Finalizar' : 'Próxima'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentExam;