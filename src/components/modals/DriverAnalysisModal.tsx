import React from 'react';
import { X, Brain, AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';

interface DriverAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: {
    id: string;
    name: string;
    events: number;
    risk: {
      score: number;
      riskLevel: string;
      factors: {
        eventFrequency: number;
        eventSeverity: number;
        timePatterns: number;
        locationRisk: number;
        behaviorPattern: number;
      };
      recommendations: string[];
      analysis: string;
    };
  };
}

const DriverAnalysisModal: React.FC<DriverAnalysisModalProps> = ({ isOpen, onClose, driver }) => {
  if (!isOpen) return null;

  const getScoreColor = (value: number) => {
    if (value < 40) return 'text-green-500';
    if (value < 60) return 'text-yellow-500';
    if (value < 80) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (value: number) => {
    if (value < 40) return 'bg-green-50';
    if (value < 60) return 'bg-yellow-50';
    if (value < 80) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-primary-600 mr-2" />
            <div>
              <h2 className="text-xl font-semibold">Análise de Risco - {driver.name}</h2>
              <p className="text-sm text-gray-600">{driver.events} eventos analisados</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`${getScoreBg(driver.risk.score)} px-4 py-2 rounded-lg`}>
              <span className={`text-2xl font-bold ${getScoreColor(driver.risk.score)}`}>
                {driver.risk.score}
              </span>
              <span className="text-sm text-gray-600 ml-1">/ 100</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analysis Text */}
        <div className="mb-6">
          <p className="text-gray-600">{driver.risk.analysis}</p>
        </div>

        {/* Risk Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Fatores de Risco</h4>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <Activity className="w-4 h-4 mr-2" />
                  Frequência de Eventos
                </span>
                <span className={getScoreColor(driver.risk.factors.eventFrequency)}>
                  {driver.risk.factors.eventFrequency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(driver.risk.factors.eventFrequency)} transition-all`}
                  style={{ width: `${driver.risk.factors.eventFrequency}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Severidade
                </span>
                <span className={getScoreColor(driver.risk.factors.eventSeverity)}>
                  {driver.risk.factors.eventSeverity}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(driver.risk.factors.eventSeverity)} transition-all`}
                  style={{ width: `${driver.risk.factors.eventSeverity}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Padrões Temporais
                </span>
                <span className={getScoreColor(driver.risk.factors.timePatterns)}>
                  {driver.risk.factors.timePatterns}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(driver.risk.factors.timePatterns)} transition-all`}
                  style={{ width: `${driver.risk.factors.timePatterns}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Risco por Localização
                </span>
                <span className={getScoreColor(driver.risk.factors.locationRisk)}>
                  {driver.risk.factors.locationRisk}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getScoreBg(driver.risk.factors.locationRisk)} transition-all`}
                  style={{ width: `${driver.risk.factors.locationRisk}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Recomendações</h4>
            <ul className="space-y-2">
              {driver.risk.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
                  <span className="text-sm text-gray-600">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Metodologia de Análise</h4>
          <p className="text-sm text-gray-600">
            Nossa análise de risco utiliza um modelo avançado que considera múltiplos fatores:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• Frequência e padrões de eventos de risco</li>
            <li>• Severidade ponderada dos eventos</li>
            <li>• Análise temporal (horários de maior risco)</li>
            <li>• Padrões geográficos e áreas de risco</li>
            <li>• Comportamento recorrente e tendências</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DriverAnalysisModal;