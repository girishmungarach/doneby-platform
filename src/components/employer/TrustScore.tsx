import { Badge } from '@/components/ui/badge'

export function TrustScore({ score }: { score: number }) {
  let color: 'success' | 'warning' | 'destructive' = 'success'
  if (score < 70) color = 'destructive'
  else if (score < 85) color = 'warning'
  return (
    <Badge variant={color}>Trust: {score}</Badge>
  )
} 