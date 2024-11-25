import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Message, Task } from '../types';
import FileUpload from './FileUpload';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  isOpen,
  onClose,
  task,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
      setShowUpload(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('messages.title', { task: t(task.title) })}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Message List */}
          <div className="h-96 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                {t('messages.noMessages')}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === 'current-user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.userId === 'current-user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <Paperclip className="h-4 w-4" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="mt-1 block text-xs opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          {showUpload && (
            <div className="border-t p-4">
              <FileUpload
                onFileSelect={setAttachments}
                multiple
                maxSize={10}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </div>
          )}

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowUpload(!showUpload)}
                className={`text-gray-400 hover:text-gray-500 ${
                  showUpload ? 'text-blue-500' : ''
                }`}
                title={t('messages.attach')}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('messages.placeholder')}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
              
              <button
                type="submit"
                disabled={!newMessage.trim() && attachments.length === 0}
                className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;