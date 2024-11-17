import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  website: string;
  telefone: string;
  email: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelNome: string;
  responsavelEmail: string;
  responsavelTelefone: string;
  createdAt: string;
  managers: number;
  drivers: number;
}

interface CompanyState {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'managers' | 'drivers'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompany: (id: string) => Company | undefined;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: [{
        id: 'ifac-1',
        cnpj: '10.918.674/0001-23',
        razaoSocial: 'Instituto Federal do Acre',
        nomeFantasia: 'IFAC',
        website: 'https://ifac.edu.br',
        telefone: '(68) 3224-1801',
        email: 'contato@ifac.edu.br',
        logradouro: 'Rua Coronel José Galdino',
        numero: '495',
        bairro: 'Bosque',
        cidade: 'Rio Branco',
        estado: 'AC',
        cep: '69900-640',
        responsavelNome: 'João da Silva',
        responsavelEmail: 'joao.silva@ifac.edu.br',
        responsavelTelefone: '(68) 99999-9999',
        createdAt: '2024-03-17T10:00:00.000Z',
        managers: 1,
        drivers: 0
      }],
      addCompany: (companyData) => {
        const newCompany: Company = {
          ...companyData,
          id: `company-${Date.now()}`,
          createdAt: new Date().toISOString(),
          managers: 0,
          drivers: 0,
        };
        set((state) => ({
          companies: [...state.companies, newCompany],
        }));
      },
      updateCompany: (id, companyData) => {
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...companyData } : company
          ),
        }));
      },
      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((company) => company.id !== id),
        }));
      },
      getCompany: (id) => {
        return get().companies.find((company) => company.id === id);
      },
    }),
    {
      name: 'company-storage',
    }
  )
);