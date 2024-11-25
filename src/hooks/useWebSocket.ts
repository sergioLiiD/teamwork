import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

type WebSocketMessage = {
  type: string;
  data: any;
};

type MessageHandler = (data: any) => void;

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuthStore();
  const messageHandlers = useRef<Map<string, MessageHandler>>(new Map());

  const connect = useCallback(() => {
    if (!user) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${user.id}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        const handler = messageHandlers.current.get(message.type);
        if (handler) {
          handler(message.data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  }, [user]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const subscribe = useCallback((messageType: string, handler: MessageHandler) => {
    messageHandlers.current.set(messageType, handler);

    return () => {
      messageHandlers.current.delete(messageType);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    subscribe,
    disconnect
  };
};
