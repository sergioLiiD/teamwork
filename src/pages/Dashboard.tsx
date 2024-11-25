import React from 'react';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import type { Task } from '../types';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w-xl mx-auto">
        <ProgressBar current={0} total={0} />
      </div>

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
              onMessageClick={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;