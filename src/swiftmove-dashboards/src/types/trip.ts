import { z } from "zod";
import { Address } from "./address";
import { MoveRequestPopulatedSchema, MoveRequestSchema } from "./move-request";
import { MoveOfferPopulatedSchema, MoveOfferSchema } from "./move-offer";

export const MoveTripSchema = z.object({
  id: z.string(),
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  status: z.enum([
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "PAYMENT_PENDING",
    "DRIVER_COMPLETED",
    "COMPLETED_BY_DRIVER"
  ]),
});

export const MoveTripFormSchema = z.object({
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  status: z.enum([
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "PAYMENT_PENDING",
    "DRIVER_COMPLETED",
    "COMPLETED_BY_DRIVER"
  ]),
});

export const MoveTripPopulatedSchema = MoveTripSchema.extend({
  moveRequest: MoveRequestSchema,
  moveOffer: MoveOfferSchema,
});

export const MoveTripDetailedSchema = MoveTripSchema.extend({
  moveRequestPopulated: MoveRequestPopulatedSchema,
  moveOfferPopulated: MoveOfferPopulatedSchema,
});

export type MoveTrip = z.infer<typeof MoveTripSchema>;

export type MoveTripForm = z.infer<typeof MoveTripFormSchema>;

export type MoveTripStatus = z.infer<typeof MoveTripSchema.shape.status>;

export type MoveTripPopulated = z.infer<typeof MoveTripPopulatedSchema>;

export type MoveTripDetailed = z.infer<typeof MoveTripDetailedSchema>;
