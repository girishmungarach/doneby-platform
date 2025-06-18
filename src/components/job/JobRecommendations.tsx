import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { JobListing, JobRecommendation } from '@/lib/types/job-listing'
import { Building2, Star, CheckCircle2 } from 'lucide-react'

export function JobRecommendations() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/jobs/recommendations')
        const data = await response.json()
        setRecommendations(data.recommendations)
        setJobs(data.jobs)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading recommendations...</div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Complete your profile to get personalized job recommendations
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/profile')}
            >
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => {
            const job = jobs.find((j) => j.id === recommendation.jobId)
            if (!job) return null

            return (
              <Card
                key={recommendation.jobId}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company.name}</span>
                        {job.company.isVerified && (
                          <Badge variant="secondary">Verified</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Match Score</span>
                        <span>{recommendation.matchPercentage}%</span>
                      </div>
                      <Progress value={recommendation.matchPercentage} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Why you're a good match:</h4>
                      <ul className="space-y-1">
                        {recommendation.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Skills Match:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.skillsMatch.map((skill) => (
                          <Badge
                            key={skill.skill}
                            variant={skill.match ? 'default' : 'outline'}
                          >
                            {skill.skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{job.company.rating.toFixed(1)}</span>
                      </div>
                      <Button variant="link" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 