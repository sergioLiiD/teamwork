import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TemplatesList from './TemplatesList';

interface NewWorkflowFormProps {
  onSubmit: (data: { title: string; type: string; description: string; templateId?: string }) => void;
  onCancel: () => void;
}

const NewWorkflowForm: React.FC<NewWorkflowFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [showTemplates, setShowTemplates] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'sales',
    description: '',
    templateId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTemplateSelect = (template: any) => {
    setFormData({
      title: template.name,
      type: template.type,
      description: template.description,
      templateId: template.id
    });
    setShowTemplates(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-semibold">{t('workflow.createNew')}</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workflow Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Sales Team Onboarding"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workflow Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="sales">{t('workflow.types.sales')}</option>
                <option value="client">{t('workflow.types.client')}</option>
                <option value="employee">{t('workflow.types.employee')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                rows={3}
                placeholder="Describe the purpose of this workflow"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileText className="w-5 h-5 mr-2" />
              Use Template
            </button>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      </div>

      {showTemplates && (
        <TemplatesList
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
};

export default NewWorkflowForm;