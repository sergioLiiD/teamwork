import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface StepMessagesProps {
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  className?: string;
}

const StepMessages: React.FC<StepMessagesProps> = ({ messages, onSendMessage, className = '' }) => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };

  return (
    <div className={`flex flex-col h-[400px] ${className}`}>
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t('messages.noMessages')}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === 'current-user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
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
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setAttachments(Array.from(e.target.files));
                }
              }}
            />
            <Paperclip className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </label>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('messages.placeholder')}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim() && attachments.length === 0}
            className="rounded-md bg-blue-500 p-2 text-white disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {attachments.length > 0 && (
          <div className="mt-2">
            <div className="text-sm text-gray-500">Attachments:</div>
            <div className="mt-1 space-y-1">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded px-2 py-1"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                    className="text-gray-400 hover:text-red-600 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default StepMessages;