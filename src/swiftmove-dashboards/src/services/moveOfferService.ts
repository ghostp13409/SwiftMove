import apiClient from "./apiClient";
import { MoveOffer, MoveOfferForm } from "@/types";

const API_BASE = "drivers/move-offers";

export const moveOfferService = {
  // Get all move offers (admin - uses test endpoint)
  getAllMoveOffers: async (): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}`);
    const data = response.data.data || response.data || [];
    return data.map((offer: any) => ({
      ...offer,
      offerDate: new Date(offer.offerDate)
    }));
  },

  // Get specific move offer by id
  getMoveOfferById: async (id: string | number): Promise<MoveOffer> => {
    const response = await apiClient.get(`${API_BASE}/${id}`);
    const data = response.data.data || response.data;
    return {
      ...data,
      offerDate: new Date(data.offerDate)
    };
  },

  // Get offers for a specific move request
  getOffersByMoveRequest: async (
    moveRequestId: string | number,
  ): Promise<MoveOffer[]> => {
    const response = await apiClient.get(
      `${API_BASE}?moveRequestId=${moveRequestId}`,
    );
    const data = response.data.data || response.data || [];
    return data.map((offer: any) => ({
      ...offer,
      offerDate: new Date(offer.offerDate)
    }));
  },

  // Get offers by driver
  getOffersByDriver: async (
    driverId: string | number,
  ): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}?driverId=${driverId}`);
    const data = response.data.data || response.data || [];
    return data.map((offer: any) => ({
      ...offer,
      offerDate: new Date(offer.offerDate)
    }));
  },

  // Create move offer
  createMoveOffer: async (data: MoveOfferForm): Promise<MoveOffer> => {
    const response = await apiClient.post(`${API_BASE}`, data);
    return response.data.data || response.data;
  },

  // Accept a move offer (client action)
  acceptOffer: async (offerId: string | number): Promise<MoveOffer> => {
    const response = await apiClient.patch(`${API_BASE}/${offerId}/accept`);
    return response.data.data || response.data;
  },

  // Update move offer
  updateMoveOffer: async (
    id: string | number,
    data: Partial<MoveOfferForm>,
  ): Promise<MoveOffer> => {
    const response = await apiClient.put(`${API_BASE}/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete move offer
  deleteMoveOffer: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },
};
