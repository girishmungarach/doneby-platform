import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { VerifierIdentityValidation } from '@/components/verification/VerifierIdentityValidation'
import { getVerifierIdentity } from '@/lib/utils/verifier'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

interface VerifierIdentityPageProps {
  params: {
    id: string
  }
}

export default async function VerifierIdentityPage({
  params,
}: VerifierIdentityPageProps) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to view verifier identity.</p>
      </div>
    )
  }

  const verifierIdentity = await getVerifierIdentity(params.id)
  if (!verifierIdentity) {
    notFound()
  }

  const handleUpdate = async (data: any) => {
    try {
      const { error } = await supabase
        .from('verifier_identities')
        .update(data)
        .eq('id', verifierIdentity.id)

      if (error) throw error

      toast.success('Verifier identity updated successfully')
    } catch (error) {
      console.error('Error updating verifier identity:', error)
      toast.error('Failed to update verifier identity')
    }
  }

  const handleVerify = async (method: string) => {
    try {
      const { error } = await supabase
        .from('verifier_identities')
        .update({
          status: 'verified',
          verification_methods: verifierIdentity.verification_methods.map((m) =>
            m.type === method
              ? { ...m, status: 'verified', verified_at: new Date().toISOString() }
              : m
          ),
        })
        .eq('id', verifierIdentity.id)

      if (error) throw error

      toast.success('Verifier identity verified successfully')
    } catch (error) {
      console.error('Error verifying verifier identity:', error)
      toast.error('Failed to verify verifier identity')
    }
  }

  const handleReject = async (method: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('verifier_identities')
        .update({
          status: 'rejected',
          verification_methods: verifierIdentity.verification_methods.map((m) =>
            m.type === method
              ? { ...m, status: 'rejected', details: { reason } }
              : m
          ),
        })
        .eq('id', verifierIdentity.id)

      if (error) throw error

      toast.success('Verifier identity rejected')
    } catch (error) {
      console.error('Error rejecting verifier identity:', error)
      toast.error('Failed to reject verifier identity')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifierIdentityValidation
          verifierIdentity={verifierIdentity}
          onUpdate={handleUpdate}
          onVerify={handleVerify}
          onReject={handleReject}
        />
      </Suspense>
    </div>
  )
} 