import React from 'react';
import { SelectionProcessConfig } from '../../../store/selectionProcessStore';

interface WeightSettingsProps {
  config: SelectionProcessConfig;
  onSave: (config: Partial<SelectionProcessConfig>) => void;
}

const WeightSettings: React.FC<WeightSettingsProps> = ({ config, onSave }) => {
  const handleWeightChange = (test: keyof typeof config.weights, value: number) => {
    onSave({
      weights: {
        ...config.weights,
        [test]: value
      }
    });
  };

  const tests = [
    { key: 'psychosocialTest', label: 'Teste Psicossocial', defaultValue: 25 },
    { key: 'reactionTime', label: 'Tempo de Reação', defaultValue: 20 },
    { key: 'theoreticalKnowledge', label: 'Conhecimento Teórico', defaultValue: 20 },
    { key: 'riskManagement', label: 'Gestão de Riscos', defaultValue: 20 },
    { key: 'economicDriving', label: 'Direção Econômica', defaultValue: 15 }
  ];

  return (
    <div className="space-y-8">
      {tests.map((test) => (
        <div key={test.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {test.label}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={config.weights[test.key as keyof typeof config.weights]}
              onChange={(e) => handleWeightChange(test.key as keyof typeof config.weights, Number(e.target.value))}
              className="flex-1"
            />
            <div className="w-16 text-right">
              <span className="text-sm font-medium text-gray-900">
                {config.weights[test.key as keyof typeof config.weights]}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${config.weights[test.key as keyof typeof config.weights]}%` }}
            />
          </div>
        </div>
      ))}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          A soma dos pesos deve ser igual a 100%
        </p>
      </div>
    </div>
  );
};

export default WeightSettings;