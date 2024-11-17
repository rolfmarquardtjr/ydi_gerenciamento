import React from 'react';
import { Candidate } from '../../store/candidateStore';
import { AssessmentConfig } from '../../store/assessmentTypes';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface CandidateProgressListProps {
  candidates: Candidate[];
  assessmentConfigs: AssessmentConfig[];
}

const CandidateProgressList: React.FC<CandidateProgressListProps> = ({
  candidates,
  assessmentConfigs
}) => {
  const getStatusIcon = (assessment: any, config: AssessmentConfig) => {
    if (!assessment) {
      return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }

    if (assessment.score >= config.passingScore) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getTestName = (type: string) => {
    switch (type) {
      case 'knowledge':
        return 'Conhecimento';
      case 'reaction':
        return 'Tempo de Reação';
      case 'risk':
        return 'Análise de Riscos';
      case 'maintenance':
        return 'Manutenção';
      default:
        return type;
    }
  };

  const calculateProgress = (candidate: Candidate) => {
    const completedTests = assessmentConfigs.filter(
      config => candidate.avaliacoes[config.type]
    ).length;
    return Math.round((completedTests / assessmentConfigs.length) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Progresso dos Candidatos</h2>
        
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{candidate.nome}</h3>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    candidate.status === 'approved' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.status === 'approved' ? 'Aprovado' :
                     candidate.status === 'rejected' ? 'Reprovado' :
                     'Em Processo'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {calculateProgress(candidate)}% concluído
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${calculateProgress(candidate)}%` }}
                />
              </div>

              {/* Tests Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assessmentConfigs.map((config) => {
                  const assessment = candidate.avaliacoes[config.type];
                  
                  return (
                    <div key={config.type} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {getTestName(config.type)}
                        </span>
                        {getStatusIcon(assessment, config)}
                      </div>
                      {assessment && (
                        <div className="text-sm">
                          <p className={`font-medium ${
                            assessment.score >= config.passingScore
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {Math.round(assessment.score)}%
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(assessment.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateProgressList;