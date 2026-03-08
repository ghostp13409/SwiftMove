import apiClient from "./apiClient";
import { LuggageEntry, LuggageType } from "@/types";

const API_BASE = "/clients/move-requests/luggage";

export const luggageService = {
  // Get all luggage types
  getAllLuggageTypes: async (): Promise<LuggageType[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/types`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching luggage types:", error);
      throw error;
    }
  },

  // Get specific luggage type by id
  getLuggageTypeById: async (id: string | number): Promise<LuggageType> => {
    try {
      const response = await apiClient.get(`${API_BASE}/types/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching luggage type:", error);
      throw error;
    }
  },

  // Get Luggage Entries By MoveRequestId
  getLuggageEntriesByMoveRequest: async (
    moveRequestId: number,
  ): Promise<LuggageEntry[]> => {
    try {
      const response = await apiClient.get(
        `${API_BASE}?moveRequestId=${moveRequestId}`,
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching luggage entries:", error);
      throw error;
    }
  },

  // Create luggage entry
  createLuggageEntry: async (
    moveRequestId: number,
    data: Omit<LuggageEntry, "moveRequestId">,
  ): Promise<LuggageEntry> => {
    try {
      const response = await apiClient.post(
        `${API_BASE}?moveRequestId=${moveRequestId}`,
        data,
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating luggage entry:", error);
      throw error;
    }
  },
};
