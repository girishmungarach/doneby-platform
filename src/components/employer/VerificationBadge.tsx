import { CheckCircle2 } from 'lucide-react'

export function VerificationBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
      <CheckCircle2 className="w-4 h-4" /> Verified
    </span>
  )
} 