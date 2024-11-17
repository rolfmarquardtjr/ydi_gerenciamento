import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAssessmentStore } from '../store/assessmentStore';
import { BookOpen, Timer, AlertCircle } from 'lucide-react';
import StartAssessmentModal from './modals/StartAssessmentModal';

const AssessmentView = () => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { getAssessmentsByCompany } = useAssessmentStore();

  // Get assessment for current user's company
  const assessment = user?.companyId ? getAssessmentsByCompany(user.companyId)[0] : null;

  if (!assessment) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma avaliação disponível
          </h3>
          <p className="text-gray-500">
            A avaliação de conhecimento ainda não foi configurada para sua empresa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Avaliação de Conhecimento</h3>
            <p className="text-gray-600 mt-1">
              Teste seus conhecimentos sobre direção segura e legislação
            </p>
          </div>
          <button
            onClick={() => setIsStartModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Iniciar Avaliação
          </button>
        </div>

        {/* Assessment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Total de Questões
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {assessment.settings.totalQuestions}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Timer className="w-4 h-4 mr-2" />
              Tempo Limite
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {assessment.settings.timeLimit} min
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              Nota Mínima
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {assessment.settings.passingScore}%
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Instruções</h3>
        <div className="space-y-3 text-gray-600">
          <p>• A avaliação contém {assessment.settings.totalQuestions} questões de múltipla escolha.</p>
          <p>• Você terá {assessment.settings.timeLimit} minutos para completar a avaliação.</p>
          <p>• A nota mínima para aprovação é {assessment.settings.passingScore}%.</p>
          <p>• Cada questão tem apenas uma alternativa correta.</p>
          <p>• Não é possível voltar às questões anteriores.</p>
          <p>• Certifique-se de ter uma conexão estável com a internet.</p>
        </div>
      </div>

      {/* Start Assessment Modal */}
      <StartAssessmentModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        assessment={assessment}
      />
    </div>
  );
};

export default AssessmentView;