import { z } from 'zod'
import { VerificationStatus } from '@/lib/types/verification'

export const verificationRequestSchema = z.object({
  profile_id: z.string().uuid(),
  timeline_entry_id: z.string().uuid(),
  evidence_type: z.enum(['document', 'testimonial', 'certification', 'other']),
  evidence_url: z.string().url(),
  evidence_description: z.string().min(10).max(500),
  metadata: z.record(z.any()).optional(),
})

export const verificationEvidenceSchema = z.object({
  evidence_type: z.enum(['document', 'testimonial', 'certification', 'other']),
  evidence_url: z.string().url(),
  evidence_description: z.string().min(10).max(500),
  metadata: z.record(z.any()).optional(),
})

export const verificationStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected'] as const),
  rejection_reason: z.string().min(10).max(500).optional(),
})

export const verificationFiltersSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected'] as const).optional(),
  evidence_type: z.string().optional(),
  date_range: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
  profile_id: z.string().uuid().optional(),
  verified_by: z.string().uuid().optional(),
})

export const verificationSortSchema = z.object({
  field: z.enum(['created_at', 'updated_at', 'verified_at', 'status']),
  direction: z.enum(['asc', 'desc']),
})

export const verificationPaginationSchema = z.object({
  page: z.number().int().min(1),
  page_size: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
})

export const verificationAuditSchema = z.object({
  action: z.enum(['created', 'updated', 'verified', 'rejected', 'appealed']),
  details: z.string().min(10).max(500),
  metadata: z.record(z.any()).optional(),
})

export type VerificationRequestInput = z.infer<typeof verificationRequestSchema>
export type VerificationEvidenceInput = z.infer<typeof verificationEvidenceSchema>
export type VerificationStatusUpdateInput = z.infer<typeof verificationStatusUpdateSchema>
export type VerificationFiltersInput = z.infer<typeof verificationFiltersSchema>
export type VerificationSortInput = z.infer<typeof verificationSortSchema>
export type VerificationPaginationInput = z.infer<typeof verificationPaginationSchema>
export type VerificationAuditInput = z.infer<typeof verificationAuditSchema> 