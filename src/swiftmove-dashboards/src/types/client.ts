import { z } from "zod";
import { MoveRequest } from "./move-request";
import { User, UserSchema } from "./user";

export type ClientWithMoveRequests = User & {
  moveRequests: MoveRequest[];
};

//  Client type  is a user with fixed role of "CLIENT"
export const Client = UserSchema.extend({
  role: z.literal("CLIENT"),
});

export type Client = z.infer<typeof Client>;
