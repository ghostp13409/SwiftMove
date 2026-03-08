import { addressService } from "./addressService";
import apiClient from "./apiClient";
import { Client, MoveRequest, MoveRequestForm } from "@/types";

const API_BASE = "/clients";

export const clientService = {
  // Get all clients (admin)
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  // Get specific client
  getClient: async (id: string | number): Promise<Client> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  // Get Current Client
  getCurrentClient: async (id: string | number): Promise<Client> => {
    try {
      const response = await apiClient.get(`${API_BASE}/me`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching current client:", error);
      throw error;
    }
  },
};
