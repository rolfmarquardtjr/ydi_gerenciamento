import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Brain, BookOpen, Settings, Upload, Eye, EyeOff } from 'lucide-react';
import { useDriverAreaConfigStore } from '../../store/driverAreaConfigStore';
import { useKnowledgeAssessmentStore } from '../../store/knowledgeAssessmentStore';
import { useNAVTAssessmentStore } from '../../store/navtAssessmentStore';
import ImportQuestionsModal from '../modals/ImportQuestionsModal';
import EditQuestionModal from '../modals/EditQuestionModal';

const DriverAreaConfig = () => {
  const { companyId } = useParams();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const { getConfig: getDriverConfig, updateConfig: updateDriverConfig } = useDriverAreaConfigStore();
  const { getConfig: getKnowledgeConfig, updateConfig: updateKnowledgeConfig, getQuestions } = useKnowledgeAssessmentStore();
  const { getConfig: getNAVTConfig, updateConfig: updateNAVTConfig } = useNAVTAssessmentStore();

  const driverConfig = companyId ? getDriverConfig(companyId) : null;
  const knowledgeConfig = companyId ? getKnowledgeConfig(companyId) : null;
  const navtConfig = companyId ? getNAVTConfig(companyId) : null;
  const questions = companyId ? getQuestions(companyId) : [];

  const handleKnowledgeConfigChange = (field: string, value: any) => {
    if (!companyId) return;
    updateKnowledgeConfig(companyId, { [field]: value });
  };

  const handleNAVTConfigChange = (field: string, value: any) => {
    if (!companyId) return;
    updateNAVTConfig(companyId, { [field]: value });
  };

  const handleDriverConfigChange = (field: string, value: any) => {
    if (!companyId) return;
    updateDriverConfig(companyId, { [field]: value });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Área do Condutor
      </h1>

      {/* Driver Area Elements */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Elementos Visíveis</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={driverConfig?.showTelemetryScore}
              onChange={(e) => handleDriverConfigChange('showTelemetryScore', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Score de Telemetria</span>
          </label>
          {/* Add other visibility toggles */}
        </div>
      </div>

      {/* Knowledge Assessment Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Avaliação de Conhecimento</h2>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={knowledgeConfig?.enabled}
              onChange={(e) => handleKnowledgeConfigChange('enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Habilitar Avaliação</span>
          </label>
        </div>

        {knowledgeConfig?.enabled && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo Limite (minutos)
                </label>
                <input
                  type="number"
                  value={knowledgeConfig.timeLimit}
                  onChange={(e) => handleKnowledgeConfigChange('timeLimit', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota Mínima (%)
                </label>
                <input
                  type="number"
                  value={knowledgeConfig.passingScore}
                  onChange={(e) => handleKnowledgeConfigChange('passingScore', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questões por Tipo
                </label>
                <input
                  type="number"
                  value={knowledgeConfig.questionsPerType}
                  onChange={(e) => handleKnowledgeConfigChange('questionsPerType', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Questões
                </label>
                <input
                  type="number"
                  value={knowledgeConfig.totalQuestions}
                  onChange={(e) => handleKnowledgeConfigChange('totalQuestions', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervalo para Retake (dias)
                </label>
                <input
                  type="number"
                  value={knowledgeConfig.retakeInterval}
                  onChange={(e) => handleKnowledgeConfigChange('retakeInterval', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={knowledgeConfig.shuffleQuestions}
                  onChange={(e) => handleKnowledgeConfigChange('shuffleQuestions', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Embaralhar ordem das questões</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={knowledgeConfig.shuffleAlternatives}
                  onChange={(e) => handleKnowledgeConfigChange('shuffleAlternatives', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Embaralhar alternativas</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={knowledgeConfig.allowRetake}
                  onChange={(e) => handleKnowledgeConfigChange('allowRetake', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Permitir refazer avaliação</span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="space-x-4">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Importar Questões
                </button>
                <button
                  onClick={() => setShowQuestions(!showQuestions)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {showQuestions ? (
                    <>
                      <EyeOff className="w-5 h-5 inline mr-2" />
                      Ocultar Questões
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5 inline mr-2" />
                      Visualizar Questões
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Question Bank Preview */}
            {showQuestions && (
              <div className="mt-6">
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {questions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600 mr-3">
                            #{question.seq}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                            {question.tipo}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="text-primary-600 hover:text-primary-700"
                          title="Editar questão"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-900 mb-3">{question.questao}</p>

                      <div className="grid grid-cols-2 gap-2">
                        {question.alternativas.map((alt, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-sm ${
                              alt.correta
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <span className="font-medium mr-1">
                              {['A', 'B', 'C', 'D'][index]}:
                            </span>
                            {alt.texto}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium">Fundamentação:</span> {question.fundamentacao}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* NAVT Assessment Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Avaliação NAVT</h2>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={navtConfig?.enabled}
              onChange={(e) => handleNAVTConfigChange('enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Habilitar NAVT</span>
          </label>
        </div>

        {navtConfig?.enabled && (
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={navtConfig.requiredForNewDrivers}
                onChange={(e) => handleNAVTConfigChange('requiredForNewDrivers', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Obrigatório para Novos Condutores</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={navtConfig.showResultsInDashboard}
                onChange={(e) => handleNAVTConfigChange('showResultsInDashboard', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Exibir Resultados no Dashboard</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={navtConfig.allowRetake}
                onChange={(e) => handleNAVTConfigChange('allowRetake', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Permitir Refazer o Teste</span>
            </label>

            {navtConfig.allowRetake && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervalo para Retake (dias)
                </label>
                <input
                  type="number"
                  value={navtConfig.retakeInterval}
                  onChange={(e) => handleNAVTConfigChange('retakeInterval', parseInt(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {companyId && (
        <>
          <ImportQuestionsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            companyId={companyId}
          />

          {selectedQuestion && (
            <EditQuestionModal
              isOpen={!!selectedQuestion}
              onClose={() => setSelectedQuestion(null)}
              question={selectedQuestion}
              companyId={companyId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DriverAreaConfig;