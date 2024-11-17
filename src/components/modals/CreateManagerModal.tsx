import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';

interface CreateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (managerData: any) => void;
}

const CreateManagerModal: React.FC<CreateManagerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const companies = useCompanyStore((state) => state.companies);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyId: '',
    password: '',
    confirmPassword: '',
    status: 'active' as const,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyId: '',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <UserPlus className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Novo Gestor</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
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
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <select
              name="companyId"
              required
              value={formData.companyId}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.nomeFantasia}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Criar Gestor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManagerModal;