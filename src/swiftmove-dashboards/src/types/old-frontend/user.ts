import { Address } from './address';

export type UserRole = 'Client' | 'Driver' | 'Admin';

export interface User {
  id: string | number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  addressId?: string | number;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  role?: UserRole;
}

export interface UserUpdateData {
  userName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  addressId?: string | number;
  password?: string;
}

export interface Client extends User {
  id: string | number;
  userId: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Driver extends User {
  id: string | number;
  userId: string | number;
  drivingExperience: number;
  range: number; // in kilometers
  drivingLicense?: string;
  createdAt?: string;
  updatedAt?: string;
}
