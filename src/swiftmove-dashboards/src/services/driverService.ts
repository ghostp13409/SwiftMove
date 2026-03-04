import apiClient from './apiClient';
import { Driver, DriverInfo, User, Vehicle } from '../types';
import { vehicleService } from './vehicleService';
import { userService } from './userService';

// NOTE: Current Implementation Takes Driver info, gets user and vehicles from that and sets into Driver Manually
const API_BASE = '/drivers/info';


export const driverService = {
  // Get current driver profile (by JWT token)
  getCurrentDriver: async (): Promise<Driver> => {
    const response = await apiClient.get(`${API_BASE}/me`);
    // Convert to Driver
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriver(driverInfo);
    return driver;
  },

  // Get driver by userId
  getDriverByUserId: async (userId: string | number): Promise<Driver> => {
    const response = await apiClient.get(`${API_BASE}/${userId}`);
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriver(driverInfo);
    return driver;
  },

  // Create driver profile
  createDriverProfile: async (driverData: any): Promise<Driver> => {
    const response = await apiClient.post(`${API_BASE}/`, driverData);
    const driverInfo = response.data.data || response.data;
    const driver = await makeDriver(driverInfo);
    return driver;
  },

  // Delete driver
  deleteDriver: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`);
  },

  // Get all drivers (admin)
  getAllDrivers: async (): Promise<Driver[]> => {
    const response = await apiClient.get(`${API_BASE}`);
    const driverInfos = response.data.data || response.data || [];
    const drivers = await Promise.all(driverInfos.map(makeDriver));
    return drivers;
  },
};

const makeDriver = async (driverInfo: DriverInfo): Promise<Driver> => {
  const user : User = await userService.getUserById(driverInfo.userId)
  const vehicles : Vehicle[] = await vehicleService.getVehiclesByDriver(driverInfo.id)
  // Set User, Vehicles to new Driver object
  return {
    ...user,
    userId: driverInfo.userId,
    drivingExperience: driverInfo.drivingExperience,
    range: driverInfo.range,
    drivingLicense: driverInfo.drivingLicense,
    vehicles
  };
}
