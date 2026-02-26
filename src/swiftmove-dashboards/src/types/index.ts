export type UserRole = "CLIENT" | "DRIVER" | "ADMIN";

export type MoveRequestStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type MoveOfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type MoveTripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Address {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  userType: UserRole;
  firstName: string;
  lastName: string;
  dob: string;
  address: Address;
  rating: number;
  phone?: string;
  createdAt: string;
  status: "active" | "inactive";
}

export interface DriverInfo {
  id: number;
  userId: number;
  drivingExperience: number;
  range: number;
  licenseNumber: string;
  user?: User;
}

export interface VehicleType {
  type: string;
  volume: number;
  maxWeight: number;
}

export interface Vehicle {
  id: number;
  driverId: number;
  model: string;
  make: string;
  year: number;
  color: string;
  vehicleType: string;
  pricePerKm: number;
  isActive: boolean;
  canCarryFurniture: boolean;
  licensePlate?: string;
}

export interface LuggageType {
  type: string;
  name: string;
  volume: number;
  weight: number;
}

export interface LuggageEntry {
  luggageType: string;
  quantity: number;
}

export interface MoveRequest {
  id: number;
  clientId: number;
  clientName: string;
  fromAddress: Address;
  toAddress: Address;
  moveDate: string;
  maxBudget: number;
  status: MoveRequestStatus;
  luggageEntries: LuggageEntry[];
  hasFurniture: boolean;
  notes?: string;
  createdAt: string;
  offersCount: number;
}

export interface MoveOffer {
  id: number;
  moveRequestId: number;
  driverId: number;
  driverName: string;
  driverRating: number;
  vehicleId: number;
  vehicleInfo: string;
  price: number;
  offeredTime: string;
  status: MoveOfferStatus;
  createdAt: string;
}

export interface MoveTrip {
  id: number;
  moveRequestId: number;
  moveOfferId: number;
  clientName: string;
  driverName: string;
  fromAddress: Address;
  toAddress: Address;
  startTime: string;
  endTime?: string;
  status: MoveTripStatus;
  price: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalDrivers: number;
  totalClients: number;
  totalMoveRequests: number;
  activeMoveTrips: number;
  completedTrips: number;
  totalVehicles: number;
  totalRevenue: number;
}
