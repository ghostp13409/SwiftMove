import { Address, AddressForm } from "@/types";
import apiClient from "./apiClient";

const API_BASE = "/addresses";

export const addressService = {
  // Get all addresses
  getAllAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  },

  // Get specific address
  getAddress: async (id: string | number): Promise<Address> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  },

  // Create new address
  createAddress: async (data: AddressForm): Promise<Address> => {
    try {
      const response = await apiClient.post(`${API_BASE}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (
    id: string | number,
    data: AddressForm,
  ): Promise<Address> => {
    try {
      const response = await apiClient.put(`${API_BASE}/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  },
};
