import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { VerificationRequestForm } from '@/components/verification/VerificationRequestForm'
import { VerifierSelection } from '@/components/verification/VerifierSelection'
import { VerificationDashboard } from '@/components/verification/VerificationDashboard'
import { getVerifications } from '@/lib/utils/verification'
import { getTimelineEntries } from '@/lib/utils/timeline'
import { getProfile } from '@/lib/utils/profile'
import { generateVerificationInvitationEmail } from '@/lib/email-templates/verification-invitation'
import { sendEmail } from '@/lib/utils/email'
import { toast } from 'sonner'

interface VerificationRequestPageProps {
  searchParams: {
    entry_id?: string
  }
}

export default async function VerificationRequestPage({
  searchParams,
}: VerificationRequestPageProps) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to request verifications.</p>
      </div>
    )
  }

  const profile = await getProfile(session.user.id)
  const timelineEntries = await getTimelineEntries(session.user.id)
  const verifications = await getVerifications({ profile_id: session.user.id })

  const selectedEntry = searchParams.entry_id
    ? timelineEntries.find(entry => entry.id === searchParams.entry_id)
    : null

  const handleResendRequest = async (verificationId: string) => {
    'use server'
    try {
      const verification = verifications.find(v => v.id === verificationId)
      if (!verification) throw new Error('Verification not found')

      const entry = timelineEntries.find(e => e.id === verification.timeline_entry_id)
      if (!entry) throw new Error('Timeline entry not found')

      const emailData = generateVerificationInvitationEmail({
        verification,
        timelineEntry: entry,
        requester: profile,
        verifier: verification.verifier!,
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verification/${verification.id}`,
      })

      await sendEmail({
        to: verification.verifier!.email,
        ...emailData,
      })

      toast.success('Verification request resent successfully')
    } catch (error) {
      console.error('Failed to resend verification request:', error)
      toast.error('Failed to resend verification request')
    }
  }

  const handleCancelRequest = async (verificationId: string) => {
    'use server'
    try {
      await supabase
        .from('verifications')
        .update({ status: 'cancelled' })
        .eq('id', verificationId)

      toast.success('Verification request cancelled successfully')
    } catch (error) {
      console.error('Failed to cancel verification request:', error)
      toast.error('Failed to cancel verification request')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        {selectedEntry ? (
          <Suspense fallback={<div>Loading...</div>}>
            <VerificationRequestForm
              timelineEntry={selectedEntry}
              profile={profile}
              onSuccess={() => {
                // TODO: Implement success handling
              }}
              onCancel={() => {
                // TODO: Implement cancel handling
              }}
            />
          </Suspense>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Request Verification</h2>
              <p className="text-muted-foreground">
                Select a timeline entry to request verification.
              </p>
            </div>

            <div className="grid gap-4">
              {timelineEntries.map(entry => (
                <a
                  key={entry.id}
                  href={`/verification/request?entry_id=${entry.id}`}
                  className="block"
                >
                  <div className="rounded-lg border p-4 hover:bg-accent">
                    <h3 className="font-medium">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Verification Requests</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <VerificationDashboard
              verifications={verifications}
              timelineEntries={timelineEntries}
              profile={profile}
              onResendRequest={handleResendRequest}
              onCancelRequest={handleCancelRequest}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 