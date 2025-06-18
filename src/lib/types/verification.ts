import { Database } from '@/types/supabase'
import { Profile } from './profile'

export type VerificationStatus = Database['public']['Enums']['verification_status']

export interface VerificationRequest {
  id: string
  profile_id: string
  timeline_entry_id: string
  evidence_type: 'document' | 'testimonial' | 'certification' | 'other'
  evidence_url: string
  evidence_description: string
  status: VerificationStatus
  created_at: string
  updated_at: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  metadata?: Record<string, any>
}

export interface VerificationEvidence {
  id: string
  verification_id: string
  evidence_type: 'document' | 'testimonial' | 'certification' | 'other'
  evidence_url: string
  evidence_description: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface VerificationAudit {
  id: string
  verification_id: string
  action: 'created' | 'updated' | 'verified' | 'rejected' | 'appealed'
  performed_by: string
  performed_at: string
  details: string
  metadata?: Record<string, any>
}

export interface Verification {
  id: string
  profile_id: string
  timeline_entry_id: string
  status: VerificationStatus
  created_at: string
  updated_at: string
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  metadata?: Record<string, any>
  evidence: VerificationEvidence[]
  audit_log: VerificationAudit[]
  profile?: Profile
  verifier?: Profile
}

export interface VerificationStats {
  total_verifications: number
  pending_verifications: number
  approved_verifications: number
  rejected_verifications: number
  average_verification_time: number
  verification_success_rate: number
}

export interface VerificationFilters {
  status?: VerificationStatus
  evidence_type?: string
  date_range?: {
    start: string
    end: string
  }
  profile_id?: string
  verified_by?: string
}

export interface VerificationSort {
  field: 'created_at' | 'updated_at' | 'verified_at' | 'status'
  direction: 'asc' | 'desc'
}

export interface VerificationPagination {
  page: number
  page_size: number
  total: number
}

export interface VerificationResponse {
  data: Verification[]
  stats: VerificationStats
  pagination: VerificationPagination
} 