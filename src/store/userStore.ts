import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as XLSX from 'xlsx';
import { useAuthStore } from './authStore';

export interface User {
  id_operador: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  senha: string;
  grupos: string; // companyId
  perfil: 'Gestor' | 'Condutor';
  telefone?: string;
  observacoes?: string;
  cnh?: string;
  categoria_cnh?: string;
  nr_seguranca_cnh?: string;
  renach?: string;
  data_nascimento?: string;
}

interface UserState {
  users: User[];
  importUsers: (file: File) => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsersByCompany: (companyId: string) => User[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      importUsers: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }) as any[];

              // Get current user's company ID
              const currentUser = useAuthStore.getState().user;
              if (!currentUser?.companyId) {
                reject(new Error('Usuário não está associado a uma empresa'));
                return;
              }

              // Field mapping for case-insensitive matching
              const fieldMapping: { [key: string]: string } = {
                'id operador': 'id_operador',
                'idoperador': 'id_operador',
                'id_operador': 'id_operador',
                'nome': 'nome',
                'sobrenome': 'sobrenome',
                'cpf': 'cpf',
                'e-mail': 'email',
                'email': 'email',
                'senha': 'senha',
                'grupos': 'grupos',
                'perfil': 'perfil'
              };

              // Map fields and normalize data
              const processedData = jsonData.map((row, index) => {
                const normalizedRow: any = {};
                
                // Convert all keys to lowercase for comparison
                const rowWithLowerKeys = Object.fromEntries(
                  Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
                );

                // Map each required field
                Object.entries(fieldMapping).forEach(([sourceKey, targetKey]) => {
                  const value = rowWithLowerKeys[sourceKey.toLowerCase()];
                  if (value !== undefined) {
                    normalizedRow[targetKey] = value;
                  }
                });

                // Force company ID to match current user's company
                normalizedRow.grupos = currentUser.companyId;

                // Copy any additional fields
                Object.entries(row).forEach(([key, value]) => {
                  if (!Object.values(fieldMapping).includes(key)) {
                    normalizedRow[key] = value;
                  }
                });

                return normalizedRow;
              });

              // Validate required fields
              const requiredFields = ['id_operador', 'nome', 'sobrenome', 'cpf', 'email', 'senha', 'grupos', 'perfil'];
              const missingFields = processedData.reduce((acc: string[], user, index) => {
                const missing = requiredFields.filter(field => !user[field]);
                if (missing.length > 0) {
                  acc.push(`Linha ${index + 2}: campos obrigatórios faltando: ${missing.join(', ')}`);
                }
                return acc;
              }, []);

              if (missingFields.length > 0) {
                reject(new Error(missingFields.join('\n')));
                return;
              }

              // Validate unique id_operador within the company
              const existingUsers = get().getUsersByCompany(currentUser.companyId);
              const uniqueIds = new Set();
              const duplicateIds = processedData.reduce((acc: string[], user, index) => {
                if (uniqueIds.has(user.id_operador) || 
                    existingUsers.some(u => u.id_operador === user.id_operador)) {
                  acc.push(`Linha ${index + 2}: ID Operador já existe na empresa: ${user.id_operador}`);
                }
                uniqueIds.add(user.id_operador);
                return acc;
              }, []);

              if (duplicateIds.length > 0) {
                reject(new Error(duplicateIds.join('\n')));
                return;
              }

              // Process and validate the data
              const validatedData = processedData.map(user => ({
                ...user,
                perfil: user.perfil === 'Gestor' ? 'Gestor' : 'Condutor'
              })) as User[];

              set({ users: [...get().users, ...validatedData] });
              resolve();
            } catch (error) {
              reject(new Error('Erro ao processar o arquivo. Verifique se o formato está correto.'));
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsArrayBuffer(file);
        });
      },
      addUser: (user: User) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        // Force company ID to match current user's company
        user.grupos = currentUser.companyId;

        // Check if ID already exists in the same company
        const existingUser = get().getUsersByCompany(currentUser.companyId)
          .find(u => u.id_operador === user.id_operador);

        if (existingUser) {
          throw new Error('ID Operador já existe nesta empresa');
        }

        set((state) => ({
          users: [...state.users, user]
        }));
      },
      updateUser: (id: string, userData: Partial<User>) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        // Prevent changing company ID
        if (userData.grupos && userData.grupos !== currentUser.companyId) {
          throw new Error('Não é possível alterar a empresa do usuário');
        }

        // Check if new ID already exists in the same company
        if (userData.id_operador) {
          const existingUser = get().getUsersByCompany(currentUser.companyId)
            .find(u => u.id_operador === userData.id_operador && u.id_operador !== id);
            
          if (existingUser) {
            throw new Error('ID Operador já existe nesta empresa');
          }
        }

        set((state) => ({
          users: state.users.map((user) =>
            user.id_operador === id && user.grupos === currentUser.companyId
              ? { ...user, ...userData }
              : user
          )
        }));
      },
      deleteUser: (id: string) => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser?.companyId) {
          throw new Error('Usuário não está associado a uma empresa');
        }

        set((state) => ({
          users: state.users.filter((user) => 
            !(user.id_operador === id && user.grupos === currentUser.companyId)
          )
        }));
      },
      getUsersByCompany: (companyId: string) => {
        return get().users.filter(user => user.grupos === companyId);
      }
    }),
    {
      name: 'user-storage',
    }
  )
);