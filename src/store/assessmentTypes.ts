export type AssessmentType = 'knowledge' | 'reaction' | 'risk' | 'maintenance';

export type TestCategory = 'selection' | 'driver';

export interface AssessmentConfig {
  id: string;
  companyId: string;
  type: AssessmentType;
  category: TestCategory;
  weight: number;
  timeLimit: number;
  passingScore: number;
  enabled: boolean;
  order: number;
  shuffleQuestions: boolean;
  shuffleAlternatives: boolean;
}

export interface Question {
  id: string;
  seq: number;
  tipo: string;
  questao: string;
  alternativas: string[];
  alternativaCorreta: number;
  alternativasOriginais: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  fundamentacao: string;
  companyId: string;
  category: TestCategory;
}