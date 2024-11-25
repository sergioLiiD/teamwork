import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { AppError } from '../utils/AppError';
import { validateRegistration, validateLogin } from '../utils/validation';

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password } = validateRegistration(req.body);
    
    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = db.prepare(`
      INSERT INTO users (id, email, password, fullName, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING id, email, fullName, role
    `).get(crypto.randomUUID(), email, hashedPassword, fullName, 'USER');

    // Generate token
    const token = jwt.sign(
      { userId: result.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user: result,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = validateLogin(req.body);

    // Get user
    const user = db.prepare(`
      SELECT id, email, password, fullName, role
      FROM users
      WHERE email = ?
    `).get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;