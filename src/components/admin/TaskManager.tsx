import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../../types';
import TaskForm from './TaskForm';

interface TaskManagerProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
  onTaskUpdate: (id: string, task: Partial<Task>) => void;
  onTaskDelete: (id: string) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSubmit = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, taskData);
    } else {
      onTaskCreate(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {t(task.title)}
                  </h3>
                  <p className="text-sm text-gray-500">{t(task.description)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskManager;