import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWorkflowStore } from './workflowStore';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'new-hire';
  isPhoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        // Clear auth state
        set({ user: null, isAuthenticated: false });
        
        // Clear workflows
        useWorkflowStore.getState().clearWorkflows();
        
        // Clear local storage
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('workflow-storage');
        localStorage.removeItem('template-storage');
        localStorage.removeItem('invite-storage');
        localStorage.removeItem('workflow-access-storage');
      },
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);