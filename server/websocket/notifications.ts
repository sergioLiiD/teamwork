import WebSocket from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws, req) => {
    try {
      // Get token from query string
      const url = new URL(req.url!, 'ws://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Missing authentication token');
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      (ws as any).userId = decoded.userId;

      logger.info('WebSocket client connected', { userId: decoded.userId });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });

      ws.on('close', () => {
        logger.info('WebSocket client disconnected', { userId: decoded.userId });
      });
    } catch (error) {
      logger.error('WebSocket connection error:', error);
      ws.close(1008, 'Authentication failed');
    }
  });

  return wss;
};