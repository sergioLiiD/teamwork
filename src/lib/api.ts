import { config } from '../config';
import { logger } from './logger';
import { sanitizeObject } from './security';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', headers = {}, body } = options;
  const startTime = Date.now();

  const token = localStorage.getItem('token');
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    logger.debug(`API Request: ${method} ${endpoint}`, { body });

    // Sanitize request body
    const sanitizedBody = body ? sanitizeObject(body) : undefined;

    const response = await fetch(`${config.API_URL}/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: sanitizedBody ? JSON.stringify(sanitizedBody) : undefined,
      credentials: 'include',
    });

    let data = await response.json();
    const duration = Date.now() - startTime;

    // Sanitize response data
    data = sanitizeObject(data);

    // Log successful responses
    logger.info(`API Response: ${method} ${endpoint}`, {
      status: response.status,
      duration,
      size: JSON.stringify(data).length,
    });

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'An error occurred', data);
    }

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof ApiError) {
      // Log API errors
      logger.error(`API Error: ${method} ${endpoint}`, {
        status: error.status,
        message: error.message,
        data: error.data,
        duration,
      });
      throw error;
    }

    // Log network or other errors
    logger.error(`Network Error: ${method} ${endpoint}`, {
      error,
      duration,
    });
    throw new ApiError(500, 'Network error or server is unreachable');
  }
};