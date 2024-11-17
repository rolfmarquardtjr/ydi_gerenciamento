import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Edit, Building2 } from 'lucide-react';
import { useManagerStore } from '../store/managerStore';
import { useCompanyStore } from '../store/companyStore';
import CreateManagerModal from './modals/CreateManagerModal';

const ManagerList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { managers, addManager, deleteManager } = useManagerStore();
  const companies = useCompanyStore((state) => state.companies);

  const handleCreateManager = (managerData: any) => {
    addManager(managerData);
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.nomeFantasia || 'Empresa não encontrada';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestores</h1>
          <p className="text-gray-600 mt-1">Gerencie os gestores das empresas</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Gestor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {managers.map((manager) => (
                  <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{manager.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{getCompanyName(manager.companyId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{manager.email}</div>
                      <div className="text-sm text-gray-500">{manager.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        manager.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {manager.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteManager(manager.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateManagerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateManager}
      />
    </div>
  );
};

export default ManagerList;