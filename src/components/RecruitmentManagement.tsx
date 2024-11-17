import React, { useState } from 'react';
import { Search, UserPlus, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useCandidateStore, Candidate } from '../store/candidateStore';
import { useAuthStore } from '../store/authStore';
import { useAssessmentConfigStore } from '../store/assessmentConfigStore';
import CreateCandidateModal from './modals/CreateCandidateModal';
import EditCandidateModal from './modals/EditCandidateModal';
import CandidateDetailsModal from './modals/CandidateDetailsModal';
import CandidateProgressList from './recruitment/CandidateProgressList';
import AssessmentStats from './recruitment/AssessmentStats';

const RecruitmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  
  const { user: currentUser } = useAuthStore();
  const getCandidatesByCompany = useCandidateStore((state) => state.getCandidatesByCompany);
  const configs = useAssessmentConfigStore(state => 
    currentUser?.companyId ? state.getConfigsByCompany(currentUser.companyId) : []
  );

  // Get candidates for current company
  const candidates = currentUser?.companyId ? getCandidatesByCompany(currentUser.companyId) : [];

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.cpf.includes(searchTerm) ||
      candidate.email.toLowerCase().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processo Seletivo</h1>
          <p className="text-gray-600 mt-1">Gerencie os candidatos e avaliações</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Candidato
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovados</option>
          <option value="rejected">Reprovados</option>
        </select>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.nome}</div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      candidate.status === 'approved' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.status === 'approved' ? 'Aprovado' :
                       candidate.status === 'rejected' ? 'Reprovado' :
                       'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(candidate.data_cadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditCandidate(candidate)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CandidateProgressList 
            candidates={filteredCandidates}
            assessmentConfigs={configs}
          />
        </div>
        <div>
          <AssessmentStats 
            candidates={candidates}
            assessmentConfigs={configs}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateCandidateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingCandidate && (
        <EditCandidateModal
          isOpen={!!editingCandidate}
          onClose={() => setEditingCandidate(null)}
          candidate={editingCandidate}
        />
      )}

      {selectedCandidate && (
        <CandidateDetailsModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
};

export default RecruitmentManagement;