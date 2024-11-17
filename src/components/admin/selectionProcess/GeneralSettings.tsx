import React from 'react';
import { SelectionProcessConfig } from '../../../store/selectionProcessStore';

interface GeneralSettingsProps {
  config: SelectionProcessConfig;
  onSave: (config: Partial<SelectionProcessConfig>) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ config, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nota Mínima para Aprovação
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={config.minScore}
              onChange={(e) => onSave({ minScore: Number(e.target.value) })}
              className="w-24 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-gray-600">pontos</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo Máximo do Teste
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={config.maxTestTime}
              onChange={(e) => onSave({ maxTestTime: Number(e.target.value) })}
              className="w-24 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-gray-600">minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;