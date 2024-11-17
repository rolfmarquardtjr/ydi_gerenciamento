import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { Company } from '../../store/companyStore';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: Partial<Company>) => void;
  company: Company;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, onSubmit, company }) => {
  const [formData, setFormData] = useState<Partial<Company>>(company);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setFormData(company);
      setCurrentStep(1);
    }
  }, [isOpen, company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Editar Empresa</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              Dados e Endereço
            </div>
            <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              Responsável
            </div>
          </div>
          <div className="relative mt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 1) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    required
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    name="razaoSocial"
                    required
                    value={formData.razaoSocial}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    name="nomeFantasia"
                    required
                    value={formData.nomeFantasia}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
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
                    name="telefone"
                    required
                    value={formData.telefone}
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
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      name="logradouro"
                      required
                      value={formData.logradouro}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      name="numero"
                      required
                      value={formData.numero}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      required
                      value={formData.bairro}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      required
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="estado"
                      required
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      required
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Dados do Responsável</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="responsavelNome"
                    required
                    value={formData.responsavelNome}
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
                    name="responsavelEmail"
                    required
                    value={formData.responsavelEmail}
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
                    name="responsavelTelefone"
                    required
                    value={formData.responsavelTelefone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
            )}
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="ml-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Salvar Alterações
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;