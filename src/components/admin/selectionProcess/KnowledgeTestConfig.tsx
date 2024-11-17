import React, { useState } from 'react';
import { Upload, Edit, Plus, AlertCircle } from 'lucide-react';
import { useAssessmentStore } from '../../../store/assessmentStore';
import EditQuestionModal from '../../modals/EditQuestionModal';

interface KnowledgeTestConfigProps {
  companyId: string;
  config: any;
  onSave: (config: any) => void;
}

const KnowledgeTestConfig: React.FC<KnowledgeTestConfigProps> = ({ 
  companyId, 
  config: providedConfig, 
  onSave 
}) => {
  const [localConfig, setLocalConfig] = useState(providedConfig || {
    weight: 30,
    timeLimit: 1200,
    passingScore: 70,
    questionsPerType: 2,
    totalQuestions: 20,
    shuffleQuestions: true,
    shuffleAlternatives: true
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);

  const questions = useAssessmentStore(state => 
    state.getQuestionsByCompany(companyId, 'selection')
  );

  const handleSettingChange = (key: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localConfig);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(providedConfig);
    setHasChanges(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadError(null);
      await useAssessmentStore.getState().importQuestions(file, 'selection', companyId);
      setHasChanges(true);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao importar questões');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Teste de Conhecimento</h3>
          <p className="text-sm text-gray-600">
            Configure o banco de questões e parâmetros
          </p>
        </div>
        <button
          onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
          className="text-primary-600 hover:text-primary-700"
        >
          {showQuestionsPreview ? 'Ocultar Questões' : 'Visualizar Questões'}
        </button>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso na Avaliação (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localConfig.weight}
            onChange={(e) => handleSettingChange('weight', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tempo Limite (minutos)
          </label>
          <input
            type="number"
            min="1"
            value={Math.floor(localConfig.timeLimit / 60)}
            onChange={(e) => handleSettingChange('timeLimit', Number(e.target.value) * 60)}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nota Mínima (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={localConfig.passingScore}
            onChange={(e) => handleSettingChange('passingScore', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Questões por Tipo
          </label>
          <input
            type="number"
            min="1"
            value={localConfig.questionsPerType}
            onChange={(e) => handleSettingChange('questionsPerType', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total de Questões
          </label>
          <input
            type="number"
            min="1"
            value={localConfig.totalQuestions}
            onChange={(e) => handleSettingChange('totalQuestions', Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Shuffle Options */}
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={localConfig.shuffleQuestions}
            onChange={(e) => handleSettingChange('shuffleQuestions', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            Embaralhar ordem das questões
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={localConfig.shuffleAlternatives}
            onChange={(e) => handleSettingChange('shuffleAlternatives', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            Embaralhar alternativas
          </span>
        </label>
      </div>

      {/* Question Bank Upload */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Banco de Questões
        </h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Arraste e solte a planilha de questões ou
            </p>
            <label className="cursor-pointer">
              <span className="text-primary-600 hover:text-primary-700">
                clique para selecionar
              </span>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
          </div>
        </div>
        {uploadError && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {uploadError}
          </div>
        )}
      </div>

      {/* Questions Preview */}
      {showQuestionsPreview && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              Questões Cadastradas ({questions.length})
            </h4>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {questions.map((question) => (
              <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        Questão {question.seq}
                      </span>
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {question.tipo}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-900">{question.questao}</p>
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(question)}
                    className="ml-4 text-primary-600 hover:text-primary-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {question.alternativas.map((alt: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        idx === question.alternativaCorreta
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span className="text-sm">
                        {['A', 'B', 'C', 'D'][idx]}) {alt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg border ${
            hasChanges
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Resetar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg ${
            hasChanges
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Salvar Alterações
        </button>
      </div>

      {/* Edit Question Modal */}
      {selectedQuestion && (
        <EditQuestionModal
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          question={selectedQuestion}
          companyId={companyId}
        />
      )}
    </div>
  );
};

export default KnowledgeTestConfig;