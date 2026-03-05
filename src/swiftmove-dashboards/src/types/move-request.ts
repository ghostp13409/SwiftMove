import { z } from "zod";

export type MoveRequestStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type MoveOfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type MoveTripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const MoveRequestSchema = z.object({
    id: z.number(),
    moveDate: z.string().datetime(),
    maxBudget: z.number(),
    clientId: z.number(),
    fromAddressId: z.number(),
    toAddressId: z.number(),
    status: z.enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
})

export const MoveRequestFormSchema = z.object({
    moveDate: z.string().datetime(),
    maxBudget: z.number(),
    fromAddressId: z.number(),
    toAddressId: z.number(),
    status: z.enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
})

export type MoveRequest = z.infer<typeof MoveRequestSchema>;
