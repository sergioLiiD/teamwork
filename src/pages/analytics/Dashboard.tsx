import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { Users, Award, Clock } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  workflowStats: {
    totalWorkflows: number;
    completedWorkflows: number;
    activeWorkflows: number;
    avgStepsPerWorkflow: number;
  };
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    completingUsers: number;
    completionRate: number;
  }>;
  stepCompletionStats: Array<{
    stepTitle: string;
    totalAssigned: number;
    completed: number;
    completionRate: number;
    avgCompletionTimeHours: number;
  }>;
  topPerformers: Array<{
    fullName: string;
    completedSteps: number;
    avgCompletionTimeHours: number;
  }>;
}

export default function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/${workspaceId}`);
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('Failed to load analytics data')}</p>
      </div>
    );
  }

  const userEngagementChart = {
    labels: data.userEngagement.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: t('Active Users'),
        data: data.userEngagement.map(d => d.activeUsers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: t('Completion Rate %'),
        data: data.userEngagement.map(d => d.completionRate),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'percentage'
      }
    ]
  };

  const stepCompletionChart = {
    labels: data.stepCompletionStats.map(s => s.stepTitle),
    datasets: [
      {
        label: t('Completion Rate %'),
        data: data.stepCompletionStats.map(s => s.completionRate),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ]
  };

  const workflowStatusChart = {
    labels: [t('Completed'), t('Active'), t('Not Started')],
    datasets: [{
      data: [
        data.workflowStats.completedWorkflows,
        data.workflowStats.activeWorkflows,
        data.workflowStats.totalWorkflows - (data.workflowStats.completedWorkflows + data.workflowStats.activeWorkflows)
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(209, 213, 219, 0.8)'
      ]
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('Analytics Dashboard')}</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('Active Users')}</p>
              <p className="text-2xl font-semibold">
                {data.userEngagement[0]?.activeUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('Completion Rate')}</p>
              <p className="text-2xl font-semibold">
                {data.userEngagement[0]?.completionRate || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('Avg Steps per Workflow')}</p>
              <p className="text-2xl font-semibold">
                {Math.round(data.workflowStats.avgStepsPerWorkflow)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('User Engagement')}</h2>
          <Line
            data={userEngagementChart}
            options={{
              responsive: true,
              scales: {
                percentage: {
                  position: 'right',
                  min: 0,
                  max: 100,
                  title: {
                    display: true,
                    text: t('Completion Rate %')
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('Step Completion Rates')}</h2>
          <Bar
            data={stepCompletionChart}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('Workflow Status')}</h2>
          <div className="aspect-w-16 aspect-h-9">
            <Doughnut
              data={workflowStatusChart}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('Top Performers')}</h2>
          <div className="space-y-4">
            {data.topPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{performer.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {t('{{count}} steps completed', { count: performer.completedSteps })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {t('Avg. Time')}
                  </p>
                  <p className="font-medium">
                    {Math.round(performer.avgCompletionTimeHours)} {t('hours')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
