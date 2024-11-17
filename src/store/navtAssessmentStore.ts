import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NAVTComponent = 'N' | 'A' | 'V' | 'T';

export interface NAVTQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    type: NAVTComponent;
  }[];
}

export interface NAVTResult {
  id: string;
  userId: string;
  companyId: string;
  date: string;
  scores: {
    N: number;
    A: number;
    V: number;
    T: number;
  };
  dominantProfile: string;
  secondaryProfile: string;
}

export interface NAVTConfig {
  id: string;
  companyId: string;
  enabled: boolean;
  requiredForNewDrivers: boolean;
  showResultsInDashboard: boolean;
  allowRetake: boolean;
  retakeInterval: number; // days
}

interface NAVTAssessmentState {
  configs: Record<string, NAVTConfig>;
  results: NAVTResult[];
  questions: NAVTQuestion[];
  getConfig: (companyId: string) => NAVTConfig;
  updateConfig: (companyId: string, config: Partial<NAVTConfig>) => void;
  addResult: (result: NAVTResult) => void;
  getResults: (userId: string) => NAVTResult[];
  getLatestResult: (userId: string) => NAVTResult | null;
}

const defaultQuestions: NAVTQuestion[] = [
  {
    id: 1,
    text: "Quando aprendendo sobre segurança no trânsito, eu prefiro:",
    options: [
      { text: "Ler folhetos e ver imagens", type: "N" },
      { text: "Ouvir instruções e discussões", type: "A" },
      { text: "Participar de simulações práticas", type: "V" },
      { text: "Estudar as bases teóricas das leis de trânsito", type: "T" }
    ]
  },
  {
    id: 2,
    text: "Para lembrar o caminho de um lugar, você:",
    options: [
      { text: "Visualiza o mapa na sua cabeça", type: "N" },
      { text: "Repete as direções em voz alta", type: "A" },
      { text: "Prefere ir dirigindo para memorizar", type: "V" },
      { text: "Estuda as rotas e seus contextos históricos", type: "T" }
    ]
  },
  {
    id: 3,
    text: "Ao montar um kit de emergência para o carro, você gosta de:",
    options: [
      { text: "Ver uma lista com imagens dos itens", type: "N" },
      { text: "Escutar alguém explicando a função de cada item", type: "A" },
      { text: "Praticar montando o kit você mesmo", type: "V" },
      { text: "Ler sobre a importância e o uso de cada item do kit", type: "T" }
    ]
  },
  {
    id: 4,
    text: "Se você vai aprender uma nova manobra de condução, você:",
    options: [
      { text: "Assiste a um tutorial em vídeo", type: "N" },
      { text: "Ouve um áudio explicativo", type: "A" },
      { text: "Pratica a manobra em um curso prático", type: "V" },
      { text: "Estuda o princípio físico por trás da manobra", type: "T" }
    ]
  },
  {
    id: 5,
    text: "Quando compra um novo dispositivo para o carro, você:",
    options: [
      { text: "Lê o manual com imagens explicativas", type: "N" },
      { text: "Ouve alguém explicar como usar o dispositivo", type: "A" },
      { text: "Experimenta o dispositivo para entender como funciona", type: "V" },
      { text: "Procura entender como a tecnologia do dispositivo funciona", type: "T" }
    ]
  },
  {
    id: 6,
    text: "Durante uma aula teórica de condução, você prefere:",
    options: [
      { text: "Olhar slides e gráficos", type: "N" },
      { text: "Escutar o instrutor falando", type: "A" },
      { text: "Fazer exercícios práticos relacionados", type: "V" },
      { text: "Compreender as razões por trás das regras de trânsito", type: "T" }
    ]
  },
  {
    id: 7,
    text: "Ao estudar sinais de trânsito, você:",
    options: [
      { text: "Prefere ver cartões com os sinais e suas descrições", type: "N" },
      { text: "Gosta de explicações em áudio sobre cada um", type: "A" },
      { text: "Prefere montar e manipular modelos dos sinais para aprender de forma prática", type: "V" },
      { text: "Lê sobre a origem e o significado dos sinais", type: "T" }
    ]
  },
  {
    id: 8,
    text: "Para se manter focado ao dirigir longas distâncias, você:",
    options: [
      { text: "Configura o GPS com visuais claros", type: "N" },
      { text: "Escuta música ou podcasts", type: "A" },
      { text: "Faz paradas frequentes para se movimentar", type: "V" },
      { text: "Planeja mentalmente a viagem, incluindo pausas e pontos de interesse", type: "T" }
    ]
  },
  {
    id: 9,
    text: "Para aprender sobre a manutenção do veículo, você:",
    options: [
      { text: "Lê manuais e assiste a vídeos", type: "N" },
      { text: "Ouve dicas de mecânicos em áudios", type: "A" },
      { text: "Realiza a manutenção sob supervisão", type: "V" },
      { text: "Estuda o funcionamento interno do carro e como cada parte contribui para o todo", type: "T" }
    ]
  },
  {
    id: 10,
    text: "Quando se depara com um problema no carro, você:",
    options: [
      { text: "Busca vídeos sobre como solucionar", type: "N" },
      { text: "Liga para um amigo e pede instruções verbais", type: "A" },
      { text: "Começa a mexer no carro para tentar consertar", type: "V" },
      { text: "Lê manuais técnicos para entender o problema", type: "T" }
    ]
  },
  {
    id: 11,
    text: "Num curso de primeiros socorros para motoristas, você prefere:",
    options: [
      { text: "Estudar com cartazes ilustrativos", type: "N" },
      { text: "Ouvir histórias de casos reais", type: "A" },
      { text: "Praticar as técnicas em manequins", type: "V" },
      { text: "Aprender sobre a teoria médica por trás dos primeiros socorros", type: "T" }
    ]
  },
  {
    id: 12,
    text: "Quando lhe dão direções, você:",
    options: [
      { text: "Prefere que desenhem um mapa", type: "N" },
      { text: "Gosta de ouvir passo a passo", type: "A" },
      { text: "Prefere caminhar ou dirigir juntos", type: "V" },
      { text: "Estuda a lógica e a eficiência das rotas sugeridas", type: "T" }
    ]
  },
  {
    id: 13,
    text: "Para ajustar a sua posição de condução ideal, você:",
    options: [
      { text: "Segue um diagrama de postura", type: "N" },
      { text: "Escuta uma descrição detalhada", type: "A" },
      { text: "Ajusta manualmente até encontrar conforto", type: "V" },
      { text: "Compreende a ergonomia por trás da posição de condução", type: "T" }
    ]
  },
  {
    id: 14,
    text: "Em um workshop sobre direção econômica, você:",
    options: [
      { text: "Foca nos dados e estatísticas apresentados", type: "N" },
      { text: "Discute ideias com outros participantes", type: "A" },
      { text: "Participa de um teste prático de direção", type: "V" },
      { text: "Estuda os princípios da condução econômica", type: "T" }
    ]
  },
  {
    id: 15,
    text: "Quando memoriza o número de emergência, você:",
    options: [
      { text: "Escreve e visualiza o número várias vezes", type: "N" },
      { text: "Repete o número em voz alta", type: "A" },
      { text: "Simula uma chamada de emergência", type: "V" },
      { text: "Entende a estrutura e a função dos serviços de emergência", type: "T" }
    ]
  },
  {
    id: 16,
    text: "Na escolha de um novo carro, o mais importante para você é:",
    options: [
      { text: "O design e cor do veículo", type: "N" },
      { text: "O ronco do motor", type: "A" },
      { text: "A sensação ao testar o carro", type: "V" },
      { text: "Conhecer as especificações técnicas e inovações", type: "T" }
    ]
  },
  {
    id: 17,
    text: "Para acompanhar alterações no código de trânsito, você:",
    options: [
      { text: "Lê o novo código e olha as mudanças destacadas", type: "N" },
      { text: "Escuta um resumo em áudio das atualizações", type: "A" },
      { text: "Faz um exercício prático sobre situações no trânsito", type: "V" },
      { text: "Estuda o impacto das mudanças na segurança e fluxo do tráfego", type: "T" }
    ]
  },
  {
    id: 18,
    text: "Para ensinar alguém a dirigir, você:",
    options: [
      { text: "Mostra um vídeo de como dirigir", type: "N" },
      { text: "Explica verbalmente o processo", type: "A" },
      { text: "Coloca a pessoa para dirigir sob sua supervisão", type: "V" },
      { text: "Fornece material de leitura sobre técnicas de condução", type: "T" }
    ]
  },
  {
    id: 19,
    text: "Quando ajusta o sistema de som do seu carro, você:",
    options: [
      { text: "Lê as instruções com diagramas", type: "N" },
      { text: "Segue uma explicação passo a passo em áudio", type: "A" },
      { text: "Vai testando até acertar o som como gosta", type: "V" },
      { text: "Entende o funcionamento do sistema de áudio", type: "T" }
    ]
  },
  {
    id: 20,
    text: "No aprendizado sobre defesa pessoal para motoristas, você:",
    options: [
      { text: "Observa demonstrações visuais", type: "N" },
      { text: "Escuta conselhos de um especialista", type: "A" },
      { text: "Participa de uma aula prática com simulações", type: "V" },
      { text: "Estuda as bases teóricas da defesa pessoal", type: "T" }
    ]
  }
];

