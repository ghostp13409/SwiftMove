import { z } from "zod";
import { UserSchema } from "./user";

//  Client type  is a user with fixed role of "CLIENT"
export const ClientSchema = UserSchema.extend({
  role: z.literal("CLIENT"),
});

export type Client = z.infer<typeof ClientSchema>;
