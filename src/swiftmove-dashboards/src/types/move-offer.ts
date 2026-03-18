import { z } from "zod";
import { MoveRequestPopulatedSchema } from "./move-request";
import { VehicleSchema } from "./vehicle";
import { DriverInfoPopulatedSchema } from "./driver";

export const MoveOfferSchema = z.object({
  id: z.number(),
  price: z.number(),
  offerDate: z.string().datetime().pipe(z.coerce.date()),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  // "OFFER_SENT" | "ACCEPTED" | "REJECTED" | "CANCELLED"
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED", "CANCELLED"]),
});

export const MoveOfferFormSchema = z.object({
  price: z.number().positive({ message: "Price must be a positive number" }),
  offerDate: z
    .string()
    .datetime()
    .pipe(z.coerce.date())
    .refine((date) => date >= new Date(new Date().getTime() - 300000), {
      message: "Offer date cannot be in the past",
    }),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED", "CANCELLED"]),
});

export const MoveOfferPopulatedSchema = MoveOfferSchema.extend({
  driver: DriverInfoPopulatedSchema,
  moveRequest: MoveRequestPopulatedSchema,
  vehicle: VehicleSchema,
});

export type MoveOffer = z.infer<typeof MoveOfferSchema>;

export type MoveOfferForm = z.infer<typeof MoveOfferFormSchema>;

export type MoveOfferStatus = z.infer<typeof MoveOfferSchema.shape.status>;

export type MoveOfferPopulated = z.infer<typeof MoveOfferPopulatedSchema>;
