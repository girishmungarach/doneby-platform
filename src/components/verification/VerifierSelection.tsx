import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Profile } from '@/lib/types/profile'
import { toast } from 'sonner'
import { z } from 'zod'

const verifierSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  organization: z.string().optional(),
  role: z.string().optional(),
})

type VerifierInput = z.infer<typeof verifierSchema>

interface VerifierSelectionProps {
  onSelect: (verifier: Profile) => void
  onCancel: () => void
}

export function VerifierSelection({ onSelect, onCancel }: VerifierSelectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedVerifiers, setSuggestedVerifiers] = useState<Profile[]>([])

  const form = useForm<VerifierInput>({
    resolver: zodResolver(verifierSchema),
    defaultValues: {
      email: '',
      name: '',
      organization: '',
      role: '',
    },
  })

  const handleImportContacts = async () => {
    try {
      // TODO: Implement contact import from email providers
      toast.info('Contact import coming soon')
    } catch (error) {
      toast.error('Failed to import contacts')
    }
  }

  const handleSuggestVerifiers = async () => {
    try {
      // TODO: Implement verifier suggestions based on timeline entry context
      toast.info('Verifier suggestions coming soon')
    } catch (error) {
      toast.error('Failed to load suggestions')
    }
  }

  const onSubmit = async (data: VerifierInput) => {
    try {
      setIsSubmitting(true)
      // TODO: Create or find verifier profile
      const verifier: Profile = {
        id: 'temp-id',
        email: data.email,
        full_name: data.name,
        organization: data.organization,
        role: data.role as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      onSelect(verifier)
    } catch (error) {
      toast.error('Failed to add verifier')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select a Verifier</h3>
          <p className="text-sm text-muted-foreground">
            Choose someone who can verify your timeline entry.
          </p>
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleImportContacts}
          >
            Import Contacts
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSuggestVerifiers}
          >
            Get Suggestions
          </Button>
        </div>

        {suggestedVerifiers.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Suggested Verifiers</h4>
            <div className="grid gap-4">
              {suggestedVerifiers.map((verifier) => (
                <Card
                  key={verifier.id}
                  className="p-4 cursor-pointer hover:bg-accent"
                  onClick={() => onSelect(verifier)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={verifier.avatar_url} />
                      <AvatarFallback>
                        {verifier.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{verifier.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {verifier.organization} • {verifier.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="verifier@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company or Institution"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Job Title or Position"
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
                {isSubmitting ? 'Adding...' : 'Add Verifier'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  )
} 