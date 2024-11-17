import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useCandidateStore, Candidate } from '../../store/candidateStore';

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

const EditCandidateModal: React.FC<EditCandidateModalProps> = ({ isOpen, onClose, candidate }) => {
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Candidate>>({
    nome: candidate.nome,
    cpf: candidate.cpf,
    cnh: candidate.cnh,
    email: candidate.email,
    senha: candidate.senha,
    telefone: candidate.telefone,
    experiencia: candidate.experiencia,
    status: candidate.status,
    observacoes: candidate.observacoes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      updateCandidate(candidate.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar candidato');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <UserPlus className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Editar Candidato</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                required
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNH *
              </label>
              <input
                type="text"
                name="cnh"
                required
                value={formData.cnh}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Reprovado</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experiência
              </label>
              <input
                type="text"
                name="experiencia"
                value={formData.experiencia}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="col-span-2">
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

export default EditCandidateModal;