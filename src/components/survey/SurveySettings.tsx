import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Survey } from '@/lib/types/survey'
import { Button } from '@/components/ui/button'

interface SurveySettingsProps {
  settings: Survey['settings']
  onUpdate: (settings: Survey['settings']) => void
}

export function SurveySettings({ settings, onUpdate }: SurveySettingsProps) {
  const handleChange = (key: keyof Survey['settings'], value: any) => {
    onUpdate({
      ...settings,
      [key]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Survey Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Partial Save</Label>
              <p className="text-sm text-muted-foreground">
                Let applicants save their progress and continue later
              </p>
            </div>
            <Switch
              checked={settings.allowPartialSave}
              onCheckedChange={(checked) => handleChange('allowPartialSave', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Progress</Label>
              <p className="text-sm text-muted-foreground">
                Display progress bar during survey completion
              </p>
            </div>
            <Switch
              checked={settings.showProgress}
              onCheckedChange={(checked) => handleChange('showProgress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Randomize Questions</Label>
              <p className="text-sm text-muted-foreground">
                Present questions in random order
              </p>
            </div>
            <Switch
              checked={settings.randomizeQuestions}
              onCheckedChange={(checked) => handleChange('randomizeQuestions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require All Questions</Label>
              <p className="text-sm text-muted-foreground">
                Force applicants to answer all questions
              </p>
            </div>
            <Switch
              checked={settings.requireAllQuestions}
              onCheckedChange={(checked) => handleChange('requireAllQuestions', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Time Limit (minutes)</Label>
            <p className="text-sm text-muted-foreground">
              Set a time limit for completing the survey (optional)
            </p>
            <Input
              type="number"
              value={settings.timeLimit || ''}
              onChange={(e) => handleChange('timeLimit', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No time limit"
              min={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Survey Link</Label>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/survey/${settings.surveyId}`}
                readOnly
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/survey/${settings.surveyId}`)
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Embed Code</Label>
            <div className="flex gap-2">
              <Input
                value={`<iframe src="${window.location.origin}/survey/${settings.surveyId}/embed" width="100%" height="600" frameborder="0"></iframe>`}
                readOnly
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<iframe src="${window.location.origin}/survey/${settings.surveyId}/embed" width="100%" height="600" frameborder="0"></iframe>`
                  )
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 