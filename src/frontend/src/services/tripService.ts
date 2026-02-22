import apiClient from './apiClient';
import { MoveTrip } from '../types';

const API_BASE = '/trips';

export const tripService = {
  // Get all trips
  getAllTrips: async (): Promise<MoveTrip[]> => {
    try {
      const response = await apiClient.get(`${API_BASE}/allTrips`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  // Get specific trip
  getTrip: async (id: string | number): Promise<MoveTrip> => {
    try {
      const response = await apiClient.get(`${API_BASE}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  },
};
