import apiClient from "./apiClient";
import { LuggageEntry, LuggageType } from "@/types";

const API_BASE = "/clients/move-requests/luggage";

export const luggageService = {
  // Get all luggage types
  getAllLuggageTypes: async (): Promise<LuggageType[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching luggage types:", error);
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
};
