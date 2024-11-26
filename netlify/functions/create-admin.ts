import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Initialize the store with context
    const store = getStore({
      name: 'users',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN
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
            siteId: context.site.id,
            hasIdentityToken: !!context.clientContext?.identity?.token,
            clientContext: context.clientContext
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
          siteId: context.site.id,
          hasIdentityToken: !!context.clientContext?.identity?.token,
          clientContext: context.clientContext
        }
      })
    };
  }
};
