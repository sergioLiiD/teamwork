import express from 'express';
import { createServer } from 'http';
import {
  limiter,
  apiLimiter,
  securityHeaders,
  corsConfig,
  corsErrorHandler,
  sanitizeInput,
  preventHPP,
  securityMiddleware,
} from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { setupWebSocket } from './websocket/notifications';
import routes from './routes';

const app = express();
const server = createServer(app);

// Set up WebSocket server
const wss = setupWebSocket(server);
app.locals.wss = wss;

// Security middleware
app.use(securityHeaders);
app.use(corsConfig);
app.use(securityMiddleware);
app.use(preventHPP);

// Rate limiting - apply to all routes
app.use(limiter);

// API-specific rate limiting
app.use('/api/', apiLimiter);

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Input sanitization
app.use(sanitizeInput);

// Routes
app.use('/api', routes);

// Error handling
app.use(corsErrorHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;