import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AssessmentConfig, AssessmentType } from './assessmentTypes';

interface AssessmentConfigState {
  configs: AssessmentConfig[];
  getConfigsByCompany: (companyId: string) => AssessmentConfig[];
  updateConfig: (companyId: string, type: AssessmentType, config: Partial<AssessmentConfig>) => void;
  initializeConfigs: (companyId: string) => void;
}

const defaultConfigs: Omit<AssessmentConfig, 'id' | 'companyId'>[] = [
  {
    type: 'knowledge',
    category: 'selection',
    weight: 30,
    timeLimit: 1200, // 20 minutes
    passingScore: 70,
    enabled: true,
    order: 1,
    shuffleQuestions: true,
    shuffleAlternatives: true,
    questionsPerType: 2
  },
  {
    type: 'reaction',
    category: 'selection',
    weight: 20,
    timeLimit: 300, // 5 minutes
    passingScore: 75,
    enabled: true,
    order: 2,
    maxReactionTime: 500, // milliseconds
    attempts: 10,
    shuffleQuestions: false,
    shuffleAlternatives: false,
    questionsPerType: 0
  },
  {
    type: 'risk',
    category: 'selection',
    weight: 30,
    timeLimit: 900, // 15 minutes
    passingScore: 70,
    enabled: true,
    order: 3,
    scenarios: 5,
    shuffleQuestions: true,
    shuffleAlternatives: false,
    questionsPerType: 0
  },
  {
    type: 'maintenance',
    category: 'selection',
    weight: 20,
    timeLimit: 600, // 10 minutes
    passingScore: 70,
    enabled: true,
    order: 4,
    questions: 20,
    shuffleQuestions: true,
    shuffleAlternatives: true,
    questionsPerType: 0
  }
];

export const useAssessmentConfigStore = create<AssessmentConfigState>()(
  persist(
    (set, get) => ({
      configs: [],
      getConfigsByCompany: (companyId) => {
        return get().configs.filter(config => config.companyId === companyId);
      },
      updateConfig: (companyId, type, configData) => {
        set(state => ({
          configs: state.configs.map(config => 
            config.companyId === companyId && config.type === type
              ? { ...config, ...configData }
              : config
          )
        }));
      },
      initializeConfigs: (companyId) => {
        const existingConfigs = get().getConfigsByCompany(companyId);
        
        if (existingConfigs.length === 0) {
          set(state => ({
            configs: [
              ...state.configs,
              ...defaultConfigs.map(config => ({
                ...config,
                id: `${companyId}-${config.type}`,
                companyId
              }))
            ]
          }));
        }
      }
    }),
    {
      name: 'assessment-config-storage'
    }
  )
);