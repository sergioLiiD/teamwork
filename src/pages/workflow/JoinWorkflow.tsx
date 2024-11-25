import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Key, Loader, XCircle, CheckCircle } from 'lucide-react';
import { validateInvite, updateInviteStatus } from '../../lib/invites';
import { useWorkflowAccessStore } from '../../store/workflowAccessStore';
import { useAuthStore } from '../../store/authStore';

const JoinWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState('');
  const { addAccess } = useWorkflowAccessStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const invite = validateInvite(email, code);
      
      if (!invite) {
        setStatus('error');
        setError(t('workflow.join.error.invalidCode'));
        return;
      }

      // Grant access to the workflow
      addAccess({
        workflowId: invite.workflowId,
        userId: user?.id || 'guest',
        role: 'participant',
        status: 'active'
      });

      // Mark invite as accepted
      updateInviteStatus(invite.workflowId, email, 'accepted');

      setStatus('success');
      
      // Redirect to workflow after a short delay
      setTimeout(() => {
        navigate(`/workflow/${invite.workflowId}`);
      }, 1500);
    } catch (error) {
      setStatus('error');
      setError(t('workflow.join.error.validationFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8">{t('workflow.join.title')}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('workflow.join.emailLabel')}
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('workflow.join.emailPlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('workflow.join.codeLabel')}
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('workflow.join.codePlaceholder')}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === 'loading' && <Loader className="w-5 h-5 mr-2 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {status === 'success' ? t('workflow.join.accessGranted') : t('workflow.join.submitButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinWorkflow;