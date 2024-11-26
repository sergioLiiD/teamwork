import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWorkflowStore } from './workflowStore';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Clear auth state
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        
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