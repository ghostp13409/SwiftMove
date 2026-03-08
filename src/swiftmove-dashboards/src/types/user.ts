import { z } from "zod";
import { AddressSchema } from "./address";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  //  Cannot be in future
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be YYYY-MM-DD",
    })
    .pipe(z.coerce.date())
    .refine((d) => d <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  rating: z.number(),
  role: z.enum(["CLIENT", "DRIVER", "ADMIN"]),
  addressId: z.union([z.string(), z.number()]),
});

export const UserFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["CLIENT", "DRIVER", "ADMIN"]),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be YYYY-MM-DD",
    })
    .pipe(z.coerce.date())
    .refine((d) => d <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  addressId: z.union([z.string(), z.number()]),
});

export const UserWithAddressSchema = UserSchema.extend({
  address: AddressSchema,
});

export type User = z.infer<typeof UserSchema>;

export type UserForm = z.infer<typeof UserFormSchema>;

export type UserWithAddress = z.infer<typeof UserWithAddressSchema>;

export type UserRole = z.infer<typeof UserSchema.shape.role>;
