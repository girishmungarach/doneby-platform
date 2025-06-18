import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MapPin, Building2, Briefcase, GraduationCap } from 'lucide-react'
import {
  JOB_TYPES,
  JOB_CATEGORIES,
  JOB_EXPERIENCE_LEVELS,
  JOB_LOCATION_TYPES,
} from '@/lib/types/job'

const basicInfoSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  company_id: z.string().min(1, 'Company is required'),
  location: z.object({
    type: z.enum(JOB_LOCATION_TYPES),
    city: z.string().optional(),
    country: z.string().optional(),
  }),
  category: z.enum(JOB_CATEGORIES),
  type: z.enum(JOB_TYPES),
  experience_level: z.enum(JOB_EXPERIENCE_LEVELS),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
})

type BasicInfoFormData = z.infer<typeof basicInfoSchema>

interface CompanyOption {
  id: string
  name: string
}

interface BasicInfoStepProps {
  companyOptions: CompanyOption[]
  initialData?: Partial<BasicInfoFormData>
  onNext: (data: BasicInfoFormData) => void
  onBack: () => void
}

export function BasicInfoStep({ companyOptions, initialData, onNext, onBack }: BasicInfoStepProps) {
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      location: { type: 'onsite' },
      ...initialData,
    },
  })

  const onSubmit = (data: BasicInfoFormData) => {
    onNext(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the essential details about the position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company_id">Company</Label>
            <Select
              onValueChange={(value) => form.setValue('company_id', value)}
              defaultValue={form.getValues('company_id')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.company_id && (
              <p className="text-sm text-destructive">{form.formState.errors.company_id.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Location</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_type">Type</Label>
                <Select
                  onValueChange={(value) => form.setValue('location.type', value as any)}
                  defaultValue={form.getValues('location.type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.watch('location.type') !== 'remote' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., San Francisco"
                      {...form.register('location.city')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g., United States"
                      {...form.register('location.country')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Job Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => form.setValue('category', value as any)}
                defaultValue={form.getValues('category')}
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
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select
                onValueChange={(value) => form.setValue('type', value as any)}
                defaultValue={form.getValues('type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select
              onValueChange={(value) => form.setValue('experience_level', value as any)}
              defaultValue={form.getValues('experience_level')}
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

          {/* Job Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Job Summary</Label>
            <Textarea
              id="summary"
              placeholder="Brief description of the role and its impact..."
              className="min-h-[100px]"
              {...form.register('summary')}
            />
            {form.formState.errors.summary && (
              <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  )
} 