import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId?: number;
  name?: string;
  email?: string;
}

// For Google OAuth
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  role: string;
}


// Auth API Base
const AUTH_API_BASE = `${API_BASE_URL}/auth`;

// Hardcoded test users for development
const HARDCODED_USERS = {
  client: {
    id: '1',
    email: 'client@example.com',
    name: 'John Client',
    role: 'Client',
  },
  admin: {
    id: '2',
    email: 'admin@example.com',
    name: 'Jane Admin',
    role: 'Admin',
  },
  driver: {
    id: '3',
    email: 'driver@example.com',
    name: 'Bob Driver',
    role: 'Driver',
  },
};

export const authService = {
  // Email/Password Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${AUTH_API_BASE}/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || 'Login failed';
      }
      throw 'Login failed';
    }
  },

  // Email/Password Register
  register: async (credentials: RegisterRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${AUTH_API_BASE}/register`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || 'Registration failed';
      }
      throw 'Registration failed';
    }
  },

  // Init Google OAuth login
  loginWithGoogle: () => {
    window.location.href = `${AUTH_API_BASE}/google-login`;
  },

 // Check Auth
 checkAuth: async (): Promise<{isAuthenticated: boolean, user?: GoogleUser }> => {
   try {
     const token = authService.getToken();
     if (!token) {
       // Check for hardcoded test user
       const userType = localStorage.getItem('userType') as keyof typeof HARDCODED_USERS | null;
       if (userType && userType in HARDCODED_USERS) {
         return { isAuthenticated: true, user: HARDCODED_USERS[userType] };
       }
       return { isAuthenticated: false };
     }

     const response = await axios.get(`${AUTH_API_BASE}/check`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     return response.data;
   } catch (error) {
     console.error('Failed to check auth:', error);
     // Check for hardcoded test user
     const userType = localStorage.getItem('userType') as keyof typeof HARDCODED_USERS | null;
     if (userType && userType in HARDCODED_USERS) {
       return { isAuthenticated: true, user: HARDCODED_USERS[userType] };
     }
     return { isAuthenticated: false };
   }
 },


  // Get current user info
  getCurrentUser: async (): Promise<GoogleUser | null> => {
    try {
      const token = authService.getToken();
      if (!token) {
        return null;
      }

      const response = await axios.get(`${AUTH_API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },


  logout: async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await axios.post(`${AUTH_API_BASE}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getRole: (): string | null => {
    return localStorage.getItem('role');
  },

  getUserId: (): number | null => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  },

  getName: (): string | null => {
    return localStorage.getItem('name');
  },

  getEmail: (): string | null => {
    return localStorage.getItem('email');
  },

  setAuthData: (token: string, role: string, userId?: number, name?: string, email?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
    if (name) {
      localStorage.setItem('name', name);
    }
    if (email) {
      localStorage.setItem('email', email);
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

 isAdmin: (): boolean => {
   return localStorage.getItem('role') === 'Admin';
 },

 // Login with hardcoded test user
 loginAsTestUser: (userType: 'client' | 'admin' | 'driver'): GoogleUser => {
   const user = HARDCODED_USERS[userType];
   authService.setAuthData('test-token-' + userType, user.role, parseInt(user.id), user.name, user.email);
   localStorage.setItem('userType', userType);
   return user;
 },

 // Get hardcoded test users (for UI purposes)
 getTestUsers: () => HARDCODED_USERS,
};
