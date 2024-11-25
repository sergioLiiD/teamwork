import React, { useState } from 'react';
import { Send, X, Copy, Mail, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createInvite } from '../../../lib/invites';

interface InviteUsersModalProps {
  workflowId: string;
  workflowTitle: string;
  onClose: () => void;
}

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({ workflowId, workflowTitle, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fixed URL for workflow access
  const accessUrl = 'https://gilded-biscochitos-8fecf8.netlify.app/workflow/join';

  const handleGenerateCode = () => {
    if (!email) {
      setError(t('workflow.invite.error.noEmail'));
      return;
    }

    try {
      const invite = createInvite(workflowId, email);
      setGeneratedCode(invite.code);
      setError('');
    } catch (err) {
      setError(t('workflow.invite.error.generateFailed'));
    }
  };

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      const originalCode = generatedCode;
      setGeneratedCode(t('workflow.invite.success.copied'));
      setTimeout(() => setGeneratedCode(originalCode), 1000);
    } catch (err) {
      setError(t('workflow.invite.error.copyFailed'));
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(accessUrl);
      setError(t('workflow.invite.success.linkCopied'));
      setTimeout(() => setError(''), 2000);
    } catch (err) {
      setError(t('workflow.invite.error.copyFailed'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">{t('workflow.invite.title')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">{t('workflow.invite.instructions.title')}</h4>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. {t('workflow.invite.instructions.step1')}</li>
              <li>2. {t('workflow.invite.instructions.step2')}</li>
              <li>3. {t('workflow.invite.instructions.step3')}</li>
              <li className="pl-4">• {t('workflow.invite.instructions.step3a')}</li>
              <li className="pl-4">• {t('workflow.invite.instructions.step3b')}</li>
              <li>4. {t('workflow.invite.instructions.step4')}</li>
            </ol>
          </div>

          {/* Access Link Section */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <LinkIcon className="w-4 h-4 mr-2" />
              {t('workflow.invite.accessLink')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={accessUrl}
                readOnly
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-600"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('common.copy')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('workflow.invite.emailLabel')}
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('workflow.invite.emailPlaceholder')}
                  />
                </div>
                <button
                  onClick={handleGenerateCode}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t('workflow.invite.generateCode')}
                </button>
              </div>
            </div>

            {generatedCode && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{t('workflow.invite.accessCode')}</h4>
                    <p className="text-2xl font-mono font-bold text-blue-600 mt-1">
                      {generatedCode}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {t('common.copy')}
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>{t('workflow.invite.codeValidity')}</p>
                  <p>{t('workflow.invite.shareInstructions')}</p>
                </div>
              </div>
            )}

            {error && (
              <div className={`flex items-center space-x-2 text-sm ${
                error === t('workflow.invite.success.linkCopied') ? 'text-green-600' : 'text-red-600'
              }`}>
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUsersModal;