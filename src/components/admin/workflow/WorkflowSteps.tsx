import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Share2, MessageCircle, Trash2, Save, Edit } from 'lucide-react';
import { useWorkflowStore } from '../../../store/workflowStore';
import { useTemplateStore } from '../../../store/templateStore';
import InviteUsersModal from './InviteUsersModal';
import WorkflowStepForm from './WorkflowStepForm';
import SaveAsTemplate from './SaveAsTemplate';
import StepMessages from '../../workflow/StepMessages';

interface WorkflowStepsProps {
  workflow: {
    id: string;
    title: string;
    type: string;
    steps: Array<{
      id: string;
      title: string;
      description: string;
      status: 'pending' | 'in-progress' | 'completed';
      dueInDays: number;
      assignees: string[];
      content?: any;
      messages?: Array<{
        id: string;
        userId: string;
        content: string;
        timestamp: string;
      }>;
    }>;
  };
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ workflow }) => {
  const { t } = useTranslation();
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState<any>(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const { updateWorkflow } = useWorkflowStore();
  const { addTemplate } = useTemplateStore();

  const handleDeleteStep = (stepId: string) => {
    updateWorkflow(workflow.id, {
      steps: workflow.steps.filter(step => step.id !== stepId)
    });
    setShowDeleteConfirm(null);
  };

  const handleStepUpdate = (stepId: string, updates: any) => {
    updateWorkflow(workflow.id, {
      steps: workflow.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    });
  };

  const handleEditStep = (step: any) => {
    setEditingStep(step);
    setShowStepForm(true);
  };

  const handleStepFormSubmit = (stepData: any) => {
    if (editingStep) {
      // Update existing step
      updateWorkflow(workflow.id, {
        steps: workflow.steps.map(step =>
          step.id === editingStep.id ? { ...step, ...stepData } : step
        )
      });
    } else {
      // Add new step
      updateWorkflow(workflow.id, {
        steps: [...workflow.steps, { ...stepData, id: `step-${Date.now()}`, messages: [] }]
      });
    }
    setShowStepForm(false);
    setEditingStep(null);
  };

  const handleSaveAsTemplate = (name: string, description: string) => {
    addTemplate({
      id: `template-${Date.now()}`,
      name,
      description,
      type: workflow.type,
      steps: workflow.steps.map(step => ({
        ...step,
        status: 'pending',
        messages: []
      }))
    });
    setShowSaveTemplate(false);
  };

  const handleSendMessage = (stepId: string, content: string, attachments?: File[]) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      userId: 'current-user',
      content,
      timestamp: new Date().toISOString()
    };

    updateWorkflow(workflow.id, {
      steps: workflow.steps.map(step =>
        step.id === stepId
          ? { ...step, messages: [...(step.messages || []), newMessage] }
          : step
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{workflow.title}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSaveTemplate(true)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            <Save className="w-4 h-4" />
            <span>{t('workflow.saveAsTemplate')}</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('workflow.shareAndInvite')}</span>
          </button>
          <button
            onClick={() => {
              setEditingStep(null);
              setShowStepForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>{t('workflow.steps.addStep')}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {workflow.steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Due in {step.dueInDays} days</span>
                    <span>{step.assignees.length} assignees</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditStep(step)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedStepId(selectedStepId === step.id ? null : step.id)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                      selectedStepId === step.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{(step.messages || []).length}</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(step.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDeleteConfirm === step.id && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 mb-4">
                    {t('workflow.steps.deleteConfirm')}
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      {t('common.delete')}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded hover:bg-gray-300"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {selectedStepId === step.id && (
                <div className="mt-4 border-t pt-4">
                  <StepMessages
                    messages={step.messages || []}
                    onSendMessage={(content, attachments) => 
                      handleSendMessage(step.id, content, attachments)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {workflow.steps.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">{t('workflow.steps.noSteps')}</p>
          </div>
        )}
      </div>

      {showInviteModal && (
        <InviteUsersModal
          workflowId={workflow.id}
          workflowTitle={workflow.title}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showStepForm && (
        <WorkflowStepForm
          step={editingStep}
          onSubmit={handleStepFormSubmit}
          onCancel={() => {
            setShowStepForm(false);
            setEditingStep(null);
          }}
        />
      )}

      {showSaveTemplate && (
        <SaveAsTemplate
          onSave={handleSaveAsTemplate}
          onClose={() => setShowSaveTemplate(false)}
        />
      )}
    </div>
  );
};

export default WorkflowSteps;