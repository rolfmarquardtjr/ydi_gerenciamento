import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAssessmentStore } from '../../store/assessmentStore';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';

interface KnowledgeTestProps {
  timeLimit: number;
  onComplete: (score: number) => void;
}

const KnowledgeTest: React.FC<KnowledgeTestProps> = ({ timeLimit, onComplete }) => {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  const assessment = useAssessmentStore(state => 
    user?.companyId ? state.getAssessmentsByCompany(user.companyId, 'selection')[0] : null
  );

  const config = useAssessmentConfigStore(state =>
    user?.companyId ? state.getConfigsByCompany(user.companyId).find(c => c.type === 'knowledge') : null
  );

  // Prepare questions based on configuration
  useEffect(() => {
    if (assessment?.questions && config) {
      // Group questions by type
      const questionsByType = assessment.questions.reduce((acc: Record<string, any[]>, question) => {
        acc[question.tipo] = acc[question.tipo] || [];
        acc[question.tipo].push(question);
        return acc;
      }, {});

      // Select questions per type
      let selected: any[] = [];
      Object.entries(questionsByType).forEach(([tipo, questions]) => {
        // Get the specified number of questions for this type
        const typeQuestions = [...questions];
        if (config.shuffleQuestions) {
          typeQuestions.sort(() => Math.random() - 0.5);
        }
        
        // Take only the configured number of questions per type
        const questionsForType = typeQuestions.slice(0, config.questionsPerType || 2);
        selected = selected.concat(questionsForType);
      });

      // Shuffle final selection if needed
      if (config.shuffleQuestions) {
        selected.sort(() => Math.random() - 0.5);
      }

      // Limit to total questions configured
      const finalQuestions = selected.slice(0, config.totalQuestions || 20);

      // For each question, shuffle alternatives if configured
      const processedQuestions = finalQuestions.map(question => {
        if (config.shuffleAlternatives) {
          // Create pairs of [alternative, isCorrect]
          const alternatives = question.alternativas.map((alt: string, idx: number) => ({
            text: alt,
            isCorrect: idx === question.alternativaCorreta
          }));
          
          // Shuffle alternatives
          alternatives.sort(() => Math.random() - 0.5);
          
          // Update question with shuffled alternatives
          return {
            ...question,
            alternativas: alternatives.map(a => a.text),
            alternativaCorreta: alternatives.findIndex(a => a.isCorrect)
          };
        }
        return question;
      });

      setSelectedQuestions(processedQuestions);
    }
  }, [assessment, config]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null || !selectedQuestions.length) return;

    const question = selectedQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [question.id]: selectedAnswer
    }));

    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!selectedQuestions.length) return;

    const totalQuestions = selectedQuestions.length;
    const correctAnswers = Object.entries(answers).reduce((acc, [questionId, answer]) => {
      const question = selectedQuestions.find(q => q.id === questionId);
      return acc + (question?.alternativaCorreta === answer ? 1 : 0);
    }, 0);

    const score = (correctAnswers / totalQuestions) * 100;
    onComplete(score);
  };

  if (!selectedQuestions.length) return null;

  const question = selectedQuestions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Avaliação de Conhecimento</h2>
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

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-lg text-gray-900 mb-6">{question.questao}</p>

        {/* Alternatives */}
        <div className="space-y-4">
          {question.alternativas.map((alternativa: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block w-6 h-6 rounded-full border-2 mr-3 text-center leading-5 ${
                selectedAnswer === index
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300'
              }`}>
                {['A', 'B', 'C', 'D'][index]}
              </span>
              {alternativa}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentQuestion + 1} de {selectedQuestions.length} questões
        </div>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`px-6 py-2 rounded-lg ${
            selectedAnswer === null
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {currentQuestion === selectedQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeTest;