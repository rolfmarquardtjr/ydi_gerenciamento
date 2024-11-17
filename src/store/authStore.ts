import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useManagerStore } from './managerStore';
import { useUserStore } from './userStore';
import { useCandidateStore } from './candidateStore';

export type UserRole = 'admin' | 'manager' | 'driver' | 'candidate';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Admin credentials
const ADMIN_USER = {
  id: '1',
  email: 'admin@younder.com.br',
  password: 'admin123',
  name: 'Administrador',
  role: 'admin' as UserRole
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        // Check admin credentials
        if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
          const { password: _, ...adminUser } = ADMIN_USER;
          set({ isAuthenticated: true, user: adminUser });
          return true;
        }

        // Check manager credentials
        const managers = useManagerStore.getState().managers;
        const manager = managers.find(m => m.email === email && m.password === password);
        
        if (manager) {
          set({ 
            isAuthenticated: true, 
            user: {
              id: manager.id,
              email: manager.email,
              name: manager.name,
              role: 'manager',
              companyId: manager.companyId
            }
          });
          return true;
        }

        // Check user credentials
        const users = useUserStore.getState().users;
        const user = users.find(u => u.email === email && u.senha === password);
        
        if (user) {
          set({
            isAuthenticated: true,
            user: {
              id: user.id_operador,
              email: user.email,
              name: `${user.nome} ${user.sobrenome}`,
              role: user.perfil === 'Condutor' ? 'driver' : 'candidate',
              companyId: user.grupos
            }
          });
          return true;
        }

        // Check candidate credentials
        const candidates = useCandidateStore.getState().candidates;
        const candidate = candidates.find(c => c.email === email && c.senha === password);

        if (candidate) {
          set({
            isAuthenticated: true,
            user: {
              id: candidate.id,
              email: candidate.email,
              name: candidate.nome,
              role: 'candidate',
              companyId: candidate.companyId
            }
          });
          return true;
        }

        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);