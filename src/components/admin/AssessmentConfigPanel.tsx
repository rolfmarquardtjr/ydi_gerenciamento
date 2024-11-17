import React from 'react';
import { Settings, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';
import KnowledgeTestConfig from './selectionProcess/KnowledgeTestConfig';
import ReactionTestConfig from './selectionProcess/ReactionTestConfig';
import RiskAnalysisConfig from './selectionProcess/RiskAnalysisConfig';
import MaintenanceTestConfig from './selectionProcess/MaintenanceTestConfig';

interface AssessmentConfigPanelProps {
  companyId: string;
}

const AssessmentConfigPanel: React.FC<AssessmentConfigPanelProps> = ({ companyId }) => {
  const { getConfigsByCompany, updateConfig, initializeConfigs } = useAssessmentConfigStore();
  const configs = getConfigsByCompany(companyId);

  React.useEffect(() => {
    if (configs.length === 0) {
      initializeConfigs(companyId);
    }
  }, [companyId, configs.length, initializeConfigs]);

  const handleConfigUpdate = (type: string, newConfig: any) => {
    updateConfig(companyId, type, newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Configuração das Avaliações</h2>
          <p className="text-sm text-gray-600">
            Configure os parâmetros e banco de questões para cada teste
          </p>
        </div>
      </div>

      {/* Knowledge Test */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <KnowledgeTestConfig
          companyId={companyId}
          config={configs.find(c => c.type === 'knowledge')}
          onSave={(config) => handleConfigUpdate('knowledge', config)}
        />
      </div>

      {/* Reaction Test */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ReactionTestConfig
          config={configs.find(c => c.type === 'reaction')}
          onSave={(config) => handleConfigUpdate('reaction', config)}
        />
      </div>

      {/* Risk Analysis Test */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <RiskAnalysisConfig
          config={configs.find(c => c.type === 'risk')}
          onSave={(config) => handleConfigUpdate('risk', config)}
        />
      </div>

      {/* Maintenance Test */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MaintenanceTestConfig
          config={configs.find(c => c.type === 'maintenance')}
          onSave={(config) => handleConfigUpdate('maintenance', config)}
        />
      </div>
    </div>
  );
};

export default AssessmentConfigPanel;