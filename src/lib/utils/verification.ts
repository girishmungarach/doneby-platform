import { createClient } from '@/lib/supabase/server'
import {
  Verification,
  VerificationRequest,
  VerificationStatus,
  VerificationFilters,
  VerificationSort,
  VerificationPagination,
  VerificationResponse,
  VerificationStats,
} from '@/lib/types/verification'

export async function createVerificationRequest(
  request: Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at' | 'status'>
): Promise<VerificationRequest> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      ...request,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getVerificationById(id: string): Promise<Verification> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verifications')
    .select(`
      *,
      evidence:verification_evidence(*),
      audit_log:verification_audit(*),
      profile:profiles(*),
      verifier:profiles!verified_by(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateVerificationStatus(
  id: string,
  status: VerificationStatus,
  verifiedBy: string,
  rejectionReason?: string
): Promise<Verification> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verifications')
    .update({
      status,
      verified_by: verifiedBy,
      verified_at: status === 'verified' ? new Date().toISOString() : null,
      rejection_reason: rejectionReason,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getVerifications(
  filters: VerificationFilters = {},
  sort: VerificationSort = { field: 'created_at', direction: 'desc' },
  pagination: VerificationPagination = { page: 1, page_size: 10, total: 0 }
): Promise<VerificationResponse> {
  const supabase = createClient()
  
  let query = supabase
    .from('verifications')
    .select(`
      *,
      evidence:verification_evidence(*),
      audit_log:verification_audit(*),
      profile:profiles(*),
      verifier:profiles!verified_by(*)
    `, { count: 'exact' })

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.profile_id) {
    query = query.eq('profile_id', filters.profile_id)
  }
  if (filters.verified_by) {
    query = query.eq('verified_by', filters.verified_by)
  }
  if (filters.date_range) {
    query = query
      .gte('created_at', filters.date_range.start)
      .lte('created_at', filters.date_range.end)
  }

  // Apply sorting
  query = query.order(sort.field, { ascending: sort.direction === 'asc' })

  // Apply pagination
  const from = (pagination.page - 1) * pagination.page_size
  const to = from + pagination.page_size - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  // Calculate stats
  const stats = await getVerificationStats(filters)

  return {
    data: data || [],
    stats,
    pagination: {
      ...pagination,
      total: count || 0,
    },
  }
}

export async function getVerificationStats(
  filters: VerificationFilters = {}
): Promise<VerificationStats> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verifications')
    .select('status, created_at, verified_at')
    .match(filters)

  if (error) throw error

  const stats = {
    total_verifications: data.length,
    pending_verifications: data.filter(v => v.status === 'pending').length,
    approved_verifications: data.filter(v => v.status === 'verified').length,
    rejected_verifications: data.filter(v => v.status === 'rejected').length,
    average_verification_time: 0,
    verification_success_rate: 0,
  }

  // Calculate average verification time
  const verifiedEntries = data.filter(v => v.status === 'verified' && v.verified_at)
  if (verifiedEntries.length > 0) {
    const totalTime = verifiedEntries.reduce((acc, entry) => {
      const created = new Date(entry.created_at).getTime()
      const verified = new Date(entry.verified_at!).getTime()
      return acc + (verified - created)
    }, 0)
    stats.average_verification_time = totalTime / verifiedEntries.length
  }

  // Calculate success rate
  const completedVerifications = data.filter(v => 
    v.status === 'verified' || v.status === 'rejected'
  ).length
  if (completedVerifications > 0) {
    stats.verification_success_rate = 
      (stats.approved_verifications / completedVerifications) * 100
  }

  return stats
}

export async function addVerificationEvidence(
  verificationId: string,
  evidence: Omit<VerificationEvidence, 'id' | 'verification_id' | 'created_at' | 'updated_at'>
): Promise<VerificationEvidence> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verification_evidence')
    .insert({
      ...evidence,
      verification_id: verificationId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addVerificationAuditLog(
  verificationId: string,
  action: VerificationAudit['action'],
  performedBy: string,
  details: string,
  metadata?: Record<string, any>
): Promise<VerificationAudit> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('verification_audit')
    .insert({
      verification_id: verificationId,
      action,
      performed_by: performedBy,
      details,
      metadata,
    })
    .select()
    .single()

  if (error) throw error
  return data
} 