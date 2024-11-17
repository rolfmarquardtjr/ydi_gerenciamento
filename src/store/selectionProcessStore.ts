import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectionProcessConfig {
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

interface CompanyConfig {
  [companyId: string]: SelectionProcessConfig;
}

interface SelectionProcessState {
  configs: CompanyConfig;
  updateConfig: (companyId: string, config: Partial<SelectionProcessConfig>) => void;
  getConfig: (companyId: string) => SelectionProcessConfig;
}

const defaultConfig: SelectionProcessConfig = {
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
};

export const useSelectionProcessStore = create<SelectionProcessState>()(
  persist(
    (set, get) => ({
      configs: {},
      updateConfig: (companyId, config) => {
        set((state) => ({
          configs: {
            ...state.configs,
            [companyId]: {
              ...get().getConfig(companyId),
              ...config,
            },
          },
        }));
      },
      getConfig: (companyId) => {
        return get().configs[companyId] || defaultConfig;
      },
    }),
    {
      name: 'selection-process-storage',
    }
  )
);