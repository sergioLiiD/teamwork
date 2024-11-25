import React from 'react';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';
import type { Task, User } from '../../types';

const Analytics: React.FC = () => {
  // Initial empty state
  const emptyData = {
    users: [],
    tasks: [],
    completionData: []
  };

  return (
    <AnalyticsDashboard
      users={emptyData.users}
      tasks={emptyData.tasks}
      completionData={emptyData.completionData}
    />
  );
};

export default Analytics;