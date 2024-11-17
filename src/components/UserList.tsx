import React, { useState } from 'react';
import { Users, Upload, Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { useUserStore, User } from '../store/userStore';
import ImportDataModal from './ImportDataModal';
import CreateUserModal from './modals/CreateUserModal';
import EditUserModal from './modals/EditUserModal';
import { useAuthStore } from '../store/authStore';

const UserList = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuthStore();
  const getUsersByCompany = useUserStore((state) => state.getUsersByCompany);
  const deleteUser = useUserStore((state) => state.deleteUser);

  // Get only users from current company
  const users = currentUser?.companyId ? getUsersByCompany(currentUser.companyId) : [];

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      return (
        `${user.nome} ${user.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Novo Usuário
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-5 h-5 mr-2" />
            Importar Usuários
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Operador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id_operador} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nome} {user.sobrenome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.perfil === 'Condutor'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.perfil}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.id_operador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id_operador)}
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

      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        type="users"
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
        />
      )}
    </div>
  );
};

export default UserList;