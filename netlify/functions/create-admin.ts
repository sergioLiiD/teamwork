import { Handler, HandlerContext } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
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
    
    // Check if admin already exists
    try {
      const adminData = await store.get('admin@teamwork.mx');
      if (adminData) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Admin user already exists' })
        };
      }
    } catch (error) {
      console.log('No existing admin found, proceeding with creation');
    }

    // Create admin user
    const adminUser = {
      id: uuidv4(),
      email: 'admin@teamwork.mx',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Admin User',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await store.set('admin@teamwork.mx', JSON.stringify(adminUser));
      
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Admin user created successfully',
          email: 'admin@teamwork.mx',
          password: 'admin123'
        })
      };
    } catch (error) {
      console.error('Error setting user data:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Error creating admin user',
          error: error instanceof Error ? error.message : String(error),
          context: {
            siteId: process.env.SITE_ID,
            hasIdentityToken: false,
            clientContext: null
          }
        })
      };
    }
  } catch (error) {
    console.error('Error in create-admin:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error creating admin user',
        error: error instanceof Error ? error.message : String(error),
        context: {
          siteId: process.env.SITE_ID,
          hasIdentityToken: false,
          clientContext: null
        }
      })
    };
  }
};
