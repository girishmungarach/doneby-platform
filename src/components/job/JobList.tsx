import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JobListing, JobListingResponse } from '@/lib/types/job-listing'
import { MapPin, Building2, DollarSign, Clock, Star, Bookmark } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function JobList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const { ref, inView } = useInView()

  const fetchJobs = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      params.set('pageSize', '10')

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data: JobListingResponse = await response.json()

      setJobs(prev => [...prev, ...data.jobs])
      setHasMore(data.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, searchParams])

  useEffect(() => {
    if (inView) {
      fetchJobs()
    }
  }, [inView, fetchJobs])

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  const handleSaveJob = async (jobId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      // Replace with actual API call
      await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })
      // Update UI to show job is saved
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const formatSalary = (job: JobListing) => {
    if (!job.salary.isPublic) return 'Salary not disclosed'
    return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card
          key={job.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleJobClick(job.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{job.company.name}</span>
                  {job.company.isVerified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleSaveJob(job.id, e)}
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {job.location.city}, {job.location.state}
                    {job.location.isRemote && ' (Remote)'}
                    {job.location.isHybrid && ' (Hybrid)'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{formatSalary(job)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Posted {formatDistanceToNow(job.postedAt)} ago</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>{job.company.rating.toFixed(1)} rating</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{job.type}</Badge>
              <Badge variant="secondary">{job.experience}</Badge>
              {job.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline">+{job.skills.length - 3} more</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Loading indicator */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isLoading && <div>Loading more jobs...</div>}
      </div>

      {/* No results */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  )
} 