import express from 'express';
import { db } from '../db';
import { AppError } from '../utils/AppError';
import { authorize } from '../middleware/auth';
import { validateWorkspace } from '../utils/validation';

const router = express.Router();

// Get user's workspaces
router.get('/', async (req, res, next) => {
  try {
    const workspaces = db.prepare(`
      SELECT w.*, COUNT(wm.userId) as memberCount
      FROM workspaces w
      LEFT JOIN workspace_members wm ON w.id = wm.workspaceId
      WHERE w.id IN (
        SELECT workspaceId
        FROM workspace_members
        WHERE userId = ?
      )
      GROUP BY w.id
    `).all(req.user!.id);

    res.json({
      status: 'success',
      data: { workspaces }
    });
  } catch (error) {
    next(error);
  }
});

// Create workspace
router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try {
    const workspaceData = validateWorkspace(req.body);
    
    const workspace = db.prepare(`
      INSERT INTO workspaces (id, name, ownerId, createdAt, updatedAt)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).get(
      crypto.randomUUID(),
      workspaceData.name,
      req.user!.id
    );

    // Add owner as member
    db.prepare(`
      INSERT INTO workspace_members (id, workspaceId, userId, role, addedAt)
      VALUES (?, ?, ?, 'owner', datetime('now'))
    `).run(
      crypto.randomUUID(),
      workspace.id,
      req.user!.id
    );

    res.status(201).json({
      status: 'success',
      data: { workspace }
    });
  } catch (error) {
    next(error);
  }
});

// Add member to workspace
router.post('/:workspaceId/members', authorize('ADMIN'), async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    const member = db.prepare(`
      INSERT INTO workspace_members (id, workspaceId, userId, role, addedAt)
      VALUES (?, ?, ?, ?, datetime('now'))
      RETURNING *
    `).get(
      crypto.randomUUID(),
      workspaceId,
      userId,
      role || 'member'
    );

    res.status(201).json({
      status: 'success',
      data: { member }
    });
  } catch (error) {
    next(error);
  }
});

export default router;