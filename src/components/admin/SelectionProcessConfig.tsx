import React, { useState } from 'react';
import { Save } from 'lucide-react';
import KnowledgeTestConfig from './selectionProcess/KnowledgeTestConfig';
import ReactionTestConfig from './selectionProcess/ReactionTestConfig';
import RiskAnalysisConfig from './selectionProcess/RiskAnalysisConfig';
import MaintenanceTestConfig from './selectionProcess/MaintenanceTestConfig';
import { useSelectionProcessStore } from '../../store/selectionProcessStore';

interface SelectionProcessConfigProps {
  companyId: string;
}

const SelectionProcessConfig: React.FC<SelectionProcessConfigProps> = ({ companyId }) => {
  const { getConfig, updateConfig } = useSelectionProcessStore();
  const config = getConfig(companyId);
  const [activeTest, setActiveTest] = useState('knowledge');

  const handleSave = (testType: string, newConfig: any) => {
    updateConfig(companyId, {
      ...config,
      tests: {
        ...config.tests,
        [testType]: newConfig
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Configuração do Processo Seletivo
          </h2>
          <p className="text-gray-600 mt-1">
            Configure os parâmetros e critérios de cada teste
          </p>
        </div>
      </div>

      {/* Test Selection Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {[
            { id: 'knowledge', label: 'Conhecimento' },
            { id: 'reaction', label: 'Tempo de Reação' },
            { id: 'risk', label: 'Análise de Riscos' },
            { id: 'maintenance', label: 'Manutenção' },
          ].map((test) => (
            <button
              key={test.id}
              onClick={() => setActiveTest(test.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTest === test.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {test.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTest === 'knowledge' && (
          <KnowledgeTestConfig
            companyId={companyId}
            config={config.tests?.knowledge}
            onSave={(newConfig) => handleSave('knowledge', newConfig)}
          />
        )}
        {activeTest === 'reaction' && (
          <ReactionTestConfig
            config={config.tests?.reaction}
            onSave={(newConfig) => handleSave('reaction', newConfig)}
          />
        )}
        {activeTest === 'risk' && (
          <RiskAnalysisConfig
            config={config.tests?.risk}
            onSave={(newConfig) => handleSave('risk', newConfig)}
          />
        )}
        {activeTest === 'maintenance' && (
          <MaintenanceTestConfig
            config={config.tests?.maintenance}
            onSave={(newConfig) => handleSave('maintenance', newConfig)}
          />
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => updateConfig(companyId, config)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default SelectionProcessConfig;