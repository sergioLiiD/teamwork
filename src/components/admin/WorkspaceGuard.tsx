import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useWorkspaceAccess } from '../../hooks/useWorkspaceAccess';

interface WorkspaceGuardProps {
  children: React.ReactNode;
  requireManage?: boolean;
}

const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({ children, requireManage = true }) => {
  const { workspaceId } = useParams();
  const { canView, canManage } = useWorkspaceAccess(workspaceId || '');

  if (!canView) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireManage && !canManage) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default WorkspaceGuard;