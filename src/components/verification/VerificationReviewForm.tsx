import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Verification, VerificationStatus } from '@/lib/types/verification'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'
import { z } from 'zod'
import { toast } from 'sonner'
import { updateVerificationStatus } from '@/lib/utils/verification'

const verificationReviewSchema = z.object({
  status: z.enum(['verified', 'rejected'] as const),
  comments: z.string().min(10).max(500),
  evidence_quality: z.enum(['excellent', 'good', 'fair', 'poor'] as const),
  verification_method: z.enum(['direct_knowledge', 'document_review', 'third_party_confirmation'] as const),
})

type VerificationReviewInput = z.infer<typeof verificationReviewSchema>

interface VerificationReviewFormProps {
  verification: Verification
  timelineEntry: TimelineEntry
  requester: Profile
  verifier: Profile
  onSuccess?: () => void
  onCancel?: () => void
}

export function VerificationReviewForm({
  verification,
  timelineEntry,
  requester,
  verifier,
  onSuccess,
  onCancel,
}: VerificationReviewFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<VerificationReviewInput>({
    resolver: zodResolver(verificationReviewSchema),
    defaultValues: {
      status: 'verified',
      comments: '',
      evidence_quality: 'good',
      verification_method: 'document_review',
    },
  })

  const onSubmit = async (data: VerificationReviewInput) => {
    try {
      setIsSubmitting(true)
      await updateVerificationStatus(
        verification.id,
        data.status,
        verifier.id,
        data.status === 'rejected' ? data.comments : undefined
      )
      toast.success('Verification review submitted successfully')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to submit verification review')
      console.error('Verification review error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      title: 'Review Timeline Entry',
      description: 'Review the timeline entry and evidence provided.',
    },
    {
      title: 'Evaluate Evidence',
      description: 'Assess the quality and validity of the evidence.',
    },
    {
      title: 'Make Decision',
      description: 'Make your final decision and provide comments.',
    },
  ]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Verification Review</h3>
          <p className="text-sm text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index + 1 === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index + 1 < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-4 h-0.5 w-8 bg-muted" />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">{timelineEntry.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {timelineEntry.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Evidence</h5>
                  {verification.evidence.map(evidence => (
                    <div
                      key={evidence.id}
                      className="rounded-lg border p-4"
                    >
                      <p className="font-medium">{evidence.evidence_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {evidence.evidence_description}
                      </p>
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
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="evidence_quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidence Quality</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="excellent" />
                            </FormControl>
                            <FormLabel>Excellent</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="good" />
                            </FormControl>
                            <FormLabel>Good</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="fair" />
                            </FormControl>
                            <FormLabel>Fair</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="poor" />
                            </FormControl>
                            <FormLabel>Poor</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verification_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="direct_knowledge" />
                            </FormControl>
                            <FormLabel>Direct Knowledge</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="document_review" />
                            </FormControl>
                            <FormLabel>Document Review</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="third_party_confirmation" />
                            </FormControl>
                            <FormLabel>Third Party</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decision</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="verified" />
                            </FormControl>
                            <FormLabel>Verify</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="rejected" />
                            </FormControl>
                            <FormLabel>Reject</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide your comments about the verification..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Card>
  )
} 