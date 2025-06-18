import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrustScore, TrustBadge } from '@/lib/types/trust-score'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrustScoreDisplayProps {
  profileId: string
  initialScore?: TrustScore
}

export function TrustScoreDisplay({
  profileId,
  initialScore,
}: TrustScoreDisplayProps) {
  const [trustScore, setTrustScore] = useState<TrustScore | undefined>(initialScore)
  const supabase = createClient()

  useEffect(() => {
    const subscription = supabase
      .channel(`trust-score-${profileId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trust_scores',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          setTrustScore(payload.new as TrustScore)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [profileId, supabase])

  if (!trustScore) {
    return <div>Loading trust score...</div>
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trust Score</h3>
          <Badge
            className={`text-lg ${
              trustScore.overall_score >= 80
                ? 'bg-green-100 text-green-800'
                : trustScore.overall_score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {trustScore.overall_score}
          </Badge>
        </div>
        <Progress value={trustScore.overall_score} className="h-2" />
      </Card>

      {/* Score History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Score History</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trustScore.history.map((entry) => ({
                date: new Date(entry.timestamp).toLocaleDateString(),
                score: entry.score,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Factors */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trust Factors</h3>
        <div className="space-y-4">
          {Object.entries(trustScore.factors).map(([factor, values]) => (
            <div key={factor} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">
                  {factor.replace(/_/g, ' ')}
                </h4>
                <Badge variant="secondary">
                  {Math.round(
                    Object.values(values).reduce((a, b) => a + b, 0) /
                      Object.keys(values).length
                  )}
                </Badge>
              </div>
              <div className="space-y-1">
                {Object.entries(values).map(([subfactor, value]) => (
                  <div key={subfactor} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">
                        {subfactor.replace(/_/g, ' ')}
                      </span>
                      <span className="text-gray-500">{value}</span>
                    </div>
                    <Progress value={value} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trust Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustScore.badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50"
            >
              <span className="text-2xl" role="img" aria-label={badge.name}>
                {getBadgeIcon(badge.id)}
              </span>
              <div>
                <p className="font-medium">{badge.name}</p>
                <p className="text-sm text-gray-500">Level {badge.level}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {trustScore.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <Badge
                  variant={
                    suggestion.priority === 'high'
                      ? 'destructive'
                      : suggestion.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {suggestion.priority}
                </Badge>
                <div>
                  <p className="font-medium capitalize">
                    {suggestion.factor.replace(/\./g, ' > ').replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {suggestion.improvement}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress
                      value={(suggestion.current_value / suggestion.target_value) * 100}
                      className="h-1 w-24"
                    />
                    <span className="text-xs text-gray-500">
                      {suggestion.current_value} → {suggestion.target_value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function getBadgeIcon(badgeId: string): string {
  const icons: Record<string, string> = {
    verified_identity: '🛡️',
    trusted_verifier: '⭐',
    community_leader: '👑',
  }
  return icons[badgeId] || '🏆'
} 