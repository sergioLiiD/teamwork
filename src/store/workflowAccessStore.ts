import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkflowAccess {
  workflowId: string;
  userId: string;
  role: 'viewer' | 'participant';
  inviteToken?: string;
  status: 'pending' | 'active';
}

interface WorkflowAccessState {
  accessList: WorkflowAccess[];
  addAccess: (access: WorkflowAccess) => void;
  removeAccess: (workflowId: string, userId: string) => void;
  hasAccess: (workflowId: string, userId: string) => boolean;
  getAccess: (workflowId: string, userId: string) => WorkflowAccess | undefined;
  activateAccess: (workflowId: string, userId: string) => void;
}

export const useWorkflowAccessStore = create<WorkflowAccessState>()(
  persist(
    (set, get) => ({
      accessList: [],
      
      addAccess: (access) => set((state) => ({
        accessList: [...state.accessList, access]
      })),
      
      removeAccess: (workflowId, userId) => set((state) => ({
        accessList: state.accessList.filter(
          a => !(a.workflowId === workflowId && a.userId === userId)
        )
      })),
      
      hasAccess: (workflowId, userId) => {
        const access = get().accessList.find(
          a => a.workflowId === workflowId && 
               a.userId === userId && 
               a.status === 'active'
        );
        return !!access;
      },
      
      getAccess: (workflowId, userId) => {
        return get().accessList.find(
          a => a.workflowId === workflowId && a.userId === userId
        );
      },
      
      activateAccess: (workflowId, userId) => set((state) => ({
        accessList: state.accessList.map(access => 
          access.workflowId === workflowId && access.userId === userId
            ? { ...access, status: 'active' }
            : access
        )
      })),
    }),
    {
      name: 'workflow-access-storage',
    }
  )
);