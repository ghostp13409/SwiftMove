import apiClient from './apiClient';
import { Address, AddressFormData } from '../types';

const API_BASE = '/address';

export const addressService = {
  // Get all addresses
  getAllAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/all`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Get specific address
  getAddress: async (id: string | number): Promise<Address> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  },

  // Create new address
  createAddress: async (data: AddressFormData): Promise<Address> => {
    try {
      const response = await apiClient.post(`${API_BASE}/addNewAddress`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (id: string | number, data: AddressFormData): Promise<Address> => {
    try {
      const response = await apiClient.put(`${API_BASE}/update/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/delete/${id}`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },
};
