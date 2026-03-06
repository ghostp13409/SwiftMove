import { z } from "zod";
import { User, UserSchema } from "./user";
import { Vehicle } from "./vehicle";
import { MoveOffer } from "./move-offer";

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

// Driver extends User with driverInfo and vehicles

export type DriverInfo = z.infer<typeof DriverInfoSchema>;

export type DriverInfoForm = z.infer<typeof DriverInfoFormSchema>;

export type DriverWithInfo = Driver & {
  driverInfo: DriverInfo;
};

export type DriverWithVehicles = Driver & {
  vehicles: Vehicle[];
};

export type DriverWithMoveOffers = Driver & {
  moveOffers: MoveOffer[];
};

export const Driver = UserSchema.extend({
  role: z.literal("DRIVER"),
});

export type Driver = z.infer<typeof Driver>;
