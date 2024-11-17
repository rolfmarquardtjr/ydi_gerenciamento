import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assessment } from './assessmentStore';

interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  answers: { [questionId: string]: number };
  timeRemaining: number;
  isComplete: boolean;
  score?: number;
  startedAt: string;
  questions: Array<{
    id: string;
    questao: string;
    alternativas: string[];
    alternativaCorreta: number;
    tipo: string;
  }>;
}

interface AssessmentProgressState {
  currentProgress: AssessmentProgress | null;
  startAssessment: (assessment: Assessment) => void;
  answerQuestion: (questionId: string, answerIndex: number) => void;
  updateTimeRemaining: (time: number) => void;
  completeAssessment: () => void;
  resetProgress: () => void;
}

export const useAssessmentProgressStore = create<AssessmentProgressState>()(
  persist(
    (set, get) => ({
      currentProgress: null,
      startAssessment: (assessment: Assessment) => {
        // Prepare questions for the assessment
        const availableQuestions = [...assessment.questions];
        const selectedQuestions: typeof availableQuestions = [];
        const questionsByType: { [key: string]: typeof availableQuestions } = {};

        // Group questions by type
        availableQuestions.forEach(question => {
          if (!questionsByType[question.tipo]) {
            questionsByType[question.tipo] = [];
          }
          questionsByType[question.tipo].push(question);
        });

        // Select questions per type
        Object.values(questionsByType).forEach(questions => {
          const shuffled = assessment.settings.shuffleQuestions
            ? questions.sort(() => Math.random() - 0.5)
            : questions;
          
          selectedQuestions.push(...shuffled.slice(0, assessment.settings.questionsPerType));
        });

        // Shuffle final question set if needed
        const finalQuestions = assessment.settings.shuffleQuestions
          ? selectedQuestions.sort(() => Math.random() - 0.5)
          : selectedQuestions;

        // Initialize progress
        set({
          currentProgress: {
            assessmentId: assessment.id,
            currentQuestion: 0,
            answers: {},
            timeRemaining: assessment.settings.timeLimit * 60, // Convert to seconds
            isComplete: false,
            startedAt: new Date().toISOString(),
            questions: finalQuestions.slice(0, assessment.settings.totalQuestions).map(q => ({
              id: q.id,
              questao: q.questao,
              alternativas: assessment.settings.shuffleAlternatives
                ? [...q.alternativas].sort(() => Math.random() - 0.5)
                : q.alternativas,
              alternativaCorreta: q.alternativaCorreta,
              tipo: q.tipo,
            })),
          },
        });
      },
      answerQuestion: (questionId: string, answerIndex: number) => {
        set(state => {
          if (!state.currentProgress) return state;

          const newAnswers = {
            ...state.currentProgress.answers,
            [questionId]: answerIndex,
          };

          const isLastQuestion = 
            state.currentProgress.currentQuestion === 
            state.currentProgress.questions.length - 1;

          return {
            currentProgress: {
              ...state.currentProgress,
              answers: newAnswers,
              currentQuestion: isLastQuestion
                ? state.currentProgress.currentQuestion
                : state.currentProgress.currentQuestion + 1,
            },
          };
        });
      },
      updateTimeRemaining: (time: number) => {
        set(state => {
          if (!state.currentProgress) return state;
          return {
            currentProgress: {
              ...state.currentProgress,
              timeRemaining: time,
            },
          };
        });
      },
      completeAssessment: () => {
        set(state => {
          if (!state.currentProgress) return state;

          // Calculate score
          const totalQuestions = state.currentProgress.questions.length;
          const correctAnswers = Object.entries(state.currentProgress.answers)
            .reduce((acc, [questionId, answerIndex]) => {
              const question = state.currentProgress?.questions
                .find(q => q.id === questionId);
              return acc + (question?.alternativaCorreta === answerIndex ? 1 : 0);
            }, 0);

          const score = (correctAnswers / totalQuestions) * 100;

          return {
            currentProgress: {
              ...state.currentProgress,
              isComplete: true,
              score,
            },
          };
        });
      },
      resetProgress: () => {
        set({ currentProgress: null });
      },
    }),
    {
      name: 'assessment-progress-storage',
    }
  )
);