import { Address } from './address';
import { LuggageEntry } from './luggage';

export type MoveRequestStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface MoveRequest {
  id: string | number;
  clientId: string | number;
  fromAddressId: string | number;
  fromAddress?: Address;
  toAddressId: string | number;
  toAddress?: Address;
  moveDate: string; // ISO date format
  maxBudget: number;
  status: MoveRequestStatus;
  luggageEntries?: LuggageEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MoveRequestFormData {
  fromAddressId: string | number;
  toAddressId: string | number;
  moveDate: string;
  maxBudget: number;
  luggageEntries: Array<{
    quantity: number;
    luggageTypeId: string | number;
  }>;
}

export interface MoveRequestCreateData extends MoveRequestFormData {
  clientId: string | number;
  status?: string;
}
