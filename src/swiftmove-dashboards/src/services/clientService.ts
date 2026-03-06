import apiClient from "./apiClient";
import { Client } from "@/types";

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

  // Get client's active move requests
  getActiveRequests: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/move-requests/active`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching active requests:", error);
      throw error;
    }
  },

  // Get client's all move requests
  getAllRequests: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}/move-requests`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching request history:", error);
      throw error;
    }
  },

  // Add move request for client
  addMoveRequest: async (
    clientId: string | number,
    requestData: any,
  ): Promise<any> => {
    try {
      const response = await apiClient.post(
        `${API_BASE}/move-requests`,
        requestData,
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error adding move request:", error);
      throw error;
    }
  },
};
