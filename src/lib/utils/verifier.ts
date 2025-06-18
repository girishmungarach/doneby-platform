import { createClient } from '@/lib/supabase/server'
import { VerifierIdentity } from '@/lib/types/verifier-identity'

export async function getVerifierIdentity(id: string): Promise<VerifierIdentity | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verifier_identities')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching verifier identity:', error)
    return null
  }

  return data as VerifierIdentity
}

export async function getVerifierIdentities(): Promise<VerifierIdentity[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verifier_identities')
    .select(`
      *,
      profile:profiles(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching verifier identities:', error)
    return []
  }

  return data as VerifierIdentity[]
}

export async function updateVerifierIdentity(
  id: string,
  updates: Partial<VerifierIdentity>
): Promise<VerifierIdentity | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('verifier_identities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating verifier identity:', error)
    return null
  }

  return data as VerifierIdentity
}

export async function verifyVerifierIdentity(
  id: string,
  method: string
): Promise<VerifierIdentity | null> {
  const supabase = createClient()

  const { data: currentData } = await supabase
    .from('verifier_identities')
    .select('verification_methods')
    .eq('id', id)
    .single()

  if (!currentData) return null

  const updatedMethods = currentData.verification_methods.map((m: any) =>
    m.type === method
      ? { ...m, status: 'verified', verified_at: new Date().toISOString() }
      : m
  )

  const { data, error } = await supabase
    .from('verifier_identities')
    .update({
      status: 'verified',
      verification_methods: updatedMethods,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error verifying verifier identity:', error)
    return null
  }

  return data as VerifierIdentity
}

export async function rejectVerifierIdentity(
  id: string,
  method: string,
  reason: string
): Promise<VerifierIdentity | null> {
  const supabase = createClient()

  const { data: currentData } = await supabase
    .from('verifier_identities')
    .select('verification_methods')
    .eq('id', id)
    .single()

  if (!currentData) return null

  const updatedMethods = currentData.verification_methods.map((m: any) =>
    m.type === method
      ? { ...m, status: 'rejected', details: { reason } }
      : m
  )

  const { data, error } = await supabase
    .from('verifier_identities')
    .update({
      status: 'rejected',
      verification_methods: updatedMethods,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error rejecting verifier identity:', error)
    return null
  }

  return data as VerifierIdentity
} 