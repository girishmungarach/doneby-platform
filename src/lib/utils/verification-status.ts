import { createClient } from '@/lib/supabase/server'
import {
  VerificationStatus,
  VerificationActivity,
  VerificationNotification,
} from '@/lib/types/verification-status'

export async function updateVerificationStatus(
  verificationId: string,
  status: VerificationStatus['status'],
  details?: VerificationStatus['details']
): Promise<VerificationStatus | null> {
  const supabase = createClient()

  // Get current status
  const { data: currentStatus } = await supabase
    .from('verification_statuses')
    .select('*')
    .eq('verification_id', verificationId)
    .single()

  // Update status
  const { data, error } = await supabase
    .from('verification_statuses')
    .update({
      status,
      previous_status: currentStatus?.status,
      details,
      updated_at: new Date().toISOString(),
    })
    .eq('verification_id', verificationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating verification status:', error)
    return null
  }

  // Create activity record
  await createVerificationActivity(verificationId, {
    type: 'status_change',
    details: {
      message: `Status changed from ${currentStatus?.status} to ${status}`,
      metadata: { previous_status: currentStatus?.status, new_status: status },
    },
  })

  // Create notifications
  await createStatusNotifications(verificationId, status, currentStatus?.status)

  return data as VerificationStatus
}

export async function createVerificationActivity(
  verificationId: string,
  activity: Omit<VerificationActivity, 'id' | 'verification_id' | 'timestamp'>
): Promise<VerificationActivity | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verification_activities')
    .insert({
      verification_id: verificationId,
      ...activity,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating verification activity:', error)
    return null
  }

  return data as VerificationActivity
}

export async function createStatusNotifications(
  verificationId: string,
  newStatus: VerificationStatus['status'],
  previousStatus?: string
): Promise<void> {
  const supabase = createClient()

  // Get verification details
  const { data: verification } = await supabase
    .from('verifications')
    .select('requester_id, verifier_id')
    .eq('id', verificationId)
    .single()

  if (!verification) return

  const notifications: Omit<VerificationNotification, 'id' | 'created_at'>[] = []

  // Create notification for requester
  notifications.push({
    user_id: verification.requester_id,
    verification_id: verificationId,
    type: 'status_update',
    title: 'Verification Status Updated',
    message: `Your verification status has been updated to ${newStatus}`,
    read: false,
  })

  // Create notification for verifier
  if (verification.verifier_id) {
    notifications.push({
      user_id: verification.verifier_id,
      verification_id: verificationId,
      type: 'status_update',
      title: 'Verification Status Updated',
      message: `Verification status has been updated to ${newStatus}`,
      read: false,
    })
  }

  // Insert notifications
  const { error } = await supabase
    .from('verification_notifications')
    .insert(notifications)

  if (error) {
    console.error('Error creating status notifications:', error)
  }
}

export async function getVerificationStatus(
  verificationId: string
): Promise<VerificationStatus | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verification_statuses')
    .select('*')
    .eq('verification_id', verificationId)
    .single()

  if (error) {
    console.error('Error fetching verification status:', error)
    return null
  }

  return data as VerificationStatus
}

export async function getVerificationActivities(
  verificationId: string
): Promise<VerificationActivity[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verification_activities')
    .select('*')
    .eq('verification_id', verificationId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching verification activities:', error)
    return []
  }

  return data as VerificationActivity[]
}

export async function getVerificationNotifications(
  userId: string
): Promise<VerificationNotification[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verification_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching verification notifications:', error)
    return []
  }

  return data as VerificationNotification[]
} 