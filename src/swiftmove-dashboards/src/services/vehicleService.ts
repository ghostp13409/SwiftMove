import apiClient from './apiClient';
import { Vehicle, VehicleFormData, VehicleType } from '../types';

const API_BASE = 'drivers/vehicles';

export const vehicleService = {
  // Get all vehicles (admin)
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get(`${API_BASE}/`);
    return response.data.data || response.data || [];
  },

  // Get vehicles for a specific driver (by driverInfoId)
  getVehiclesByDriver: async (driverInfoId: string | number): Promise<Vehicle[]> => {
    const response = await apiClient.get(`${API_BASE}?driverId=${driverInfoId}`);
    return response.data.data || response.data || [];
  },

  // Create new vehicle
  createVehicle: async (data: VehicleFormData): Promise<Vehicle> => {
    const response = await apiClient.post(`${API_BASE}/`, data);
    return response.data.data || response.data;
  },

  // Delete vehicle
  deleteVehicle: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Toggle vehicle active status
  toggleVehicleActive: async (id: string | number): Promise<Vehicle> => {
    const response = await apiClient.patch(`${API_BASE}/${id}/toggle-active`);
    return response.data.data || response.data;
  },

  // Get all vehicle types
  getVehicleTypes: async (): Promise<VehicleType[]> => {
    const response = await apiClient.get('/drivers/vehicle-types');
    return response.data.data || response.data || [];
  },
};
