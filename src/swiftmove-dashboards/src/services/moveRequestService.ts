import apiClient from './apiClient';
import { MoveRequest, MoveRequestCreateData } from '../types';

const API_BASE = '/move-request';

export const moveRequestService = {
  // Get all move requests
  getAllMoveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/get`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching move requests:', error);
      throw error;
    }
  },

  // Get specific move request
  getMoveRequest: async (id: string | number): Promise<MoveRequest> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching move request:', error);
      throw error;
    }
  },

  // Create new move request
  createMoveRequest: async (data: MoveRequestCreateData): Promise<MoveRequest> => {
    try {
      const response = await apiClient.post(`${API_BASE}/add`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating move request:', error);
      throw error;
    }
  },

  // Update move request
  updateMoveRequest: async (id: string | number, data: any): Promise<MoveRequest> => {
    try {
      const response = await apiClient.put(`${API_BASE}/edit/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating move request:', error);
      throw error;
    }
  },

  // Delete move request
  deleteMoveRequest: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/delete/${id}`);
    } catch (error) {
      console.error('Error deleting move request:', error);
      throw error;
    }
  },
};
