import React from 'react';
import { X, Clock, Users, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  stepsCount: number;
  lastUsed: string;
  usageCount: number;
  steps: Array<{
    title: string;
    description: string;
    type: string;
    content: any;
    dueInDays: number;
  }>;
}

interface TemplatesListProps {
  onSelect: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ onSelect, onClose }) => {
  const { t } = useTranslation();

  // Mock data - Replace with actual templates from your backend
  const MOCK_TEMPLATES: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Sales Team Onboarding',
      description: 'Complete onboarding process for new sales team members',
      type: 'sales',
      stepsCount: 8,
      lastUsed: '2024-03-15',
      usageCount: 12,
      steps: [
        {
          title: 'Welcome and Introduction',
          description: 'Introduction to the company and team',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/welcome',
            text: 'Welcome to our sales team! This video will introduce you to our company culture, values, and your role in the organization.',
            documents: ['Welcome_Package.pdf']
          },
          dueInDays: 1
        },
        {
          title: 'Company Policies',
          description: 'Review important company policies and procedures',
          type: 'document',
          content: {
            text: 'Please review our company policies carefully and acknowledge receipt.',
            documents: [
              'Employee_Handbook.pdf',
              'Sales_Policies.pdf',
              'Code_of_Conduct.pdf'
            ]
          },
          dueInDays: 2
        },
        {
          title: 'Sales Tools Training',
          description: 'Learn to use our essential sales tools and CRM',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/crm-training',
            text: 'Complete training on our CRM system and sales tools.',
            documents: ['CRM_Guide.pdf', 'Sales_Tools_Manual.pdf']
          },
          dueInDays: 3
        },
        {
          title: 'Product Knowledge Assessment',
          description: 'Test your understanding of our products',
          type: 'quiz',
          content: {
            quiz: {
              questions: [
                {
                  question: 'What is our flagship product?',
                  options: ['Product A', 'Product B', 'Product C', 'Product D'],
                  correctAnswer: 'Product A'
                },
                {
                  question: 'What are the key features of Product B?',
                  options: [
                    'Feature 1, 2, 3',
                    'Feature 2, 3, 4',
                    'Feature 3, 4, 5',
                    'Feature 4, 5, 6'
                  ],
                  correctAnswer: 'Feature 1, 2, 3'
                }
              ]
            }
          },
          dueInDays: 5
        },
        {
          title: 'Sales Process Overview',
          description: 'Learn our sales methodology and process',
          type: 'document',
          content: {
            text: 'Review our sales methodology and complete the checklist.',
            documents: ['Sales_Methodology.pdf'],
            todos: [
              { text: 'Review sales stages', required: true },
              { text: 'Complete mock sales call', required: true },
              { text: 'Set up sales tools', required: true }
            ]
          },
          dueInDays: 7
        }
      ]
    },
    {
      id: '2',
      name: 'Client Onboarding',
      description: 'Standard process for new client setup and orientation',
      type: 'client',
      stepsCount: 6,
      lastUsed: '2024-03-10',
      usageCount: 25,
      steps: [
        {
          title: 'Welcome Package',
          description: 'Send welcome materials and gather initial information',
          type: 'checklist',
          content: {
            text: 'Complete all initial client setup tasks',
            todos: [
              { text: 'Send welcome email', required: true },
              { text: 'Schedule kickoff call', required: true },
              { text: 'Send client questionnaire', required: true },
              { text: 'Create client folder', required: true }
            ]
          },
          dueInDays: 1
        },
        {
          title: 'Account Setup',
          description: 'Set up client accounts and access',
          type: 'document',
          content: {
            text: 'Complete account setup and documentation',
            documents: ['Account_Setup_Guide.pdf'],
            todos: [
              { text: 'Create client portal account', required: true },
              { text: 'Set up billing information', required: true },
              { text: 'Configure user access', required: true }
            ]
          },
          dueInDays: 2
        },
        {
          title: 'Kickoff Meeting',
          description: 'Initial client meeting and project planning',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/client-kickoff',
            text: 'Prepare for and conduct the client kickoff meeting',
            documents: ['Kickoff_Agenda.pdf', 'Project_Timeline.pdf']
          },
          dueInDays: 3
        },
        {
          title: 'Requirements Gathering',
          description: 'Collect and document client requirements',
          type: 'document',
          content: {
            text: 'Document all client requirements and specifications',
            documents: ['Requirements_Template.pdf'],
            todos: [
              { text: 'Complete requirements document', required: true },
              { text: 'Get client approval', required: true }
            ]
          },
          dueInDays: 5
        }
      ]
    },
    {
      id: '3',
      name: 'New Employee Orientation',
      description: 'General employee onboarding and orientation process',
      type: 'employee',
      stepsCount: 7,
      lastUsed: '2024-03-12',
      usageCount: 18,
      steps: [
        {
          title: 'First Day Setup',
          description: 'Essential first-day tasks and introductions',
          type: 'checklist',
          content: {
            text: 'Complete all first-day setup tasks',
            todos: [
              { text: 'Set up workstation', required: true },
              { text: 'Configure email account', required: true },
              { text: 'Complete HR paperwork', required: true },
              { text: 'Team introductions', required: true }
            ]
          },
          dueInDays: 1
        },
        {
          title: 'HR Orientation',
          description: 'Review company policies and benefits',
          type: 'document',
          content: {
            text: 'Review all HR policies and benefit information',
            documents: [
              'Employee_Handbook.pdf',
              'Benefits_Guide.pdf',
              'IT_Security_Policy.pdf'
            ]
          },
          dueInDays: 2
        },
        {
          title: 'Department Training',
          description: 'Specific department orientation and training',
          type: 'video',
          content: {
            videoUrl: 'https://example.com/dept-training',
            text: 'Complete department-specific training modules',
            documents: ['Department_Guide.pdf']
          },
          dueInDays: 5
        },
        {
          title: 'Systems Access',
          description: 'Set up and learn company systems',
          type: 'checklist',
          content: {
            text: 'Complete system access setup and training',
            todos: [
              { text: 'Set up VPN access', required: true },
              { text: 'Configure development environment', required: true },
              { text: 'Complete security training', required: true }
            ]
          },
          dueInDays: 3
        },
        {
          title: 'Company Knowledge Check',
          description: 'Verify understanding of company policies',
          type: 'quiz',
          content: {
            quiz: {
              questions: [
                {
                  question: 'What is our company mission?',
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                  correctAnswer: 'Option A'
                },
                {
                  question: 'What is the procedure for requesting time off?',
                  options: ['Process A', 'Process B', 'Process C', 'Process D'],
                  correctAnswer: 'Process B'
                }
              ]
            }
          },
          dueInDays: 7
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">Select Template</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>{template.stepsCount} steps</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{template.usageCount} uses</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Last used {new Date(template.lastUsed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesList;