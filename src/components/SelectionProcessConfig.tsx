import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface SelectionProcessConfig {
  minScore: number;
  maxTestTime: number;
  weights: {
    psychosocialTest: number;
    reactionTime: number;
    theoreticalKnowledge: number;
    riskManagement: number;
    economicDriving: number;
  };
  eliminationCriteria: {
    psychosocialScore: number;
    reactionTime: number;
    theoreticalScore: number;
  };
  reportConfig: {
    includeLogo: boolean;
    includePerformanceGraphs: boolean;
    reportHeader: string;
  };
}

interface Props {
  companyId: string;
  initialConfig?: SelectionProcessConfig;
  onSave: (config: SelectionProcessConfig) => void;
}

const SelectionProcessConfig: React.FC<Props> = ({ companyId, initialConfig, onSave }) => {
  const [config, setConfig] = useState<SelectionProcessConfig>(initialConfig || {
    minScore: 70,
    maxTestTime: 120,
    weights: {
      psychosocialTest: 25,
      reactionTime: 20,
      theoreticalKnowledge: 20,
      riskManagement: 20,
      economicDriving: 15,
    },
    eliminationCriteria: {
      psychosocialScore: 60,
      reactionTime: 500,
      theoreticalScore: 70,
    },
    reportConfig: {
      includeLogo: false,
      includePerformanceGraphs: true,
      reportHeader: '',
    },
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    onSave(config);
  };

  const updateWeight = (key: keyof typeof config.weights, value: number) => {
    setConfig(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Configurações do Processo Seletivo</h2>
        <p className="text-gray-600">Personalize os parâmetros e critérios de avaliação</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('general')}
        >
          Configurações Gerais
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'weights' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('weights')}
        >
          Pesos das Avaliações
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'criteria' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('criteria')}
        >
          Critérios de Eliminação
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'reports' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reports')}
        >
          Personalização de Relatórios
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota Mínima para Aprovação
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={config.minScore}
                  onChange={(e) => setConfig(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                  className="w-24 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-600">pontos</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo Máximo do Teste
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={config.maxTestTime}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxTestTime: Number(e.target.value) }))}
                  className="w-24 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-600">minutos</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weights' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Teste Psicossocial
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.weights.psychosocialTest}
                onChange={(e) => updateWeight('psychosocialTest', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>{config.weights.psychosocialTest}%</span>
                <span>100%</span>
              </div>
            </div>
            {/* Similar sliders for other weights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tempo de Reação
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.weights.reactionTime}
                onChange={(e) => updateWeight('reactionTime', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0%</span>
                <span>{config.weights.reactionTime}%</span>
                <span>100%</span>
              </div>
            </div>
            {/* Add other weight sliders */}
          </div>
        )}

        {activeTab === 'criteria' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="psychosocial-criteria"
                checked={config.eliminationCriteria.psychosocialScore > 0}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  eliminationCriteria: {
                    ...prev.eliminationCriteria,
                    psychosocialScore: e.target.checked ? 60 : 0
                  }
                }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="psychosocial-criteria" className="text-sm text-gray-700">
                Eliminar se nota psicossocial {'<'} 60%
              </label>
            </div>
            {/* Add other elimination criteria */}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo da Empresa
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabeçalho do Relatório
              </label>
              <input
                type="text"
                value={config.reportConfig.reportHeader}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  reportConfig: {
                    ...prev.reportConfig,
                    reportHeader: e.target.value
                  }
                }))}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-graphs"
                checked={config.reportConfig.includePerformanceGraphs}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  reportConfig: {
                    ...prev.reportConfig,
                    includePerformanceGraphs: e.target.checked
                  }
                }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="include-graphs" className="text-sm text-gray-700">
                Incluir gráficos de desempenho
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default SelectionProcessConfig;