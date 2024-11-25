import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../hooks/useWebSocket';

type Notification = {
  id: string;
  message: string;
  type: 'WORKFLOW_UPDATE' | 'STEP_COMPLETED' | 'NEW_ASSIGNMENT' | 'DEADLINE_APPROACHING' | 'ERROR';
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribeHandlers = [
      subscribe('WORKFLOW_UPDATE', (data) => {
        const message = data.action === 'created'
          ? t('New workflow created')
          : data.action === 'updated'
          ? t('Workflow updated')
          : t('Workflow deleted');

        addNotification({
          type: 'WORKFLOW_UPDATE',
          message
        });
      }),

      subscribe('STEP_COMPLETED', (data) => {
        addNotification({
          type: 'STEP_COMPLETED',
          message: t('Step completed in workflow')
        });
      }),

      subscribe('NEW_ASSIGNMENT', (data) => {
        addNotification({
          type: 'NEW_ASSIGNMENT',
          message: t('New workflow assigned to you')
        });
      }),

      subscribe('DEADLINE_APPROACHING', (data) => {
        addNotification({
          type: 'DEADLINE_APPROACHING',
          message: t('Deadline approaching for workflow step', { days: data.daysLeft })
        });
      }),

      subscribe('ERROR', (data) => {
        addNotification({
          type: 'ERROR',
          message: data.message
        });
      })
    ];

    return () => {
      unsubscribeHandlers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, t]);

  const addNotification = ({ type, message }: Pick<Notification, 'type' | 'message'>) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t('Notifications')}</h3>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  {t('Mark all as read')}
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t('No notifications')}
                </p>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-indigo-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}