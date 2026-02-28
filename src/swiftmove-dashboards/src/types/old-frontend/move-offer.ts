import { MoveRequest } from './move-request';
import { Vehicle } from './vehicle';
import { Driver } from './user';

export type MoveOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface MoveOffer {
  id: string | number;
  moveRequestId: string | number;
  moveRequest?: MoveRequest;
  driverId: string | number;
  driver?: Driver;
  vehicleId: string | number;
  vehicle?: Vehicle;
  price: number;
  offeredDate: string; // ISO datetime format
  statusId: string | number;
  status?: MoveOfferStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoveOfferFormData {
  price: number;
  vehicleId: string | number;
  offeredDate?: string;
}

export interface MoveOfferCreateData extends MoveOfferFormData {
  moveRequestId: string | number;
  driverId: string | number;
  statusId?: string | number;
}
