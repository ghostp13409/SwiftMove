import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  GoogleUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";
import { normalizeRole } from "@/utils";

// Auth API Base
const AUTH_API_BASE = `${API_BASE_URL}/auth`;

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
        throw error.response?.data || "Login failed";
      }
      throw "Login failed";
    }
  },

  // Email/Password Register
  register: async (credentials: RegisterRequest): Promise<LoginResponse> => {
    try {
      // Convert dob to YYYY-MM-DD string if it's a Date object
      const formattedCredentials = {
        ...credentials,
        dob:
          credentials.dob instanceof Date
            ? credentials.dob.toISOString().split("T")[0]
            : credentials.dob,
      };
      const response = await axios.post(
        `${AUTH_API_BASE}/register`,
        formattedCredentials,
      );
      const data: LoginResponse = response.data;
      data.role = normalizeRole(data.role) || data.role;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Registration failed";
      }
      throw "Registration failed";
    }
  },

  // Init Google OAuth login
  loginWithGoogle: () => {
    window.location.href = `${AUTH_API_BASE}/google-login`;
  },

  // Return a mock user for testing purposes (client/admin/driver)
  loginAsTestUser: (
    userType: "client" | "admin" | "driver",
  ): { id: string; role: string; name: string; email: string } => {
    // This is purely front-end convenience for development.
    switch (userType) {
      case "admin":
        return {
          id: "1",
          role: "Admin",
          name: "Test Admin",
          email: "admin@example.com",
        };
      case "driver":
        return {
          id: "2",
          role: "Driver",
          name: "Test Driver",
          email: "driver@example.com",
        };
      case "client":
      default:
        return {
          id: "3",
          role: "Client",
          name: "Test Client",
          email: "client@example.com",
        };
    }
  },

  // Check Auth
  checkAuth: async (): Promise<{
    isAuthenticated: boolean;
    user?: GoogleUser;
  }> => {
    try {
      const token = authService.getToken();
      if (!token) {
        return { isAuthenticated: false };
      }
      const response = await axios.get(`${AUTH_API_BASE}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = response.data as {
        isAuthenticated: boolean;
        user?: GoogleUser;
      };
      if (result.user && result.user.role) {
        result.user.role = normalizeRole(result.user.role) || result.user.role;
      }
      return result;
    } catch (error) {
      console.error("Failed to check auth:", error);
      return { isAuthenticated: false };
    }
  },

  // Get current user info
  getCurrentUser: async (): Promise<User | null> => {
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
      if (response.data.dob && typeof response.data.dob === "string") {
        response.data.dob = new Date(response.data.dob);
      }
      const user: User = response.data;
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  // Get current user info
  getCurrentGoogleUser: async (): Promise<GoogleUser | null> => {
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
      console.error("Failed to get current user:", error);
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
      console.error("Failed to logout:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getRole: (): string | null => {
    const role = localStorage.getItem("role");
    return normalizeRole(role);
  },

  getUserId: (): number | null => {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId) : null;
  },

  getName: (): string | null => {
    return localStorage.getItem("name");
  },

  getEmail: (): string | null => {
    return localStorage.getItem("email");
  },

  setAuthData: (
    token: string,
    role: string,
    userId?: number,
    name?: string,
    email?: string,
  ) => {
    const normalizedRole = normalizeRole(role) || role;
    localStorage.setItem("token", token);
    localStorage.setItem("role", normalizedRole);
    if (userId) {
      localStorage.setItem("userId", userId.toString());
    }
    if (name) {
      localStorage.setItem("name", name);
    }
    if (email) {
      localStorage.setItem("email", email);
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  isAdmin: (): boolean => {
    return authService.getRole() === "Admin";
  },
};
