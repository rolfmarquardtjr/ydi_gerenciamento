import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useRiskScenariosStore } from '../../store/riskScenariosStore';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';

interface RiskAnalysisTestProps {
  timeLimit: number;
  onComplete: (score: number) => void;
}

const RiskAnalysisTest: React.FC<RiskAnalysisTestProps> = ({ timeLimit, onComplete }) => {
  const { user } = useAuthStore();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [answers, setAnswers] = useState<{ scenarioId: string; optionId: string; correct: boolean }[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<any[]>([]);

  const getScenariosByCompany = useRiskScenariosStore(state => state.getScenariosByCompany);
  const config = useAssessmentConfigStore(state =>
    user?.companyId ? state.getConfigsByCompany(user.companyId).find(c => c.type === 'risk') : null
  );

  // Initialize scenarios
  useEffect(() => {
    if (user?.companyId && config) {
      const allScenarios = getScenariosByCompany(user.companyId);
      
      // Shuffle and select scenarios based on config
      const shuffledScenarios = [...allScenarios].sort(() => Math.random() - 0.5);
      setSelectedScenarios(shuffledScenarios.slice(0, config.scenarios || 5));
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

  const handleOptionSelect = (optionId: string) => {
    if (!showExplanation) {
      setSelectedOption(optionId);
    }
  };

  const handleNext = () => {
    if (!selectedOption || !selectedScenarios.length) return;

    const scenario = selectedScenarios[currentScenario];
    const selectedAnswer = scenario.options.find(opt => opt.id === selectedOption);
    
    setAnswers(prev => [...prev, {
      scenarioId: scenario.id,
      optionId: selectedOption,
      correct: selectedAnswer?.isCorrect || false
    }]);

    if (currentScenario < selectedScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!selectedScenarios.length) return;

    const totalScenarios = selectedScenarios.length;
    const correctAnswers = answers.filter(a => a.correct).length;
    const score = (correctAnswers / totalScenarios) * 100;
    
    onComplete(score);
  };

  if (!selectedScenarios.length) return null;

  const scenario = selectedScenarios[currentScenario];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Análise de Riscos</h2>
          <p className="text-sm text-gray-600">
            Cenário {currentScenario + 1} de {selectedScenarios.length}
          </p>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-mono">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Scenario */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analise o Cenário
            </h3>
            <p className="text-gray-600 mb-4">{scenario.description}</p>
          </div>
        </div>

        {scenario.imageUrl && (
          <img
            src={scenario.imageUrl}
            alt="Cenário de risco"
            className="w-full rounded-lg mb-4"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {scenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedOption === option.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <p className="text-gray-900">{option.text}</p>
            {showExplanation && selectedOption === option.id && (
              <p className={`mt-2 text-sm ${
                option.isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {option.explanation}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end">
        {!showExplanation && selectedOption && (
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
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {currentScenario < selectedScenarios.length - 1 ? 'Próximo Cenário' : 'Finalizar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskAnalysisTest;