import { z } from "zod";
import { UserSchema, UserWithAddressSchema } from "./user";
import { Vehicle, VehiclePopulatedSchema, VehicleSchema } from "./vehicle";
import { MoveOfferSchema } from "./move-offer";

export const DriverInfoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  drivingLicense: z.string(),
  drivingExperience: z.number(),
  range: z.number(),
});

export const DriverInfoFormSchema = z.object({
  userId: z.number(),
  drivingLicense: z.string().min(1, { message: "Driving license is required" }),
  drivingExperience: z
    .number()
    .min(0, { message: "Driving experience must be at least 0 years" }),
  range: z.number().min(0, { message: "Range must be at least 0 km" }),
});

export const DriverInfoPopulatedSchema = DriverInfoSchema.extend({
  user: UserSchema.extend({
    role: z.literal("DRIVER"),
  }),
});

export const DriverInfoDetailedSchema = DriverInfoSchema.extend({
  user: UserWithAddressSchema.extend({
    role: z.literal("DRIVER"),
  }),
  vehicles: z.array(VehiclePopulatedSchema),
  moveOffers: z.array(MoveOfferSchema),
});

export const DriverSchema = UserSchema.extend({
  role: z.literal("DRIVER"),
});

export type Driver = z.infer<typeof DriverSchema>;

export type DriverInfo = z.infer<typeof DriverInfoSchema>;

export type DriverInfoForm = z.infer<typeof DriverInfoFormSchema>;

export type DriverInfoPopulated = z.infer<typeof DriverInfoPopulatedSchema>;

export type DriverInfoDetailed = z.infer<typeof DriverInfoDetailedSchema>;
