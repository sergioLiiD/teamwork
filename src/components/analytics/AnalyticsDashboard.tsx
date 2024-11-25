import React from 'react';
import { BarChart, Users, Clock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressChart from './ProgressChart';
import StatsCard from './StatsCard';
import CompletionTable from './CompletionTable';
import type { Task, User } from '../../types';

interface AnalyticsDashboardProps {
  tasks: Task[];
  users: User[];
  completionData: {
    userId: string;
    taskId: string;
    completedAt: string;
    timeSpent: number;
  }[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  tasks,
  users,
  completionData,
}) => {
  const { t } = useTranslation();

  const stats = {
    totalUsers: users.length,
    completedTasks: completionData.length,
    avgCompletionTime: Math.round(
      completionData.reduce((acc, curr) => acc + curr.timeSpent, 0) / completionData.length
    ),
    completionRate: Math.round(
      (completionData.length / (tasks.length * users.length)) * 100
    ),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('analytics.totalUsers')}
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          trend={+15}
        />
        <StatsCard
          title={t('analytics.completedTasks')}
          value={stats.completedTasks}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          trend={+8}
        />
        <StatsCard
          title={t('analytics.avgCompletionTime')}
          value={`${stats.avgCompletionTime} ${t('analytics.minutes')}`}
          icon={<Clock className="w-6 h-6 text-purple-500" />}
          trend={-5}
        />
        <StatsCard
          title={t('analytics.completionRate')}
          value={`${stats.completionRate}%`}
          icon={<BarChart className="w-6 h-6 text-orange-500" />}
          trend={+12}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('analytics.progressOverTime')}
          </h3>
          {completionData.length > 0 ? (
            <ProgressChart data={completionData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              {t('analytics.noData')}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('analytics.recentCompletions')}
          </h3>
          {completionData.length > 0 ? (
            <CompletionTable
              data={completionData.slice(0, 5)}
              users={users}
              tasks={tasks}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              {t('analytics.noData')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;