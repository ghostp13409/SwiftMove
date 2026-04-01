import { z } from "zod";
import { AddressSchema } from "./address";
import { ClientSchema } from "./client";
import { LuggageEntryPopulatedSchema } from "./luggage";

export const MoveRequestSchema = z.object({
  id: z.number(),
  moveDate: z.string().datetime().pipe(z.coerce.date()),
  maxBudget: z.number(),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  distance: z.number().optional(),
  fromLatitude: z.number().optional(),
  fromLongitude: z.number().optional(),
  toLatitude: z.number().optional(),
  toLongitude: z.number().optional(),
  status: z.enum(["CREATED", "OFFER_AVAILABLE", "ACCEPTED", "CANCELLED"]),
  hasFurniture: z.boolean().default(false),
  note: z.string().optional(),
});

export const MoveRequestFormSchema = z.object({
  moveDate: z
    .string()
    .datetime()
    .pipe(z.coerce.date())
    .refine((date) => date >= new Date(new Date().getTime() - 300000), {
      message: "Move date cannot be in the past",
    }),
  maxBudget: z.number().min(1, { message: "Budget must be at least $1" }),
  clientId: z.number(),
  fromAddressId: z.number(),
  toAddressId: z.number(),
  distance: z.number().optional(),
  fromLatitude: z.number().optional(),
  fromLongitude: z.number().optional(),
  toLatitude: z.number().optional(),
  toLongitude: z.number().optional(),
  status: z.enum(["CREATED", "OFFER_AVAILABLE", "ACCEPTED", "CANCELLED"]),
  hasFurniture: z.boolean().default(false),
  note: z.string().optional(),
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

export type MoveRequestStatus = z.infer<typeof MoveRequestSchema.shape.status>;
