import { z } from 'zod'

export const VerifierIdentitySchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  status: z.enum(['pending', 'verified', 'rejected', 'suspended']),
  verification_methods: z.array(
    z.object({
      type: z.enum([
        'linkedin',
        'email_domain',
        'professional_certification',
        'government_id',
        'manual_review',
      ]),
      status: z.enum(['pending', 'verified', 'rejected']),
      verified_at: z.string().datetime().optional(),
      details: z.record(z.unknown()),
    })
  ),
  linkedin_profile: z
    .object({
      url: z.string().url(),
      verified: z.boolean(),
      verified_at: z.string().datetime().optional(),
      profile_data: z.record(z.unknown()).optional(),
    })
    .optional(),
  email_domain: z
    .object({
      domain: z.string(),
      verified: z.boolean(),
      verified_at: z.string().datetime().optional(),
      company_name: z.string().optional(),
      company_website: z.string().url().optional(),
    })
    .optional(),
  reputation_score: z.object({
    overall: z.number().min(0).max(100),
    verification_accuracy: z.number().min(0).max(100),
    response_time: z.number().min(0).max(100),
    verification_count: z.number().min(0),
    rejection_rate: z.number().min(0).max(100),
    fraud_risk_score: z.number().min(0).max(100),
  }),
  qualifications: z.array(
    z.object({
      type: z.enum([
        'direct_supervisor',
        'colleague',
        'client',
        'partner',
        'certified_verifier',
        'other',
      ]),
      relationship: z.string(),
      duration: z.string(),
      evidence: z.string(),
      verified: z.boolean(),
      verified_at: z.string().datetime().optional(),
    })
  ),
  badges: z.array(
    z.object({
      id: z.string().uuid(),
      type: z.enum([
        'verified_professional',
        'top_verifier',
        'quick_responder',
        'high_accuracy',
        'expert_verifier',
        'trusted_verifier',
      ]),
      awarded_at: z.string().datetime(),
      expires_at: z.string().datetime().optional(),
      criteria_met: z.record(z.unknown()),
    })
  ),
  verification_history: z.array(
    z.object({
      id: z.string().uuid(),
      verification_id: z.string().uuid(),
      status: z.enum(['verified', 'rejected', 'pending']),
      completed_at: z.string().datetime().optional(),
      accuracy_score: z.number().min(0).max(100).optional(),
      feedback: z.string().optional(),
    })
  ),
  fraud_detection: z.object({
    risk_level: z.enum(['low', 'medium', 'high']),
    risk_factors: z.array(
      z.object({
        type: z.enum([
          'suspicious_pattern',
          'multiple_rejections',
          'inconsistent_behavior',
          'fake_credentials',
          'other',
        ]),
        description: z.string(),
        detected_at: z.string().datetime(),
        resolved: z.boolean(),
        resolved_at: z.string().datetime().optional(),
      })
    ),
    last_assessment: z.string().datetime(),
  }),
  onboarding_status: z.object({
    completed: z.boolean(),
    steps: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        status: z.enum(['pending', 'completed', 'failed']),
        completed_at: z.string().datetime().optional(),
        required: z.boolean(),
      })
    ),
    qualification_score: z.number().min(0).max(100),
  }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type VerifierIdentity = z.infer<typeof VerifierIdentitySchema>

export interface VerifierIdentityProps {
  verifierIdentity: VerifierIdentity
  onUpdate: (data: Partial<VerifierIdentity>) => Promise<void>
  onVerify: (method: string) => Promise<void>
  onReject: (method: string, reason: string) => Promise<void>
  isLoading?: boolean
}

export const VERIFIER_ONBOARDING_STEPS = [
  {
    id: 'basic_info',
    name: 'Basic Information',
    required: true,
  },
  {
    id: 'linkedin_verification',
    name: 'LinkedIn Profile Verification',
    required: true,
  },
  {
    id: 'email_verification',
    name: 'Email Domain Verification',
    required: true,
  },
  {
    id: 'qualification_assessment',
    name: 'Qualification Assessment',
    required: true,
  },
  {
    id: 'identity_verification',
    name: 'Identity Verification',
    required: true,
  },
  {
    id: 'terms_acceptance',
    name: 'Terms and Conditions',
    required: true,
  },
]

export const VERIFIER_BADGE_CRITERIA = {
  verified_professional: {
    name: 'Verified Professional',
    description: 'Successfully verified professional identity',
    criteria: {
      linkedin_verified: true,
      email_verified: true,
      identity_verified: true,
    },
  },
  top_verifier: {
    name: 'Top Verifier',
    description: 'Consistently high verification accuracy',
    criteria: {
      verification_count: 50,
      accuracy_score: 95,
      response_time: 24, // hours
    },
  },
  quick_responder: {
    name: 'Quick Responder',
    description: 'Fast response to verification requests',
    criteria: {
      average_response_time: 12, // hours
      verification_count: 10,
    },
  },
  high_accuracy: {
    name: 'High Accuracy',
    description: 'Maintains high verification accuracy',
    criteria: {
      accuracy_score: 90,
      verification_count: 20,
    },
  },
  expert_verifier: {
    name: 'Expert Verifier',
    description: 'Verified expert in their field',
    criteria: {
      verification_count: 100,
      accuracy_score: 95,
      years_experience: 5,
    },
  },
  trusted_verifier: {
    name: 'Trusted Verifier',
    description: 'Consistently trusted by the community',
    criteria: {
      verification_count: 200,
      accuracy_score: 90,
      fraud_risk_score: 10,
    },
  },
} 