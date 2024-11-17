import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useAssessmentStore, Assessment } from '../../store/assessmentStore';

interface AssessmentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  assessment: Assessment | null;
}

const AssessmentSettingsModal: React.FC<AssessmentSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  companyId,
  assessment 
}) => {
  const [settings, setSettings] = useState({
    timeLimit: assessment?.settings?.timeLimit || 120,
    passingScore: assessment?.settings?.passingScore || 70,
    shuffleQuestions: assessment?.settings?.shuffleQuestions || true,
    shuffleAlternatives: assessment?.settings?.shuffleAlternatives || true,
    questionsPerType: assessment?.settings?.questionsPerType || 2,
    totalQuestions: assessment?.settings?.totalQuestions || 20,
  });

  const handleSave = () => {
    if (assessment) {
      useAssessmentStore.getState().updateAssessment(assessment.id, {
        settings,
      });
    } else {
      useAssessmentStore.getState().addAssessment({
        companyId,
        title: 'Avaliação de Conhecimento',
        description: 'Avaliação padrão de conhecimento',
        questions: [],
        settings,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Settings className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Configurações da Avaliação</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo Limite (minutos)
            </label>
            <input
              type="number"
              value={settings.timeLimit}
              onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota Mínima para Aprovação (%)
            </label>
            <input
              type="number"
              value={settings.passingScore}
              onChange={(e) => setSettings(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questões por Tipo
            </label>
            <input
              type="number"
              value={settings.questionsPerType}
              onChange={(e) => setSettings(prev => ({ ...prev, questionsPerType: Number(e.target.value) }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total de Questões na Prova
            </label>
            <input
              type="number"
              value={settings.totalQuestions}
              onChange={(e) => setSettings(prev => ({ ...prev, totalQuestions: Number(e.target.value) }))}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.shuffleQuestions}
                onChange={(e) => setSettings(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Embaralhar ordem das questões
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.shuffleAlternatives}
                onChange={(e) => setSettings(prev => ({ ...prev, shuffleAlternatives: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Embaralhar ordem das alternativas
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSettingsModal;