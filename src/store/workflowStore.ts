import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: string;
  content: any;
  dueInDays: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Workflow {
  id: string;
  name: string;
  title?: string;
  description: string;
  type: string;
  status: 'draft' | 'active' | 'archived';
  steps: WorkflowStep[];
  createdAt: string;
}

interface WorkflowStore {
  workflows: Workflow[];
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflowById: (id: string) => Workflow | undefined;
  clearWorkflows: () => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      workflows: [],
      
      addWorkflow: (workflow) => set((state) => ({
        workflows: [...state.workflows, workflow]
      })),
      
      updateWorkflow: (id, updates) => set((state) => ({
        workflows: state.workflows.map(workflow =>
          workflow.id === id ? { ...workflow, ...updates } : workflow
        )
      })),
      
      deleteWorkflow: (id) => set((state) => ({
        workflows: state.workflows.filter(workflow => workflow.id !== id)
      })),
      
      getWorkflowById: (id) => {
        return get().workflows.find(workflow => workflow.id === id);
      },

      clearWorkflows: () => set({ workflows: [] }),
    }),
    {
      name: 'workflow-storage',
    }
  )
);