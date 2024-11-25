import React from 'react';
import { CheckCircle, Clock, AlertCircle, MessageCircle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../../ProgressBar';

interface WorkflowOverviewProps {
  workflow: {
    id: string;
    title: string;
    type: string;
    steps: Array<{
      id: string;
      title: string;
      status?: 'pending' | 'in-progress' | 'completed';
      dueInDays: number;
      assignees: string[];
      messages: Array<{
        id: string;
        content: string;
        timestamp: string;
      }>;
    }>;
  };
  onSelect: () => void;
}

const WorkflowOverview: React.FC<WorkflowOverviewProps> = ({ workflow, onSelect }) => {
  const { t } = useTranslation();

  const stats = {
    completed: workflow.steps.filter(s => s.status === 'completed').length,
    inProgress: workflow.steps.filter(s => s.status === 'in-progress').length,
    pending: workflow.steps.filter(s => s.status === 'pending' || !s.status).length,
    totalMessages: workflow.steps.reduce((sum, step) => sum + step.messages.length, 0),
    totalAssignees: [...new Set(workflow.steps.flatMap(s => s.assignees))].length,
  };

  const progress = (stats.completed / workflow.steps.length) * 100;

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6 border border-gray-200 hover:border-blue-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{workflow.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
            {t(`workflow.types.${workflow.type}`)}
          </span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{progress.toFixed(0)}%</div>
      </div>

      <div className="mb-4">
        <ProgressBar current={stats.completed} total={workflow.steps.length} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <div className="text-sm font-medium text-gray-500">Completed</div>
            <div className="text-lg font-semibold text-gray-900">{stats.completed}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          <div>
            <div className="text-sm font-medium text-gray-500">In Progress</div>
            <div className="text-lg font-semibold text-gray-900">{stats.inProgress}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="text-lg font-semibold text-gray-900">{stats.pending}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-500" />
          <div>
            <div className="text-sm font-medium text-gray-500">Messages</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalMessages}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{stats.totalAssignees} assignees</span>
        </div>
        <span>{workflow.steps.length} total steps</span>
      </div>
    </div>
  );
};

export default WorkflowOverview;