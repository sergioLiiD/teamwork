import { Handler, HandlerContext } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
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
  // Enable CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  let { email, password } = JSON.parse(event.body || '{}');
  console.log('Login attempt for:', email);

  if (!email || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders,
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
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Server configuration error',
          error: 'Missing required environment variables'
        })
      };
    }

    // Initialize the store
    const store = getStore({
      name: 'users',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
    });

    console.log('Fetching user data for:', email);
    const userData = await store.get(email);
    
    if (!userData) {
      console.log('User not found:', email);
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const user = JSON.parse(userData);
    console.log('Validating password for user:', email);
    
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    console.log('Login successful for user:', email);
    const authToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
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
    console.error('Error in auth function:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
