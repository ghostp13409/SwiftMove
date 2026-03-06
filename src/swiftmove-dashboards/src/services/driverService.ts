import apiClient from "./apiClient";
import { Driver, DriverInfo, DriverWithInfo, User, Vehicle } from "@/types";
import { userService } from "./userService";

// NOTE: Current Implementation Takes Driver info, gets user and vehicles from that and sets into Driver Manually
const API_BASE = "/drivers/info";

export const driverService = {
  // Get current driver profile (by JWT token)
  getCurrentDriver: async (): Promise<DriverInfo> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    // Convert to Driver
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriverWithInfo(driverInfo);
    return driver;
  },

  // Get driver by userId
  getDriverByUserId: async (userId: string | number): Promise<DriverInfo> => {
    const response = await apiClient.get(`${API_BASE}/${userId}`);
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriverWithInfo(driverInfo);
    return driver;
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<DriverInfo> => {
    const response = await apiClient.post(`${API_BASE}/`, driverData);
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriverWithInfo(driverInfo);
    return driver;
  },

  // Delete driver
  deleteDriver: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Get all drivers (admin)
  getAllDrivers: async (): Promise<DriverInfo[]> => {
    const response = await apiClient.get(`${API_BASE}`);
    const driverInfos = response.data.data || response.data || [];
    return driverInfos;
  },
};

const makeDriverWithInfo = async (
  driverInfo: DriverInfo,
): Promise<DriverWithInfo> => {
  const user: User = await userService.getUserById(driverInfo.userId);
  const DriverWithInfo: DriverWithInfo = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    passwordHash: user.passwordHash,
    addressId: user.addressId,
    dob: user.dob,
    role: "DRIVER",
    driverInfo: driverInfo,
  };
  return DriverWithInfo;
};
