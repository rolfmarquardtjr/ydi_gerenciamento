import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ImportModal from './ImportModal';
import RiskEventMap from './RiskEventMap';
import { useTelemetryStore } from '../store/telemetryStore';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import TelemetryOverview from './TelemetryOverview';
import TelemetryStats from './TelemetryStats';
import DriverRiskList from './DriverRiskList';

const TelemetryDashboard = () => {
  const [importModalConfig, setImportModalConfig] = useState<{
    isOpen: boolean;
    type: 'telemetry' | 'users';
  }>({ isOpen: false, type: 'telemetry' });

  const { user: currentUser } = useAuthStore();
  const events = useTelemetryStore((state) => state.events);
  const getEventsByCompany = useTelemetryStore((state) => state.getEventsByCompany);
  const getUsersByCompany = useUserStore((state) => state.getUsersByCompany);

  // Get company events
  const companyEvents = currentUser?.companyId ? getEventsByCompany(currentUser.companyId) : [];

  // Get company drivers
  const companyUsers = currentUser?.companyId ? getUsersByCompany(currentUser.companyId) : [];
  const drivers = companyUsers.filter(user => user.perfil === 'Condutor');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Central de Monitoramento de Telemetria
          </h1>
          <p className="text-gray-600 mt-1">
            Análise de eventos e comportamento dos condutores
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setImportModalConfig({ isOpen: true, type: 'telemetry' })}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Importar Telemetria
          </button>
        </div>
      </div>

      {/* Telemetry Overview */}
      <div className="mb-8">
        <TelemetryOverview events={companyEvents} drivers={drivers} />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TelemetryStats events={companyEvents} />
        <DriverRiskList drivers={drivers} />
      </div>

      {/* Risk Event Map */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Mapa de Eventos de Risco</h3>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <RiskEventMap events={companyEvents} />
        </div>
      </div>

      <ImportModal
        isOpen={importModalConfig.isOpen}
        onClose={() => setImportModalConfig({ isOpen: false, type: 'telemetry' })}
        type={importModalConfig.type}
      />
    </div>
  );
};

export default TelemetryDashboard;