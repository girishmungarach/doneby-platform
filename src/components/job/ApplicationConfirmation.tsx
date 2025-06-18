import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Bell, FileText } from 'lucide-react'
import { JobListing } from '@/lib/types/job-listing'

interface ApplicationConfirmationProps {
  job: JobListing
  onClose: () => void
  onViewStatus: () => void
}

export function ApplicationConfirmation({
  job,
  onClose,
  onViewStatus,
}: ApplicationConfirmationProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Your application for {job.title} at {job.company.name} has been
          submitted successfully.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Bell className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">What's Next?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You'll receive email notifications about your application
                  status. Make sure to check your inbox regularly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Track Your Application</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  View your application status, messages, and updates in your
                  applications dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onViewStatus}>
          View Application Status
        </Button>
      </div>
    </div>
  )
} 