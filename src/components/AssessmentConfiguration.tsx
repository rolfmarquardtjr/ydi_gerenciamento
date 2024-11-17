import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Settings, Upload } from 'lucide-react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useCompanyStore } from '../store/companyStore';
import ImportQuestionsModal from './modals/ImportQuestionsModal';
import AssessmentSettingsModal from './modals/AssessmentSettingsModal';
import EditQuestionModal from './modals/EditQuestionModal';

const AssessmentConfiguration = () => {
  const { companyId } = useParams();
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState<any>(null);
  
  const { getAssessmentsByCompany, initializeAssessment } = useAssessmentStore();
  const { getCompany } = useCompanyStore();

  // Get company's assessment and company info
  const companyAssessments = companyId ? getAssessmentsByCompany(companyId, 'selection') : [];
  const companyAssessment = companyAssessments[0];
  const company = companyId ? getCompany(companyId) : null;

  useEffect(() => {
    if (companyId && companyAssessments.length === 0) {
      initializeAssessment(companyId, 'selection');
    }
  }, [companyId, companyAssessments.length, initializeAssessment]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Avaliação de Conhecimento
          </h1>
          <p className="text-gray-600 mt-1">
            {company ? `Configuração para ${company.nomeFantasia}` : 'Configure o banco de questões e as regras da avaliação'}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Upload className="w-5 h-5 mr-2" />
            Importar Questões
          </button>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-5 h-5 mr-2" />
            Configurações
          </button>
        </div>
      </div>

      {/* Assessment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Questões Cadastradas
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {companyAssessment?.questions?.length || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Settings className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Tempo da Prova
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {companyAssessment?.settings?.timeLimit 
              ? Math.floor(companyAssessment.settings.timeLimit / 60)
              : 20} min
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Nota Mínima
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {companyAssessment?.settings?.passingScore || 70}%
          </p>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Questões Cadastradas</h3>
        <div className="max-h-[600px] overflow-y-auto pr-4 -mr-4">
          <div className="space-y-6">
            {companyAssessment?.questions?.map((question) => (
              <div key={question.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Questão {question.seq} - {question.tipo}
                  </span>
                  <button
                    onClick={() => setSelectedQuestion(question)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-900 mb-3">{question.questao}</p>
                <div className="grid grid-cols-2 gap-4">
                  {question.alternativas.map((alt, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        i === question.alternativaCorreta
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="text-sm">
                        {['A', 'B', 'C', 'D'][i]}) {alt}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Fundamentação:</span> {question.fundamentacao}
                  </p>
                </div>
              </div>
            ))}
            {(!companyAssessment?.questions || companyAssessment.questions.length === 0) && (
              <p className="text-center text-gray-500">
                Nenhuma questão cadastrada. Importe o banco de questões para começar.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {companyId && (
        <>
          <ImportQuestionsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            companyId={companyId}
          />
          <AssessmentSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            companyId={companyId}
            assessment={companyAssessment}
          />
          {selectedQuestion && (
            <EditQuestionModal
              isOpen={!!selectedQuestion}
              onClose={() => setSelectedQuestion(null)}
              question={selectedQuestion}
              assessmentId={companyAssessment?.id || ''}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssessmentConfiguration;