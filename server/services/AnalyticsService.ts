import { db } from '../db';
import { logger } from '../utils/logger';

export class AnalyticsService {
  static async getWorkflowStats(workspaceId: string) {
    try {
      return db.prepare(`
        SELECT
          COUNT(*) as totalWorkflows,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedWorkflows,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as activeWorkflows,
          AVG(
            (SELECT COUNT(*) FROM workflow_steps WHERE workflow_steps.workflowId = workflows.id)
          ) as avgStepsPerWorkflow
        FROM workflows
        WHERE workspaceId = ?
      `).get(workspaceId);
    } catch (error) {
      logger.error('Error getting workflow stats:', error);
      throw error;
    }
  }

  static async getUserEngagement(workspaceId: string, days: number = 30) {
    try {
      return db.prepare(`
        WITH daily_stats AS (
          SELECT
            date(wa.updatedAt) as date,
            COUNT(DISTINCT wa.userId) as activeUsers,
            COUNT(DISTINCT CASE WHEN ws.status = 'completed' THEN wa.userId END) as completingUsers
          FROM workflow_access wa
          JOIN workflows w ON wa.workflowId = w.id
          LEFT JOIN workflow_steps ws ON w.id = ws.workflowId
          WHERE w.workspaceId = ?
          AND wa.updatedAt >= datetime('now', '-' || ? || ' days')
          GROUP BY date(wa.updatedAt)
        )
        SELECT
          date,
          activeUsers,
          completingUsers,
          ROUND(CAST(completingUsers AS FLOAT) / CAST(activeUsers AS FLOAT) * 100, 2) as completionRate
        FROM daily_stats
        ORDER BY date DESC
      `).all(workspaceId, days);
    } catch (error) {
      logger.error('Error getting user engagement stats:', error);
      throw error;
    }
  }

  static async getStepCompletionStats(workflowId: string) {
    try {
      return db.prepare(`
        SELECT
          ws.id as stepId,
          ws.title as stepTitle,
          COUNT(DISTINCT wa.userId) as totalAssigned,
          COUNT(DISTINCT CASE WHEN ws.status = 'completed' THEN wa.userId END) as completed,
          ROUND(
            CAST(COUNT(DISTINCT CASE WHEN ws.status = 'completed' THEN wa.userId END) AS FLOAT) /
            CAST(COUNT(DISTINCT wa.userId) AS FLOAT) * 100,
            2
          ) as completionRate,
          AVG(
            CASE WHEN ws.status = 'completed'
            THEN ROUND((julianday(ws.updatedAt) - julianday(wa.createdAt)) * 24, 2)
            END
          ) as avgCompletionTimeHours
        FROM workflow_steps ws
        JOIN workflow_access wa ON ws.workflowId = wa.workflowId
        WHERE ws.workflowId = ?
        GROUP BY ws.id, ws.title
        ORDER BY ws.order
      `).all(workflowId);
    } catch (error) {
      logger.error('Error getting step completion stats:', error);
      throw error;
    }
  }

  static async getTopPerformers(workspaceId: string, limit: number = 5) {
    try {
      return db.prepare(`
        SELECT
          u.id as userId,
          u.fullName,
          COUNT(DISTINCT ws.id) as completedSteps,
          AVG(
            ROUND((julianday(ws.updatedAt) - julianday(wa.createdAt)) * 24, 2)
          ) as avgCompletionTimeHours
        FROM users u
        JOIN workflow_access wa ON u.id = wa.userId
        JOIN workflows w ON wa.workflowId = w.id
        JOIN workflow_steps ws ON w.id = ws.workflowId
        WHERE w.workspaceId = ?
        AND ws.status = 'completed'
        GROUP BY u.id, u.fullName
        ORDER BY completedSteps DESC, avgCompletionTimeHours ASC
        LIMIT ?
      `).all(workspaceId, limit);
    } catch (error) {
      logger.error('Error getting top performers:', error);
      throw error;
    }
  }
}
