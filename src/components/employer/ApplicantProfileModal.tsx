import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VerificationBadge } from './VerificationBadge'
import { TrustScore } from './TrustScore'
import { SurveyScoreBadge } from './SurveyScoreBadge'
import { MessageSquare, Calendar, CheckCircle2, XCircle } from 'lucide-react'

interface ApplicantProfileModalProps {
  applicant: any
  onClose: () => void
}

export function ApplicantProfileModal({ applicant, onClose }: ApplicantProfileModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Applicant Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
            {applicant.name[0]}
          </div>
          <div className="font-medium text-lg">{applicant.name}</div>
          <div className="text-xs text-muted-foreground">{applicant.email}</div>
          {applicant.profileVerified && <VerificationBadge />}
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Badge variant="outline">Verification: {applicant.verificationScore}</Badge>
          <Badge variant="outline">Skills Match: {applicant.skillsMatch}%</Badge>
          <SurveyScoreBadge score={applicant.surveyScore} />
          <TrustScore score={applicant.trustScore} />
        </div>
        <div className="mb-4">
          <h4 className="font-medium mb-1">Survey Responses</h4>
          <div className="space-y-2">
            {Object.entries(applicant.surveyResponses || {}).length === 0 && (
              <div className="text-xs text-muted-foreground">No survey responses available.</div>
            )}
            {Object.entries(applicant.surveyResponses || {}).map(([q, a]) => (
              <div key={q} className="text-xs"><span className="font-semibold">{q}:</span> {Array.isArray(a) ? a.join(', ') : a}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4 mr-1" /> Message</Button>
          <Button size="sm" variant="outline"><Calendar className="w-4 h-4 mr-1" /> Schedule Interview</Button>
          <Button size="sm" variant="success"><CheckCircle2 className="w-4 h-4 mr-1" /> Move to Next Stage</Button>
          <Button size="sm" variant="destructive"><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 