import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function EmployerSettings() {
  const [notifications, setNotifications] = useState(true)
  const [pipelineStages, setPipelineStages] = useState(['Review', 'Interview', 'Offer', 'Rejected'])
  const [companyProfile, setCompanyProfile] = useState('')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Application Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for new applications and updates.</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="space-y-2">
            <Label>Pipeline Stages</Label>
            <Input
              value={pipelineStages.join(', ')}
              onChange={e => setPipelineStages(e.target.value.split(',').map(s => s.trim()))}
              placeholder="Review, Interview, Offer, Rejected"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of stages for your hiring pipeline.</p>
          </div>
          <div className="space-y-2">
            <Label>Company Profile Link</Label>
            <Input
              value={companyProfile}
              onChange={e => setCompanyProfile(e.target.value)}
              placeholder="https://yourcompany.com/profile"
            />
            <p className="text-xs text-muted-foreground">Link to your company profile for applicants to view.</p>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
} 