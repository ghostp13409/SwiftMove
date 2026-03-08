import apiClient from "./apiClient";
import { MoveTrip } from "@/types";

const API_BASE = "/trips";

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
};
