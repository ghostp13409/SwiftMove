import { z } from "zod";
import { AddressSchema } from "./address";
import { ClientSchema } from "./client";
import { LuggageEntryPopulatedSchema, LuggageEntrySchema } from "./luggage";

export const MoveRequestSchema = z.object({
  id: z.number(),
  moveDate: z.string().datetime().pipe(z.coerce.date()),
  maxBudget: z.number(),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  status: z.enum(["CREATED", "OFFER_AVAILABLE", "ACCEPTED", "CANCELLED"]),
});

export const MoveRequestFormSchema = z.object({
  moveDate: z.string().datetime().pipe(z.coerce.date()),
  maxBudget: z.number(),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  status: z.enum(["CREATED", "OFFER_AVAILABLE", "ACCEPTED", "CANCELLED"]),
});

export const MoveRequestPopulatedSchema = MoveRequestSchema.extend({
  client: ClientSchema,
  fromAddress: AddressSchema,
  toAddress: AddressSchema,
  luggageEntries: z.array(LuggageEntryPopulatedSchema),
});

export type MoveRequest = z.infer<typeof MoveRequestSchema>;
export type MoveRequestForm = z.infer<typeof MoveRequestFormSchema>;
export type MoveRequestPopulated = z.infer<typeof MoveRequestPopulatedSchema>;
