import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useKnowledgeAssessmentStore, KnowledgeQuestion } from '../../store/knowledgeAssessmentStore';

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  question: KnowledgeQuestion;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  companyId,
  question
}) => {
  const updateQuestion = useKnowledgeAssessmentStore(state => state.updateQuestion);
  const [formData, setFormData] = useState<KnowledgeQuestion>(question);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuestion(companyId, question.id, formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAlternativeChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      alternativas: prev.alternativas.map((alt, i) => 
        i === index ? { ...alt, texto: value } : alt
      )
    }));
  };

  const handleCorrectAlternativeChange = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternativas: prev.alternativas.map((alt, i) => ({
        ...alt,
        correta: i === index
      }))
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Editar Questão</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sequência
              </label>
              <input
                type="number"
                name="seq"
                value={formData.seq}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questão
            </label>
            <textarea
              name="questao"
              value={formData.questao}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Alternativas</h3>
            {formData.alternativas.map((alt, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternativa {['A', 'B', 'C', 'D'][index]}
                  </label>
                  <textarea
                    value={alt.texto}
                    onChange={(e) => handleAlternativeChange(index, e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="pt-7">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={alt.correta}
                      onChange={() => handleCorrectAlternativeChange(index)}
                      className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Correta</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fundamentação
            </label>
            <textarea
              name="fundamentacao"
              value={formData.fundamentacao}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;