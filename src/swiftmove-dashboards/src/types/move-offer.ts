import { z } from "zod";

export const MoveOfferSchema = z.object({
  id: z.number(),
  price: z.number(),
  offerDate: z.string().datetime(),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  // "OFFER_SENT" | "ACCEPTED" | "REJECTED";
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED"]),
});

export const MoveOfferFormSchema = z.object({
  price: z.number().positive({ message: "Price must be a positive number" }),
  //   Cannot be in past
  offerDate: z
    .string()
    .datetime()
    .refine((date) => new Date(date) > new Date(), {
      message: "Offer date must be in the future",
    }),
  moveRequestId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  status: z.enum(["OFFER_SENT", "ACCEPTED", "REJECTED"]),
});

export type MoveOffer = z.infer<typeof MoveOfferSchema>;

export type MoveOfferForm = z.infer<typeof MoveOfferFormSchema>;
