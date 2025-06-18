import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { verificationRequestSchema, type VerificationRequestInput } from '@/lib/validations/verification'
import { EVIDENCE_TYPES } from '@/lib/constants/verification'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'
import { createVerificationRequest } from '@/lib/utils/verification'
import { toast } from 'sonner'

interface VerificationRequestFormProps {
  timelineEntry: TimelineEntry
  profile: Profile
  onSuccess?: () => void
  onCancel?: () => void
}

export function VerificationRequestForm({
  timelineEntry,
  profile,
  onSuccess,
  onCancel,
}: VerificationRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedVerifier, setSelectedVerifier] = useState<Profile | null>(null)

  const form = useForm<VerificationRequestInput>({
    resolver: zodResolver(verificationRequestSchema),
    defaultValues: {
      profile_id: profile.id,
      timeline_entry_id: timelineEntry.id,
      evidence_type: 'document',
      evidence_url: '',
      evidence_description: '',
    },
  })

  const onSubmit = async (data: VerificationRequestInput) => {
    try {
      setIsSubmitting(true)
      await createVerificationRequest(data)
      toast.success('Verification request sent successfully')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to send verification request')
      console.error('Verification request error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Request Verification</h3>
            <p className="text-sm text-muted-foreground">
              Select a verifier and provide evidence to verify your timeline entry.
            </p>
          </div>

          <FormField
            control={form.control}
            name="evidence_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select evidence type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(EVIDENCE_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evidence_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evidence URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/evidence"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evidence_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the evidence and how it verifies your timeline entry..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
} 