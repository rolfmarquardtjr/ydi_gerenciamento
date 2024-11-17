import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as XLSX from 'xlsx';
import { Question, TestCategory } from './assessmentTypes';

// Helper function to normalize text (remove accents and convert to lowercase)
const normalizeText = (text: string): string => {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// Helper function to find matching field regardless of case and accents
const findField = (row: any, possibleNames: string[]): string | undefined => {
  const normalizedNames = possibleNames.map(name => normalizeText(name));
  const rowKeys = Object.keys(row);
  
  for (const key of rowKeys) {
    if (normalizedNames.includes(normalizeText(key))) {
      return row[key];
    }
  }
  
  return undefined;
};

interface AssessmentSettings {
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  shuffleAlternatives: boolean;
  questionsPerType: number;
  totalQuestions: number;
}

interface Assessment {
  id: string;
  companyId: string;
  category: TestCategory;
  questions: Question[];
  settings: AssessmentSettings;
}

interface AssessmentState {
  assessments: Assessment[];
  getAssessmentsByCompany: (companyId: string, category: TestCategory) => Assessment[];
  getQuestionsByCompany: (companyId: string, category: TestCategory) => Question[];
  importQuestions: (file: File, category: TestCategory, companyId: string) => Promise<Question[]>;
  updateAssessment: (id: string, data: Partial<Assessment>) => void;
  initializeAssessment: (companyId: string, category: TestCategory) => void;
}

const defaultSettings: AssessmentSettings = {
  timeLimit: 1200, // 20 minutes
  passingScore: 70,
  shuffleQuestions: true,
  shuffleAlternatives: true,
  questionsPerType: 2,
  totalQuestions: 20
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      assessments: [],

      getAssessmentsByCompany: (companyId, category) => {
        return get().assessments.filter(
          assessment => assessment.companyId === companyId && assessment.category === category
        );
      },

      getQuestionsByCompany: (companyId, category) => {
        const assessments = get().getAssessmentsByCompany(companyId, category);
        return assessments.length > 0 ? assessments[0].questions : [];
      },

      importQuestions: async (file: File, category: TestCategory, companyId: string) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

              // Process each row
              const questions = jsonData.map((row, index) => {
                // Find fields using possible variations of names
                const seq = findField(row, ['Seq', 'seq', 'sequencia', 'Sequência']);
                const tipo = findField(row, ['Tipo', 'tipo']);
                const questao = findField(row, ['Questao', 'Questão', 'questao']);
                const alternativaA = findField(row, ['Alternativa a', 'alternativa a', 'Alternativa A']);
                const alternativaB = findField(row, ['Alternativa b', 'alternativa b', 'Alternativa B']);
                const alternativaC = findField(row, ['Alternativa c', 'alternativa c', 'Alternativa C']);
                const alternativaD = findField(row, ['Alternativa d', 'alternativa d', 'Alternativa D']);
                const fundamentacao = findField(row, ['Fundamentacao', 'Fundamentação', 'fundamentacao']);

                // Validate required fields
                const missingFields = [];
                if (!seq) missingFields.push('Seq');
                if (!tipo) missingFields.push('Tipo');
                if (!questao) missingFields.push('Questão');
                if (!alternativaA) missingFields.push('Alternativa A');
                if (!alternativaB) missingFields.push('Alternativa B');
                if (!alternativaC) missingFields.push('Alternativa C');
                if (!alternativaD) missingFields.push('Alternativa D');
                if (!fundamentacao) missingFields.push('Fundamentação');

                if (missingFields.length > 0) {
                  throw new Error(`Linha ${index + 2}: campos obrigatórios faltando: ${missingFields.join(', ')}`);
                }

                // Store original alternatives
                const alternativasOriginais = {
                  a: alternativaA,
                  b: alternativaB,
                  c: alternativaC,
                  d: alternativaD
                };

                // Create question object
                const question: Question = {
                  id: `${category}-${companyId}-${Date.now()}-${index}`,
                  seq: Number(seq),
                  tipo,
                  questao,
                  alternativas: [alternativaA, alternativaB, alternativaC, alternativaD],
                  alternativaCorreta: 0, // A primeira alternativa é sempre a correta
                  alternativasOriginais,
                  fundamentacao,
                  companyId,
                  category
                };

                return question;
              });

              // Update assessment
              const assessment = get().getAssessmentsByCompany(companyId, category)[0];
              if (assessment) {
                set(state => ({
                  assessments: state.assessments.map(a => 
                    a.id === assessment.id 
                      ? { ...a, questions }
                      : a
                  )
                }));
              } else {
                // Create new assessment
                const newAssessment: Assessment = {
                  id: `${category}-${companyId}-${Date.now()}`,
                  companyId,
                  category,
                  questions,
                  settings: defaultSettings
                };

                set(state => ({
                  assessments: [...state.assessments, newAssessment]
                }));
              }

              resolve(questions);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(file);
        });
      },

      updateAssessment: (id, data) => {
        set(state => ({
          assessments: state.assessments.map(assessment =>
            assessment.id === id
              ? { ...assessment, ...data }
              : assessment
          )
        }));
      },

      initializeAssessment: (companyId, category) => {
        const existing = get().getAssessmentsByCompany(companyId, category);
        if (existing.length === 0) {
          const newAssessment: Assessment = {
            id: `${category}-${companyId}-${Date.now()}`,
            companyId,
            category,
            questions: [],
            settings: defaultSettings
          };

          set(state => ({
            assessments: [...state.assessments, newAssessment]
          }));
        }
      }
    }),
    {
      name: 'assessment-storage'
    }
  )
);