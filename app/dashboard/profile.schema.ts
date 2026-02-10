// app/dashboard/profile/profile.schema.ts
import { z } from "zod";

export const profileSchema = z.object({
  participant: z.object({
    name: z.string().min(1, "Required"),
    address1: z.string().min(1, "Required"),
    address2: z.string().optional(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    pincode: z.string(),
  }),

  contact: z.object({
    name: z.string().min(1),
    mobile: z.string().min(10),
    email: z.string().email(),
    alternateEmail: z.string().optional(),
  }),

  disciplines: z.array(z.string()).min(1, "Select at least one discipline"),
});
