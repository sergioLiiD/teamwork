import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, MessageCircle, FileText, Video, ClipboardCheck, Lock } from 'lucide-react';
import StepMessages from '../components/workflow/StepMessages';
import StepContent from '../components/workflow/StepContent';
import { useNotificationStore } from '../store/notificationStore';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

// Mock data - Replace with actual API call
const MOCK_USER = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=john'
};

const MOCK_WORKFLOW = {
  id: 'workflow-1',
  title: 'Sales Team Onboarding',
  steps: [
    {
      id: 'step-1',
      title: 'Welcome and Introduction',
      description: 'Get started with your onboarding journey',
      status: 'completed',
      content: {
        text: 'Welcome to the team! This is your first step in the onboarding process.',
        videoUrl: 'https://example.com/welcome-video',
      },
      dueInDays: 1,
      assignees: ['mentor@example.com'],
      messages: []
    },
    {
      id: 'step-2',
      title: 'Company Policies',
      description: 'Review important company policies and guidelines',
      status: 'in-progress',
      content: {
        text: 'Please review the following company policies carefully.',
        documents: ['Company Handbook.pdf', 'Code of Conduct.pdf'],
        todos: [
          { text: 'Read Company Handbook', required: true },
          { text: 'Sign Code of Conduct', required: true }
        ]
      },
      dueInDays: 3,
      assignees: ['hr@example.com'],
      messages: []
    },
    {
      id: 'step-3',
      title: 'Initial Training',
      description: 'Complete your first training module',
      status: 'pending',
      content: {
        text: 'Complete the training module and quiz.',
        videoUrl: 'https://example.com/training-video',
        quiz: {
          questions: [
            {
              question: 'What is our company\'s main value?',
              options: ['Innovation', 'Integrity', 'Growth', 'Excellence'],
              correctAnswer: 'Integrity'
            }
          ]
        }
      },
      dueInDays: 5,
      assignees: ['trainer@example.com'],
      messages: []
    }
  ]
};

const UserWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const { workflowId } = useParams();
  const [user] = useState(MOCK_USER);
  const [workflow] = useState(MOCK_WORKFLOW);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const addNotification = useNotificationStore(state => state.addNotification);

  const totalSteps = workflow.steps.length;
  const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / totalSteps) * 100;

  const getStepStatus = (step: typeof workflow.steps[0], index: number) => {
    if (step.status === 'completed') {
      return { text: 'Completed', icon: <CheckCircle className="w-5 h-5 text-green-500" /> };
    }

    if (step.status === 'in-progress') {
      return { text: 'In Progress', icon: <Clock className="w-5 h-5 text-yellow-500" /> };
    }

    const previousIncomplete = workflow.steps
      .slice(0, index)
      .some(s => s.status !== 'completed');

    if (previousIncomplete) {
      return { text: 'Locked', icon: <Lock className="w-5 h-5 text-gray-400" /> };
    }

    return { text: 'Pending', icon: <AlertCircle className="w-5 h-5 text-gray-400" /> };
  };

  const handleStepComplete = (stepId: string) => {
    // Update step status logic here
    addNotification({
      type: 'success',
      message: 'Step completed successfully!',
      workflowId,
      stepId
    });
  };

  const handleSendMessage = (stepId: string, content: string, attachments?: File[]) => {
    // Send message logic here
    addNotification({
      type: 'info',
      message: 'New message in workflow step',
      workflowId,
      stepId
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <h2 className="text-sm font-medium text-gray-600">{t('userWorkflow.welcome')}</h2>
                <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{workflow.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('userWorkflow.progress.completed', { total: totalSteps })}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {progress.toFixed(0)}%
            </div>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {workflow.steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isLocked = status.text === 'Locked';
            const isActive = selectedStep === step.id;

            return (
              <div
                key={step.id}
                className={`border-2 rounded-lg transition-all ${
                  isActive ? 'border-blue-500' : 'border-gray-200'
                } ${isLocked ? 'opacity-50' : 'hover:border-gray-300'}`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {status.icon}
                      <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    </div>
                    {isLocked && (
                      <span className="text-sm text-gray-500">
                        {t('userWorkflow.steps.locked')}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{step.description}</p>

                  {isActive ? (
                    <div className="mt-4 space-y-4">
                      <StepContent
                        step={step}
                        onComplete={() => handleStepComplete(step.id)}
                      />
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {t('userWorkflow.steps.messages')}
                        </h4>
                        <StepMessages
                          messages={step.messages}
                          onSendMessage={(content, attachments) => 
                            handleSendMessage(step.id, content, attachments)
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedStep(step.id)}
                      disabled={isLocked}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserWorkflow;