import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { AssessmentType } from './assessmentTypes';

export interface CandidateAssessment {
  type: AssessmentType;
  score: number;
  completedAt: string;
  timeSpent: number;
  isCompleted: boolean;
}

export interface Candidate {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  email: string;
  senha: string;
  telefone: string;
  experiencia: string;
  data_cadastro: string;
  status: 'pending' | 'approved' | 'rejected';
  companyId: string;
  avaliacoes: Record<AssessmentType, CandidateAssessment | undefined>;
  observacoes?: string;
}

interface CandidateState {
  candidates: Candidate[];
  addCandidate: (candidateData: Omit<Candidate, 'id' | 'data_cadastro' | 'avaliacoes' | 'companyId'>) => void;
  updateCandidate: (id: string, candidateData: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  getCandidatesByCompany: (companyId: string) => Candidate[];
  updateCandidateAssessment: (id: string, assessment: CandidateAssessment) => void;
  getAssessmentProgress: (candidateId: string, type: AssessmentType) => CandidateAssessment | undefined;
  isTestCompleted: (candidateId: string, type: AssessmentType) => boolean;
}

export const useCandidateStore = create<CandidateState>()(
  persist(
    (set, get) => ({
      candidates: [],
      addCandidate: (candidateData) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        const newCandidate: Candidate = {
          ...candidateData,
          id: `candidate-${Date.now()}`,
          data_cadastro: new Date().toISOString(),
          companyId: currentUser.companyId,
          avaliacoes: {},
          status: 'pending'
        };

        set((state) => ({
          candidates: [...state.candidates, newCandidate]
        }));
      },
      updateCandidate: (id, candidateData) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        // Prevent changing company ID
        if (candidateData.companyId && candidateData.companyId !== currentUser.companyId) {
          throw new Error('Não é possível alterar a empresa do candidato');
        }

        set((state) => ({
          candidates: state.candidates.map((candidate) =>
            candidate.id === id && candidate.companyId === currentUser.companyId
              ? { ...candidate, ...candidateData }
              : candidate
          )
        }));
      },
      deleteCandidate: (id) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        set((state) => ({
          candidates: state.candidates.filter((candidate) => 
            !(candidate.id === id && candidate.companyId === currentUser.companyId)
          )
        }));
      },
      getCandidatesByCompany: (companyId) => {
        return get().candidates.filter(candidate => candidate.companyId === companyId);
      },
      updateCandidateAssessment: (id, assessment) => {
        set((state) => ({
          candidates: state.candidates.map((candidate) =>
            candidate.id === id
              ? {
                  ...candidate,
                  avaliacoes: {
                    ...candidate.avaliacoes,
                    [assessment.type]: {
                      ...assessment,
                      isCompleted: true
                    }
                  }
                }
              : candidate
          )
        }));
      },
      getAssessmentProgress: (candidateId, type) => {
        const candidate = get().candidates.find(c => c.id === candidateId);
        return candidate?.avaliacoes[type];
      },
      isTestCompleted: (candidateId, type) => {
        const candidate = get().candidates.find(c => c.id === candidateId);
        return candidate?.avaliacoes[type]?.isCompleted || false;
      }
    }),
    {
      name: 'candidate-storage',
    }
  )
);