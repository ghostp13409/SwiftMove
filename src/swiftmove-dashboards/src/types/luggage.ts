import { z } from "zod";
import { MoveRequestSchema } from "./move-request";

export const LuggageEntrySchema = z.object({
  id: z.number(),
  quantity: z.number(),
  moveRequestId: z.number(),
  luggageTypeId: z.number(),
});

export const LuggageEntryFormSchema = z.object({
  id: z.number(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  moveRequestId: z.number(),
  luggageTypeId: z.number(),
});
export const LuggageTypeSchema = z.object({
  id: z.number(),
  type: z.string(),
  luggageTypeEnum: z.enum([
    "SMALL",
    "MEDIUM",
    "LARGE",
    "EXTRA_LARGE",
    "EXTRA_EXTRA_LARGE",
  ]),
  name: z.string(),
  volume: z.number(),
  weight: z.number(),
});

export const LuggageEntryPopulatedSchema = LuggageEntrySchema.extend({
  luggageType: LuggageTypeSchema,
});

export type LuggageEntry = z.infer<typeof LuggageEntrySchema>;

export type LuggageEntryForm = z.infer<typeof LuggageEntryFormSchema>;
export type LuggageType = z.infer<typeof LuggageTypeSchema>;
export type LuggageEntryPopulated = z.infer<typeof LuggageEntryPopulatedSchema>;
