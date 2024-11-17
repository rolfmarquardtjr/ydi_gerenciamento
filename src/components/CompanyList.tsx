import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../store/companyStore';
import { Building2, Users, Trash2, Edit, Settings, BookOpen, Mail, Phone, Globe, MapPin, UserCog } from 'lucide-react';
import CreateCompanyModal from './modals/CreateCompanyModal';
import EditCompanyModal from './modals/EditCompanyModal';
import type { Company } from '../store/companyStore';

const CompanyList = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const { companies, addCompany, updateCompany, deleteCompany } = useCompanyStore();

  const handleCreateCompany = (companyData: any) => {
    addCompany(companyData);
  };

  const handleEditCompany = (companyData: Partial<Company>) => {
    if (editCompany) {
      updateCompany(editCompany.id, companyData);
    }
    setEditCompany(null);
  };

  const handleConfigureSelectionProcess = (companyId: string) => {
    navigate(`/admin/companies/${companyId}/selection-process`);
  };

  const handleConfigureAssessment = (companyId: string) => {
    navigate(`/admin/companies/${companyId}/assessment`);
  };

  const handleConfigureDriverArea = (companyId: string) => {
    navigate(`/admin/companies/${companyId}/driver-area`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Empresas Cadastradas</h2>
          <p className="text-gray-600 mt-1">Gerencie as empresas e suas configurações</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Building2 className="w-5 h-5 mr-2" />
          Nova Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.nomeFantasia}</h3>
                    <p className="text-sm text-gray-500">{company.razaoSocial}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditCompany(company)}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Editar empresa"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteCompany(company.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir empresa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 text-gray-400 mr-1.5" />
                    <span className="text-gray-600">Gestores</span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{company.managers}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 text-gray-400 mr-1.5" />
                    <span className="text-gray-600">Condutores</span>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{company.drivers}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="px-6 py-4 bg-gray-50 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{company.telefone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                <span>{company.website}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span>{company.cidade} - {company.estado}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-white border-t border-gray-100">
              <div className="space-y-2">
                <button 
                  onClick={() => handleConfigureSelectionProcess(company.id)}
                  className="flex items-center w-full p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Configurar Processo Seletivo</span>
                </button>
                <button 
                  onClick={() => handleConfigureAssessment(company.id)}
                  className="flex items-center w-full p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Configurar Avaliação de Conhecimento</span>
                </button>
                <button 
                  onClick={() => handleConfigureDriverArea(company.id)}
                  className="flex items-center w-full p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Configurar Área do Condutor</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCompany}
      />

      {editCompany && (
        <EditCompanyModal
          isOpen={!!editCompany}
          onClose={() => setEditCompany(null)}
          onSubmit={handleEditCompany}
          company={editCompany}
        />
      )}
    </div>
  );
};

export default CompanyList;