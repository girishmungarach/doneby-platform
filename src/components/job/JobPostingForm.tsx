import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  JobPostingSchema,
  JobPosting,
  JOB_TYPES,
  JOB_CATEGORIES,
  JOB_EXPERIENCE_LEVELS,
  JOB_LOCATION_TYPES,
  JOB_BENEFIT_CATEGORIES,
  JOB_REQUIREMENT_CATEGORIES,
} from '@/lib/types/job'
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
import { Plus, Trash2 } from 'lucide-react'

interface JobPostingFormProps {
  companyId: string
  onSuccess?: (job: JobPosting) => void
  onCancel?: () => void
}

export function JobPostingForm({ companyId, onSuccess, onCancel }: JobPostingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<JobPosting>({
    resolver: zodResolver(JobPostingSchema),
    defaultValues: {
      company_id: companyId,
      status: 'draft',
      requirements: [],
      benefits: [],
      skills: [],
      applications: [],
      analytics: {
        views: 0,
        applications: 0,
        saves: 0,
        shares: 0,
        conversion_rate: 0,
        average_screening_score: 0,
        source_analytics: {},
        status_distribution: {},
      },
      location: {
        type: 'onsite',
      },
      compensation: {
        type: 'salary',
        currency: 'USD',
        min: 0,
        max: 0,
      },
    },
  })

  const updateProgress = () => {
    const values = form.getValues()
    const totalFields = Object.keys(JobPostingSchema.shape).length
    const filledFields = Object.entries(values).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object') return Object.keys(value).length > 0
      return !!value
    }).length
    setProgress((filledFields / totalFields) * 100)
  }

  const handleSubmit = async (data: JobPosting) => {
    try {
      setIsLoading(true)
      const { data: job, error } = await supabase
        .from('jobs')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      toast.success('Job posted successfully')
      onSuccess?.(job)
      router.push(`/jobs/${job.slug}`)
    } catch (error) {
      console.error('Error posting job:', error)
      toast.error('Failed to post job')
    } finally {
      setIsLoading(false)
    }
  }

  const addRequirement = () => {
    const requirements = form.getValues('requirements') || []
    form.setValue('requirements', [
      ...requirements,
      {
        id: crypto.randomUUID(),
        type: 'required',
        description: '',
        category: 'skill',
      },
    ])
    updateProgress()
  }

  const removeRequirement = (id: string) => {
    const requirements = form.getValues('requirements')
    form.setValue(
      'requirements',
      requirements.filter((req) => req.id !== id)
    )
    updateProgress()
  }

  const addBenefit = () => {
    const benefits = form.getValues('benefits') || []
    form.setValue('benefits', [
      ...benefits,
      {
        id: crypto.randomUUID(),
        name: '',
        category: 'other',
      },
    ])
    updateProgress()
  }

  const removeBenefit = (id: string) => {
    const benefits = form.getValues('benefits')
    form.setValue(
      'benefits',
      benefits.filter((benefit) => benefit.id !== id)
    )
    updateProgress()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Post a Job</h2>
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
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the job's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    onChange={(e) => {
                      form.setValue('title', e.target.value)
                      form.setValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))
                      updateProgress()
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
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
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('type', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('category', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Additional job information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('experience_level', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location_type">Location Type</Label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('location.type', value as any)
                        updateProgress()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LOCATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Compensation</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="compensation_type">Type</Label>
                      <Select
                        onValueChange={(value) => {
                          form.setValue('compensation.type', value as any)
                          updateProgress()
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select compensation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="project">Project-based</SelectItem>
                          <SelectItem value="equity">Equity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compensation_currency">Currency</Label>
                      <Select
                        onValueChange={(value) => {
                          form.setValue('compensation.currency', value)
                          updateProgress()
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="compensation_min">Minimum</Label>
                      <Input
                        id="compensation_min"
                        type="number"
                        {...form.register('compensation.min', { valueAsNumber: true })}
                        onChange={(e) => {
                          form.setValue('compensation.min', parseInt(e.target.value))
                          updateProgress()
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compensation_max">Maximum</Label>
                      <Input
                        id="compensation_max"
                        type="number"
                        {...form.register('compensation.max', { valueAsNumber: true })}
                        onChange={(e) => {
                          form.setValue('compensation.max', parseInt(e.target.value))
                          updateProgress()
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements">
            <Card>
              <CardHeader>
                <CardTitle>Job Requirements</CardTitle>
                <CardDescription>Specify the requirements for this position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.getValues('requirements')?.map((requirement, index) => (
                  <div key={requirement.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Requirement {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(requirement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={requirement.type}
                          onValueChange={(value) => {
                            const requirements = form.getValues('requirements')
                            requirements[index].type = value as any
                            form.setValue('requirements', requirements)
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="required">Required</SelectItem>
                            <SelectItem value="preferred">Preferred</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={requirement.category}
                          onValueChange={(value) => {
                            const requirements = form.getValues('requirements')
                            requirements[index].category = value as any
                            form.setValue('requirements', requirements)
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_REQUIREMENT_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={requirement.description}
                        onChange={(e) => {
                          const requirements = form.getValues('requirements')
                          requirements[index].description = e.target.value
                          form.setValue('requirements', requirements)
                          updateProgress()
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRequirement}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
                <CardDescription>List the benefits and perks for this position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.getValues('benefits')?.map((benefit, index) => (
                  <div key={benefit.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Benefit {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(benefit.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={benefit.name}
                          onChange={(e) => {
                            const benefits = form.getValues('benefits')
                            benefits[index].name = e.target.value
                            form.setValue('benefits', benefits)
                            updateProgress()
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={benefit.category}
                          onValueChange={(value) => {
                            const benefits = form.getValues('benefits')
                            benefits[index].category = value as any
                            form.setValue('benefits', benefits)
                            updateProgress()
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_BENEFIT_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={benefit.description}
                        onChange={(e) => {
                          const benefits = form.getValues('benefits')
                          benefits[index].description = e.target.value
                          form.setValue('benefits', benefits)
                          updateProgress()
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBenefit}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Benefit
                </Button>
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
            {isLoading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  )
} 