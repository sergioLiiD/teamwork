import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AuthGuard from './components/auth/AuthGuard';
import WorkflowGuard from './components/auth/WorkflowGuard';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyPhone from './pages/auth/VerifyPhone';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Quizzes from './pages/Quizzes';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import WorkflowManager from './pages/admin/WorkflowManager';
import TasksManager from './pages/admin/TasksManager';
import UsersManager from './pages/admin/UsersManager';
import QuizManager from './pages/admin/QuizManager';
import Analytics from './pages/admin/Analytics';
import UserWorkflow from './pages/UserWorkflow';
import JoinWorkflow from './pages/workflow/JoinWorkflow';

function App() {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify" element={<VerifyPhone />} />
          </Route>

          {/* Join workflow route - must be before protected routes */}
          <Route path="/workflow/join" element={<JoinWorkflow />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AuthGuard roles={['admin', 'manager']}>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/admin/workflows" replace />} />
            <Route path="workflows" element={<WorkflowManager />} />
            <Route path="tasks" element={<TasksManager />} />
            <Route path="users" element={<UsersManager />} />
            <Route path="quizzes" element={<QuizManager />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* User routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Workflow routes */}
          <Route
            path="/workflow/:workflowId"
            element={
              <WorkflowGuard>
                <UserWorkflow />
              </WorkflowGuard>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;