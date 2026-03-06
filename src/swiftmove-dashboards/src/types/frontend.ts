/**
 * Frontend-only types that are NOT sent to/from the backend.
 * These are purely for UI convenience (computed/display data).
 */

import { Address } from "./address";

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────
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

// ─── User Profile Update (sent to backend as partial update) ─────────────────
export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  password?: string;
}

// ─── MoveTrip with enriched display fields ───────────────────────────────────
// The backend MoveTripSchema only has: id, moveRequestId, moveOfferId, status.
// Some API responses may include extra display fields; model them here.
export interface MoveTripDisplay {
  clientName?: string;
  driverName?: string;
  fromAddress?: Address;
  toAddress?: Address;
  /** ISO date-time string for when the trip starts */
  startTime?: string;
  /** Final price for the trip */
  price?: number;
  /** Nested move request (if returned by endpoint) */
  moveRequest?: {
    clientId?: number;
  };
}

// ─── Vehicle with enriched display fields ────────────────────────────────────
// VehicleSchema has vehicleTypeId (number) but some endpoints return the type label.
export interface VehicleDisplay {
  /** Human-readable vehicle type label (e.g. "VAN") returned by some endpoints */
  vehicleType?: string;
  /** License plate – returned by some endpoints but not in the core schema */
  licensePlate?: string;
}
