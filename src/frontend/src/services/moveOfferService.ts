import apiClient from './apiClient';
import { MoveOffer, MoveOfferCreateData } from '../types';

const API_BASE = '/move-offer';

export const moveOfferService = {
  // Create move offer
  createMoveOffer: async (data: MoveOfferCreateData): Promise<MoveOffer> => {
    try {
      const response = await apiClient.post(`${API_BASE}/offers`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating move offer:', error);
      throw error;
    }
  },

  // Update move offer
  updateMoveOffer: async (id: string | number, data: any): Promise<MoveOffer> => {
    try {
      const response = await apiClient.put(`${API_BASE}/offers/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating move offer:', error);
      throw error;
    }
  },

  // Get offers for move request
  getOffersByMoveRequest: async (moveRequestId: string | number): Promise<MoveOffer[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/move-requests/${moveRequestId}/offers`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  // Accept move offer
  acceptOffer: async (id: string | number): Promise<MoveOffer> => {
    try {
      const response = await apiClient.put(`${API_BASE}/offers/${id}/accept`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    }
  },

  // Delete move offer
  deleteMoveOffer: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting move offer:', error);
      throw error;
    }
  },

  // Get all move offers (test endpoint)
  getMoveOffers: async (): Promise<MoveOffer[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/move-offers/test`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching move offers:', error);
      throw error;
    }
  },

  // Test endpoint
  test: async (): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_BASE}/move-offers/test`);
      return response.data;
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  },
};
