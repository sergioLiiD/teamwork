import WebSocket from 'ws';
import { logger } from '../utils/logger';

export class NotificationService {
  private static instance: NotificationService;
  private wss: WebSocket.Server | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setWebSocketServer(wss: WebSocket.Server) {
    this.wss = wss;
  }

  private getClientsByUserId(userId: string): WebSocket[] {
    if (!this.wss) return [];
    
    return Array.from(this.wss.clients)
      .filter(client => (client as any).userId === userId);
  }

  private broadcast(clients: WebSocket[], data: any) {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  notifyWorkflowUpdate(workspaceId: string, workflowId: string, action: 'created' | 'updated' | 'deleted') {
    if (!this.wss) {
      logger.warn('WebSocket server not initialized');
      return;
    }

    // Get all connected clients
    const clients = Array.from(this.wss.clients);
    
    // Broadcast to all clients in the workspace
    this.broadcast(clients, {
      type: 'WORKFLOW_UPDATE',
      data: {
        workspaceId,
        workflowId,
        action
      }
    });
  }

  notifyStepCompletion(userId: string, workflowId: string, stepId: string) {
    const clients = this.getClientsByUserId(userId);
    
    this.broadcast(clients, {
      type: 'STEP_COMPLETED',
      data: {
        workflowId,
        stepId
      }
    });
  }

  notifyNewAssignment(userId: string, workflowId: string) {
    const clients = this.getClientsByUserId(userId);
    
    this.broadcast(clients, {
      type: 'NEW_ASSIGNMENT',
      data: {
        workflowId
      }
    });
  }

  notifyDeadlineApproaching(userId: string, workflowId: string, stepId: string, daysLeft: number) {
    const clients = this.getClientsByUserId(userId);
    
    this.broadcast(clients, {
      type: 'DEADLINE_APPROACHING',
      data: {
        workflowId,
        stepId,
        daysLeft
      }
    });
  }

  notifyError(userId: string, message: string) {
    const clients = this.getClientsByUserId(userId);
    
    this.broadcast(clients, {
      type: 'ERROR',
      data: {
        message
      }
    });
  }
}
