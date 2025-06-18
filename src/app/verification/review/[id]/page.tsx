import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DetailedVerificationForm } from '@/components/verification/DetailedVerificationForm'
import { VerificationReport } from '@/components/verification/VerificationReport'
import { VerificationStatusTracker } from '@/components/verification/VerificationStatusTracker'
import { VerificationNotifications } from '@/components/verification/VerificationNotifications'
import { getVerificationById } from '@/lib/utils/verification'
import { getTimelineEntry } from '@/lib/utils/timeline'
import { getProfile } from '@/lib/utils/profile'
import { getVerificationStatus, getVerificationActivities, getVerificationNotifications } from '@/lib/utils/verification-status'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

interface VerificationReviewPageProps {
  params: {
    id: string
  }
}

export default async function VerificationReviewPage({
  params,
}: VerificationReviewPageProps) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to view verification details.</p>
      </div>
    )
  }

  const verification = await getVerificationById(params.id)
  if (!verification) {
    notFound()
  }

  const timelineEntry = await getTimelineEntry(verification.timeline_entry_id)
  if (!timelineEntry) {
    notFound()
  }

  const requester = await getProfile(verification.requester_id)
  if (!requester) {
    notFound()
  }

  const verifier = verification.verifier_id
    ? await getProfile(verification.verifier_id)
    : null

  const status = await getVerificationStatus(params.id)
  const activities = await getVerificationActivities(params.id)
  const notifications = await getVerificationNotifications(session.user.id)

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('verifications')
        .update(data)
        .eq('id', verification.id)

      if (error) throw error

      toast.success('Verification updated successfully')
    } catch (error) {
      console.error('Error updating verification:', error)
      toast.error('Failed to update verification')
    }
  }

  const handleCancel = () => {
    // Handle cancellation
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div>Loading...</div>}>
            {verification.status === 'completed' ? (
              <VerificationReport
                verification={verification}
                timelineEntry={timelineEntry}
                requester={requester}
                verifier={verifier}
              />
            ) : (
              <DetailedVerificationForm
                verification={verification}
                timelineEntry={timelineEntry}
                requester={requester}
                verifier={verifier}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<div>Loading...</div>}>
            <VerificationStatusTracker
              verificationId={verification.id}
              initialStatus={status}
              initialActivities={activities}
            />
          </Suspense>

          <Suspense fallback={<div>Loading...</div>}>
            <VerificationNotifications
              userId={session.user.id}
              initialNotifications={notifications}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 