const defaultConfig: Omit<NAVTConfig, 'id' | 'companyId'> = {
  enabled: false,
  requiredForNewDrivers: false,
  showResultsInDashboard: true,
  allowRetake: true,
  retakeInterval: 180 // 6 months
};

const calculateProfiles = (scores: { N: number; A: number; V: number; T: number }) => {
  const total = scores.N + scores.A + scores.V + scores.T;
  const normalized = {
    N: (scores.N / total) * 100,
    A: (scores.A / total) * 100,
    V: (scores.V / total) * 100,
    T: (scores.T / total) * 100
  };

  // Calculate combined profiles
  const profiles = {
    EVA: normalized.N + normalized.A, // Explorador Visual-Auditivo
    PT: normalized.V + normalized.T,  // Praticante Teórico
    AAT: normalized.A + normalized.T, // Analista Auditivo-Teórico
    VP: normalized.N + normalized.V,  // Visionário Prático
    IP: normalized.V + normalized.A,  // Instrutor Prático
    PV: normalized.N + normalized.T,  // Planejador Visual
    MS: Math.max(...Object.values(normalized)), // Multissensorial
    EP: normalized.V + normalized.T,  // Erudito Prático
    TVA: normalized.N + normalized.A + normalized.T, // Teórico Visual-Auditivo
    ET: normalized.V + normalized.T,  // Executor Teórico
    AU: Math.min(...Object.values(normalized)) > 20 ? 'AU' : '', // Aprendiz Universal
  };

  // Find dominant and secondary profiles
  const sortedProfiles = Object.entries(profiles)
    .sort(([,a], [,b]) => b - a);

  return {
    dominantProfile: sortedProfiles[0][0],
    secondaryProfile: sortedProfiles[1][0]
  };
};

export const useNAVTAssessmentStore = create<NAVTAssessmentState>()(
  persist(
    (set, get) => ({
      configs: {},
      results: [],
      questions: defaultQuestions,
      
      getConfig: (companyId) => {
        const config = get().configs[companyId];
        if (!config) {
          const newConfig = {
            ...defaultConfig,
            id: `navt-config-${Date.now()}`,
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
      },

      addResult: (result) => {
        set(state => ({
          results: [...state.results, result]
        }));
      },

      getResults: (userId) => {
        return get().results.filter(r => r.userId === userId);
      },

      getLatestResult: (userId) => {
        const userResults = get().results
          .filter(r => r.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return userResults[0] || null;
      }
    }),
    {
      name: 'navt-assessment-storage'
    }
  )
);