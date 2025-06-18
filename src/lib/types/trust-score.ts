import { z } from 'zod'

export const TrustScoreFactorsSchema = z.object({
  verification_quality: z.object({
    evidence_quality: z.number().min(0).max(100),
    verification_method: z.number().min(0).max(100),
    confidence_level: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
  }),
  profile_credibility: z.object({
    profile_completeness: z.number().min(0).max(100),
    account_age: z.number().min(0).max(100),
    verification_history: z.number().min(0).max(100),
    social_connections: z.number().min(0).max(100),
  }),
  peer_endorsements: z.object({
    endorsement_count: z.number().min(0),
    endorsement_quality: z.number().min(0).max(100),
    endorsement_diversity: z.number().min(0).max(100),
    endorsement_recency: z.number().min(0).max(100),
  }),
  verification_history: z.object({
    total_verifications: z.number().min(0),
    success_rate: z.number().min(0).max(100),
    average_quality: z.number().min(0).max(100),
    consistency_score: z.number().min(0).max(100),
  }),
})

export const TrustScoreSchema = z.object({
  id: z.string(),
  profile_id: z.string(),
  overall_score: z.number().min(0).max(100),
  factors: TrustScoreFactorsSchema,
  badges: z.array(z.object({
    id: z.string(),
    name: z.string(),
    level: z.number(),
    criteria: z.record(z.any()),
    awarded_at: z.string(),
  })),
  history: z.array(z.object({
    timestamp: z.string(),
    score: z.number().min(0).max(100),
    factors: TrustScoreFactorsSchema,
    reason: z.string(),
  })),
  suggestions: z.array(z.object({
    factor: z.string(),
    current_value: z.number(),
    target_value: z.number(),
    improvement: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
  })),
  updated_at: z.string(),
})

export const TrustBadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  levels: z.array(z.object({
    level: z.number(),
    min_score: z.number(),
    criteria: z.record(z.any()),
    benefits: z.array(z.string()),
  })),
  icon: z.string(),
  color: z.string(),
})

export type TrustScoreFactors = z.infer<typeof TrustScoreFactorsSchema>
export type TrustScore = z.infer<typeof TrustScoreSchema>
export type TrustBadge = z.infer<typeof TrustBadgeSchema>

export const TRUST_BADGES: TrustBadge[] = [
  {
    id: 'verified_identity',
    name: 'Verified Identity',
    description: 'Successfully verified identity through multiple methods',
    levels: [
      {
        level: 1,
        min_score: 60,
        criteria: {
          verification_methods: ['email', 'phone'],
          profile_completeness: 70,
        },
        benefits: ['Basic profile verification'],
      },
      {
        level: 2,
        min_score: 80,
        criteria: {
          verification_methods: ['email', 'phone', 'government_id'],
          profile_completeness: 90,
        },
        benefits: ['Enhanced profile verification', 'Priority support'],
      },
      {
        level: 3,
        min_score: 95,
        criteria: {
          verification_methods: ['email', 'phone', 'government_id', 'professional'],
          profile_completeness: 100,
        },
        benefits: ['Premium verification', 'Exclusive features', 'Priority support'],
      },
    ],
    icon: '🛡️',
    color: 'blue',
  },
  {
    id: 'trusted_verifier',
    name: 'Trusted Verifier',
    description: 'Demonstrated expertise in verification processes',
    levels: [
      {
        level: 1,
        min_score: 70,
        criteria: {
          verification_count: 10,
          success_rate: 80,
        },
        benefits: ['Basic verifier status'],
      },
      {
        level: 2,
        min_score: 85,
        criteria: {
          verification_count: 50,
          success_rate: 90,
        },
        benefits: ['Advanced verifier status', 'Priority verifications'],
      },
      {
        level: 3,
        min_score: 95,
        criteria: {
          verification_count: 100,
          success_rate: 95,
        },
        benefits: ['Expert verifier status', 'Premium verifications', 'Mentorship opportunities'],
      },
    ],
    icon: '⭐',
    color: 'gold',
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    description: 'Active and respected member of the community',
    levels: [
      {
        level: 1,
        min_score: 65,
        criteria: {
          endorsement_count: 5,
          activity_score: 70,
        },
        benefits: ['Basic community features'],
      },
      {
        level: 2,
        min_score: 80,
        criteria: {
          endorsement_count: 20,
          activity_score: 85,
        },
        benefits: ['Enhanced community features', 'Community moderation'],
      },
      {
        level: 3,
        min_score: 90,
        criteria: {
          endorsement_count: 50,
          activity_score: 95,
        },
        benefits: ['Premium community features', 'Community leadership', 'Exclusive events'],
      },
    ],
    icon: '👑',
    color: 'purple',
  },
] 