import React, { useState, useEffect } from 'react';
import { X, Plus, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FileUpload from '../../FileUpload';
import QuizSection from './QuizSection';
import TodoSection from './TodoSection';

interface WorkflowStep {
  title: string;
  description: string;
  assignees: string[];
  dueInDays: number;
  content: {
    text?: string;
    documents?: File[];
    videoUrl?: string;
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
  notifications: string[];
}

interface WorkflowStepFormProps {
  step?: any;
  onSubmit: (step: WorkflowStep) => void;
  onCancel: () => void;
}

const WorkflowStepForm: React.FC<WorkflowStepFormProps> = ({ step, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<WorkflowStep>({
    title: '',
    description: '',
    assignees: [],
    dueInDays: 7,
    content: {
      quiz: { questions: [] },
      todos: [],
    },
    notifications: [],
  });

  useEffect(() => {
    if (step) {
      setFormData({
        title: step.title || '',
        description: step.description || '',
        assignees: step.assignees || [],
        dueInDays: step.dueInDays || 7,
        content: step.content || {
          quiz: { questions: [] },
          todos: [],
        },
        notifications: step.notifications || [],
      });
    }
  }, [step]);

  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'todos'>('content');
  const [showNotificationInput, setShowNotificationInput] = useState(false);
  const [newNotification, setNewNotification] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAssignee = () => {
    if (newAssignee && !formData.assignees.includes(newAssignee)) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, newAssignee],
      }));
      setNewAssignee('');
    }
  };

  const removeAssignee = (email: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter(a => a !== email),
    }));
  };

  const addNotification = () => {
    if (newNotification && !formData.notifications.includes(newNotification)) {
      setFormData(prev => ({
        ...prev,
        notifications: [...prev.notifications, newNotification],
      }));
      setNewNotification('');
      setShowNotificationInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">
              {step ? 'Edit Workflow Step' : 'Create Workflow Step'}
            </h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Step Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Assignees and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignees
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={newAssignee}
                    onChange={e => setNewAssignee(e.target.value)}
                    placeholder="Add assignee email"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addAssignee}
                    className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {formData.assignees.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.assignees.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                      >
                        <span className="text-sm text-gray-600">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeAssignee(email)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due In (Days)
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.dueInDays}
                    onChange={e => setFormData({ ...formData, dueInDays: parseInt(e.target.value) })}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4">
                {(['content', 'quiz', 'todos'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'content' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Content Text
                    </label>
                    <textarea
                      value={formData.content.text || ''}
                      onChange={e => setFormData({
                        ...formData,
                        content: { ...formData.content, text: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Documents
                    </label>
                    <FileUpload
                      onFileSelect={files => setFormData({
                        ...formData,
                        content: { ...formData.content, documents: files }
                      })}
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.content.videoUrl || ''}
                      onChange={e => setFormData({
                        ...formData,
                        content: { ...formData.content, videoUrl: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {activeTab === 'quiz' && (
                <QuizSection
                  questions={formData.content.quiz?.questions || []}
                  onChange={questions => setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      quiz: { questions }
                    }
                  })}
                />
              )}

              {activeTab === 'todos' && (
                <TodoSection
                  todos={formData.content.todos || []}
                  onChange={todos => setFormData({
                    ...formData,
                    content: { ...formData.content, todos }
                  })}
                />
              )}
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Notifications
                </label>
                <button
                  type="button"
                  onClick={() => setShowNotificationInput(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Add Notification
                </button>
              </div>

              {showNotificationInput && (
                <div className="mt-2 flex items-center space-x-2">
                  <input
                    type="email"
                    value={newNotification}
                    onChange={e => setNewNotification(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addNotification}
                    className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}

              {formData.notifications.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {formData.notifications.map((email, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                    >
                      <span className="text-sm text-gray-600">{email}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          notifications: prev.notifications.filter((_, i) => i !== index)
                        }))}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
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
                {step ? 'Update Step' : 'Create Step'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepForm;