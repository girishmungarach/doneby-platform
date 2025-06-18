import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  VerifierIdentity,
  VerifierIdentityProps,
  VERIFIER_ONBOARDING_STEPS,
  VERIFIER_BADGE_CRITERIA,
} from '@/lib/types/verifier-identity'
import { cn } from '@/lib/utils'

export function VerifierIdentityValidation({
  verifierIdentity,
  onUpdate,
  onVerify,
  onReject,
  isLoading,
}: VerifierIdentityProps) {
  const [activeTab, setActiveTab] = useState('onboarding')
  const [progress, setProgress] = useState(0)

  const form = useForm<VerifierIdentity>({
    defaultValues: verifierIdentity,
  })

  const handleSubmit = async (data: VerifierIdentity) => {
    try {
      await onUpdate(data)
    } catch (error) {
      console.error('Error updating verifier identity:', error)
    }
  }

  const updateProgress = () => {
    const completedSteps = verifierIdentity.onboarding_status.steps.filter(
      (step) => step.status === 'completed'
    ).length
    const totalSteps = verifierIdentity.onboarding_status.steps.length
    setProgress((completedSteps / totalSteps) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'warning'
      case 'suspended':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Verifier Identity Validation</h2>
        <div className="flex items-center gap-4">
          <Progress value={progress} className="w-32" />
          <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="verification">Verification Methods</TabsTrigger>
          <TabsTrigger value="reputation">Reputation & Badges</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Onboarding Progress</h3>
            <div className="space-y-4">
              {verifierIdentity.onboarding_status.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{step.name}</p>
                    {step.completed_at && (
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(step.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={getStatusColor(step.status)}>
                    {step.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Qualification Assessment</h3>
            <div className="space-y-4">
              {verifierIdentity.qualifications.map((qualification, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{qualification.type}</p>
                    <Badge variant={qualification.verified ? 'success' : 'warning'}>
                      {qualification.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Relationship: {qualification.relationship}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {qualification.duration}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Evidence: {qualification.evidence}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">LinkedIn Profile</h3>
            <div className="space-y-4">
              {verifierIdentity.linkedin_profile ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Profile URL</p>
                    <a
                      href={verifierIdentity.linkedin_profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Verification Status</p>
                    <Badge
                      variant={
                        verifierIdentity.linkedin_profile.verified
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {verifierIdentity.linkedin_profile.verified
                        ? 'Verified'
                        : 'Pending'}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No LinkedIn profile added</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Email Domain</h3>
            <div className="space-y-4">
              {verifierIdentity.email_domain ? (
                <>
                  <div>
                    <p className="font-medium">Domain</p>
                    <p>{verifierIdentity.email_domain.domain}</p>
                  </div>
                  <div>
                    <p className="font-medium">Company Name</p>
                    <p>{verifierIdentity.email_domain.company_name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Verification Status</p>
                    <Badge
                      variant={
                        verifierIdentity.email_domain.verified ? 'success' : 'warning'
                      }
                    >
                      {verifierIdentity.email_domain.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">No email domain added</p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Reputation Score</h3>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall Score
                </p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={verifierIdentity.reputation_score.overall}
                    className="w-full"
                  />
                  <Badge variant="outline">
                    {verifierIdentity.reputation_score.overall}/100
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Verification Accuracy
                </p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={verifierIdentity.reputation_score.verification_accuracy}
                    className="w-full"
                  />
                  <Badge variant="outline">
                    {verifierIdentity.reputation_score.verification_accuracy}/100
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Response Time
                </p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={verifierIdentity.reputation_score.response_time}
                    className="w-full"
                  />
                  <Badge variant="outline">
                    {verifierIdentity.reputation_score.response_time}/100
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="grid gap-4">
              {verifierIdentity.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {VERIFIER_BADGE_CRITERIA[badge.type].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {VERIFIER_BADGE_CRITERIA[badge.type].description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Awarded: {new Date(badge.awarded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fraud Risk Assessment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Risk Level</p>
                <Badge variant={getRiskLevelColor(verifierIdentity.fraud_detection.risk_level)}>
                  {verifierIdentity.fraud_detection.risk_level.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="font-medium mb-2">Risk Factors</p>
                <div className="space-y-2">
                  {verifierIdentity.fraud_detection.risk_factors.map(
                    (factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{factor.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {factor.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Detected: {new Date(factor.detected_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={factor.resolved ? 'success' : 'destructive'}
                        >
                          {factor.resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">Last Assessment</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    verifierIdentity.fraud_detection.last_assessment
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onReject('manual', 'Rejected by admin')}
          disabled={isLoading}
        >
          Reject
        </Button>
        <Button
          type="button"
          onClick={() => onVerify('manual')}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </div>
  )
} 