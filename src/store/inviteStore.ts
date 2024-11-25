import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Invite {
  token: string;
  workflowId: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

interface InviteStore {
  invites: Invite[];
  addInvite: (invite: Invite) => void;
  getInviteByToken: (token: string) => Invite | undefined;
  acceptInvite: (token: string) => void;
  expireInvite: (token: string) => void;
}

export const useInviteStore = create<InviteStore>()(
  persist(
    (set, get) => ({
      invites: [],
      
      addInvite: (invite) => set((state) => ({
        invites: [...state.invites, invite]
      })),
      
      getInviteByToken: (token) => {
        return get().invites.find(invite => invite.token === token);
      },
      
      acceptInvite: (token) => set((state) => ({
        invites: state.invites.map(invite =>
          invite.token === token
            ? { ...invite, status: 'accepted' }
            : invite
        )
      })),
      
      expireInvite: (token) => set((state) => ({
        invites: state.invites.map(invite =>
          invite.token === token
            ? { ...invite, status: 'expired' }
            : invite
        )
      })),
    }),
    {
      name: 'invite-storage',
    }
  )
);