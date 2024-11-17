import React from 'react';
import { SelectionProcessConfig } from '../../../store/selectionProcessStore';

interface EliminationCriteriaProps {
  config: SelectionProcessConfig;
  onSave: (config: Partial<SelectionProcessConfig>) => void;
}

const EliminationCriteria: React.FC<EliminationCriteriaProps> = ({ config, onSave }) => {
  const criteria = [
    {
      key: 'psychosocialScore',
      label: 'Nota Mínima no Teste Psicossocial',
      unit: 'pontos',
      min: 0,
      max: 100
    },
    {
      key: 'reactionTime',
      label: 'Tempo Máximo de Reação',
      unit: 'ms',
      min: 100,
      max: 1000
    },
    {
      key: 'theoreticalScore',
      label: 'Nota Mínima no Teste Teórico',
      unit: 'pontos',
      min: 0,
      max: 100
    }
  ];

  const handleChange = (key: keyof typeof config.eliminationCriteria, value: number) => {
    onSave({
      eliminationCriteria: {
        ...config.eliminationCriteria,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {criteria.map((criterion) => (
        <div key={criterion.key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {criterion.label}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={criterion.min}
              max={criterion.max}
              value={config.eliminationCriteria[criterion.key as keyof typeof config.eliminationCriteria]}
              onChange={(e) => handleChange(
                criterion.key as keyof typeof config.eliminationCriteria,
                Number(e.target.value)
              )}
              className="flex-1"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {config.eliminationCriteria[criterion.key as keyof typeof config.eliminationCriteria]}
              </span>
              <span className="text-sm text-gray-600">{criterion.unit}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{
                width: `${(config.eliminationCriteria[criterion.key as keyof typeof config.eliminationCriteria] / criterion.max) * 100}%`
              }}
            />
          </div>
        </div>
      ))}

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-700">
          Candidatos que não atingirem estes critérios mínimos serão automaticamente eliminados do processo.
        </p>
      </div>
    </div>
  );
};

export default EliminationCriteria;