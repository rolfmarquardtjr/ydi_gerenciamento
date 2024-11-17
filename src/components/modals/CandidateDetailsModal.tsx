import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { useCandidateStore, Candidate } from '../../store/candidateStore';

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({ isOpen, onClose, candidate }) => {
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    psicotecnico: candidate.avaliacoes.psicotecnico?.score || 0,
    teorico: candidate.avaliacoes.teorico?.score || 0,
    pratico: candidate.avaliacoes.pratico?.score || 0,
    observacoes: candidate.observacoes || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateStatus = async (status: Candidate['status']) => {
    try {
      await updateCandidate(candidate.id, { status });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  const handleSaveEvaluations = async () => {
    try {
      const now = new Date().toISOString();
      await updateCandidate(candidate.id, {
        avaliacoes: {
          psicotecnico: {
            score: Number(formData.psicotecnico),
            data: now
          },
          teorico: {
            score: Number(formData.teorico),
            data: now
          },
          pratico: {
            score: Number(formData.pratico),
            data: now
          }
        },
        observacoes: formData.observacoes
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar avaliações');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Detalhes do Candidato</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Candidate Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.nome}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.cpf}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CNH</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.cnh}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.telefone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experiência</label>
            <p className="mt-1 text-sm text-gray-900">{candidate.experiencia}</p>
          </div>
        </div>

        {/* Evaluations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Avaliações</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teste Psicotécnico (0-100)
              </label>
              <input
                type="number"
                name="psicotecnico"
                min="0"
                max="100"
                value={formData.psicotecnico}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teste Teórico (0-100)
              </label>
              <input
                type="number"
                name="teorico"
                min="0"
                max="100"
                value={formData.teorico}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teste Prático (0-100)
              </label>
              <input
                type="number"
                name="pratico"
                min="0"
                max="100"
                value={formData.pratico}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Observations */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            name="observacoes"
            rows={3}
            value={formData.observacoes}
            onChange={handleInputChange}
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="space-x-4">
            <button
              onClick={() => handleUpdateStatus('approved')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Aprovar
            </button>
            <button
              onClick={() => handleUpdateStatus('rejected')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Reprovar
            </button>
          </div>
          <button
            onClick={handleSaveEvaluations}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Salvar Avaliações
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;