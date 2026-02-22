import apiClient from './apiClient';
import { Driver } from '../types';

const API_BASE = '/drivers';

export const driverService = {
  // Get current driver profile
  getCurrentDriver: async (): Promise<Driver> => {
    try {
      const response = await apiClient.get(`${API_BASE}/me`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching current driver:', error);
      throw error;
    }
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<Driver> => {
    try {
      const response = await apiClient.post(`${API_BASE}/add`, driverData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating driver profile:', error);
      throw error;
    }
  },

  // Delete driver
  deleteDriver: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  },

  // Test endpoint
  test: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_BASE}/test`);
      return response.data;
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  },
};
