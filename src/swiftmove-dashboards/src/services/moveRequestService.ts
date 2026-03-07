import apiClient from "./apiClient";
import { MoveRequest, MoveRequestForm } from "@/types";

const API_BASE = "clients/move-requests";

export const moveRequestService = {
  // Get all move requests for admin or current client
  getAllMoveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      const data = response.data.data || response.data || [];
      return data.map((req: any) => ({
        ...req,
        moveDate: new Date(req.moveDate)
      }));
    } catch (error) {
      console.error("Error fetching move requests:", error);
      throw error;
    }
  },

  getCurrentClientAllMoveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      const data = response.data.data || response.data || [];
      return data.map((req: any) => ({
        ...req,
        moveDate: new Date(req.moveDate)
      }));
    } catch (error) {
      console.error("Error fetching move requests:", error);
      throw error;
    }
  },

  // Get client's active move requests
  getActiveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/active`);
      const data = response.data.data || response.data || [];
      return data.map((req: any) => ({
        ...req,
        moveDate: new Date(req.moveDate)
      }));
    } catch (error) {
      console.error("Error fetching active requests:", error);
      throw error;
    }
  },

  // Get client's all move requests
  getAllRequests: async (id: string | number): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(
        `${API_BASE}/move-requests?clientId=${id}`,
      );
      const data = response.data.data || response.data || [];
      return data.map((req: any) => ({
        ...req,
        moveDate: new Date(req.moveDate)
      }));
    } catch (error) {
      console.error("Error fetching request history:", error);
      throw error;
    }
  },

  // Get specific move request
  getMoveRequestById: async (id: string | number): Promise<MoveRequest> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      const data = response.data.data || response.data;
      return {
        ...data,
        moveDate: new Date(data.moveDate)
      };
    } catch (error) {
      console.error("Error fetching move request:", error);
      throw error;
    }
  },

  // Create new move request
  createMoveRequest: async (data: MoveRequestForm): Promise<MoveRequest> => {
    try {
      const response = await apiClient.post(`${API_BASE}`, data);
      const moveRequest: MoveRequest = response.data.data || response.data;
      return moveRequest;
    } catch (error) {
      console.error("Error creating move request:", error);
      throw error;
    }
  },

  // Update move request
  updateMoveRequest: async (
    id: string | number,
    data: any,
  ): Promise<MoveRequest> => {
    try {
      const response = await apiClient.put(`${API_BASE}/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating move request:", error);
      throw error;
    }
  },

  // Delete move request
  deleteMoveRequest: async (id: string | number): Promise<void> => {
    try {
      await apiClient.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error("Error deleting move request:", error);
      throw error;
    }
  },
};
