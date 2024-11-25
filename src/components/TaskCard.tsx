import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageCircle, 
  Video,
  ClipboardCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onMessageClick: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onMessageClick }) => {
  const { t } = useTranslation();

  const getTaskIcon = () => {
    switch (task.type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'quiz':
        return <ClipboardCheck className="w-5 h-5 text-green-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {getTaskIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{t(task.title)}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {t(`task.status.${task.status}`)}
        </span>
      </div>
      
      <p className="mt-3 text-gray-600">{t(task.description)}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onStatusChange(task.id, 'completed')}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('task.actions.markComplete')}</span>
          </button>
          
          <button
            onClick={() => onMessageClick(task.id)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('task.actions.askQuestion')}</span>
          </button>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;