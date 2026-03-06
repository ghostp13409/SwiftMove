import { z } from "zod";

export const MoveTripSchema = z.object({
  id: z.string(),
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  //   "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export const MoveTripFormSchema = z.object({
  moveRequestId: z.number(),
  moveOfferId: z.number(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export type MoveTrip = z.infer<typeof MoveTripSchema>;

export type MoveTripForm = z.infer<typeof MoveTripFormSchema>;

export type MoveTripStatus = z.infer<typeof MoveTripSchema.shape.status>;
