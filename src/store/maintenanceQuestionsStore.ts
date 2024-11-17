import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MaintenanceQuestion {
  id: string;
  companyId: string;
  question: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  category: string;
}

interface MaintenanceQuestionsState {
  questions: MaintenanceQuestion[];
  addQuestions: (companyId: string, questions: Omit<MaintenanceQuestion, 'id' | 'companyId'>[]) => void;
  getQuestionsByCompany: (companyId: string) => MaintenanceQuestion[];
  updateQuestion: (id: string, question: Partial<MaintenanceQuestion>) => void;
  deleteQuestion: (id: string) => void;
}

// Questões padrão para demonstração
const defaultQuestions: Omit<MaintenanceQuestion, 'id' | 'companyId'>[] = [
  {
    question: "Qual é a função principal do sistema de arrefecimento do motor?",
    options: [
      {
        id: "1",
        text: "Controlar a temperatura do motor, evitando superaquecimento",
        isCorrect: true,
        explanation: "O sistema de arrefecimento mantém a temperatura do motor em níveis seguros, prevenindo danos por superaquecimento."
      },
      {
        id: "2",
        text: "Aumentar a potência do motor",
        isCorrect: false,
        explanation: "A potência do motor não está diretamente relacionada ao sistema de arrefecimento."
      },
      {
        id: "3",
        text: "Melhorar o consumo de combustível",
        isCorrect: false,
        explanation: "Embora um motor em temperatura adequada tenha melhor eficiência, esta não é a função principal do sistema."
      },
      {
        id: "4",
        text: "Reduzir o ruído do motor",
        isCorrect: false,
        explanation: "O sistema de arrefecimento não tem relação direta com o ruído do motor."
      }
    ],
    category: "Motor"
  },
  {
    question: "Por que é importante verificar regularmente o nível do óleo do motor?",
    options: [
      {
        id: "1",
        text: "Para garantir a lubrificação adequada e proteção do motor",
        isCorrect: true,
        explanation: "O óleo é essencial para lubrificar, resfriar e proteger as peças móveis do motor contra desgaste."
      },
      {
        id: "2",
        text: "Apenas para melhorar o desempenho do veículo",
        isCorrect: false,
        explanation: "Embora o óleo afete o desempenho, sua função principal é a proteção do motor."
      },
      {
        id: "3",
        text: "Para economizar combustível",
        isCorrect: false,
        explanation: "A economia de combustível não é a função principal do óleo do motor."
      },
      {
        id: "4",
        text: "Somente para reduzir a emissão de gases",
        isCorrect: false,
        explanation: "A redução de emissões não é a função principal do óleo do motor."
      }
    ],
    category: "Motor"
  },
  {
    question: "Qual a importância da calibragem correta dos pneus?",
    options: [
      {
        id: "1",
        text: "Garante segurança, economia de combustível e durabilidade dos pneus",
        isCorrect: true,
        explanation: "A calibragem correta afeta diretamente a segurança, o consumo de combustível e a vida útil dos pneus."
      },
      {
        id: "2",
        text: "Serve apenas para melhorar a aparência do veículo",
        isCorrect: false,
        explanation: "A calibragem não tem relação com a aparência do veículo."
      },
      {
        id: "3",
        text: "É importante apenas para economizar combustível",
        isCorrect: false,
        explanation: "A economia é apenas um dos benefícios da calibragem correta."
      },
      {
        id: "4",
        text: "Afeta somente o conforto ao dirigir",
        isCorrect: false,
        explanation: "O conforto é apenas um dos aspectos afetados pela calibragem correta."
      }
    ],
    category: "Pneus"
  },
  {
    question: "O que deve ser verificado no sistema de freios durante a manutenção preventiva?",
    options: [
      {
        id: "1",
        text: "Nível do fluido, desgaste das pastilhas e discos",
        isCorrect: true,
        explanation: "Estes são os principais itens que garantem o funcionamento seguro do sistema de freios."
      },
      {
        id: "2",
        text: "Apenas o nível do fluido de freio",
        isCorrect: false,
        explanation: "A verificação apenas do fluido é insuficiente para garantir a segurança do sistema."
      },
      {
        id: "3",
        text: "Somente a espessura dos discos",
        isCorrect: false,
        explanation: "Verificar apenas os discos não é suficiente para a manutenção completa."
      },
      {
        id: "4",
        text: "Apenas a cor do fluido de freio",
        isCorrect: false,
        explanation: "A cor do fluido é apenas um dos indicadores do sistema."
      }
    ],
    category: "Freios"
  },
  {
    question: "Quais são os sinais de que a bateria do veículo precisa ser substituída?",
    options: [
      {
        id: "1",
        text: "Dificuldade na partida, luzes fracas e vida útil próxima ao fim",
        isCorrect: true,
        explanation: "Estes são os principais sinais de que a bateria está chegando ao fim de sua vida útil."
      },
      {
        id: "2",
        text: "Apenas quando o carro não liga",
        isCorrect: false,
        explanation: "Esperar o carro não ligar pode deixar você em situações complicadas."
      },
      {
        id: "3",
        text: "Somente quando as luzes estão fracas",
        isCorrect: false,
        explanation: "Luzes fracas são apenas um dos sinais de problema na bateria."
      },
      {
        id: "4",
        text: "Quando o rádio não funciona",
        isCorrect: false,
        explanation: "Problemas no rádio podem ter outras causas além da bateria."
      }
    ],
    category: "Elétrica"
  }
];

export const useMaintenanceQuestionsStore = create<MaintenanceQuestionsState>()(
  persist(
    (set, get) => ({
      questions: [],
      
      addQuestions: (companyId, newQuestions) => {
        const questionsWithIds = newQuestions.map(question => ({
          ...question,
          id: `maintenance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          companyId
        }));

        set(state => ({
          questions: [...state.questions, ...questionsWithIds]
        }));
      },

      getQuestionsByCompany: (companyId) => {
        const questions = get().questions.filter(q => q.companyId === companyId);
        if (questions.length === 0) {
          // Inicializa com questões padrão se não houver nenhuma
          get().addQuestions(companyId, defaultQuestions);
          return get().questions.filter(q => q.companyId === companyId);
        }
        return questions;
      },

      updateQuestion: (id, questionData) => {
        set(state => ({
          questions: state.questions.map(question =>
            question.id === id ? { ...question, ...questionData } : question
          )
        }));
      },

      deleteQuestion: (id) => {
        set(state => ({
          questions: state.questions.filter(question => question.id !== id)
        }));
      }
    }),
    {
      name: 'maintenance-questions-storage'
    }
  )
);