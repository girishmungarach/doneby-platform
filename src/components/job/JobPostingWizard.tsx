import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'

const STEPS = [
  { key: 'template', label: 'Template' },
  { key: 'basic', label: 'Basic Info' },
  { key: 'details', label: 'Details' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'benefits', label: 'Benefits' },
  { key: 'preview', label: 'Preview' },
  { key: 'publish', label: 'Publish' },
]

export function JobPostingWizard({
  companyId,
  jobId,
  initialData,
  onSuccess,
  onCancel,
}: {
  companyId: string
  jobId?: string
  initialData?: any
  onSuccess?: (job: any) => void
  onCancel?: () => void
}) {
  const [step, setStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [jobData, setJobData] = useState(initialData || {})

  const goToStep = (idx: number) => setStep(idx)
  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const saveDraft = async () => {
    setIsSaving(true)
    // TODO: Save draft to Supabase (insert or update)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Draft saved')
    }, 500)
  }

  const handleStepData = (data: any) => {
    setJobData((prev: any) => ({ ...prev, ...data }))
  }

  // Placeholder step components
  const StepComponent = () => {
    switch (STEPS[step].key) {
      case 'template':
        return <div className="p-4">[Template Selector Coming Soon]</div>
      case 'basic':
        return <div className="p-4">[Basic Info Step Coming Soon]</div>
      case 'details':
        return <div className="p-4">[Details Step Coming Soon]</div>
      case 'requirements':
        return <div className="p-4">[Requirements Step Coming Soon]</div>
      case 'benefits':
        return <div className="p-4">[Benefits Step Coming Soon]</div>
      case 'preview':
        return <div className="p-4">[Preview Step Coming Soon]</div>
      case 'publish':
        return <div className="p-4">[Publish Step Coming Soon]</div>
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-2 sm:p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Job Posting Wizard</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={((step + 1) / STEPS.length) * 100} className="w-40" />
            <span className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}: {STEPS[step].label}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={STEPS[step].key} className="w-full">
            <TabsList className="w-full flex flex-wrap gap-1 mb-4 overflow-x-auto">
              {STEPS.map((s, idx) => (
                <TabsTrigger
                  key={s.key}
                  value={s.key}
                  onClick={() => goToStep(idx)}
                  className={
                    step === idx
                      ? 'font-bold border-b-2 border-primary'
                      : 'text-muted-foreground'
                  }
                >
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={STEPS[step].key} className="min-h-[200px]">
              <StepComponent />
            </TabsContent>
          </Tabs>
          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={saveDraft} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep} disabled={step === STEPS.length - 1}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 