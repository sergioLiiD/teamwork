import React from 'react';
import TaskManager from '../../components/admin/TaskManager';
import type { Task } from '../../types';

// Mock data - Replace with actual data from your backend
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'tasks.welcome.title',
    description: 'tasks.welcome.description',
    type: 'video',
    status: 'completed',
    content: 'https://example.com/welcome-video',
    dueDate: '2024-03-20',
  },
  {
    id: '2',
    title: 'tasks.profile.title',
    description: 'tasks.profile.description',
    type: 'document',
    status: 'in-progress',
    content: 'Profile setup guide',
    dueDate: '2024-03-21',
  },
];

const TasksManager: React.FC = () => {
  const handleTaskCreate = (task: Omit<Task, 'id'>) => {
    // Implement task creation logic
    console.log('Creating task:', task);
  };

  const handleTaskUpdate = (id: string, task: Partial<Task>) => {
    // Implement task update logic
    console.log('Updating task:', id, task);
  };

  const handleTaskDelete = (id: string) => {
    // Implement task deletion logic
    console.log('Deleting task:', id);
  };

  return (
    <TaskManager
      tasks={mockTasks}
      onTaskCreate={handleTaskCreate}
      onTaskUpdate={handleTaskUpdate}
      onTaskDelete={handleTaskDelete}
    />
  );
};

export default TasksManager;