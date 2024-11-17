import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useUserStore, User } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const { user: currentUser } = useAuthStore();
  const updateUser = useUserStore((state) => state.updateUser);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      updateUser(user.id_operador, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            <h2 className="text-xl font-semibold">Editar Usuário</h2>
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
                ID Operador *
              </label>
              <input
                type="text"
                name="id_operador"
                required
                value={formData.id_operador}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
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
                Sobrenome *
              </label>
              <input
                type="text"
                name="sobrenome"
                required
                value={formData.sobrenome}
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
                Senha *
              </label>
              <input
                type="password"
                name="senha"
                required
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perfil *
              </label>
              <select
                name="perfil"
                required
                value={formData.perfil}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Condutor">Condutor</option>
                <option value="Gestor">Gestor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNH
              </label>
              <input
                type="text"
                name="cnh"
                value={formData.cnh}
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

export default EditUserModal;