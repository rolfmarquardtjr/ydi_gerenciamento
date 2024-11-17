import React from 'react';
import { useAssessmentConfigStore } from '../../store/assessmentConfigStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssessmentConfigSummaryProps {
  companyId: string;
}

const AssessmentConfigSummary: React.FC<AssessmentConfigSummaryProps> = ({ companyId }) => {
  const configs = useAssessmentConfigStore((state) => state.getConfigsByCompany(companyId));

  const data = configs
    .filter(config => config.enabled)
    .map(config => ({
      name: config.type === 'knowledge' ? 'Conhecimento' :
            config.type === 'reaction' ? 'Tempo de Reação' :
            config.type === 'risk' ? 'Análise de Riscos' :
            'Manutenção',
      value: config.weight
    }));

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Distribuição dos Pesos</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${value}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {configs.map((config, index) => (
          <div key={config.type} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {config.type === 'knowledge' ? 'Conhecimento' :
                 config.type === 'reaction' ? 'Tempo de Reação' :
                 config.type === 'risk' ? 'Análise de Riscos' :
                 'Manutenção'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {config.enabled ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Peso:</span>
                <span className="font-medium">{config.weight}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo:</span>
                <span className="font-medium">{Math.floor(config.timeLimit / 60)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nota Mínima:</span>
                <span className="font-medium">{config.passingScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentConfigSummary;