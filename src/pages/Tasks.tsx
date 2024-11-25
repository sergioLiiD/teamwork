import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';
import { useTranslation } from 'react-i18next';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleMessageClick = (id: string) => {
    // Will be implemented with real messaging functionality
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('tasks.title')}</h1>
      
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('tasks.noTasks')}
          </h3>
          <p className="text-gray-500">
            {t('tasks.tasksWillAppear')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;