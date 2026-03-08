import apiClient from "./apiClient";
import {
  Driver,
  DriverInfo,
  DriverInfoPopulated,
  User,
  Vehicle,
} from "@/types";
import { userService } from "./userService";

// NOTE: Current Implementation Takes Driver info, gets user and vehicles from that and sets into DriverWithInfo Manually
const API_BASE = "/drivers/info";

export const driverService = {
  // Get current driver profile (by JWT token) — returns DriverWithInfo
  getCurrentDriver: async (): Promise<DriverInfo> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return driverInfo;
  },

  // Get driver by userId — returns DriverWithInfo
  getDriverByUserId: async (userId: string | number): Promise<DriverInfo> => {
    const response = await apiClient.get(
      `${API_BASE}/by-driver?driverId=${userId}`,
    );
    const driverInfo: DriverInfo = response.data.data || response.data;
    return driverInfo;
  },

  getDriverById: async (id: string | number): Promise<DriverInfo> => {
    const response = await apiClient.get(`${API_BASE}/${id}`);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return driverInfo;
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<DriverInfo> => {
    const response = await apiClient.post(`${API_BASE}/`, driverData);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return driverInfo;
  },

  // Delete driver
  deleteDriver: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Get all drivers (admin) — returns raw DriverInfo list
  getAllDrivers: async (): Promise<DriverInfo[]> => {
    const response = await apiClient.get(`${API_BASE}`);
    return response.data.data || response.data || [];
  },
};
