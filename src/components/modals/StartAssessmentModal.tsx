import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Assessment } from '../../store/assessmentStore';
import { useAssessmentProgressStore } from '../../store/assessmentProgressStore';
import { useNavigate } from 'react-router-dom';

interface StartAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment;
}

const StartAssessmentModal: React.FC<StartAssessmentModalProps> = ({
  isOpen,
  onClose,
  assessment
}) => {
  const navigate = useNavigate();
  const startAssessment = useAssessmentProgressStore((state) => state.startAssessment);

  const handleStart = () => {
    startAssessment(assessment);
    onClose();
    navigate('/assessment-exam');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Iniciar Avaliação</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Você está prestes a iniciar a avaliação de conhecimento. Certifique-se de:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
              <span className="text-sm text-gray-600">
                Ter {assessment.settings.timeLimit} minutos disponíveis ininterruptos
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
              <span className="text-sm text-gray-600">
                Estar em um ambiente calmo e sem distrações
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 mr-2" />
              <span className="text-sm text-gray-600">
                Ter uma conexão estável com a internet
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-yellow-700">
            <strong>Atenção:</strong> Após iniciar, você não poderá pausar ou reiniciar a avaliação.
            O tempo começará a contar imediatamente.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Iniciar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartAssessmentModal;