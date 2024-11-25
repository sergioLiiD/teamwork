import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTemplateStore } from '../../../store/templateStore';
import TemplateList from './TemplateList';

interface NewWorkflowDialogProps {
  onClose: () => void;
  onCreateWorkflow: (workflowData: {
    title: string;
    description: string;
    type: string;
    templateId?: string;
  }) => void;
}

const NewWorkflowDialog: React.FC<NewWorkflowDialogProps> = ({
  onClose,
  onCreateWorkflow,
}) => {
  const { t } = useTranslation();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('custom');
  const { getTemplateById } = useTemplateStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const template = selectedTemplateId ? getTemplateById(selectedTemplateId) : null;
    
    onCreateWorkflow({
      title,
      description,
      type: template?.type || type,
      templateId: selectedTemplateId || undefined,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">{t('workflow.createNew')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('workflow.form.title')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder={t('workflow.form.titlePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('workflow.form.description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder={t('workflow.form.descriptionPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('workflow.form.type')}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="custom">{t('workflow.types.custom')}</option>
                  <option value="sales">{t('workflow.types.sales')}</option>
                  <option value="client">{t('workflow.types.client')}</option>
                  <option value="employee">{t('workflow.types.employee')}</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('workflow.templates.optional')}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {t('workflow.templates.selectTitle')}
              </h4>
              <TemplateList 
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {t('workflow.form.create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewWorkflowDialog;