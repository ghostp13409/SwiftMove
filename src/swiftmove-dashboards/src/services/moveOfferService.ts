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

  // Get offers by current driver
  getOffersByDriver: async (): Promise<MoveOffer[]> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    const data = response.data.data || response.data || [];
    return data.map((offer: any) => ({
      ...offer,
      offerDate: new Date(offer.offerDate)
    }));
  },


  // Create move offer
  createMoveOffer: async (data: MoveOfferForm): Promise<MoveOffer> => {
    const formattedData = {
      ...data,
      offerDate: data.offerDate instanceof Date ? data.offerDate.toISOString() : data.offerDate,
    };
    const response = await apiClient.post(`${API_BASE}`, formattedData);
    const result = response.data.data || response.data;
    return {
      ...result,
      offerDate: new Date(result.offerDate)
    };
  },

  // Accept a move offer (client action)
  acceptOffer: async (offerId: string | number): Promise<MoveOffer> => {
    const response = await apiClient.patch(`${API_BASE}/${offerId}/accept`);
    const result = response.data.data || response.data;
    return {
      ...result,
      offerDate: new Date(result.offerDate)
    };
  },

  // Reject a move offer (client action)
  rejectOffer: async (offerId: string | number): Promise<MoveOffer> => {
    const response = await apiClient.patch(`${API_BASE}/${offerId}/reject`);
    const result = response.data.data || response.data;
    return {
      ...result,
      offerDate: new Date(result.offerDate)
    };
  },

  // Update move offer
  updateMoveOffer: async (
    id: string | number,
    data: Partial<MoveOfferForm>,
  ): Promise<MoveOffer> => {
    const formattedData = { ...data };
    if (data.offerDate instanceof Date) {
      formattedData.offerDate = data.offerDate;
    }
    const response = await apiClient.put(`${API_BASE}/${id}`, formattedData);
    const result = response.data.data || response.data;
    return {
      ...result,
      offerDate: new Date(result.offerDate)
    };
  },

  // Delete move offer
  deleteMoveOffer: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Cancel move offer
  cancelMoveOffer: async (id: string | number): Promise<void> => {
    await apiClient.patch(`${API_BASE}/${id}/cancel`);
  },
};
