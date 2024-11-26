interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/auth'
  : 'http://localhost:8888/.netlify/functions/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  console.log('Auth Service: Making login request to:', API_URL);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Auth Service: Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Auth Service: Request failed:', error);
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Auth Service: Login successful');
    return data;
  } catch (error) {
    console.error('Auth Service: Request error:', error);
    throw error;
  }
}
