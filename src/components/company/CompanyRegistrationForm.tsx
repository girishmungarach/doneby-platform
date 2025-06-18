import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompanyProfileSchema, CompanyProfile, COMPANY_SIZES, COMPANY_INDUSTRIES } from '@/lib/types/company'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CompanyRegistrationFormProps {
  onSuccess?: (company: CompanyProfile) => void
  onCancel?: () => void
}

export function CompanyRegistrationForm({ onSuccess, onCancel }: CompanyRegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<CompanyProfile>({
    resolver: zodResolver(CompanyProfileSchema),
    defaultValues: {
      verification_status: 'pending',
      verification_documents: [],
      team_members: [],
      culture: {
        values: [],
        mission: '',
        vision: '',
        benefits: [],
        perks: [],
        work_environment: '',
        diversity_initiatives: [],
      },
      metrics: {
        total_hires: 0,
        average_time_to_hire: 0,
        candidate_satisfaction: 0,
        retention_rate: 0,
        diversity_metrics: {},
        hiring_success_rate: 0,
      },
      badges: [],
    },
  })

  const updateProgress = () => {
    const values = form.getValues()
    const totalFields = Object.keys(CompanyProfileSchema.shape).length
    const filledFields = Object.entries(values).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.keys(value).length > 0
      return !!value
    }).length
    setProgress((filledFields / totalFields) * 100)
  }

  const handleSubmit = async (data: CompanyProfile) => {
    try {
      setIsLoading(true)
      const { data: company, error } = await supabase
        .from('companies')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      toast.success('Company registered successfully')
      onSuccess?.(company)
      router.push(`/company/${company.slug}`)
    } catch (error) {
      console.error('Error registering company:', error)
      toast.error('Failed to register company')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Register Company</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <Progress value={progress} className="w-32" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="culture">Culture</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter your company's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      onChange={(e) => {
                        form.setValue('name', e.target.value)
                        form.setValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        updateProgress()
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      {...form.register('website')}
                      onChange={(e) => {
                        form.setValue('website', e.target.value)
                        updateProgress()
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    onChange={(e) => {
                      form.setValue('description', e.target.value)
                      updateProgress()
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('size', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('industry', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry.charAt(0).toUpperCase() + industry.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Additional company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="founded_year">Founded Year</Label>
                    <Input
                      id="founded_year"
                      type="number"
                      {...form.register('founded_year', { valueAsNumber: true })}
                      onChange={(e) => {
                        form.setValue('founded_year', parseInt(e.target.value))
                        updateProgress()
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      {...form.register('contact_email')}
                      onChange={(e) => {
                        form.setValue('contact_email', e.target.value)
                        updateProgress()
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Headquarters</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      {...form.register('headquarters.city')}
                      onChange={(e) => {
                        form.setValue('headquarters.city', e.target.value)
                        updateProgress()
                      }}
                    />
                    <Input
                      placeholder="Country"
                      {...form.register('headquarters.country')}
                      onChange={(e) => {
                        form.setValue('headquarters.country', e.target.value)
                        updateProgress()
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="LinkedIn URL"
                      type="url"
                      {...form.register('social_links.linkedin')}
                      onChange={(e) => {
                        form.setValue('social_links.linkedin', e.target.value)
                        updateProgress()
                      }}
                    />
                    <Input
                      placeholder="Twitter URL"
                      type="url"
                      {...form.register('social_links.twitter')}
                      onChange={(e) => {
                        form.setValue('social_links.twitter', e.target.value)
                        updateProgress()
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="culture">
            <Card>
              <CardHeader>
                <CardTitle>Company Culture</CardTitle>
                <CardDescription>Define your company's culture and values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    {...form.register('culture.mission')}
                    onChange={(e) => {
                      form.setValue('culture.mission', e.target.value)
                      updateProgress()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    {...form.register('culture.vision')}
                    onChange={(e) => {
                      form.setValue('culture.vision', e.target.value)
                      updateProgress()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_environment">Work Environment</Label>
                  <Textarea
                    id="work_environment"
                    {...form.register('culture.work_environment')}
                    onChange={(e) => {
                      form.setValue('culture.work_environment', e.target.value)
                      updateProgress()
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Set up your company's team structure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Team members can be added after company registration is complete.
                </p>
              </CardContent>
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
            {isLoading ? 'Registering...' : 'Register Company'}
          </Button>
        </div>
      </form>
    </div>
  )
} 