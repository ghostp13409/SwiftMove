import apiClient from './apiClient';
import { LuggageTypeInfo } from '../types';

export const luggageService = {
  // Get all luggage types
  getAllLuggageTypes: async (): Promise<LuggageTypeInfo[]> => {
    try {
      const response = await apiClient.get('/api/luggage-types');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching luggage types:', error);
      throw error;
    }
  },
};
