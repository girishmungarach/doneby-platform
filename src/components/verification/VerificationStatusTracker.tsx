import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  VerificationStatus,
  VerificationActivity,
  VERIFICATION_STATUS_COLORS,
  VERIFICATION_STATUS_LABELS,
  VERIFICATION_ACTIVITY_ICONS,
} from '@/lib/types/verification-status'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

interface VerificationStatusTrackerProps {
  verificationId: string
  initialStatus?: VerificationStatus
  initialActivities?: VerificationActivity[]
}

export function VerificationStatusTracker({
  verificationId,
  initialStatus,
  initialActivities = [],
}: VerificationStatusTrackerProps) {
  const [status, setStatus] = useState<VerificationStatus | undefined>(initialStatus)
  const [activities, setActivities] = useState<VerificationActivity[]>(initialActivities)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to status changes
    const statusSubscription = supabase
      .channel(`verification-status-${verificationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'verification_statuses',
          filter: `verification_id=eq.${verificationId}`,
        },
        (payload) => {
          setStatus(payload.new as VerificationStatus)
        }
      )
      .subscribe()

    // Subscribe to activity changes
    const activitySubscription = supabase
      .channel(`verification-activities-${verificationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'verification_activities',
          filter: `verification_id=eq.${verificationId}`,
        },
        (payload) => {
          setActivities((prev) => [payload.new as VerificationActivity, ...prev])
        }
      )
      .subscribe()

    return () => {
      statusSubscription.unsubscribe()
      activitySubscription.unsubscribe()
    }
  }, [verificationId, supabase])

  const getProgressValue = () => {
    if (!status) return 0
    switch (status.status) {
      case 'pending':
        return 0
      case 'in_progress':
        return 50
      case 'verified':
      case 'rejected':
        return 75
      case 'completed':
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Verification Status</h3>
          {status && (
            <Badge className={VERIFICATION_STATUS_COLORS[status.status]}>
              {VERIFICATION_STATUS_LABELS[status.status]}
            </Badge>
          )}
        </div>
        <Progress value={getProgressValue()} className="h-2" />
        {status?.details?.comments && (
          <p className="mt-4 text-sm text-gray-600">{status.details.comments}</p>
        )}
      </Card>

      {/* Activity Feed */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <span className="text-2xl" role="img" aria-label={activity.type}>
                  {VERIFICATION_ACTIVITY_ICONS[activity.type]}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.details.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
} 