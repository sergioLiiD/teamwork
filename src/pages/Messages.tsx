import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, Paperclip } from 'lucide-react';
import type { Message } from '../types';

const Messages: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        taskId: 'general',
        userId: 'current-user',
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)]">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('messages.title')}
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2" />
                <p>{t('messages.noMessages')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === 'current-user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.userId === 'current-user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                title={t('messages.attach')}
              >
                <Paperclip className="w-5 h-5" />
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
                disabled={!newMessage.trim()}
                className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;