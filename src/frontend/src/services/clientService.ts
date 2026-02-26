import apiClient from './apiClient';
import { Client } from '../types';

const API_BASE = '/client';

export const clientService = {
  // Get all clients (admin)
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/allClients`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get specific client
  getClient: async (id: string | number): Promise<Client> => {
    try {
      const response = await apiClient.get(`${API_BASE}/getClient/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Get client's active move requests
  getActiveRequests: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}/move-requests/active`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching active requests:', error);
      throw error;
    }
  },

  // Get client's move request history
  getRequestHistory: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}/move-requests/history`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching request history:', error);
      throw error;
    }
  },

  // Add move request for client
  addMoveRequest: async (clientId: string | number, requestData: any): Promise<any> => {
    try {
      const response = await apiClient.post(`${API_BASE}/${clientId}/addMoveRequest`, requestData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error adding move request:', error);
      throw error;
    }
  },
};
