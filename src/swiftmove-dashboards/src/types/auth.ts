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
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be YYYY-MM-DD",
    })
    .pipe(z.coerce.date())
    .refine((d) => d <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
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
