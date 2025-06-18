import { z } from 'zod'
import { VerificationMethod, VerificationStatus } from './verification'

export const EvidenceQualitySchema = z.object({
  clarity: z.number().min(1).max(5),
  relevance: z.number().min(1).max(5),
  authenticity: z.number().min(1).max(5),
  completeness: z.number().min(1).max(5),
  timeliness: z.number().min(1).max(5),
})

export const VerificationConfidenceSchema = z.object({
  level: z.enum(['low', 'medium', 'high']),
  certainty: z.number().min(1).max(100),
  reasoning: z.string().min(10),
})

export const VerificationNarrativeSchema = z.object({
  summary: z.string().min(50),
  keyFindings: z.array(z.string()),
  concerns: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
})

export const VerificationScoreSchema = z.object({
  overall: z.number().min(1).max(100),
  evidenceQuality: z.number().min(1).max(100),
  verificationProcess: z.number().min(1).max(100),
  confidenceLevel: z.number().min(1).max(100),
  comments: z.string().optional(),
})

export const VerificationMilestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
  completedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export const VerificationAttachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  url: z.string().url(),
  uploadedAt: z.string().datetime(),
  size: z.number(),
  description: z.string().optional(),
})

export const VerificationFormSchema = z.object({
  verificationId: z.string().uuid(),
  status: VerificationStatus,
  method: VerificationMethod,
  evidenceQuality: EvidenceQualitySchema,
  confidence: VerificationConfidenceSchema,
  narrative: VerificationNarrativeSchema,
  score: VerificationScoreSchema,
  milestones: z.array(VerificationMilestoneSchema),
  attachments: z.array(VerificationAttachmentSchema),
  comments: z.string().min(10),
  completedAt: z.string().datetime().optional(),
})

export type EvidenceQuality = z.infer<typeof EvidenceQualitySchema>
export type VerificationConfidence = z.infer<typeof VerificationConfidenceSchema>
export type VerificationNarrative = z.infer<typeof VerificationNarrativeSchema>
export type VerificationScore = z.infer<typeof VerificationScoreSchema>
export type VerificationMilestone = z.infer<typeof VerificationMilestoneSchema>
export type VerificationAttachment = z.infer<typeof VerificationAttachmentSchema>
export type VerificationForm = z.infer<typeof VerificationFormSchema>

export interface VerificationFormProps {
  verification: VerificationForm
  onSubmit: (data: VerificationForm) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export interface VerificationQuestion {
  id: string
  type: 'work' | 'education' | 'skill'
  question: string
  required: boolean
  validation?: z.ZodType<any>
}

export const WORK_VERIFICATION_QUESTIONS: VerificationQuestion[] = [
  {
    id: 'work-role',
    type: 'work',
    question: 'Did the individual hold the claimed position?',
    required: true,
  },
  {
    id: 'work-duration',
    type: 'work',
    question: 'Did they work for the stated duration?',
    required: true,
  },
  {
    id: 'work-responsibilities',
    type: 'work',
    question: 'Did they perform the stated responsibilities?',
    required: true,
  },
  {
    id: 'work-performance',
    type: 'work',
    question: 'How would you rate their overall performance?',
    required: true,
    validation: z.enum(['excellent', 'good', 'average', 'below_average', 'poor']),
  },
]

export const EDUCATION_VERIFICATION_QUESTIONS: VerificationQuestion[] = [
  {
    id: 'education-degree',
    type: 'education',
    question: 'Did the individual earn the claimed degree?',
    required: true,
  },
  {
    id: 'education-duration',
    type: 'education',
    question: 'Did they attend for the stated duration?',
    required: true,
  },
  {
    id: 'education-graduation',
    type: 'education',
    question: 'Did they graduate in the stated year?',
    required: true,
  },
  {
    id: 'education-major',
    type: 'education',
    question: 'Did they major in the stated field?',
    required: true,
  },
]

export const SKILL_VERIFICATION_QUESTIONS: VerificationQuestion[] = [
  {
    id: 'skill-proficiency',
    type: 'skill',
    question: 'How would you rate their proficiency level?',
    required: true,
    validation: z.enum(['expert', 'advanced', 'intermediate', 'beginner']),
  },
  {
    id: 'skill-application',
    type: 'skill',
    question: 'Have you observed them applying this skill?',
    required: true,
  },
  {
    id: 'skill-duration',
    type: 'skill',
    question: 'How long have they been using this skill?',
    required: true,
  },
  {
    id: 'skill-recommendation',
    type: 'skill',
    question: 'Would you recommend them for roles requiring this skill?',
    required: true,
  },
] 