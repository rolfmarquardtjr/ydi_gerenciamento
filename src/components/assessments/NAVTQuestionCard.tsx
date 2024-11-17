import React from 'react';
import { NAVTQuestion } from '../../store/navtAssessmentStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface NAVTQuestionCardProps {
  question: NAVTQuestion;
  selectedAnswer: string | undefined;
  onAnswer: (questionId: number, type: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentQuestion: number;
  totalQuestions: number;
}

const NAVTQuestionCard: React.FC<NAVTQuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  currentQuestion,
  totalQuestions
}) => {
  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <motion.div
      key={question.id}
      initial="enter"
      animate="center"
      exit="exit"
      variants={cardVariants}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50" />
      
      {/* Progress Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Questão {currentQuestion + 1} de {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(question.id, option.type)}
              className={`w-full text-left p-6 rounded-xl transition-all transform ${
                selectedAnswer === option.type
                  ? 'bg-primary-50 border-2 border-primary-500 shadow-md'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center text-lg font-semibold rounded-full mr-4 ${
                  selectedAnswer === option.type
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-500 border-2 border-gray-300'
                }`}>
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                <span className={`text-lg ${
                  selectedAnswer === option.type
                    ? 'text-primary-900 font-medium'
                    : 'text-gray-700'
                }`}>
                  {option.text}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center relative z-10">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
            isFirst
              ? 'opacity-0 cursor-default'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Anterior
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentQuestion ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={!selectedAnswer}
          className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
            !selectedAnswer
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isLast ? 'Finalizar' : 'Próxima'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

export default NAVTQuestionCard;