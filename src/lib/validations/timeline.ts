import * as z from 'zod';
import { TimelineEntryType } from '@/lib/types/profile';

export const timelineEntrySchema = z.object({
  type: z.nativeEnum(TimelineEntryType, {
    required_error: "Please select an entry type.",
  }),
  title: z.string().min(1, { message: "Title is required." }).max(255, { message: "Title cannot exceed 255 characters." }),
  organization: z.string().max(255, { message: "Organization name cannot exceed 255 characters." }).optional().or(z.literal('')), // Optional, but if present, has max length
  description: z.string().max(1000, { message: "Description cannot exceed 1000 characters." }).optional().or(z.literal('')), // Optional, max length
  start_date: z.string().min(1, { message: "Start date is required." }),
  end_date: z.string().optional().or(z.literal('')), // Optional
  is_current: z.boolean().default(false).optional(),
  location: z.string().max(255, { message: "Location cannot exceed 255 characters." }).optional().or(z.literal('')), // Optional, max length
  url: z.string().url({ message: "Invalid URL format." }).max(255, { message: "URL cannot exceed 255 characters." }).optional().or(z.literal('')), // Optional, but if present, must be a valid URL and has max length
  skills: z.array(z.string()).optional(), // Changed from string to string array
  files: z.array(z.instanceof(File)).max(5, { message: "You can upload a maximum of 5 files." }).optional(),
});

export type TimelineEntryFormValues = z.infer<typeof timelineEntrySchema>; 