import apiClient from "./apiClient";
import { Address, User, UserForm } from "@/types";

const API_BASE = "/users";

export const userService = {
  // Get all users (alt endpoint)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user by Id (Not used anywhere)
  getUserById: async (id: string | number): Promise<User> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: UserForm): Promise<User> => {
    try {
      const formattedData = {
        ...userData,
        userName: userData.username,
      };
      const response = await apiClient.post(`${API_BASE}`, formattedData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user profile (accepts partial data for partial updates)
  updateUserProfile: async (
    id: string | number,
    data: Partial<UserForm> & { username?: string },
  ): Promise<User> => {
    try {
      const formattedData = {
        ...data,
        userName: data.username,
      };
      const response = await apiClient.put(`${API_BASE}/${id}`, formattedData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Get user's address
  getUserAddress: async (id: string | number): Promise<Address> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching user address:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Seed data (for testing)
  seedData: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_BASE}/seed`);
      return response.data;
    } catch (error) {
      console.error("Error seeding data:", error);
      throw error;
    }
  },
};
