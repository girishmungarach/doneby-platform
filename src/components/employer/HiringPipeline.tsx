import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const pipelineStages = [
  { key: 'review', label: 'Review', color: 'secondary' },
  { key: 'interview', label: 'Interview', color: 'default' },
  { key: 'offer', label: 'Offer', color: 'success' },
  { key: 'rejected', label: 'Rejected', color: 'destructive' },
]

const dummyCounts = {
  review: 3,
  interview: 2,
  offer: 1,
  rejected: 1,
}

export function HiringPipeline() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {pipelineStages.map(stage => (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-2">
                <Badge variant={stage.color as any} className="text-base px-4 py-2">
                  {stage.label}
                </Badge>
                <div className="text-2xl font-bold">{dummyCounts[stage.key]}</div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 