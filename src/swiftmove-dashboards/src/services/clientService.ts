import { addressService } from "./addressService";
import apiClient from "./apiClient";
import { Client, MoveRequest, MoveRequestForm } from "@/types";

const API_BASE = "/clients";

export const clientService = {
  // Get all clients (admin)
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  // Get specific client
  getClient: async (id: string | number): Promise<Client> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  // Get Current Client
  getCurrentClient: async (id: string | number): Promise<Client> => {
    try {
      const response = await apiClient.get(`${API_BASE}/me`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching current client:", error);
      throw error;
    }
  },

  // Get client's active move requests
  getActiveRequests: async (id: string | number): Promise<MoveRequest[]> => {
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
  getAllRequests: async (id: string | number): Promise<MoveRequest[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}/move-requests`);
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

  // Add move request for client
  addMoveRequest: async (
    clientId: string | number,
    requestData: MoveRequest,
  ): Promise<MoveRequest> => {
    try {
      // Get Addresses and add them throw Address Service
      const [fromAddress, toAddress] = await Promise.all([
        addressService.createAddress(requestData.fromAddress),
        addressService.createAddress(requestData.toAddress),
      ]);
      // Senetize moveDate
      const sanitizedMoveDate = sanitizeMoveDate(requestData.moveDate);
      // Create move request form with moverequest data and addressIds from to and from address creation
      const moveRequestForm: MoveRequestForm = {
        ...requestData,
        moveDate: sanitizedMoveDate,
      };
      console.log("Move Request Form:", moveRequestForm);
      const response = await apiClient.post(
        `${API_BASE}/move-requests`,
        moveRequestForm,
      );
      const moveRequest: MoveRequestForm = response.data.data || response.data;
      return attachAddressesToMoveRequest(moveRequest);
    } catch (error) {
      console.error("Error adding move request:", error);
      throw error;
    }
  },
};

// Attach Addresses to MoveRequest
const attachAddressesToMoveRequest = async (
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
    throw error;
  }
};

// Senatize moveDate from "2026-03-05T02:03" to "2026-01-28T07:14:23"
export const sanitizeMoveDate = (moveDate: string): string => {
  const date = new Date(moveDate);
  return date.toISOString();
};
