import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.number(),
  make: z.string(),
  model: z.string(),
  year: z.number().int().min(1886, { message: "Year must be 1886 or later" }),
  color: z.string(),
  pricePerKm: z
    .number()
    .positive({ message: "Price per km must be a positive number" }),
  isActive: z.boolean(),
  canCarryFurniture: z.boolean(),
  driverId: z.number(), // driverInfoId
  vehicleTypeId: z.number(),
});

export const VehicleFormSchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.number().int().min(1886, { message: "Year must be 1886 or later" }),
  color: z.string().min(1, { message: "Color is required" }),
  pricePerKm: z
    .number()
    .positive({ message: "Price per km must be a positive number" }),
  isActive: z.boolean(),
  canCarryFurniture: z.boolean(),
  driverId: z.number(), // driverInfoId
  vehicleTypeId: z.number(),
});

export const VehicleTypeSchema = z.object({
  id: z.number(),
  type: z.enum(["SEDAN", "HATCHBACK", "SUV", "MINIVAN", "VAN", "TRUCK"]),
  maxWeight: z
    .number()
    .positive({ message: "Max weight must be a positive number" }),
  maxCapacity: z
    .number()
    .positive({ message: "Max capacity must be a positive number" }),
});

export type Vehicle = z.infer<typeof VehicleSchema> & {
  // Optional enriched fields returned by some API endpoints
  /** Human-readable vehicle type label (e.g. "VAN") returned by some endpoints */
  vehicleType?: string;
  /** License plate – returned by some endpoints but not in the core schema */
  licensePlate?: string;
};

export type VehicleForm = z.infer<typeof VehicleFormSchema>;

export type VehicleType = z.infer<typeof VehicleTypeSchema>;
