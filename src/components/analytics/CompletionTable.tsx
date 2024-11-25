import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Task, User } from '../../types';

interface CompletionTableProps {
  data: {
    userId: string;
    taskId: string;
    completedAt: string;
    timeSpent: number;
  }[];
  users: User[];
  tasks: Task[];
}

const CompletionTable: React.FC<CompletionTableProps> = ({ data, users, tasks }) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.table.user')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.table.task')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.table.completedAt')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('analytics.table.timeSpent')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const user = users.find(u => u.id === item.userId);
            const task = tasks.find(t => t.id === item.taskId);

            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{t(task?.title || '')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {Math.round(item.timeSpent)} min
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompletionTable;