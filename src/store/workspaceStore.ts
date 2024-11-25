import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkspaceRole = 'owner' | 'admin' | 'member';

interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  addedAt: string;
}

interface Workspace {
  id: string;
  name: string;
  members: WorkspaceMember[];
  createdAt: string;
  ownerId: string;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  addMember: (workspaceId: string, member: WorkspaceMember) => void;
  removeMember: (workspaceId: string, userId: string) => void;
  updateMemberRole: (workspaceId: string, userId: string, role: WorkspaceRole) => void;
  getUserWorkspaces: (userId: string) => Workspace[];
  canManageWorkspace: (workspaceId: string, userId: string) => boolean;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace]
      })),
      
      updateWorkspace: (id, updates) => set((state) => ({
        workspaces: state.workspaces.map(workspace =>
          workspace.id === id ? { ...workspace, ...updates } : workspace
        )
      })),
      
      deleteWorkspace: (id) => set((state) => ({
        workspaces: state.workspaces.filter(workspace => workspace.id !== id)
      })),
      
      addMember: (workspaceId, member) => set((state) => ({
        workspaces: state.workspaces.map(workspace =>
          workspace.id === workspaceId
            ? { ...workspace, members: [...workspace.members, member] }
            : workspace
        )
      })),
      
      removeMember: (workspaceId, userId) => set((state) => ({
        workspaces: state.workspaces.map(workspace =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                members: workspace.members.filter(m => m.userId !== userId)
              }
            : workspace
        )
      })),
      
      updateMemberRole: (workspaceId, userId, role) => set((state) => ({
        workspaces: state.workspaces.map(workspace =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                members: workspace.members.map(m =>
                  m.userId === userId ? { ...m, role } : m
                )
              }
            : workspace
        )
      })),
      
      getUserWorkspaces: (userId) => {
        return get().workspaces.filter(workspace =>
          workspace.ownerId === userId ||
          workspace.members.some(m => m.userId === userId)
        );
      },
      
      canManageWorkspace: (workspaceId, userId) => {
        const workspace = get().workspaces.find(w => w.id === workspaceId);
        if (!workspace) return false;
        
        // Owner has full access
        if (workspace.ownerId === userId) return true;
        
        // Check member role
        const member = workspace.members.find(m => m.userId === userId);
        return member?.role === 'admin';
      },
    }),
    {
      name: 'workspace-storage',
    }
  )
);