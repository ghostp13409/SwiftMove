import { z } from "zod";

const LoginRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    // NOTE: For now set to 4 for testing
    .min(4, { message: "Password must be at least 4 characters" }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["CLIENT", "DRIVER", "ADMIN"]),
  dob: z
    .date()
    .max(new Date(), { message: "Date of birth cannot be in the future" }),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginResponseSchema = z.object({
  token: z.string(),
  role: z.string(),
  userId: z.number().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const GoogleUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
});

export type GoogleUser = z.infer<typeof GoogleUserSchema>;

// Utility function to convert role string to expected format
export const normalizeRole = (role: string): string => {
  const upperRole = role.toUpperCase();
  if (upperRole === "CLIENT") return "CLIENT";
  if (upperRole === "DRIVER") return "DRIVER";
  if (upperRole === "ADMIN") return "ADMIN";
  // If it's already one of the expected forms just return as-is
  return role;
};

// Utility function to convert role string to expected format for Google OAuth
export const normalizeGoogleRole = (role: string): string => {
  const lowerRole = role.toLowerCase();
  if (lowerRole === "client") return "CLIENT";
  if (lowerRole === "driver") return "DRIVER";
  if (lowerRole === "admin") return "ADMIN";
  // If it's already one of the expected forms just return as-is
  return role;
};
