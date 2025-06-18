import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { JobListing, Survey } from '@/lib/types/job-listing'
import { ProfileVerification } from './ProfileVerification'
import { SurveyResponse } from './SurveyResponse'
import { ApplicationPreview } from './ApplicationPreview'
import { ApplicationConfirmation } from './ApplicationConfirmation'

export type ApplicationStep = 'verification' | 'survey' | 'preview' | 'confirmation'

interface ApplicationWizardProps {
  job: JobListing
  survey: Survey
  onClose: () => void
}

export function ApplicationWizard({ job, survey, onClose }: ApplicationWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('verification')
  const [surveyResponses, setSurveyResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps: ApplicationStep[] = ['verification', 'survey', 'preview', 'confirmation']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    setError(null)
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    setError(null)
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const handleSurveyResponse = (responses: Record<string, any>) => {
    setSurveyResponses(responses)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      // Replace with actual API call
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          surveyResponses,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit application')
      }
      handleNext()
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted successfully.',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.')
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'verification':
        return (
          <ProfileVerification
            onComplete={handleNext}
            onSkip={handleNext}
          />
        )
      case 'survey':
        return (
          <SurveyResponse
            survey={survey}
            onComplete={handleSurveyResponse}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 'preview':
        return (
          <ApplicationPreview
            job={job}
            survey={survey}
            responses={surveyResponses}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )
      case 'confirmation':
        return (
          <ApplicationConfirmation
            job={job}
            onClose={onClose}
            onViewStatus={() => window.location.assign('/applications')}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl font-bold">Apply for {job.title}</CardTitle>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs md:text-sm text-muted-foreground">
            {steps.map((step) => (
              <span
                key={step}
                className={
                  steps.indexOf(step) <= currentStepIndex
                    ? 'text-primary font-semibold'
                    : ''
                }
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
        {error && <div className="mt-4 text-destructive text-center">{error}</div>}
      </CardContent>
    </Card>
  )
} 