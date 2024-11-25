import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckSquare, ClipboardList, Clock } from 'lucide-react';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';

// Mock data - Replace with actual data from your backend
const mockUsers = [
  { id: '1', name: 'John Doe', role: 'new-hire', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Jane Smith', role: 'new-hire', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Mike Johnson', role: 'new-hire', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const mockTasks = [
  {
    id: '1',
    title: 'tasks.welcome.title',
    description: 'tasks.welcome.description',
    type: 'video',
    status: 'completed',
    content: 'https://example.com/welcome-video',
  },
  {
    id: '2',
    title: 'tasks.profile.title',
    description: 'tasks.profile.description',
    type: 'document',
    status: 'in-progress',
    content: 'Profile setup guide',
  },
];

const mockCompletionData = [
  {
    userId: '1',
    taskId: '1',
    completedAt: '2024-03-15T10:30:00Z',
    timeSpent: 45,
  },
  {
    userId: '2',
    taskId: '1',
    completedAt: '2024-03-15T14:20:00Z',
    timeSpent: 38,
  },
];

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
      
      <AnalyticsDashboard
        users={mockUsers}
        tasks={mockTasks}
        completionData={mockCompletionData}
      />
    </div>
  );
};

export default AdminDashboard;