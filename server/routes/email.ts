import express from 'express';
import { sendEmail } from '../services/emailService';
import { authenticate } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const router = express.Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { to, subject, html, from } = req.body;

    if (!to || !subject || !html) {
      throw new AppError('Missing required email fields', 400);
    }

    await sendEmail({ to, subject, html, from });

    res.json({
      status: 'success',
      message: 'Email sent successfully'
    });
  } catch (error) {
    logger.error('Email route error:', error);
    next(error);
  }
});

export default router;