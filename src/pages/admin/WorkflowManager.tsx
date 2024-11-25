import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NewWorkflowDialog from '../../components/admin/workflow/NewWorkflowDialog';
import WorkflowList from '../../components/admin/workflow/WorkflowList';
import { useWorkflowStore } from '../../store/workflowStore';
import { useTemplateStore } from '../../store/templateStore';

const WorkflowManager: React.FC = () => {
  const { t } = useTranslation();
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const { addWorkflow } = useWorkflowStore();
  const { getTemplateById } = useTemplateStore();

  const handleCreateWorkflow = (workflowData: any) => {
    const template = workflowData.templateId 
      ? getTemplateById(workflowData.templateId)
      : null;

    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name: workflowData.title,
      title: workflowData.title,
      description: workflowData.description,
      type: workflowData.type,
      steps: template?.steps || [],
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    addWorkflow(newWorkflow);
    setShowNewWorkflow(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('workflow.title')}
        </h2>
        <button
          onClick={() => setShowNewWorkflow(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>{t('workflow.createNew')}</span>
        </button>
      </div>

      <WorkflowList />

      {showNewWorkflow && (
        <NewWorkflowDialog
          onClose={() => setShowNewWorkflow(false)}
          onCreateWorkflow={handleCreateWorkflow}
        />
      )}
    </div>
  );
};

export default WorkflowManager;