import React from 'react';
import { Candidate } from '../../store/candidateStore';
import { AssessmentConfig } from '../../store/assessmentTypes';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AssessmentStatsProps {
  candidates: Candidate[];
  assessmentConfigs: AssessmentConfig[];
}

const AssessmentStats: React.FC<AssessmentStatsProps> = ({
  candidates,
  assessmentConfigs
}) => {
  // Calculate statistics
  const totalCandidates = candidates.length;
  const approvedCandidates = candidates.filter(c => c.status === 'approved').length;
  const rejectedCandidates = candidates.filter(c => c.status === 'rejected').length;
  const inProcessCandidates = totalCandidates - approvedCandidates - rejectedCandidates;

  const data = [
    { name: 'Aprovados', value: approvedCandidates },
    { name: 'Em Processo', value: inProcessCandidates },
    { name: 'Reprovados', value: rejectedCandidates },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Estatísticas do Processo</h2>

      {/* Pie Chart */}
      <div className="h-64 mb-6">
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{approvedCandidates}</p>
          <p className="text-sm text-gray-600">Aprovados</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{inProcessCandidates}</p>
          <p className="text-sm text-gray-600">Em Processo</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{rejectedCandidates}</p>
          <p className="text-sm text-gray-600">Reprovados</p>
        </div>
      </div>

      {/* Test Performance */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Desempenho por Teste
        </h3>
        {assessmentConfigs.map((config) => {
          const completedTests = candidates.filter(c => 
            c.avaliacoes[config.type]?.score !== undefined
          ).length;
          
          const avgScore = candidates.reduce((sum, candidate) => 
            sum + (candidate.avaliacoes[config.type]?.score || 0), 0
          ) / (completedTests || 1);

          return (
            <div key={config.type} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {config.type === 'knowledge' ? 'Conhecimento' :
                   config.type === 'reaction' ? 'Tempo de Reação' :
                   config.type === 'risk' ? 'Análise de Riscos' :
                   'Manutenção'}
                </span>
                <span className="font-medium">{avgScore.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${avgScore}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentStats;