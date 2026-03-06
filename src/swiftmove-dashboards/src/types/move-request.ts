import { z } from "zod";
import { Address } from "./address";
import { LuggageEntry } from "./luggage";

export const MoveRequestSchema = z.object({
  id: z.number(),
  moveDate: z.string().datetime(),
  maxBudget: z.number(),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "OFFER_AVAILABLE", "CANCELLED"]),
});

export const MoveRequestFormSchema = z.object({
  moveDate: z.string().datetime(),
  maxBudget: z.number(),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "OFFER_AVAILABLE", "CANCELLED"]),
});

export type MoveRequest = z.infer<typeof MoveRequestSchema> & {
  // Optional enriched fields returned by some API endpoints
  fromAddress?: Address;
  toAddress?: Address;
  clientName?: string;
  luggageEntries?: (LuggageEntry & { luggageType?: string })[];
  hasFurniture?: boolean;
  notes?: string;
};

export type MoveRequestForm = z.infer<typeof MoveRequestFormSchema>;

export type MoveRequestStatus = z.infer<typeof MoveRequestSchema.shape.status>;
