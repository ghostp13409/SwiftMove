import apiClient from "./apiClient";
import { DriverInfo, DriverWithInfo, User, Vehicle } from "@/types";
import { userService } from "./userService";

// NOTE: Current Implementation Takes Driver info, gets user and vehicles from that and sets into DriverWithInfo Manually
const API_BASE = "/drivers/info";

export const driverService = {
  // Get current driver profile (by JWT token) — returns DriverWithInfo
  getCurrentDriver: async (): Promise<DriverWithInfo> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return makeDriverWithInfo(driverInfo);
  },

  // Get driver by userId — returns DriverWithInfo
  getDriverByUserId: async (
    userId: string | number,
  ): Promise<DriverWithInfo> => {
    const response = await apiClient.get(`${API_BASE}/${userId}`);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return makeDriverWithInfo(driverInfo);
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<DriverWithInfo> => {
    const response = await apiClient.post(`${API_BASE}/`, driverData);
    const driverInfo: DriverInfo = response.data.data || response.data;
    return makeDriverWithInfo(driverInfo);
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

const makeDriverWithInfo = async (
  driverInfo: DriverInfo,
): Promise<DriverWithInfo> => {
  const user: User = await userService.getUserById(driverInfo.userId);
  const driverWithInfo: DriverWithInfo = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    passwordHash: user.passwordHash,
    addressId: user.addressId,
    dob: user.dob,
    rating: user.rating,
    role: "DRIVER",
    driverInfo: driverInfo,
  };
  return driverWithInfo;
};
