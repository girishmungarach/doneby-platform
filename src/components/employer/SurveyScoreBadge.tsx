import { Badge } from '@/components/ui/badge'

export function SurveyScoreBadge({ score }: { score: number }) {
  let color: 'success' | 'warning' | 'destructive' = 'success'
  if (score < 70) color = 'destructive'
  else if (score < 85) color = 'warning'
  return (
    <Badge variant={color}>Survey: {score}</Badge>
  )
} 