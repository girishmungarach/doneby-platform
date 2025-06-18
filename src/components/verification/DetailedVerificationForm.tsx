import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  VerificationForm,
  VerificationFormSchema,
  VerificationQuestion,
  WORK_VERIFICATION_QUESTIONS,
  EDUCATION_VERIFICATION_QUESTIONS,
  SKILL_VERIFICATION_QUESTIONS,
} from '@/lib/types/verification-form'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'
import { cn } from '@/lib/utils'

interface DetailedVerificationFormProps {
  verification: VerificationForm
  timelineEntry: TimelineEntry
  requester: Profile
  verifier: Profile
  onSubmit: (data: VerificationForm) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DetailedVerificationForm({
  verification,
  timelineEntry,
  requester,
  verifier,
  onSubmit,
  onCancel,
  isLoading,
}: DetailedVerificationFormProps) {
  const [activeTab, setActiveTab] = useState('evidence')
  const [progress, setProgress] = useState(0)

  const form = useForm<VerificationForm>({
    resolver: zodResolver(VerificationFormSchema),
    defaultValues: verification,
  })

  const getQuestionsByType = (type: string): VerificationQuestion[] => {
    switch (type) {
      case 'work':
        return WORK_VERIFICATION_QUESTIONS
      case 'education':
        return EDUCATION_VERIFICATION_QUESTIONS
      case 'skill':
        return SKILL_VERIFICATION_QUESTIONS
      default:
        return []
    }
  }

  const questions = getQuestionsByType(timelineEntry.type)

  const handleSubmit = async (data: VerificationForm) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting verification:', error)
    }
  }

  const updateProgress = () => {
    const totalFields = Object.keys(form.getValues()).length
    const filledFields = Object.values(form.getValues()).filter(
      (value) => value !== undefined && value !== null && value !== ''
    ).length
    setProgress((filledFields / totalFields) * 100)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Verification Form</h2>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="w-32" />
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="evidence">Evidence Review</TabsTrigger>
            <TabsTrigger value="questions">Verification Questions</TabsTrigger>
            <TabsTrigger value="assessment">Quality Assessment</TabsTrigger>
            <TabsTrigger value="summary">Final Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="evidence" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Timeline Entry Details</h3>
              <div className="space-y-4">
                <div>
                  <FormLabel>Title</FormLabel>
                  <p className="text-sm text-muted-foreground">{timelineEntry.title}</p>
                </div>
                <div>
                  <FormLabel>Description</FormLabel>
                  <p className="text-sm text-muted-foreground">{timelineEntry.description}</p>
                </div>
                <div>
                  <FormLabel>Evidence</FormLabel>
                  <p className="text-sm text-muted-foreground">{timelineEntry.evidence}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Evidence Quality Assessment</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="evidenceQuality.clarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clarity</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(parseInt(value))
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select clarity rating" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {rating} - {getRatingLabel(rating)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evidenceQuality.relevance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevance</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(parseInt(value))
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relevance rating" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {rating} - {getRatingLabel(rating)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evidenceQuality.authenticity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authenticity</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => {
                            field.onChange(parseInt(value))
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select authenticity rating" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {rating} - {getRatingLabel(rating)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Verification Questions</h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {questions.map((question) => (
                    <FormField
                      key={question.id}
                      control={form.control}
                      name={`questions.${question.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{question.question}</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value)
                                updateProgress()
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your answer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="partially">Partially</SelectItem>
                                <SelectItem value="unsure">Unsure</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Verification Assessment</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="confidence.level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidence Level</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select confidence level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confidence.certainty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certainty Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value))
                            updateProgress()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confidence.reasoning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reasoning</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            updateProgress()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Final Summary</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="narrative.summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            updateProgress()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="narrative.keyFindings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Findings</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.split('\n'))
                            updateProgress()
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each finding on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            updateProgress()
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Verification'}
          </Button>
        </div>
      </form>
    </Form>
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