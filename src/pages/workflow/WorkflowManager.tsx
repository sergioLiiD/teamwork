import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { WorkflowStep } from '../../types/workflow';

const stepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['TASK', 'QUIZ', 'DOCUMENT', 'VIDEO']),
  content: z.string().min(1, 'Content is required'),
  dueInDays: z.number().min(1).max(365)
});

const workflowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['ONBOARDING', 'TRAINING', 'COMPLIANCE']),
  steps: z.array(stepSchema).min(1, 'At least one step is required')
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

export default function WorkflowManager() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { createWorkflow, updateWorkflow, getWorkflow } = useWorkflowStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      steps: []
    }
  });

  React.useEffect(() => {
    if (id) {
      const workflow = getWorkflow(id);
      if (workflow) {
        setValue('title', workflow.title);
        setValue('description', workflow.description);
        setValue('type', workflow.type);
        setValue('steps', workflow.steps);
      }
    }
  }, [id, getWorkflow, setValue]);

  const onSubmit = async (data: WorkflowFormData) => {
    try {
      if (id) {
        await updateWorkflow(id, data);
      } else {
        await createWorkflow(data);
      }
      navigate('/workflows');
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  const addStep = () => {
    const currentSteps = watch('steps') || [];
    setValue('steps', [...currentSteps, {
      title: '',
      description: '',
      type: 'TASK',
      content: '',
      dueInDays: 7
    }]);
  };

  const removeStep = (index: number) => {
    const currentSteps = watch('steps');
    setValue('steps', currentSteps.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/workflows')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('Back to Workflows')}
      </button>

      <h1 className="text-3xl font-bold mb-8">
        {id ? t('Edit Workflow') : t('Create New Workflow')}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Title')}
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Description')}
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Type')}
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="ONBOARDING">{t('Onboarding')}</option>
            <option value="TRAINING">{t('Training')}</option>
            <option value="COMPLIANCE">{t('Compliance')}</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('Steps')}</h2>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Add Step')}
            </button>
          </div>

          {watch('steps')?.map((step, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {t('Step')} {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  {t('Remove')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Title')}
                  </label>
                  <input
                    type="text"
                    {...register(`steps.${index}.title`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Type')}
                  </label>
                  <select
                    {...register(`steps.${index}.type`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="TASK">{t('Task')}</option>
                    <option value="QUIZ">{t('Quiz')}</option>
                    <option value="DOCUMENT">{t('Document')}</option>
                    <option value="VIDEO">{t('Video')}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Content')}
                  </label>
                  <textarea
                    {...register(`steps.${index}.content`)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Due in Days')}
                  </label>
                  <input
                    type="number"
                    {...register(`steps.${index}.dueInDays`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('Save Workflow')}
          </button>
        </div>
      </form>
    </div>
  );
}
