import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPin, Building2, DollarSign, Clock, Star } from 'lucide-react'
import { JobFilter } from '@/lib/types/job-listing'

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<JobFilter>({
    location: {
      isRemote: searchParams.get('remote') === 'true',
      isHybrid: searchParams.get('hybrid') === 'true',
    },
    type: searchParams.get('type')?.split(',') as JobFilter['type'],
    experience: searchParams.get('experience')?.split(',') as JobFilter['experience'],
    salary: {
      min: Number(searchParams.get('salaryMin')) || undefined,
      max: Number(searchParams.get('salaryMax')) || undefined,
    },
    skills: searchParams.get('skills')?.split(','),
    company: {
      isVerified: searchParams.get('verified') === 'true',
      minRating: Number(searchParams.get('minRating')) || undefined,
    },
    postedWithin: (searchParams.get('postedWithin') as JobFilter['postedWithin']) || undefined,
  })

  const handleFilterChange = (key: keyof JobFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateUrlParams(newFilters)
  }

  const updateUrlParams = (newFilters: JobFilter) => {
    const params = new URLSearchParams(searchParams.toString())

    // Location
    if (newFilters.location?.isRemote) {
      params.set('remote', 'true')
    } else {
      params.delete('remote')
    }
    if (newFilters.location?.isHybrid) {
      params.set('hybrid', 'true')
    } else {
      params.delete('hybrid')
    }

    // Type
    if (newFilters.type?.length) {
      params.set('type', newFilters.type.join(','))
    } else {
      params.delete('type')
    }

    // Experience
    if (newFilters.experience?.length) {
      params.set('experience', newFilters.experience.join(','))
    } else {
      params.delete('experience')
    }

    // Salary
    if (newFilters.salary?.min) {
      params.set('salaryMin', newFilters.salary.min.toString())
    } else {
      params.delete('salaryMin')
    }
    if (newFilters.salary?.max) {
      params.set('salaryMax', newFilters.salary.max.toString())
    } else {
      params.delete('salaryMax')
    }

    // Skills
    if (newFilters.skills?.length) {
      params.set('skills', newFilters.skills.join(','))
    } else {
      params.delete('skills')
    }

    // Company
    if (newFilters.company?.isVerified) {
      params.set('verified', 'true')
    } else {
      params.delete('verified')
    }
    if (newFilters.company?.minRating) {
      params.set('minRating', newFilters.company.minRating.toString())
    } else {
      params.delete('minRating')
    }

    // Posted within
    if (newFilters.postedWithin) {
      params.set('postedWithin', newFilters.postedWithin)
    } else {
      params.delete('postedWithin')
    }

    router.push(`/jobs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({})
    router.push('/jobs')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <Label>Location</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={filters.location?.isRemote}
                    onCheckedChange={(checked) =>
                      handleFilterChange('location', {
                        ...filters.location,
                        isRemote: checked,
                      })
                    }
                  />
                  <Label htmlFor="remote">Remote</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hybrid"
                    checked={filters.location?.isHybrid}
                    onCheckedChange={(checked) =>
                      handleFilterChange('location', {
                        ...filters.location,
                        isHybrid: checked,
                      })
                    }
                  />
                  <Label htmlFor="hybrid">Hybrid</Label>
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <Label>Job Type</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {['full_time', 'part_time', 'contract', 'internship'].map((type) => (
                  <Badge
                    key={type}
                    variant={filters.type?.includes(type) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newTypes = filters.type?.includes(type)
                        ? filters.type.filter((t) => t !== type)
                        : [...(filters.type || []), type]
                      handleFilterChange('type', newTypes)
                    }}
                  >
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <Label>Experience Level</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {['entry', 'mid', 'senior', 'lead'].map((level) => (
                  <Badge
                    key={level}
                    variant={filters.experience?.includes(level) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newLevels = filters.experience?.includes(level)
                        ? filters.experience.filter((l) => l !== level)
                        : [...(filters.experience || []), level]
                      handleFilterChange('experience', newLevels)
                    }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <Label>Salary Range</Label>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[filters.salary?.min || 0, filters.salary?.max || 200000]}
                  min={0}
                  max={200000}
                  step={10000}
                  onValueChange={([min, max]) =>
                    handleFilterChange('salary', { min, max })
                  }
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${filters.salary?.min?.toLocaleString() || 0}</span>
                  <span>${filters.salary?.max?.toLocaleString() || 200000}</span>
                </div>
              </div>
            </div>

            {/* Posted Within */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <Label>Posted Within</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '24h', label: '24 hours' },
                  { value: '7d', label: '7 days' },
                  { value: '30d', label: '30 days' },
                ].map((option) => (
                  <Badge
                    key={option.value}
                    variant={filters.postedWithin === option.value ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('postedWithin', option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Company Rating */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <Label>Company Rating</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={filters.company?.isVerified}
                    onCheckedChange={(checked) =>
                      handleFilterChange('company', {
                        ...filters.company,
                        isVerified: checked,
                      })
                    }
                  />
                  <Label htmlFor="verified">Verified Companies Only</Label>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Rating</Label>
                  <Slider
                    value={[filters.company?.minRating || 0]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={([rating]) =>
                      handleFilterChange('company', {
                        ...filters.company,
                        minRating: rating,
                      })
                    }
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>{filters.company?.minRating || 0}</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 