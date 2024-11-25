import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useWorkflowAccessStore } from '../../store/workflowAccessStore';

interface WorkflowGuardProps {
  children: React.ReactNode;
}

const WorkflowGuard: React.FC<WorkflowGuardProps> = ({ children }) => {
  const { workflowId } = useParams();
  const { user } = useAuthStore();
  const { hasAccess } = useWorkflowAccessStore();

  if (!user || !workflowId) {
    return <Navigate to="/auth/login" replace />;
  }

  // Admin and managers have access to all workflows
  if (['admin', 'manager'].includes(user.role)) {
    return <>{children}</>;
  }

  // Check if user has specific access to this workflow
  if (!hasAccess(workflowId, user.id)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default WorkflowGuard;