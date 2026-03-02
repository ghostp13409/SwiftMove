import apiClient from './apiClient';
import { User, UserUpdateData, UserProfile } from '../types';

const API_BASE = '/users';

export const userService = {
  // Get all users (admin)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/all`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get all users (alt endpoint)
  getAllUsersAlt: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/allUsers`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: any): Promise<User> => {
    try {
      const response = await apiClient.post(`${API_BASE}/addUser`, userData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (id: string | number, data: UserUpdateData): Promise<User> => {
    try {
      const response = await apiClient.put(`${API_BASE}/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user's address
  getUserAddress: async (id: string | number): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user address:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Seed data (for testing)
  seedData: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_BASE}/seed`);
      return response.data;
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },
};
