import { nanoid } from 'nanoid';

export interface WorkflowInvite {
  code: string;
  workflowId: string;
  email: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

const STORAGE_KEY = 'workflow-invites';

// Generate a 6-digit numeric code
export const generateInviteCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createInvite = (workflowId: string, email: string): WorkflowInvite => {
  const invite: WorkflowInvite = {
    code: generateInviteCode(),
    workflowId,
    email: email.toLowerCase(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };

  // Get existing invites
  const invites = getInvites();
  
  // Remove any existing invites for this email and workflow
  const filteredInvites = invites.filter(
    i => !(i.workflowId === workflowId && i.email === email)
  );
  
  // Add new invite
  filteredInvites.push(invite);
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInvites));

  return invite;
};

export const getInvites = (): WorkflowInvite[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const validateInvite = (email: string, code: string): WorkflowInvite | null => {
  const invites = getInvites();
  const invite = invites.find(
    i => i.email.toLowerCase() === email.toLowerCase() && 
         i.code === code && 
         i.status === 'pending'
  );

  if (!invite) return null;

  // Check if expired
  if (new Date(invite.expiresAt) < new Date()) {
    updateInviteStatus(invite.workflowId, invite.email, 'expired');
    return null;
  }

  return invite;
};

export const updateInviteStatus = (
  workflowId: string, 
  email: string, 
  status: WorkflowInvite['status']
): void => {
  const invites = getInvites();
  const updatedInvites = invites.map(invite => 
    invite.workflowId === workflowId && invite.email.toLowerCase() === email.toLowerCase()
      ? { ...invite, status }
      : invite
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvites));
};