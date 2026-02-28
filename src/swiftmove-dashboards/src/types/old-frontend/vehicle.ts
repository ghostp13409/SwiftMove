export type VehicleTypeEnum = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'MINIVAN' | 'VAN' | 'TRUCK';

export interface VehicleType {
  id?: string | number;
  type: VehicleTypeEnum;
  volume: number; // cubic feet
  maxWeight: number; // lbs
}

export interface Vehicle {
  id: string | number;
  model: string;
  make: string;
  year: number;
  color: string;
  licensePlate?: string;
  pricePerKm: number;
  isActive: boolean;
  canCarryFurniture: boolean;
  driverInfoId: string | number;
  vehicleTypeId: string | number;
  vehicleType?: VehicleType;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFormData {
  model: string;
  make: string;
  year: number;
  color: string;
  licensePlate?: string;
  pricePerKm: number;
  canCarryFurniture: boolean;
  vehicleTypeId: string | number;
}
