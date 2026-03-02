import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Normalize roles to a consistent capitalized format used throughout the app
const normalizeRole = (role: string | null): string | null => {
  if (!role) return null;
  const lower = role.toLowerCase();
  if (lower === 'client') return 'Client';
  if (lower === 'driver') return 'Driver';
  if (lower === 'admin') return 'Admin';
  // if it's already one of the expected forms just return as-is
  return role;
};

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
      const data: LoginResponse = response.data;
      data.role = normalizeRole(data.role) || data.role;
      return data;
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
      const data: LoginResponse = response.data;
      data.role = normalizeRole(data.role) || data.role;
      return data;
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
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user?: GoogleUser }> => {
    try {
      const token = authService.getToken();
      if (!token) {
        // Check for hardcoded test user
        const userType =
          localStorage.getItem('userType') as keyof typeof HARDCODED_USERS | null;
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
      const result = response.data as { isAuthenticated: boolean; user?: GoogleUser };
      if (result.user && result.user.role) {
        result.user.role = normalizeRole(result.user.role) || result.user.role;
      }
      return result;
    } catch (error) {
      console.error('Failed to check auth:', error);
      // Check for hardcoded test user
      const userType =
        localStorage.getItem('userType') as keyof typeof HARDCODED_USERS | null;
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
      const user: GoogleUser = response.data;
      if (user.role) {
        user.role = normalizeRole(user.role) || user.role;
      }
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  logout: async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await axios.post(
          `${AUTH_API_BASE}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
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
    const role = localStorage.getItem('role');
    return normalizeRole(role);
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

  setAuthData: (
    token: string,
    role: string,
    userId?: number,
    name?: string,
    email?: string,
  ) => {
    const normalizedRole = normalizeRole(role) || role;
    localStorage.setItem('token', token);
    localStorage.setItem('role', normalizedRole);
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
    return authService.getRole() === 'Admin';
  },

  // Login with hardcoded test user
  loginAsTestUser: (
    userType: 'client' | 'admin' | 'driver',
  ): GoogleUser => {
    const user = HARDCODED_USERS[userType];
    authService.setAuthData(
      'test-token-' + userType,
      user.role,
      parseInt(user.id),
      user.name,
      user.email,
    );
    localStorage.setItem('userType', userType);
    return user;
  },

  // Get hardcoded test users (for UI purposes)
  getTestUsers: () => HARDCODED_USERS,
};
