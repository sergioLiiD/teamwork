import React, { useState } from 'react';
import { useWorkflowStore } from '../../../store/workflowStore';
import { Clock, Users, FileText, ChevronRight, Trash2, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WorkflowSteps from './WorkflowSteps';

const WorkflowList: React.FC = () => {
  const { t } = useTranslation();
  const { workflows, deleteWorkflow, updateWorkflow } = useWorkflowStore(state => ({
    workflows: state.workflows,
    deleteWorkflow: state.deleteWorkflow,
    updateWorkflow: state.updateWorkflow
  }));
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingWorkflow, setEditingWorkflow] = useState<string | null>(null);

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('workflow.noWorkflows')}
        </h3>
        <p className="text-gray-500">
          {t('workflow.createFirst')}
        </p>
      </div>
    );
  }

  if (selectedWorkflow) {
    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (!workflow) return null;

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedWorkflow(null)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← {t('common.back')}
        </button>
        <WorkflowSteps workflow={workflow} />
      </div>
    );
  }

  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflow(id);
    setShowDeleteConfirm(null);
  };

  const handleEditWorkflow = (workflow: any) => {
    updateWorkflow(workflow.id, {
      title: workflow.title,
      description: workflow.description,
      type: workflow.type
    });
    setEditingWorkflow(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden relative group"
        >
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingWorkflow(workflow.id);
              }}
              className="p-2 text-gray-400 hover:text-blue-600"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(workflow.id);
              }}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div onClick={() => setSelectedWorkflow(workflow.id)} className="cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {workflow.title || workflow.name}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {workflow.description}
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{workflow.steps.length} {t('workflow.steps.total')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{t(`workflow.types.${workflow.type}`)}</span>
                </div>
              </div>
            </div>
          </div>

          {showDeleteConfirm === workflow.id && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-sm text-gray-900 mb-4">
                  {t('workflow.deleteConfirm')}
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkflow(workflow.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    {t('common.delete')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-300"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingWorkflow === workflow.id && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Workflow</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEditWorkflow(workflow);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={workflow.title}
                        onChange={(e) => updateWorkflow(workflow.id, { title: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={workflow.description}
                        onChange={(e) => updateWorkflow(workflow.id, { description: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={workflow.type}
                        onChange={(e) => updateWorkflow(workflow.id, { type: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="custom">{t('workflow.types.custom')}</option>
                        <option value="sales">{t('workflow.types.sales')}</option>
                        <option value="client">{t('workflow.types.client')}</option>
                        <option value="employee">{t('workflow.types.employee')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingWorkflow(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkflowList;