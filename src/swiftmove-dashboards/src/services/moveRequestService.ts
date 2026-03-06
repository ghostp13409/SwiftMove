import apiClient from "./apiClient";
import { MoveRequest, MoveRequestForm } from "@/types";
import { addressService } from "./addressService";

const API_BASE = "clients/move-requests";

export const moveRequestService = {
  // Get all move requests
  // FIXME: currently doesn't work for admin
  getAllMoveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/all`);
      // attach addresses to each move request
      const moveRequests: MoveRequest[] =
        response.data.data || response.data || [];
      const moveRequestsWithAddresses = await Promise.all(
        moveRequests.map(attachAddressesToMoveRequest),
      );
      return moveRequestsWithAddresses;
    } catch (error) {
      console.error("Error fetching move requests:", error);
      throw error;
    }
  },

  getCurrentClientAllMoveRequests: async (): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      // atttach addresses
      const moveRequests: MoveRequest[] =
        response.data.data || response.data || [];
      const moveRequestsWithAddresses = await Promise.all(
        moveRequests.map(attachAddressesToMoveRequest),
      );
      return moveRequestsWithAddresses;
    } catch (error) {
      console.error("Error fetching move requests:", error);
      throw error;
    }
  },

  // Get client's active move requests
  getActiveRequests: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/move-requests/active`);
      // attach addresses to each move request
      const moveRequests: MoveRequest[] =
        response.data.data || response.data || [];
      const moveRequestsWithAddresses = await Promise.all(
        moveRequests.map(attachAddressesToMoveRequest),
      );
      return moveRequestsWithAddresses;
    } catch (error) {
      console.error("Error fetching active requests:", error);
      throw error;
    }
  },

  // Get client's all move requests
  getAllRequests: async (id: string | number): Promise<any[]> => {
    try {
      const response = await apiClient.get(
        `${API_BASE}/move-requests?clientId=${id}`,
      );
      // attach addresses to each move request
      const moveRequests: MoveRequest[] =
        response.data.data || response.data || [];
      const moveRequestsWithAddresses = await Promise.all(
        moveRequests.map(attachAddressesToMoveRequest),
      );
      return moveRequestsWithAddresses;
    } catch (error) {
      console.error("Error fetching request history:", error);
      throw error;
    }
  },

  // Get specific move request
  getMoveRequest: async (id: string | number): Promise<MoveRequest> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      const moveRequest: MoveRequest = response.data.data || response.data;
      return attachAddressesToMoveRequest(moveRequest);
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
      return attachAddressesToMoveRequest(moveRequest);
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

// Add to and from addresses to move request by calling address service (get address by id) and attach it to move request object to and from
export const attachAddressesToMoveRequest = async (
  moveRequest: MoveRequest,
): Promise<MoveRequest> => {
  try {
    const [fromAddress, toAddress] = await Promise.all([
      addressService.getAddress(moveRequest.fromAddressId),
      addressService.getAddress(moveRequest.toAddressId),
    ]);
    return {
      ...moveRequest,
      fromAddress,
      toAddress,
    };
  } catch (error) {
    console.error("Error fetching addresses for move request:", error);
    return moveRequest; // Return original move request without addresses if there's an error
  }
};
