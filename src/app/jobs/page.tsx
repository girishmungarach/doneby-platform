import { Suspense } from 'react'
import { JobSearch } from '@/components/job/JobSearch'
import { JobFilters } from '@/components/job/JobFilters'
import { JobList } from '@/components/job/JobList'
import { JobRecommendations } from '@/components/job/JobRecommendations'

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <JobFilters />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <JobSearch />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job listings */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div>Loading jobs...</div>}>
                <JobList />
              </Suspense>
            </div>

            {/* Recommendations sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Suspense fallback={<div>Loading recommendations...</div>}>
                  <JobRecommendations />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 