import { z } from "zod";

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

export type MoveOffer = z.infer<typeof MoveOfferSchema> & {
  // Optional enriched fields returned by some API endpoints
  driverName?: string;
  vehicleInfo?: string;
  driverRating?: number;
  createdAt?: string;
};

export type MoveOfferForm = z.infer<typeof MoveOfferFormSchema>;

export type MoveOfferStatus = z.infer<typeof MoveOfferSchema.shape.status>;
