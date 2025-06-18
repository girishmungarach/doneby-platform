import { z } from 'zod'

export const VerificationStatusSchema = z.object({
  id: z.string(),
  verification_id: z.string(),
  status: z.enum([
    'pending',
    'in_progress',
    'verified',
    'rejected',
    'completed',
    'cancelled',
  ]),
  previous_status: z.string().optional(),
  updated_by: z.string(),
  updated_at: z.string(),
  details: z.object({
    reason: z.string().optional(),
    comments: z.string().optional(),
    evidence_quality: z.number().optional(),
    verification_method: z.string().optional(),
    trust_score: z.number().optional(),
  }).optional(),
})

export const VerificationActivitySchema = z.object({
  id: z.string(),
  verification_id: z.string(),
  type: z.enum([
    'status_change',
    'comment_added',
    'evidence_uploaded',
    'verification_completed',
    'trust_score_updated',
  ]),
  actor_id: z.string(),
  actor_type: z.enum(['requester', 'verifier', 'system']),
  timestamp: z.string(),
  details: z.object({
    message: z.string(),
    metadata: z.record(z.any()).optional(),
  }),
})

export const VerificationNotificationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  verification_id: z.string(),
  type: z.enum([
    'status_update',
    'comment',
    'evidence',
    'verification_complete',
    'trust_score',
  ]),
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  created_at: z.string(),
  metadata: z.record(z.any()).optional(),
})

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>
export type VerificationActivity = z.infer<typeof VerificationActivitySchema>
export type VerificationNotification = z.infer<typeof VerificationNotificationSchema>

export const VERIFICATION_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-gray-100 text-gray-800',
} as const

export const VERIFICATION_STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  verified: 'Verified',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const

export const VERIFICATION_ACTIVITY_ICONS = {
  status_change: '🔄',
  comment_added: '💬',
  evidence_uploaded: '📎',
  verification_completed: '✅',
  trust_score_updated: '📊',
} as const 