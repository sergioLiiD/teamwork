import { Handler } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { db } from '../../server/db';
import authRoutes from '../../server/routes/auth';
import workflowRoutes from '../../server/routes/workflows';
import workspaceRoutes from '../../server/routes/workspaces';
import emailRoutes from '../../server/routes/email';
import notificationRoutes from '../../server/routes/notifications';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(hpp());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/workflows', workflowRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/email', emailRoutes);
app.use('/notifications', notificationRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Database connection
db.prepare('PRAGMA foreign_keys = ON').run();

// Create serverless handler
const serverlessHandler = serverless(app);

export const handler: Handler = async (event, context) => {
  // Add the path to the event if it's not present
  if (!event.path && event.rawUrl) {
    const url = new URL(event.rawUrl);
    event.path = url.pathname;
  }

  // Handle the request
  return serverlessHandler(event, context);
};
