import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ProfileVerificationProps {
  onComplete: () => void
  onSkip: () => void
}

type VerificationStatus = 'pending' | 'verified' | 'failed'

interface VerificationItem {
  id: string
  title: string
  description: string
  status: VerificationStatus
}

export function ProfileVerification({ onComplete, onSkip }: ProfileVerificationProps) {
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Verify your email address',
      status: 'pending',
    },
    {
      id: 'phone',
      title: 'Phone Verification',
      description: 'Verify your phone number',
      status: 'pending',
    },
    {
      id: 'resume',
      title: 'Resume Upload',
      description: 'Upload your latest resume',
      status: 'pending',
    },
    {
      id: 'skills',
      title: 'Skills Verification',
      description: 'Verify your skills and experience',
      status: 'pending',
    },
  ])

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)
    try {
      // Replace with actual API call
      const response = await fetch('/api/profile/verify', { method: 'POST' })
      if (!response.ok) throw new Error('Verification failed')
      const data = await response.json()
      setVerificationItems(data.verificationItems)
      const allVerified = data.verificationItems.every((item: VerificationItem) => item.status === 'verified')
      if (allVerified) {
        toast({ title: 'Profile Verified', description: 'Your profile has been verified successfully.' })
        onComplete()
      } else {
        toast({ title: 'Verification Incomplete', description: 'Some items need attention before proceeding.', variant: 'warning' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify profile. Please try again.')
      toast({ title: 'Verification Failed', description: err.message || 'Failed to verify profile. Please try again.', variant: 'destructive' })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const verifiedCount = verificationItems.filter((item) => item.status === 'verified').length
  const progress = (verifiedCount / verificationItems.length) * 100

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Profile Verification</h3>
        <p className="text-muted-foreground mb-4">Please verify your profile information before proceeding with the application.</p>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{verifiedCount} of {verificationItems.length} items verified</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>
      <div className="space-y-4">
        {verificationItems.map((item) => (
          <Card key={item.id} className="shadow-none border border-muted-foreground/10">
            <CardContent className="pt-4 pb-2 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-base">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              {getStatusIcon(item.status)}
            </CardContent>
          </Card>
        ))}
      </div>
      {error && <div className="text-destructive text-center text-sm">{error}</div>}
      <div className="flex justify-between gap-2 mt-4">
        <Button variant="outline" onClick={onSkip} className="flex-1">Skip for Now</Button>
        <Button onClick={handleVerify} disabled={isVerifying} className="flex-1">
          {isVerifying ? 'Verifying...' : 'Verify Profile'}
        </Button>
      </div>
    </div>
  )
} 