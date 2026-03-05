import { z } from 'zod';

export const AddressSchema = z.object({
    id: z.number(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    stateOrProvince: z.string(),
    country: z.string(),
    postalOrZipCode: z.string(),
})

export const AddressFormSchema = z.object({
    line1: z.string().min(1, { message: "Address Line 1 is required" }),
    line2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    stateOrProvince: z.string().min(1, { message: "State/Province is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    postalOrZipCode: z.string().min(1, { message: "Postal/Zip Code is required" }),
})

export type Address = z.infer<typeof AddressSchema>;

export type AddressForm = z.infer<typeof AddressFormSchema>;
