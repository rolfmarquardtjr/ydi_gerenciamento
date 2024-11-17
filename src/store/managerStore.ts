import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCompanyStore } from './companyStore';

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  companyId: string;
  status: 'active' | 'inactive';
  role: 'manager';
  createdAt: string;
}

interface ManagerState {
  managers: Manager[];
  addManager: (manager: Omit<Manager, 'id' | 'role' | 'createdAt'>) => void;
  updateManager: (id: string, manager: Partial<Manager>) => void;
  deleteManager: (id: string) => void;
  getManagersByCompany: (companyId: string) => Manager[];
}

export const useManagerStore = create<ManagerState>()(
  persist(
    (set, get) => ({
      managers: [{
        id: 'manager-1',
        name: 'Gestor IFAC',
        email: 'gestor@ifac.edu.br',
        phone: '(68) 98888-8888',
        password: 'gestor123',
        companyId: 'ifac-1',
        status: 'active',
        role: 'manager',
        createdAt: '2024-03-17T10:00:00.000Z'
      }],
      addManager: (managerData) => {
        const newManager: Manager = {
          ...managerData,
          id: `manager-${Date.now()}`,
          role: 'manager',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          managers: [...state.managers, newManager],
        }));

        const company = useCompanyStore.getState().getCompany(managerData.companyId);
        if (company) {
          useCompanyStore.getState().updateCompany(company.id, {
            managers: (company.managers || 0) + 1,
          });
        }
      },
      updateManager: (id, managerData) => {
        const oldManager = get().managers.find(m => m.id === id);
        
        set((state) => ({
          managers: state.managers.map((manager) =>
            manager.id === id ? { ...manager, ...managerData } : manager
          ),
        }));

        if (oldManager && managerData.companyId && oldManager.companyId !== managerData.companyId) {
          const oldCompany = useCompanyStore.getState().getCompany(oldManager.companyId);
          const newCompany = useCompanyStore.getState().getCompany(managerData.companyId);

          if (oldCompany) {
            useCompanyStore.getState().updateCompany(oldCompany.id, {
              managers: Math.max(0, (oldCompany.managers || 0) - 1),
            });
          }

          if (newCompany) {
            useCompanyStore.getState().updateCompany(newCompany.id, {
              managers: (newCompany.managers || 0) + 1,
            });
          }
        }
      },
      deleteManager: (id) => {
        const manager = get().managers.find(m => m.id === id);
        
        set((state) => ({
          managers: state.managers.filter((manager) => manager.id !== id),
        }));

        if (manager) {
          const company = useCompanyStore.getState().getCompany(manager.companyId);
          if (company) {
            useCompanyStore.getState().updateCompany(company.id, {
              managers: Math.max(0, (company.managers || 0) - 1),
            });
          }
        }
      },
      getManagersByCompany: (companyId) => {
        return get().managers.filter((manager) => manager.companyId === companyId);
      },
    }),
    {
      name: 'manager-storage',
    }
  )
);