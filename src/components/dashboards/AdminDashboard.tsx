import React, { useState } from 'react';
import { Building2, UserPlus, Settings, Users, Brain, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompanyStore } from '../../store/companyStore';
import { useManagerStore } from '../../store/managerStore';
import CreateCompanyModal from '../modals/CreateCompanyModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const companies = useCompanyStore((state) => state.companies);
  const managers = useManagerStore((state) => state.managers);

  // Calculate total drivers across all companies
  const totalDrivers = companies.reduce((sum, company) => sum + (company.drivers || 0), 0);

  const metrics = [
    {
      id: '1',
      title: 'Empresas Cadastradas',
      value: companies.length.toString(),
      icon: Building2,
      trend: '+12%',
      trendUp: true,
      description: 'Total de empresas ativas'
    },
    {
      id: '2',
      title: 'Gestores',
      value: managers.length.toString(),
      icon: Users,
      trend: '+8%',
      trendUp: true,
      description: 'Gestores ativos'
    },
    {
      id: '3',
      title: 'Motoristas',
      value: totalDrivers.toString(),
      icon: Briefcase,
      trend: '+15%',
      trendUp: true,
      description: 'Total de condutores'
    },
    {
      id: '4',
      title: 'Processos Seletivos',
      value: companies.length.toString(),
      icon: Brain,
      trend: '+5%',
      trendUp: true,
      description: 'Processos configurados'
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de Empresas e Usuários
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Building2 className="w-5 h-5 mr-2" />
            Nova Empresa
          </button>
          <button
            onClick={() => navigate('/admin/managers/new')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Novo Gestor
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-primary-600" />
              </div>
              <span className={`text-sm font-medium ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Empresas Cadastradas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestores
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motoristas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{company.nomeFantasia}</div>
                          <div className="text-sm text-gray-500">{company.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.managers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.drivers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => navigate(`/admin/companies/${company.id}/selection-process`)}
                        className="text-primary-600 hover:text-primary-700 mr-4"
                      >
                        Configurar Processo Seletivo
                      </button>
                      <button className="text-primary-600 hover:text-primary-700">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(companyData) => {
          useCompanyStore.getState().addCompany(companyData);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminDashboard;