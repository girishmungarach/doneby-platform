import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Verification, VerificationStatus } from '@/lib/types/verification'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'
import { VERIFICATION_STATUS } from '@/lib/constants/verification'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface VerifierDashboardProps {
  verifications: Verification[]
  timelineEntries: TimelineEntry[]
  profile: Profile
  verificationStats: {
    total_verifications: number
    pending_verifications: number
    completed_verifications: number
    verification_score: number
  }
}

export function VerifierDashboard({
  verifications,
  timelineEntries,
  profile,
  verificationStats,
}: VerifierDashboardProps) {
  const [activeTab, setActiveTab] = useState<VerificationStatus>('pending')

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'verified':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTimelineEntry = (entryId: string) => {
    return timelineEntries.find(entry => entry.id === entryId)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Verifications
            </p>
            <p className="text-2xl font-bold">
              {verificationStats.total_verifications}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </p>
            <p className="text-2xl font-bold">
              {verificationStats.pending_verifications}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Completed Verifications
            </p>
            <p className="text-2xl font-bold">
              {verificationStats.completed_verifications}
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Verification Score
            </p>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {verificationStats.verification_score}%
              </p>
              <Progress value={verificationStats.verification_score} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Verification Requests</h3>
            <p className="text-sm text-muted-foreground">
              Review and manage verification requests.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as VerificationStatus)}
          >
            <TabsList>
              {Object.entries(VERIFICATION_STATUS).map(([key, value]) => (
                <TabsTrigger key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(VERIFICATION_STATUS).map(([key, status]) => (
              <TabsContent key={key} value={status}>
                <div className="space-y-4">
                  {verifications
                    .filter(v => v.status === status)
                    .map(verification => {
                      const entry = getTimelineEntry(verification.timeline_entry_id)
                      return (
                        <Card key={verification.id} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={getStatusColor(verification.status)}
                                  >
                                    {verification.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}
                                  </span>
                                </div>
                                <h4 className="font-medium">
                                  {entry?.title || 'Timeline Entry'}
                                </h4>
                              </div>
                              {verification.status === 'pending' && (
                                <Link
                                  href={`/verification/${verification.id}/review`}
                                >
                                  <Button size="sm">
                                    Review Request
                                  </Button>
                                </Link>
                              )}
                            </div>

                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={verification.profile?.avatar_url} />
                                <AvatarFallback>
                                  {verification.profile?.full_name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {verification.profile?.full_name || 'Unknown User'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {verification.profile?.organization}
                                </p>
                              </div>
                            </div>

                            {verification.evidence.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Evidence</h5>
                                {verification.evidence.map(evidence => (
                                  <div
                                    key={evidence.id}
                                    className="text-sm text-muted-foreground"
                                  >
                                    <p>{evidence.evidence_description}</p>
                                    <a
                                      href={evidence.evidence_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      View Evidence
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}

                            {verification.rejection_reason && (
                              <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-700">
                                  {verification.rejection_reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
 