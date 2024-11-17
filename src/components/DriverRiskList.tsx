import React, { useState } from 'react';
import { Users, HelpCircle } from 'lucide-react';
import { useTelemetryStore } from '../store/telemetryStore';
import { useRiskAnalysisStore } from '../store/riskAnalysisStore';
import DriverAnalysisModal from './modals/DriverAnalysisModal';
import Tooltip from './Tooltip';
import { User } from '../store/userStore';

interface DriverRiskListProps {
  drivers: User[];
}

const DriverRiskList: React.FC<DriverRiskListProps> = ({ drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const analyzeRisk = useRiskAnalysisStore(state => state.analyzeRisk);
  const getEventsByOperator = useTelemetryStore(state => state.getEventsByOperator);

  const tooltipContent = `
    Lista de condutores ordenada por nível de risco. O score é calculado considerando:
    - Frequência de eventos (25%)
    - Severidade dos eventos (30%)
    - Padrões temporais (15%)
    - Localização dos eventos (15%)
    - Comportamento recorrente (15%)
    
    Clique em um condutor para ver análise detalhada.
  `;

  // Calculate risk scores for all drivers
  const driversWithRisk = drivers.map(driver => {
    const driverEvents = getEventsByOperator(driver.id_operador);
    const riskAnalysis = analyzeRisk(driverEvents, driver.id_operador);
    return {
      ...driver,
      events: driverEvents.length,
      risk: riskAnalysis
    };
  }).sort((a, b) => (b.risk?.score || 0) - (a.risk?.score || 0));

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Análise de Risco por Condutor</h3>
          <Tooltip content={tooltipContent}>
            <HelpCircle className="w-5 h-5 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {driversWithRisk.map((driver) => (
            <button
              key={`driver-${driver.id_operador}`}
              onClick={() => setSelectedDriver(driver)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-3 text-left">
                  <p className="font-medium">{`${driver.nome} ${driver.sobrenome}`}</p>
                  <p className="text-sm text-gray-500">{driver.events} eventos registrados</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  (driver.risk?.score || 0) < 40 ? 'text-green-600' :
                  (driver.risk?.score || 0) < 60 ? 'text-yellow-600' :
                  (driver.risk?.score || 0) < 80 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  Score: {driver.risk?.score || 0}
                </div>
                <p className="text-xs text-gray-500">{driver.risk?.riskLevel || 'Não avaliado'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedDriver && (
        <DriverAnalysisModal
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          driver={selectedDriver}
        />
      )}
    </>
  );
};

export default DriverRiskList;