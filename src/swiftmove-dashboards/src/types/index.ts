export type UserRole = "CLIENT" | "DRIVER" | "ADMIN";

export type MoveRequestStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type MoveOfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type MoveTripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Address {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  stateOrProvince?: string;
  country: string;
  postalCode?: string;
  postalOrZipCode?: string;
}

export interface User {
  id: number;
  username?: string;
  userName?: string;
  email: string;
  userType: UserRole;
  role?: string;
  firstName: string;
  lastName: string;
  dob?: string;
  address?: Address;
  addressId?: number;
  rating?: number;
  phone?: string;
  createdAt?: string;
  status?: "active" | "inactive";
}

export interface UserUpdateData {
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  addressId?: number;
  password?: string;
}

export interface UserProfile extends User {
  driverInfo?: DriverInfo;
}

export interface Client {
  id: number;
  userId: number;
  user?: User;
}

export interface Driver {
  id: number;
  userId: number;
  drivingExperience?: number;
  range?: number;
  licenseNumber?: string; // TODO: Remove it
  drivingLicense?: string;
  user?: User;
  vehicles?: Vehicle[];
}

export interface DriverInfo {
  id: number;
  userId: number;
  drivingExperience: number;
  range: number;
  drivingLicense: string;
  user?: User;
}

export interface VehicleType {
  id?: number;
  type: string;
  volume: number;
  maxWeight: number;
}

export interface Vehicle {
  id: number;
  driverId?: number;
  driverInfoId?: number;
  model: string;
  make: string;
  year: number;
  color: string;
  vehicleType?: string;
  vehicleTypeId?: number;
  pricePerKm: number;
  isActive: boolean;
  canCarryFurniture: boolean;
  licensePlate?: string;
}

export interface VehicleFormData {
  model: string;
  make: string;
  year: number;
  color: string;
  vehicleTypeId: number;
  pricePerKm: number;
  isActive: boolean;
  canCarryFurniture: boolean;
  driverId: number;
  licensePlate?: string;
}

export interface LuggageType {
  id?: number;
  type: string;
  name: string;
  volume: number;
  weight: number;
}

export interface LuggageEntry {
  luggageType?: string;
  luggageTypeId?: number;
  quantity: number;
}

export interface MoveRequest {
  id: number;
  clientId: number;
  clientName?: string;
  fromAddressId?: number;
  fromAddress?: Address;
  toAddressId?: number;
  toAddress?: Address;
  moveDate: string;
  maxBudget: number;
  status: MoveRequestStatus;
  luggageEntries?: LuggageEntry[];
  hasFurniture?: boolean;
  notes?: string;
  createdAt?: string;
  offersCount?: number;
}

export interface MoveRequestCreateData {
  clientId: number;
  fromAddressId: number;
  toAddressId: number;
  moveDate: string;
  maxBudget: number;
  status?: string;
  luggageEntries: Array<{
    quantity: number;
    luggageTypeId: number;
  }>;
}

export interface AddressFormData {
  line1: string;
  line2?: string;
  city: string;
  stateOrProvince: string;
  country: string;
  postalOrZipCode: string;
}

export interface MoveOffer {
  id: number;
  moveRequestId: number;
  driverId: number;
  driverName?: string;
  driverRating?: number;
  vehicleId: number;
  vehicleInfo?: string;
  price: number;
  offeredTime?: string;
  offeredDate?: string;
  status: MoveOfferStatus;
  statusId?: number;
  createdAt?: string;
}

export interface MoveOfferCreateData {
  moveRequestId: number;
  driverId: number;
  vehicleId: number;
  price: number;
  offeredDate: string;
  statusId?: number;
}

export interface MoveTrip {
  id: number;
  moveRequestId: number;
  moveOfferId?: number;
  clientName?: string;
  driverName?: string;
  fromAddress?: Address;
  toAddress?: Address;
  startTime?: string;
  endTime?: string;
  status: MoveTripStatus;
  price?: number;
  moveRequest?: MoveRequest;
  moveOffer?: MoveOffer;
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
