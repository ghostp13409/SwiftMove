import { MoveRequest } from './move-request';
import { MoveOffer } from './move-offer';
import { Driver } from './user';

export type TripStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

export interface MoveTrip {
  id: string | number;
  moveRequestId: string | number;
  moveRequest?: MoveRequest;
  moveOfferId: string | number;
  moveOffer?: MoveOffer;
  driverId: string | number;
  driver?: Driver;
  status: TripStatus;
  startTime?: string; // ISO datetime
  endTime?: string; // ISO datetime
  createdAt?: string;
  updatedAt?: string;
}
