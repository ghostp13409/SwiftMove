import apiClient from './apiClient';
import { Vehicle, VehicleFormData, VehicleType } from '../types';

const API_BASE = '/vehicle';

export const vehicleService = {
  // Create new vehicle
  createVehicle: async (data: VehicleFormData): Promise<Vehicle> => {
    try {
      const response = await apiClient.post(`${API_BASE}/`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },

  // Toggle vehicle active status
  toggleVehicleActive: async (id: string | number): Promise<Vehicle> => {
    try {
      const response = await apiClient.patch(`${API_BASE}/${id}/toggle-active`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error toggling vehicle active status:', error);
      throw error;
    }
  },

  // Get all vehicle types
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    try {
      const response = await apiClient.get('/api/vehicle-types');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      throw error;
    }
  },

  // Get all vehicles (test endpoint to retrieve vehicles)
  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
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
