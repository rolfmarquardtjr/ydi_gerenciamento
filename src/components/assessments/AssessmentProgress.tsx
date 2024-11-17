import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { AssessmentType } from '../../store/assessmentTypes';

interface AssessmentProgressProps {
  currentTest: AssessmentType;
  completedTests: AssessmentType[];
  scores: Record<AssessmentType, number | null>;
}

const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentTest,
  completedTests,
  scores
}) => {
  const tests = [
    { 
      type: 'knowledge' as AssessmentType,
      icon: CheckCircle,
      label: 'Conhecimento',
      description: 'Regras de trânsito e legislação'
    },
    {
      type: 'reaction' as AssessmentType,
      icon: Clock,
      label: 'Tempo de Reação',
      description: 'Avaliação de reflexos'
    },
    {
      type: 'risk' as AssessmentType,
      icon: AlertTriangle,
      label: 'Análise de Riscos',
      description: 'Tomada de decisão'
    },
    {
      type: 'maintenance' as AssessmentType,
      icon: Wrench,
      label: 'Manutenção',
      description: 'Conhecimentos técnicos'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Progresso da Avaliação</h2>
      <div className="space-y-6">
        {tests.map((test, index) => {
          const isCompleted = completedTests.includes(test.type);
          const isCurrent = currentTest === test.type;
          const score = scores[test.type];

          return (
            <div key={test.type} className="relative">
              {/* Progress Line */}
              {index < tests.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex items-start relative">
                {/* Status Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100' :
                  isCurrent ? 'bg-primary-100' :
                  'bg-gray-100'
                }`}>
                  <test.icon className={`w-5 h-5 ${
                    isCompleted ? 'text-green-600' :
                    isCurrent ? 'text-primary-600' :
                    'text-gray-400'
                  }`} />
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      isCompleted ? 'text-green-600' :
                      isCurrent ? 'text-primary-600' :
                      'text-gray-500'
                    }`}>
                      {test.label}
                    </h3>
                    {score !== null && (
                      <span className={`text-sm font-medium ${
                        score >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {score}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {test.description}
                  </p>
                  {isCurrent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                      Em andamento
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentProgress;