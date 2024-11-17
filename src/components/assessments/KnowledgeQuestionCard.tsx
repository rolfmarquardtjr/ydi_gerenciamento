import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import { KnowledgeQuestion } from '../../store/knowledgeAssessmentStore';

interface KnowledgeQuestionCardProps {
  question: KnowledgeQuestion;
  selectedAnswer: number | undefined;
  onAnswer: (questionId: string, answerIndex: number) => void;
  onNext: () => void;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
}

const KnowledgeQuestionCard: React.FC<KnowledgeQuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswer,
  onNext,
  currentQuestion,
  totalQuestions,
  timeRemaining
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      {/* Progress and Timer */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Questão {currentQuestion + 1} de {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
          <Clock className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-mono text-lg">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question Type Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
          {question.tipo}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.questao}
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {question.alternativas.map((alternativa, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAnswer(question.id, index)}
            className={`w-full text-left p-6 rounded-xl transition-all ${
              selectedAnswer === index
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <span className={`w-8 h-8 flex items-center justify-center text-lg font-semibold rounded-full mr-4 ${
                selectedAnswer === index
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-500 border-2 border-gray-300'
              }`}>
                {['A', 'B', 'C', 'D'][index]}
              </span>
              <span className={`text-lg ${
                selectedAnswer === index ? 'text-primary-900' : 'text-gray-700'
              }`}>
                {alternativa.texto}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={selectedAnswer === undefined}
          className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
            selectedAnswer === undefined
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {currentQuestion === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

export default KnowledgeQuestionCard;