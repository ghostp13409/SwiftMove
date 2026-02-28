import apiClient from './apiClient';
import { MoveOffer, MoveOfferCreateData } from '../types';

const API_BASE = '/move-offer';

export const moveOfferService = {
  // Get all move offers (admin - uses test endpoint)
  getAllMoveOffers: async (): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}/move-offers/test`);
    return response.data.data || response.data || [];
  },

  // Get offers for a specific move request
  getOffersByMoveRequest: async (moveRequestId: string | number): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}/move-requests/${moveRequestId}/offers`);
    return response.data.data || response.data || [];
  },

  // Get offers by driver
  getOffersByDriver: async (driverId: string | number): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}/driver/${driverId}`);
    return response.data.data || response.data || [];
  },

  // Create move offer
  createMoveOffer: async (data: MoveOfferCreateData): Promise<MoveOffer> => {
    const response = await apiClient.post(`${API_BASE}/offers`, data);
    return response.data.data || response.data;
  },

  // Update move offer
  updateMoveOffer: async (id: string | number, data: Partial<MoveOfferCreateData>): Promise<MoveOffer> => {
    const response = await apiClient.put(`${API_BASE}/offers/${id}`, data);
    return response.data.data || response.data;
  },

  // Accept move offer
  acceptOffer: async (id: string | number): Promise<MoveOffer> => {
    const response = await apiClient.put(`${API_BASE}/offers/${id}/accept`);
    return response.data.data || response.data;
  },

  // Delete move offer
  deleteMoveOffer: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },
};
