import { config } from '../config';
import { logger } from './logger';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

class NotificationService {
  private static instance: NotificationService;
  private socket: WebSocket | null = null;

  private constructor() {
    this.connect();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private connect() {
    if (typeof window === 'undefined') return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      logger.info('Notification WebSocket connected');
    };

    this.socket.onclose = () => {
      logger.info('Notification WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      logger.error('WebSocket error:', error);
    };
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const response = await fetch(`${config.API_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      logger.info('Notification sent successfully', { notification });
      return true;
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const response = await fetch(
        `${config.API_URL}/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return true;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const response = await fetch(
        `${config.API_URL}/api/notifications/read-all`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      return true;
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export const notificationService = NotificationService.getInstance();