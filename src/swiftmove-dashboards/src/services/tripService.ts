import apiClient from "./apiClient";
import { MoveTrip, MoveRequest } from "@/types";

const API_BASE = "/trips";

export interface BudgetSuggestionRequest {
  fromAddressId: number;
  toAddressId: number;
  hasFurniture: boolean;
}

export interface BudgetSuggestionResponse {
  distance: number;
  suggestedMaxBudget: number;
  averagePricePerKm: number;
}

export const tripService = {
  // Get all trips (admin)
  getAllTrips: async (): Promise<MoveTrip[]> => {
    const response = await apiClient.get(`${API_BASE}/allTrips`);
    return response.data.data || response.data || [];
  },

  // Get specific trip
  getTrip: async (id: string | number): Promise<MoveTrip> => {
    const response = await apiClient.get(`${API_BASE}/${id}`);
    return response.data.data || response.data;
  },

  // Get trips for a specific client
  getTripsByClient: async (clientId: string | number): Promise<MoveTrip[]> => {
    const response = await apiClient.get(`${API_BASE}/client/${clientId}`);
    return response.data.data || response.data || [];
  },

  // Get trips for a specific driver
  getTripsByDriver: async (driverId: string | number): Promise<MoveTrip[]> => {
    const response = await apiClient.get(`${API_BASE}/driver/${driverId}`);
    return response.data.data || response.data || [];
  },

  // Update trip status
  updateTripStatus: async (id: string | number, status: string): Promise<MoveTrip> => {
    const response = await apiClient.patch(`${API_BASE}/${id}/status?status=${status}`);
    return response.data.data || response.data;
  },

  // Suggest budget
  suggestBudget: async (request: BudgetSuggestionRequest): Promise<BudgetSuggestionResponse> => {
    const response = await apiClient.post(`${API_BASE}/suggest-budget`, request);
    return response.data.data || response.data;
  },

  // Browse filtered requests for driver
  browseRequests: async (driverId: string | number): Promise<MoveRequest[]> => {
    const response = await apiClient.get(`${API_BASE}/browse-requests?driverId=${driverId}`);
    return response.data.data || response.data || [];
  },

  // Delete a trip (including associated offer and request)
  deleteTrip: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },
};
