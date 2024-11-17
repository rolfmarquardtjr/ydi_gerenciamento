import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import AssessmentConfigPanel from './admin/AssessmentConfigPanel';
import AssessmentConfigSummary from './admin/AssessmentConfigSummary';

const CompanySelectionProcess = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const company = useCompanyStore((state) => state.getCompany(companyId || ''));

  if (!company) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Empresa não encontrada</p>
          <button
            onClick={() => navigate('/admin/companies')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Voltar para lista de empresas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/admin/companies')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para lista de empresas
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Configuração do Processo Seletivo
        </h1>
        <p className="text-gray-600 mt-1">
          {company.nomeFantasia}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração dos Testes */}
        <div className="lg:col-span-2">
          <AssessmentConfigPanel companyId={company.id} />
        </div>

        {/* Resumo das Configurações */}
        <div>
          <AssessmentConfigSummary companyId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default CompanySelectionProcess;