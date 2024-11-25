import express from 'express';
import { authenticate } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { db } from '../db';

const router = express.Router();

// Get user notifications
router.get('/', authenticate, async (req, res, next) => {
  try {
    const notifications = db.prepare(`
      SELECT * FROM notifications
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 50
    `).all(req.user!.id);

    res.json({
      status: 'success',
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
});

// Create notification
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { userId, title, message, type, actionUrl } = req.body;

    if (!userId || !title || !message || !type) {
      throw new AppError('Missing required notification fields', 400);
    }

    const notification = db.prepare(`
      INSERT INTO notifications (
        id, userId, title, message, type,
        actionUrl, read, createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
      RETURNING *
    `).get(
      crypto.randomUUID(),
      userId,
      title,
      message,
      type,
      actionUrl
    );

    // Emit notification through WebSocket if connected
    if (req.app.locals.wss) {
      req.app.locals.wss.clients.forEach((client: any) => {
        if (client.userId === userId) {
          client.send(JSON.stringify(notification));
        }
      });
    }

    res.status(201).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      UPDATE notifications
      SET read = 1
      WHERE id = ? AND userId = ?
      RETURNING *
    `).get(id, req.user!.id);

    if (!result) {
      throw new AppError('Notification not found', 404);
    }

    res.json({
      status: 'success',
      data: { notification: result }
    });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put('/read-all', authenticate, async (req, res, next) => {
  try {
    db.prepare(`
      UPDATE notifications
      SET read = 1
      WHERE userId = ?
    `).run(req.user!.id);

    res.json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
});

export default router;