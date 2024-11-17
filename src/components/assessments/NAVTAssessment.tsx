import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useNAVTAssessmentStore } from '../../store/navtAssessmentStore';
import NAVTQuestionCard from './NAVTQuestionCard';
import { CheckCircle } from 'lucide-react';

const NAVTAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { questions, getConfig, addResult, getLatestResult } = useNAVTAssessmentStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showIntro, setShowIntro] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(0);

  // Verificações de permissão e configuração
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

    const latestResult = getLatestResult(user.id);

    if (latestResult && !config.allowRetake) {
      navigate('/driver/dashboard');
      return;
    }

    if (latestResult && config.allowRetake) {
      const lastTestDate = new Date(latestResult.date);
      const daysSinceLastTest = Math.floor(
        (Date.now() - lastTestDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastTest < config.retakeInterval) {
        navigate('/driver/dashboard');
        return;
      }
    }
  }, [user, navigate]);

  const handleAnswer = (questionId: number, type: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: type
    }));

    // Automatically move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setDirection(1);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateResults();
      }
    }, 500);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    if (!user?.companyId) return;

    const scores = {
      N: 0,
      A: 0,
      V: 0,
      T: 0
    };

    Object.entries(answers).forEach(([_, type]) => {
      scores[type as keyof typeof scores]++;
    });

    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const normalized = {
      N: (scores.N / total) * 100,
      A: (scores.A / total) * 100,
      V: (scores.V / total) * 100,
      T: (scores.T / total) * 100
    };

    const profiles = [
      { type: 'EVA', score: normalized.N + normalized.A },
      { type: 'PT', score: normalized.V + normalized.T },
      { type: 'AAT', score: normalized.A + normalized.T },
      { type: 'VP', score: normalized.N + normalized.V }
    ].sort((a, b) => b.score - a.score);

    const result = {
      id: `navt-result-${Date.now()}`,
      userId: user.id,
      companyId: user.companyId,
      date: new Date().toISOString(),
      scores,
      dominantProfile: profiles[0].type,
      secondaryProfile: profiles[1].type
    };

    addResult(result);
    setIsComplete(true);
    
    setTimeout(() => {
      navigate('/driver/navt-results');
    }, 1500);
  };

  // Renderização da introdução
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Avaliação NAVT - Perfil de Aprendizagem
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-6">
              Esta avaliação ajudará a identificar seu estilo único de aprendizagem,
              permitindo personalizar seu treinamento e desenvolvimento.
            </p>
            <div className="space-y-4 text-left mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Instruções:</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>São {questions.length} questões de múltipla escolha</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>Não há respostas certas ou erradas</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>Escolha a opção que melhor reflete sua preferência</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span>Você pode revisar suas respostas antes de finalizar</span>
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

  // Renderização da tela de conclusão
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

  // Renderização das questões
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <NAVTQuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === questions.length - 1}
            currentQuestion={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NAVTAssessment;