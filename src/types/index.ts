export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'quiz' | 'checklist';
  status: 'pending' | 'in-progress' | 'completed';
  content: string;
  resources?: string[];
  assignedTo?: string[];
  dueDate?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'new-hire';
  avatar?: string;
}

export interface Message {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  isRead?: boolean;
}