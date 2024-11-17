import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as XLSX from 'xlsx';

export interface KnowledgeQuestion {
  id: string;
  seq: number;
  tipo: string;
  questao: string;
  alternativas: {
    texto: string;
    correta: boolean;
  }[];
  fundamentacao: string;
}

export interface KnowledgeResult {
  id: string;
  userId: string;
  companyId: string;
  date: string;
  score: number;
  answers: Record<string, number>;
  timeSpent: number;
}

export interface KnowledgeConfig {
  id: string;
  companyId: string;
  enabled: boolean;
  timeLimit: number; // minutes
  passingScore: number; // percentage
  questionsPerType: number;
  totalQuestions: number;
  shuffleQuestions: boolean;
  shuffleAlternatives: boolean;
  allowRetake: boolean;
  retakeInterval: number; // days
}

interface KnowledgeAssessmentState {
  configs: Record<string, KnowledgeConfig>;
  questions: Record<string, KnowledgeQuestion[]>;
  results: KnowledgeResult[];
  getConfig: (companyId: string) => KnowledgeConfig;
  updateConfig: (companyId: string, config: Partial<KnowledgeConfig>) => void;
  importQuestions: (companyId: string, file: File) => Promise<void>;
  getQuestions: (companyId: string) => KnowledgeQuestion[];
  updateQuestion: (companyId: string, questionId: string, question: Partial<KnowledgeQuestion>) => void;
  addResult: (result: KnowledgeResult) => void;
  getResults: (userId: string) => KnowledgeResult[];
  getLatestResult: (userId: string) => KnowledgeResult | null;
  canTakeAssessment: (userId: string, companyId: string) => boolean;
}

const defaultConfig: Omit<KnowledgeConfig, 'id' | 'companyId'> = {
  enabled: false,
  timeLimit: 60,
  passingScore: 70,
  questionsPerType: 5,
  totalQuestions: 20,
  shuffleQuestions: true,
  shuffleAlternatives: true,
  allowRetake: true,
  retakeInterval: 30
};

const normalizeText = (text: string): string => {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const findColumn = (headers: string[], columnNames: string[]): string | undefined => {
  const normalizedHeaders = headers.map(normalizeText);
  const normalizedColumns = columnNames.map(normalizeText);
  
  const headerIndex = normalizedHeaders.findIndex(header => 
    normalizedColumns.includes(header)
  );
  
  return headerIndex >= 0 ? headers[headerIndex] : undefined;
};

export const useKnowledgeAssessmentStore = create<KnowledgeAssessmentState>()(
  persist(
    (set, get) => ({
      configs: {},
      questions: {},
      results: [],

      getConfig: (companyId) => {
        const config = get().configs[companyId];
        if (!config) {
          const newConfig = {
            ...defaultConfig,
            id: `knowledge-config-${Date.now()}`,
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

      importQuestions: async (companyId, file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

              const columnMapping = {
                seq: ['Seq', 'seq', 'Sequencia', 'Sequência', 'sequencia', 'sequência'],
                tipo: ['Tipo', 'tipo', 'Type', 'type'],
                questao: ['Questao', 'Questão', 'questao', 'questão', 'Pergunta', 'pergunta'],
                alternativaA: ['Alternativa a', 'alternativa a', 'Alternativa A', 'alternativaa'],
                alternativaB: ['Alternativa b', 'alternativa b', 'Alternativa B', 'alternativab'],
                alternativaC: ['Alternativa c', 'alternativa c', 'Alternativa C', 'alternativac'],
                alternativaD: ['Alternativa d', 'alternativa d', 'Alternativa D', 'alternativad'],
                fundamentacao: ['Fundamentacao', 'Fundamentação', 'fundamentacao', 'fundamentação']
              };

              const headers = Object.keys(jsonData[0]);
              const mapping: Record<string, string> = {};
              const missingColumns: string[] = [];

              for (const [key, variations] of Object.entries(columnMapping)) {
                const found = findColumn(headers, variations);
                if (found) {
                  mapping[key] = found;
                } else {
                  missingColumns.push(variations[0]);
                }
              }

              if (missingColumns.length > 0) {
                reject(new Error(`Colunas obrigatórias faltando: ${missingColumns.join(', ')}`));
                return;
              }

              const questions: KnowledgeQuestion[] = jsonData.map((row, index) => {
                if (!row[mapping.questao] || !row[mapping.fundamentacao]) {
                  throw new Error(`Linha ${index + 2}: Questão ou Fundamentação está vazia`);
                }

                return {
                  id: `question-${Date.now()}-${index}`,
                  seq: Number(row[mapping.seq]) || index + 1,
                  tipo: row[mapping.tipo] || 'Geral',
                  questao: row[mapping.questao],
                  alternativas: [
                    { texto: row[mapping.alternativaA], correta: true },
                    { texto: row[mapping.alternativaB], correta: false },
                    { texto: row[mapping.alternativaC], correta: false },
                    { texto: row[mapping.alternativaD], correta: false }
                  ],
                  fundamentacao: row[mapping.fundamentacao]
                };
              });

              set(state => ({
                questions: {
                  ...state.questions,
                  [companyId]: questions
                }
              }));

              resolve();
            } catch (error) {
              if (error instanceof Error) {
                reject(error);
              } else {
                reject(new Error('Erro ao processar arquivo. Verifique o formato.'));
              }
            }
          };
          reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
          reader.readAsArrayBuffer(file);
        });
      },

      getQuestions: (companyId) => {
        return get().questions[companyId] || [];
      },

      updateQuestion: (companyId, questionId, questionData) => {
        set(state => ({
          questions: {
            ...state.questions,
            [companyId]: state.questions[companyId].map(q =>
              q.id === questionId ? { ...q, ...questionData } : q
            )
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
      },

      canTakeAssessment: (userId, companyId) => {
        const config = get().getConfig(companyId);
        if (!config.enabled) return false;

        const latestResult = get().getLatestResult(userId);
        if (!latestResult) return true;

        if (!config.allowRetake) return false;

        const lastTestDate = new Date(latestResult.date);
        const daysSinceLastTest = Math.floor(
          (Date.now() - lastTestDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return daysSinceLastTest >= config.retakeInterval;
      }
    }),
    {
      name: 'knowledge-assessment-storage'
    }
  )
);