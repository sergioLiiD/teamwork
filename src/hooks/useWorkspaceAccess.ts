import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';

export const useWorkspaceAccess = (workspaceId: string) => {
  const { user } = useAuthStore();
  const { canManageWorkspace } = useWorkspaceStore();

  if (!user) {
    return {
      canView: false,
      canEdit: false,
      canManage: false,
      isOwner: false,
    };
  }

  const workspace = useWorkspaceStore.getState().workspaces.find(w => w.id === workspaceId);
  
  if (!workspace) {
    return {
      canView: false,
      canEdit: false,
      canManage: false,
      isOwner: false,
    };
  }

  const member = workspace.members.find(m => m.userId === user.id);
  const isOwner = workspace.ownerId === user.id;
  const isAdmin = member?.role === 'admin';

  return {
    canView: true,
    canEdit: isOwner || isAdmin || member?.role === 'member',
    canManage: isOwner || isAdmin,
    isOwner,
  };
};