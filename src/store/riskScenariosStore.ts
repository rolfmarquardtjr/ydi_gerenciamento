import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RiskScenario {
  id: string;
  companyId: string;
  description: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  timeLimit: number;
  type: string;
}

interface RiskScenariosState {
  scenarios: RiskScenario[];
  addScenarios: (companyId: string, scenarios: Omit<RiskScenario, 'id' | 'companyId'>[]) => void;
  getScenariosByCompany: (companyId: string) => RiskScenario[];
  updateScenario: (id: string, scenario: Partial<RiskScenario>) => void;
  deleteScenario: (id: string) => void;
}

// Default scenarios for demonstration
const defaultScenarios: Omit<RiskScenario, 'id' | 'companyId'>[] = [
  {
    description: "Você está dirigindo em uma via de mão dupla e percebe que um veículo está vindo na contramão. O que você deve fazer?",
    options: [
      {
        id: "1",
        text: "Reduzir a velocidade, sinalizar e desviar com segurança para o acostamento",
        isCorrect: true,
        explanation: "Esta é a ação mais segura, pois reduz o risco de colisão e alerta outros motoristas."
      },
      {
        id: "2",
        text: "Buzinar repetidamente e manter a velocidade",
        isCorrect: false,
        explanation: "Apenas buzinar não é suficiente e manter a velocidade aumenta o risco de colisão."
      },
      {
        id: "3",
        text: "Aumentar a velocidade para passar rapidamente pelo veículo",
        isCorrect: false,
        explanation: "Aumentar a velocidade aumenta o risco e a gravidade de um possível acidente."
      },
      {
        id: "4",
        text: "Frear bruscamente no meio da via",
        isCorrect: false,
        explanation: "Frear bruscamente pode causar acidentes com veículos que vêm atrás."
      }
    ],
    timeLimit: 30,
    type: "Situação de Emergência"
  },
  {
    description: "Em uma rodovia com neblina intensa, a visibilidade está muito reduzida. Qual a melhor ação a ser tomada?",
    options: [
      {
        id: "1",
        text: "Ligar farol baixo, reduzir velocidade e aumentar distância do veículo à frente",
        isCorrect: true,
        explanation: "Estas medidas aumentam a segurança em condições de baixa visibilidade."
      },
      {
        id: "2",
        text: "Ligar farol alto e manter velocidade normal",
        isCorrect: false,
        explanation: "Farol alto em neblina pode piorar a visibilidade devido ao reflexo."
      },
      {
        id: "3",
        text: "Parar no acostamento até a neblina passar",
        isCorrect: false,
        explanation: "Parar no acostamento em condições de baixa visibilidade é perigoso."
      },
      {
        id: "4",
        text: "Seguir o veículo à frente bem de perto para não perdê-lo de vista",
        isCorrect: false,
        explanation: "Seguir muito próximo aumenta o risco de colisão traseira."
      }
    ],
    timeLimit: 30,
    type: "Condições Adversas"
  }
];

export const useRiskScenariosStore = create<RiskScenariosState>()(
  persist(
    (set, get) => ({
      scenarios: [],
      
      addScenarios: (companyId, newScenarios) => {
        const scenariosWithIds = newScenarios.map(scenario => ({
          ...scenario,
          id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          companyId
        }));

        set(state => ({
          scenarios: [...state.scenarios, ...scenariosWithIds]
        }));
      },

      getScenariosByCompany: (companyId) => {
        const scenarios = get().scenarios.filter(s => s.companyId === companyId);
        if (scenarios.length === 0) {
          // Initialize with default scenarios if none exist
          get().addScenarios(companyId, defaultScenarios);
          return get().scenarios.filter(s => s.companyId === companyId);
        }
        return scenarios;
      },

      updateScenario: (id, scenarioData) => {
        set(state => ({
          scenarios: state.scenarios.map(scenario =>
            scenario.id === id ? { ...scenario, ...scenarioData } : scenario
          )
        }));
      },

      deleteScenario: (id) => {
        set(state => ({
          scenarios: state.scenarios.filter(scenario => scenario.id !== id)
        }));
      }
    }),
    {
      name: 'risk-scenarios-storage'
    }
  )
);