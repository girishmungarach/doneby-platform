import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),
  linkedin: z.string().optional(),
  // Add other profile fields as needed
});

export type ProfileFormValues = z.infer<typeof profileSchema>; 