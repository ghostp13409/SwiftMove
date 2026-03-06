import { z } from "zod";

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

export type LuggageEntry = z.infer<typeof LuggageEntrySchema>;

export type LuggageEntryForm = z.infer<typeof LuggageEntryFormSchema>;

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

export type LuggageType = z.infer<typeof LuggageTypeSchema>;
