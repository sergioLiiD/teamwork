import React, { useState } from 'react';
import { Send, X, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InviteUsersProps {
  workflowId: string;
  onInvite: (emails: string[]) => void;
  onClose: () => void;
}

const InviteUsers: React.FC<InviteUsersProps> = ({ workflowId, onInvite, onClose }) => {
  const { t } = useTranslation();
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Generate a unique invitation link
  const inviteLink = `${window.location.origin}/workflow/${workflowId}/join`;

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length > 0) {
      onInvite(emails);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Invite Users to Workflow</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Invitation Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Invitation Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
              />
              <button
                onClick={copyInviteLink}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
            {showCopiedMessage && (
              <p className="text-sm text-green-600">Link copied to clipboard!</p>
            )}
          </div>

          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Invite by Email
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Email List */}
              {emails.length > 0 && (
                <div className="space-y-2">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
                    >
                      <span className="text-sm text-gray-600">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emails.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Invitations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUsers;