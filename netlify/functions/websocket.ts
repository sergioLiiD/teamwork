import { Handler } from '@netlify/functions';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

let wss: WebSocketServer;

export const handler: Handler = async (event, context) => {
  // Only handle WebSocket events
  if (!event.requestContext.routeKey) {
    return { statusCode: 400, body: 'Not a WebSocket event' };
  }

  const connectionId = event.requestContext.connectionId;

  switch (event.requestContext.routeKey) {
    case '$connect':
      // Verify token from query string
      try {
        const params = new URLSearchParams(event.queryStringParameters || {});
        const token = params.get('token');

        if (!token) {
          return {
            statusCode: 401,
            body: 'Missing authentication token'
          };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Store user info in connection context
        context.clientContext = {
          ...context.clientContext,
          userId: decoded.userId
        };

        return {
          statusCode: 200,
          body: 'Connected'
        };
      } catch (error) {
        return {
          statusCode: 401,
          body: 'Invalid authentication token'
        };
      }

    case '$disconnect':
      return {
        statusCode: 200,
        body: 'Disconnected'
      };

    case '$default':
      // Handle incoming messages
      try {
        const message = JSON.parse(event.body!);
        const userId = context.clientContext?.userId;

        // Broadcast message to relevant clients
        // This is handled by the NotificationService
        return {
          statusCode: 200,
          body: 'Message received'
        };
      } catch (error) {
        return {
          statusCode: 400,
          body: 'Invalid message format'
        };
      }

    default:
      return {
        statusCode: 400,
        body: 'Unknown route'
      };
  }
};
