import React from 'react';
import { SelectionProcessConfig } from '../../../store/selectionProcessStore';

interface ReportSettingsProps {
  config: SelectionProcessConfig;
  onSave: (config: Partial<SelectionProcessConfig>) => void;
}

const ReportSettings: React.FC<ReportSettingsProps> = ({ config, onSave }) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle logo upload
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSave({
      reportConfig: {
        ...config.reportConfig,
        reportHeader: e.target.value
      }
    });
  };

  const handleCheckboxChange = (key: keyof typeof config.reportConfig) => {
    onSave({
      reportConfig: {
        ...config.reportConfig,
        [key]: !config.reportConfig[key]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo da Empresa
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => document.getElementById('logo-upload')?.click()}
            className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Choose File
          </button>
          <span className="text-sm text-gray-500">
            {config.reportConfig.logoUrl ? 'Logo selecionada' : 'No file chosen'}
          </span>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cabeçalho do Relatório
        </label>
        <input
          type="text"
          value={config.reportConfig.reportHeader}
          onChange={handleHeaderChange}
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Digite o cabeçalho do relatório"
        />
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config.reportConfig.includePerformanceGraphs}
            onChange={() => handleCheckboxChange('includePerformanceGraphs')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            Incluir gráficos de desempenho
          </span>
        </label>
      </div>
    </div>
  );
};

export default ReportSettings;