import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VerificationForm } from '@/lib/types/verification-form'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'
import { formatDate } from '@/lib/utils'

interface VerificationReportProps {
  verification: VerificationForm
  timelineEntry: TimelineEntry
  requester: Profile
  verifier: Profile
}

export function VerificationReport({
  verification,
  timelineEntry,
  requester,
  verifier,
}: VerificationReportProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'success'
      case 'medium':
        return 'warning'
      case 'low':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const calculateAverageScore = (scores: number[]): number => {
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const evidenceQualityScores = [
    verification.evidenceQuality.clarity,
    verification.evidenceQuality.relevance,
    verification.evidenceQuality.authenticity,
    verification.evidenceQuality.completeness,
    verification.evidenceQuality.timeliness,
  ]

  const averageEvidenceQuality = calculateAverageScore(evidenceQualityScores)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Verification Report</h2>
        <Badge variant={getStatusColor(verification.status)}>
          {verification.status.toUpperCase()}
        </Badge>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Details</h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Verification ID</p>
            <p>{verification.verificationId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Method</p>
            <p>{verification.method}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed At</p>
            <p>{verification.completedAt ? formatDate(verification.completedAt) : 'N/A'}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Timeline Entry</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p>{timelineEntry.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p>{timelineEntry.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Evidence</p>
            <p>{timelineEntry.evidence}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evidence Quality Assessment</h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clarity</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {verification.evidenceQuality.clarity}/5
              </Badge>
              <p>{getRatingLabel(verification.evidenceQuality.clarity)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Relevance</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {verification.evidenceQuality.relevance}/5
              </Badge>
              <p>{getRatingLabel(verification.evidenceQuality.relevance)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Authenticity</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {verification.evidenceQuality.authenticity}/5
              </Badge>
              <p>{getRatingLabel(verification.evidenceQuality.authenticity)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completeness</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {verification.evidenceQuality.completeness}/5
              </Badge>
              <p>{getRatingLabel(verification.evidenceQuality.completeness)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Timeliness</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {verification.evidenceQuality.timeliness}/5
              </Badge>
              <p>{getRatingLabel(verification.evidenceQuality.timeliness)}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Average Quality Score</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{averageEvidenceQuality}/5</Badge>
              <p>{getRatingLabel(averageEvidenceQuality)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Assessment</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Confidence Level</p>
            <Badge variant={getConfidenceColor(verification.confidence.level)}>
              {verification.confidence.level.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Certainty</p>
            <p>{verification.confidence.certainty}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reasoning</p>
            <p>{verification.confidence.reasoning}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Narrative</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Summary</p>
            <p>{verification.narrative.summary}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Key Findings</p>
            <ul className="list-disc pl-4">
              {verification.narrative.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          {verification.narrative.concerns && verification.narrative.concerns.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Concerns</p>
              <ul className="list-disc pl-4">
                {verification.narrative.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          )}
          {verification.narrative.recommendations &&
            verification.narrative.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recommendations
                </p>
                <ul className="list-disc pl-4">
                  {verification.narrative.recommendations.map(
                    (recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Score</h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
            <p>{verification.score.overall}/100</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Evidence Quality Score
            </p>
            <p>{verification.score.evidenceQuality}/100</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Verification Process Score
            </p>
            <p>{verification.score.verificationProcess}/100</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Confidence Level Score
            </p>
            <p>{verification.score.confidenceLevel}/100</p>
          </div>
          {verification.score.comments && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comments</p>
              <p>{verification.score.comments}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Milestones</h3>
        <div className="space-y-4">
          {verification.milestones.map((milestone) => (
            <div key={milestone.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{milestone.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
                <Badge variant={getStatusColor(milestone.status)}>
                  {milestone.status.toUpperCase()}
                </Badge>
              </div>
              {milestone.completedAt && (
                <p className="text-sm text-muted-foreground mt-1">
                  Completed: {formatDate(milestone.completedAt)}
                </p>
              )}
              {milestone.notes && (
                <p className="text-sm text-muted-foreground mt-1">
                  Notes: {milestone.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Comments</h3>
        <p>{verification.comments}</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Team</h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Requester</p>
            <p>{requester.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Verifier</p>
            <p>{verifier.full_name}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1:
      return 'Poor'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Very Good'
    case 5:
      return 'Excellent'
    default:
      return ''
  }
} 