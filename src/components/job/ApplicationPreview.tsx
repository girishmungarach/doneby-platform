import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, DollarSign, Clock } from 'lucide-react'
import { JobListing, Survey } from '@/lib/types/job-listing'

interface ApplicationPreviewProps {
  job: JobListing
  survey: Survey
  responses: Record<string, any>
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  error?: string | null
}

export function ApplicationPreview({
  job,
  survey,
  responses,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: ApplicationPreviewProps) {
  const formatSalary = (job: JobListing) => {
    if (!job.salary.isPublic) return 'Salary not disclosed'
    return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
  }

  const renderSurveyResponse = (questionId: string) => {
    const question = survey.questions.find((q) => q.id === questionId)
    const response = responses[questionId]

    if (!question || !response) return null

    return (
      <div key={questionId} className="space-y-2">
        <h4 className="font-medium">{question.title}</h4>
        <div className="text-sm text-muted-foreground">
          {Array.isArray(response) ? response.join(', ') : response}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Application Preview</h3>
        <p className="text-muted-foreground">Please review your application before submitting.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Job Details */}
            <div>
              <h4 className="font-medium mb-2">Job Details</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{job.company.name}</span>
                  {job.company.isVerified && <Badge variant="secondary">Verified</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location.city}, {job.location.state}{job.location.isRemote && ' (Remote)'}{job.location.isHybrid && ' (Hybrid)'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{formatSalary(job)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
            {/* Survey Responses */}
            <div>
              <h4 className="font-medium mb-2">Your Responses</h4>
              <div className="space-y-4">
                {survey.questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <h5 className="font-medium">{question.title}</h5>
                    <div className="text-sm text-muted-foreground">
                      {Array.isArray(responses[question.id]) ? responses[question.id].join(', ') : responses[question.id]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Skills Match */}
            <div>
              <h4 className="font-medium mb-2">Skills Match</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && <div className="text-destructive text-center text-sm">{error}</div>}
      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </div>
  )
} 