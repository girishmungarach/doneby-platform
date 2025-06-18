import { createClient } from '@/lib/supabase/server'
import {
  TrustScore,
  TrustScoreFactors,
  TrustBadge,
  TRUST_BADGES,
} from '@/lib/types/trust-score'

const FACTOR_WEIGHTS = {
  verification_quality: 0.35,
  profile_credibility: 0.25,
  peer_endorsements: 0.20,
  verification_history: 0.20,
}

const SUBFACTOR_WEIGHTS = {
  verification_quality: {
    evidence_quality: 0.35,
    verification_method: 0.25,
    confidence_level: 0.25,
    completeness: 0.15,
  },
  profile_credibility: {
    profile_completeness: 0.30,
    account_age: 0.20,
    verification_history: 0.30,
    social_connections: 0.20,
  },
  peer_endorsements: {
    endorsement_count: 0.30,
    endorsement_quality: 0.30,
    endorsement_diversity: 0.20,
    endorsement_recency: 0.20,
  },
  verification_history: {
    total_verifications: 0.25,
    success_rate: 0.35,
    average_quality: 0.25,
    consistency_score: 0.15,
  },
}

export async function calculateTrustScore(profileId: string): Promise<TrustScore> {
  const supabase = createClient()

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  // Fetch verification history
  const { data: verifications } = await supabase
    .from('verifications')
    .select('*')
    .eq('profile_id', profileId)

  // Fetch endorsements
  const { data: endorsements } = await supabase
    .from('endorsements')
    .select('*')
    .eq('endorsed_id', profileId)

  // Calculate factors
  const factors = await calculateFactors(profile, verifications, endorsements)

  // Calculate overall score
  const overallScore = calculateOverallScore(factors)

  // Get badges
  const badges = calculateBadges(overallScore, factors)

  // Generate suggestions
  const suggestions = generateSuggestions(factors)

  // Create trust score object
  const trustScore: TrustScore = {
    id: crypto.randomUUID(),
    profile_id: profileId,
    overall_score: overallScore,
    factors,
    badges,
    history: [], // Will be populated by the database
    suggestions,
    updated_at: new Date().toISOString(),
  }

  // Save to database
  await saveTrustScore(trustScore)

  return trustScore
}

async function calculateFactors(
  profile: any,
  verifications: any[],
  endorsements: any[]
): Promise<TrustScoreFactors> {
  const verificationQuality = calculateVerificationQuality(verifications)
  const profileCredibility = calculateProfileCredibility(profile, verifications)
  const peerEndorsements = calculatePeerEndorsements(endorsements)
  const verificationHistory = calculateVerificationHistory(verifications)

  return {
    verification_quality: verificationQuality,
    profile_credibility: profileCredibility,
    peer_endorsements: peerEndorsements,
    verification_history: verificationHistory,
  }
}

function calculateVerificationQuality(verifications: any[]) {
  const weights = SUBFACTOR_WEIGHTS.verification_quality
  const recentVerifications = verifications.slice(-5) // Consider last 5 verifications

  return {
    evidence_quality: calculateAverageScore(recentVerifications, 'evidence_quality'),
    verification_method: calculateAverageScore(recentVerifications, 'method_quality'),
    confidence_level: calculateAverageScore(recentVerifications, 'confidence_level'),
    completeness: calculateAverageScore(recentVerifications, 'completeness'),
  }
}

function calculateProfileCredibility(profile: any, verifications: any[]) {
  const weights = SUBFACTOR_WEIGHTS.profile_credibility

  return {
    profile_completeness: calculateProfileCompleteness(profile),
    account_age: calculateAccountAgeScore(profile.created_at),
    verification_history: calculateVerificationHistoryScore(verifications),
    social_connections: calculateSocialConnectionsScore(profile),
  }
}

function calculatePeerEndorsements(endorsements: any[]) {
  const weights = SUBFACTOR_WEIGHTS.peer_endorsements

  return {
    endorsement_count: endorsements.length,
    endorsement_quality: calculateEndorsementQuality(endorsements),
    endorsement_diversity: calculateEndorsementDiversity(endorsements),
    endorsement_recency: calculateEndorsementRecency(endorsements),
  }
}

function calculateVerificationHistory(verifications: any[]) {
  const weights = SUBFACTOR_WEIGHTS.verification_history

  return {
    total_verifications: verifications.length,
    success_rate: calculateSuccessRate(verifications),
    average_quality: calculateAverageQuality(verifications),
    consistency_score: calculateConsistencyScore(verifications),
  }
}

function calculateOverallScore(factors: TrustScoreFactors): number {
  let score = 0

  // Calculate weighted score for each factor
  for (const [factor, weight] of Object.entries(FACTOR_WEIGHTS)) {
    const factorScore = calculateFactorScore(factors[factor as keyof TrustScoreFactors])
    score += factorScore * weight
  }

  return Math.round(score)
}

function calculateFactorScore(factor: Record<string, number>): number {
  return Object.values(factor).reduce((sum, value) => sum + value, 0) / Object.keys(factor).length
}

