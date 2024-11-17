import React, { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useKnowledgeAssessmentStore } from '../../store/knowledgeAssessmentStore';

interface ImportQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

const ImportQuestionsModal: React.FC<ImportQuestionsModalProps> = ({ isOpen, onClose, companyId }) => {
  const { importQuestions, getQuestions } = useKnowledgeAssessmentStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    totalQuestions: number;
    questionTypes: { tipo: string; count: number; }[];
  } | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsUploading(true);

    if (!file.name.endsWith('.xlsx')) {
      setError('Por favor, selecione um arquivo XLSX válido.');
      setIsUploading(false);
      return;
    }

    try {
      await importQuestions(companyId, file);
      setSuccess(true);
      
      // Show success message with details
      const questions = getQuestions(companyId);
      const questionTypes = [...new Set(questions.map(q => q.tipo))];
      
      setSuccessDetails({
        totalQuestions: questions.length,
        questionTypes: questionTypes.map(tipo => ({
          tipo,
          count: questions.filter(q => q.tipo === tipo).length
        }))
      });

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      let errorMessage = 'Erro ao processar o arquivo.';
      if (err instanceof Error) {
        if (err.message.includes('Colunas obrigatórias')) {
          errorMessage = err.message;
        } else if (err.message.includes('Linha')) {
          errorMessage = `Erro na planilha: ${err.message}`;
        }
      }
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Importar Questões</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isUploading ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
        >
          {isUploading ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-primary-700">Processando arquivo...</p>
            </motion.div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arraste e solte seu arquivo XLSX aqui ou
              </p>
              <label className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-700">
                  selecione um arquivo
                </span>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                  }}
                />
              </label>
            </>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start"
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </motion.div>
        )}

        {success && successDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 rounded-lg"
          >
            <div className="flex items-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">
                Questões importadas com sucesso!
              </span>
            </div>
            <div className="text-sm text-green-600">
              <p>Total de questões: {successDetails.totalQuestions}</p>
              <div className="mt-2">
                <p className="font-medium mb-1">Distribuição por tipo:</p>
                <ul className="space-y-1">
                  {successDetails.questionTypes.map(({ tipo, count }) => (
                    <li key={tipo} className="flex justify-between">
                      <span>{tipo}:</span>
                      <span className="font-medium">{count} questões</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImportQuestionsModal;