import React from 'react';
import { CheckCircle, Clock, AlertCircle, Lock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueInDays: number;
  assignees: string[];
}

interface StepsListProps {
  steps: Step[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onUpdateStatus: (stepId: string, status: Step['status']) => void;
}

const StepsList: React.FC<StepsListProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  onUpdateStatus
}) => {
  const getStatusIcon = (status: Step['status'], isLocked: boolean) => {
    if (isLocked) return <Lock className="w-5 h-5 text-gray-400" />;
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const isStepLocked = (index: number): boolean => {
    if (index === 0) return false;
    
    // Check if all previous steps are completed
    for (let i = 0; i < index; i++) {
      if (steps[i].status !== 'completed') return true;
    }
    return false;
  };

  return (
    <div className="space-y-4">
      {steps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No steps yet. Click "Add Step" to create your first step.
        </div>
      ) : (
        steps.map((step, index) => {
          const isLocked = isStepLocked(index);
          
          return (
            <div
              key={step.id}
              className={`w-full border rounded-lg transition-all ${
                selectedStepId === step.id ? 'border-blue-500' : 'border-gray-200'
              } ${isLocked ? 'opacity-50' : 'hover:border-gray-300'}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(step.status, isLocked)}
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  </div>
                  
                  {!isLocked && (
                    <select
                      value={step.status}
                      onChange={(e) => onUpdateStatus(step.id, e.target.value as Step['status'])}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm px-3 py-1 rounded-md border bg-white text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-600">{step.description}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div>Due in {step.dueInDays} days</div>
                  <div>{step.assignees.length} assignees</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default StepsList;