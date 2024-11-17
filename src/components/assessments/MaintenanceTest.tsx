import React, { useState, useEffect } from 'react';
import { Timer, Wrench, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMaintenanceQuestionsStore } from '../../store/maintenanceQuestionsStore';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';

interface MaintenanceTestProps {
  timeLimit: number;
  onComplete: (score: number) => void;
}

const MaintenanceTest: React.FC<MaintenanceTestProps> = ({ timeLimit, onComplete }) => {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  const getQuestionsByCompany = useMaintenanceQuestionsStore(state => state.getQuestionsByCompany);
  const config = useAssessmentConfigStore(state =>
    user?.companyId ? state.getConfigsByCompany(user.companyId).find(c => c.type === 'maintenance') : null
  );

  // Preparar questões baseado na configuração
  useEffect(() => {
    if (user?.companyId && config) {
      const allQuestions = getQuestionsByCompany(user.companyId);
      
      // Embaralhar questões se configurado
      const shuffledQuestions = config.shuffleQuestions 
        ? [...allQuestions].sort(() => Math.random() - 0.5)
        : [...allQuestions];

      // Selecionar número configurado de questões
      const questionsToUse = shuffledQuestions.slice(0, config.questions || 20);

      // Embaralhar alternativas se configurado
      const processedQuestions = questionsToUse.map(question => {
        if (config.shuffleAlternatives) {
          const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
          return { ...question, options: shuffledOptions };
        }
        return question;
      });

      setSelectedQuestions(processedQuestions);
    }
  }, [user?.companyId, config]);

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (optionId: string) => {
    if (!showExplanation) {
      setSelectedAnswer(optionId);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer || !selectedQuestions.length) return;

    const question = selectedQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [question.id]: selectedAnswer
    }));

    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!selectedQuestions.length) return;

    const totalQuestions = selectedQuestions.length;
    const correctAnswers = Object.entries(answers).reduce((acc, [questionId, answerId]) => {
      const question = selectedQuestions.find(q => q.id === questionId);
      const selectedOption = question?.options.find(opt => opt.id === answerId);
      return acc + (selectedOption?.isCorrect ? 1 : 0);
    }, 0);

    const score = (correctAnswers / totalQuestions) * 100;
    onComplete(score);
  };

  if (!selectedQuestions.length) return null;

  const question = selectedQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Manutenção Preventiva</h2>
          <p className="text-sm text-gray-600">
            Questão {currentQuestion + 1} de {selectedQuestions.length}
          </p>
        </div>
        <div className="flex items-center text-gray-600">
          <Timer className="w-5 h-5 mr-2" />
          <span className="font-mono">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Questão */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start space-x-4">
          <Wrench className="w-6 h-6 text-primary-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.question}
            </h3>
            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Ilustração da questão"
                className="w-full rounded-lg mb-4"
              />
            )}
          </div>
        </div>

        {/* Alternativas */}
        <div className="space-y-4 mt-6">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === option.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <p className="text-gray-900">{option.text}</p>
              {showExplanation && selectedAnswer === option.id && (
                <p className={`mt-2 text-sm ${
                  option.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {option.explanation}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentQuestion + 1} de {selectedQuestions.length} questões
        </div>
        <div className="flex space-x-4">
          {!showExplanation && selectedAnswer && (
            <button
              onClick={() => setShowExplanation(true)}
              className="px-4 py-2 text-primary-600 hover:text-primary-700"
            >
              Ver Explicação
            </button>
          )}
          {showExplanation && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {currentQuestion === selectedQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
            </button>
          )}
        </div>
      </div>

      {/* Aviso de Tempo */}
      {timeRemaining <= 300 && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center shadow-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-700">
            Atenção: Restam apenas {Math.floor(timeRemaining / 60)} minutos!
          </p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTest;