import { Handler, HandlerContext } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface User {
  id: string;
  email: string;
  role: string;
}

export function verifyToken(token: string): User {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function generateToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const handler: Handler = async (event: any, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  let { email, password } = JSON.parse(event.body || '{}');

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email and password are required' })
    };
  }

  try {
    // Check required environment variables
    if (!process.env.SITE_ID || !process.env.NETLIFY_BLOBS_TOKEN) {
      console.error('Missing required environment variables:', {
        hasSiteId: !!process.env.SITE_ID,
        hasToken: !!process.env.NETLIFY_BLOBS_TOKEN
      });
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Server configuration error',
          error: 'Missing required environment variables',
          debug: {
            hasSiteId: !!process.env.SITE_ID,
            hasToken: !!process.env.NETLIFY_BLOBS_TOKEN
          }
        })
      };
    }

    // Initialize the store using environment variables
    const store = getStore({
      name: 'users',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });

    // Log initialization details for debugging
    console.log('Store initialization:', {
      name: 'users',
      hasSiteId: !!process.env.SITE_ID,
      hasToken: !!process.env.NETLIFY_BLOBS_TOKEN,
      siteId: process.env.SITE_ID
    });

    let userData;
    try {
      userData = await store.get(email);
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          message: 'Invalid credentials',
          error: error instanceof Error ? error.message : String(error),
          debug: {
            hasEnvVars: {
              siteId: !!process.env.SITE_ID,
              token: !!process.env.NETLIFY_BLOBS_TOKEN
            }
          }
        })
      };
    }
    
    if (!userData) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const user = JSON.parse(userData);
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const authToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      })
    };
  } catch (error) {
    console.error('Error in auth:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
        debug: {
          hasEnvVars: {
            siteId: !!process.env.SITE_ID,
            token: !!process.env.NETLIFY_BLOBS_TOKEN
          }
        }
      })
    };
  }
};
