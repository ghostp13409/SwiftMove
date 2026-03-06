import { z } from "zod";

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
  fromAddressId: z.number(),
  toAddressId: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "OFFER_AVAILABLE", "CANCELLED"]),
});

export type MoveRequest = z.infer<typeof MoveRequestSchema>;
