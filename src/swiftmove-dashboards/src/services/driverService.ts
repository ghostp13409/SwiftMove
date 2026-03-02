import apiClient from './apiClient';
import { Driver } from '../types';

const API_BASE = '/drivers';

export const driverService = {
  // Get current driver profile (by JWT token)
  getCurrentDriver: async (): Promise<Driver> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    return response.data.data || response.data;
  },

  // Get driver by userId
  getDriverByUserId: async (userId: string | number): Promise<Driver> => {
    const response = await apiClient.get(`${API_BASE}/user/${userId}`);
    return response.data.data || response.data;
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<Driver> => {
    const response = await apiClient.post(`${API_BASE}/add`, driverData);
    return response.data.data || response.data;
  },

  // Delete driver
  deleteDriver: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Get all drivers (admin)
  getAllDrivers: async (): Promise<Driver[]> => {
    const response = await apiClient.get(`${API_BASE}/all`);
    return response.data.data || response.data || [];
  },
};
