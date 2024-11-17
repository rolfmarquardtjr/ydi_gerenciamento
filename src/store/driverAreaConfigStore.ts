import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DriverAreaConfig {
  id: string;
  companyId: string;
  showTelemetryScore: boolean;
  showRiskAnalysis: boolean;
  showEventHistory: boolean;
  showPerformanceCharts: boolean;
  showSafetyTips: boolean;
  showMaintenanceAlerts: boolean;
}

interface DriverAreaConfigState {
  configs: Record<string, DriverAreaConfig>;
  getConfig: (companyId: string) => DriverAreaConfig;
  updateConfig: (companyId: string, config: Partial<DriverAreaConfig>) => void;
}

const defaultConfig: Omit<DriverAreaConfig, 'id' | 'companyId'> = {
  showTelemetryScore: true,
  showRiskAnalysis: true,
  showEventHistory: true,
  showPerformanceCharts: true,
  showSafetyTips: true,
  showMaintenanceAlerts: true
};

export const useDriverAreaConfigStore = create<DriverAreaConfigState>()(
  persist(
    (set, get) => ({
      configs: {},
      getConfig: (companyId) => {
        const config = get().configs[companyId];
        if (!config) {
          const newConfig = {
            ...defaultConfig,
            id: `driver-config-${Date.now()}`,
            companyId
          };
          set(state => ({
            configs: {
              ...state.configs,
              [companyId]: newConfig
            }
          }));
          return newConfig;
        }
        return config;
      },
      updateConfig: (companyId, configData) => {
        set(state => ({
          configs: {
            ...state.configs,
            [companyId]: {
              ...state.configs[companyId],
              ...configData
            }
          }
        }));
      }
    }),
    {
      name: 'driver-area-config-storage'
    }
  )
);