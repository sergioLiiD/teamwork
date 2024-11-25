import express from 'express';
import { db } from '../db';
import { AppError } from '../utils/AppError';
import { authorize } from '../middleware/auth';
import { validateWorkflow, validateStep } from '../utils/validation';

const router = express.Router();

// Get all workflows
router.get('/', async (req, res, next) => {
  try {
    const workflows = db.prepare(`
      SELECT w.*, COUNT(ws.id) as stepsCount
      FROM workflows w
      LEFT JOIN workflow_steps ws ON w.id = ws.workflowId
      WHERE w.workspaceId IN (
        SELECT workspaceId 
        FROM workspace_members 
        WHERE userId = ?
      )
      GROUP BY w.id
    `).all(req.user!.id);

    res.json({
      status: 'success',
      data: { workflows }
    });
  } catch (error) {
    next(error);
  }
});

// Create workflow
router.post('/', authorize('ADMIN', 'MANAGER'), async (req, res, next) => {
  try {
    const workflowData = validateWorkflow(req.body);
    
    const workflow = db.prepare(`
      INSERT INTO workflows (id, title, description, type, workspaceId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).get(
      crypto.randomUUID(),
      workflowData.title,
      workflowData.description,
      workflowData.type,
      workflowData.workspaceId
    );

    res.status(201).json({
      status: 'success',
      data: { workflow }
    });
  } catch (error) {
    next(error);
  }
});

// Add step to workflow
router.post('/:workflowId/steps', authorize('ADMIN', 'MANAGER'), async (req, res, next) => {
  try {
    const { workflowId } = req.params;
    const stepData = validateStep(req.body);

    // Get current max order
    const maxOrder = db.prepare(`
      SELECT MAX(stepOrder) as maxOrder
      FROM workflow_steps
      WHERE workflowId = ?
    `).get(workflowId).maxOrder || 0;

    const step = db.prepare(`
      INSERT INTO workflow_steps (
        id, workflowId, title, description, type,
        content, dueInDays, stepOrder, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).get(
      crypto.randomUUID(),
      workflowId,
      stepData.title,
      stepData.description,
      stepData.type,
      JSON.stringify(stepData.content),
      stepData.dueInDays,
      maxOrder + 1
    );

    res.status(201).json({
      status: 'success',
      data: { step }
    });
  } catch (error) {
    next(error);
  }
});

// Get workflow details
router.get('/:workflowId', async (req, res, next) => {
  try {
    const { workflowId } = req.params;

    const workflow = db.prepare(`
      SELECT w.*, json_group_array(
        json_object(
          'id', ws.id,
          'title', ws.title,
          'description', ws.description,
          'type', ws.type,
          'content', ws.content,
          'dueInDays', ws.dueInDays,
          'stepOrder', ws.stepOrder,
          'status', ws.status,
          'createdAt', ws.createdAt,
          'updatedAt', ws.updatedAt
        )
      ) as steps
      FROM workflows w
      LEFT JOIN workflow_steps ws ON w.id = ws.workflowId
      WHERE w.id = ?
      GROUP BY w.id
    `).get(workflowId);

    if (!workflow) {
      throw new AppError('Workflow not found', 404);
    }

    // Parse steps JSON
    workflow.steps = JSON.parse(workflow.steps);

    res.json({
      status: 'success',
      data: { workflow }
    });
  } catch (error) {
    next(error);
  }
});

export default router;