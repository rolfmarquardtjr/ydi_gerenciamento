import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskAnalysisConfigProps {
  config: any;
  onSave: (config: any) => void;
}

const RiskAnalysisConfig: React.FC<RiskAnalysisConfigProps> = ({ config: providedConfig, onSave }) => {
  const [localConfig, setLocalConfig] = useState(providedConfig || {
    weight: 30,
    timeLimit: 900,
    passingScore: 70,
    scenarios: 5
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localConfig);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(providedConfig);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-primary-600 mr-2" />
        <div>
          <h3 className="text-lg font-semibold">Análise de Riscos</h3>
          <p className="text-sm text-gray-600">
            Configure os parâmetros do teste de análise de riscos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso na Avaliação (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localConfig.weight}
            onChange={(e) => handleSettingChange('weight', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo Limite (minutos)
          </label>
          <input
            type="number"
            min="1"
            value={Math.floor(localConfig.timeLimit / 60)}
            onChange={(e) => handleSettingChange('timeLimit', Number(e.target.value) * 60)}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nota Mínima (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localConfig.passingScore}
            onChange={(e) => handleSettingChange('passingScore', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Cenários
          </label>
          <input
            type="number"
            min="1"
            value={localConfig.scenarios}
            onChange={(e) => handleSettingChange('scenarios', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          O teste apresentará cenários de risco no trânsito para avaliação da 
          capacidade de tomada de decisão do candidato.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg border ${
            hasChanges
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Resetar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg ${
            hasChanges
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default RiskAnalysisConfig;