import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useKnowledgeAssessmentStore } from '../../store/knowledgeAssessmentStore';
import KnowledgeQuestionCard from './KnowledgeQuestionCard';
import { CheckCircle } from 'lucide-react';

const KnowledgeAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getConfig, getQuestions, addResult } = useKnowledgeAssessmentStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  // Get configuration and questions
  useEffect(() => {
    if (!user?.companyId) {
      navigate('/');
      return;
    }

    const config = getConfig(user.companyId);
    if (!config.enabled) {
      navigate('/driver/dashboard');
      return;
    }

    // Set initial time
    setTimeRemaining(config.timeLimit * 60);

    // Get and prepare questions
    const allQuestions = getQuestions(user.companyId);
    const questionsByType = allQuestions.reduce((acc: Record<string, any[]>, question) => {
      acc[question.tipo] = acc[question.tipo] || [];
      acc[question.tipo].push(question);
      return acc;
    }, {});

    let selected: any[] = [];
    Object.entries(questionsByType).forEach(([_, questions]) => {
      const typeQuestions = config.shuffleQuestions 
        ? [...questions].sort(() => Math.random() - 0.5)
        : [...questions];
      
      selected = selected.concat(typeQuestions.slice(0, config.questionsPerType));
    });

    if (config.shuffleQuestions) {
      selected.sort(() => Math.random() - 0.5);
    }

    setSelectedQuestions(selected.slice(0, config.totalQuestions));
  }, [user, navigate]);

  // Timer
  useEffect(() => {
    if (!showIntro && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            calculateResults();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showIntro, timeRemaining]);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    if (!user?.companyId) return;

    const totalQuestions = selectedQuestions.length;
    const correctAnswers = Object.entries(answers).reduce((acc, [questionId, answerIndex]) => {
      const question = selectedQuestions.find(q => q.id === questionId);
      return acc + (question?.alternativas[answerIndex].correta ? 1 : 0);
    }, 0);

    const score = (correctAnswers / totalQuestions) * 100;

    const result = {
      id: `knowledge-result-${Date.now()}`,
      userId: user.id,
      companyId: user.companyId,
      date: new Date().toISOString(),
      score,
      answers,
      timeSpent: timeRemaining
    };

    addResult(result);
    setIsComplete(true);
    
    setTimeout(() => {
      navigate('/driver/knowledge-results');
    }, 1500);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Avaliação de Conhecimento
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-6">
              Esta avaliação testará seus conhecimentos sobre direção segura,
              legislação e boas práticas.
            </p>
            <div className="space-y-4 text-left mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Instruções:</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>Você terá {Math.floor(timeRemaining / 60)} minutos para completar a avaliação</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>São {selectedQuestions.length} questões de múltipla escolha</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>Você não poderá voltar às questões anteriores</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>A avaliação será encerrada automaticamente ao fim do tempo</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowIntro(false)}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Começar Avaliação
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Avaliação Concluída!
          </h2>
          <p className="text-gray-600">
            Redirecionando para seus resultados...
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <KnowledgeQuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            currentQuestion={currentQuestionIndex}
            totalQuestions={selectedQuestions.length}
            timeRemaining={timeRemaining}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KnowledgeAssessment;