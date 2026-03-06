import { z } from "zod";
import { Address } from "./address";

export const MoveTripSchema = z.object({
  id: z.string(),
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  //   "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export const MoveTripFormSchema = z.object({
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export type MoveTrip = z.infer<typeof MoveTripSchema> & {
  // Optional enriched fields returned by some API endpoints
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
};

export type MoveTripForm = z.infer<typeof MoveTripFormSchema>;

export type MoveTripStatus = z.infer<typeof MoveTripSchema.shape.status>;
