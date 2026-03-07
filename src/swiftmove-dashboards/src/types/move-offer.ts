import { Move } from "lucide-react";
import { z } from "zod";
import { MoveRequestSchema } from "./move-request";
import { VehicleSchema } from "./vehicle";
import { DriverInfoPopulatedSchema, DriverSchema } from "./driver";
import { UserSchema } from "./user";

export const MoveOfferSchema = z.object({
  id: z.number(),
  price: z.number(),
  offerDate: z.string(),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  // "OFFER_SENT" | "ACCEPTED" | "REJECTED"
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED"]),
});

export const MoveOfferFormSchema = z.object({
  price: z.number().positive({ message: "Price must be a positive number" }),
  offerDate: z.string(),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED"]),
});

export const MoveOfferPopulatedSchema = MoveOfferFormSchema.extend({
  driver: DriverInfoPopulatedSchema,
  moveRequest: MoveRequestSchema,
  vehicle: VehicleSchema,
});

export type MoveOffer = z.infer<typeof MoveOfferSchema>;

export type MoveOfferForm = z.infer<typeof MoveOfferFormSchema>;

export type MoveOfferStatus = z.infer<typeof MoveOfferSchema.shape.status>;

export type MoveOfferPopulated = z.infer<typeof MoveOfferPopulatedSchema>;