function calculateBadges(score: number, factors: TrustScoreFactors): TrustBadge[] {
  const badges: TrustBadge[] = []

  for (const badge of TRUST_BADGES) {
    const highestLevel = badge.levels.reduce((highest, level) => {
      if (score >= level.min_score && level.level > highest) {
        return level.level
      }
      return highest
    }, 0)

    if (highestLevel > 0) {
      badges.push({
        id: badge.id,
        name: badge.name,
        level: highestLevel,
        criteria: badge.levels[highestLevel - 1].criteria,
        awarded_at: new Date().toISOString(),
      })
    }
  }

  return badges
}

function generateSuggestions(factors: TrustScoreFactors) {
  const suggestions = []

  // Analyze each factor and generate improvement suggestions
  for (const [factor, values] of Object.entries(factors)) {
    for (const [subfactor, value] of Object.entries(values)) {
      if (value < 70) {
        suggestions.push({
          factor: `${factor}.${subfactor}`,
          current_value: value,
          target_value: 70,
          improvement: generateImprovementSuggestion(factor, subfactor, value),
          priority: value < 50 ? 'high' : value < 60 ? 'medium' : 'low',
        })
      }
    }
  }

  return suggestions
}

function generateImprovementSuggestion(
  factor: string,
  subfactor: string,
  currentValue: number
): string {
  // Generate specific improvement suggestions based on factor and subfactor
  const suggestions: Record<string, Record<string, string>> = {
    verification_quality: {
      evidence_quality: 'Improve the quality of evidence provided in verifications',
      verification_method: 'Use more reliable verification methods',
      confidence_level: 'Increase confidence in verification decisions',
      completeness: 'Provide more complete verification information',
    },
    profile_credibility: {
      profile_completeness: 'Complete more profile information',
      account_age: 'Continue using the platform to build account history',
      verification_history: 'Complete more verifications successfully',
      social_connections: 'Connect with more verified users',
    },
    // Add more suggestions for other factors
  }

  return suggestions[factor]?.[subfactor] || 'Work on improving this aspect'
}

async function saveTrustScore(trustScore: TrustScore) {
  const supabase = createClient()

  const { error } = await supabase.from('trust_scores').upsert({
    ...trustScore,
    history: [
      {
        timestamp: new Date().toISOString(),
        score: trustScore.overall_score,
        factors: trustScore.factors,
        reason: 'Score calculated',
      },
    ],
  })

  if (error) {
    console.error('Error saving trust score:', error)
  }
}

// Helper functions for specific calculations
function calculateAverageScore(items: any[], field: string): number {
  if (!items.length) return 0
  const sum = items.reduce((acc, item) => acc + (item[field] || 0), 0)
  return Math.round(sum / items.length)
}

function calculateProfileCompleteness(profile: any): number {
  const requiredFields = ['name', 'email', 'bio', 'avatar_url']
  const completedFields = requiredFields.filter((field) => profile[field])
  return Math.round((completedFields.length / requiredFields.length) * 100)
}

function calculateAccountAgeScore(createdAt: string): number {
  const ageInDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  return Math.min(Math.round(ageInDays), 100)
}

function calculateVerificationHistoryScore(verifications: any[]): number {
  if (!verifications.length) return 0
  const successfulVerifications = verifications.filter((v) => v.status === 'verified')
  return Math.round((successfulVerifications.length / verifications.length) * 100)
}

function calculateSocialConnectionsScore(profile: any): number {
  // Implement social connections scoring logic
  return 0
}

function calculateEndorsementQuality(endorsements: any[]): number {
  if (!endorsements.length) return 0
  const qualityScores = endorsements.map((e) => e.quality_score || 0)
  return Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
}

function calculateEndorsementDiversity(endorsements: any[]): number {
  if (!endorsements.length) return 0
  const uniqueEndorsers = new Set(endorsements.map((e) => e.endorser_id))
  return Math.round((uniqueEndorsers.size / endorsements.length) * 100)
}

function calculateEndorsementRecency(endorsements: any[]): number {
  if (!endorsements.length) return 0
  const now = Date.now()
  const recentEndorsements = endorsements.filter(
    (e) => now - new Date(e.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
  )
  return Math.round((recentEndorsements.length / endorsements.length) * 100)
}

function calculateSuccessRate(verifications: any[]): number {
  if (!verifications.length) return 0
  const successful = verifications.filter((v) => v.status === 'verified').length
  return Math.round((successful / verifications.length) * 100)
}

function calculateAverageQuality(verifications: any[]): number {
  if (!verifications.length) return 0
  const qualityScores = verifications.map((v) => v.quality_score || 0)
  return Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
}

function calculateConsistencyScore(verifications: any[]): number {
  if (!verifications.length) return 0
  const qualityScores = verifications.map((v) => v.quality_score || 0)
  const average = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
  const variance =
    qualityScores.reduce((a, b) => a + Math.pow(b - average, 2), 0) / qualityScores.length
  return Math.round(100 - Math.min(variance * 10, 100))
} 