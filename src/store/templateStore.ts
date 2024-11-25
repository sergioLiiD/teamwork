import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'client' | 'employee';
  steps: Array<{
    id: string;
    title: string;
    description: string;
    type: 'video' | 'document' | 'quiz' | 'checklist';
    content: {
      text?: string;
      videoUrl?: string;
      documents?: string[];
      quiz?: {
        questions: Array<{
          question: string;
          options: string[];
          correctAnswer: string;
        }>;
      };
      todos?: Array<{
        text: string;
        required: boolean;
      }>;
    };
    dueInDays: number;
  }>;
}

interface TemplateStore {
  templates: WorkflowTemplate[];
  addTemplate: (template: WorkflowTemplate) => void;
  updateTemplate: (id: string, template: Partial<WorkflowTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => WorkflowTemplate | undefined;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template]
      })),
      
      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(template =>
          template.id === id
            ? { ...template, ...updates }
            : template
        )
      })),
      
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(template => template.id !== id)
      })),
      
      getTemplateById: (id) => {
        return get().templates.find(template => template.id === id);
      },
    }),
    {
      name: 'template-storage',
    }
  )
);