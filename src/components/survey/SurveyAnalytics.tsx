import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SurveyAnalytics as SurveyAnalyticsType } from '@/lib/types/survey'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface SurveyAnalyticsProps {
  surveyId: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function SurveyAnalytics({ surveyId }: SurveyAnalyticsProps) {
  const [analytics, setAnalytics] = useState<SurveyAnalyticsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch analytics
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setAnalytics({
          surveyId,
          totalResponses: 150,
          completionRate: 0.85,
          averageScore: 4.2,
          questionAnalytics: [
            {
              questionId: '1',
              responseCount: 150,
              averageScore: 4.5,
              distribution: {
                'Strongly Agree': 45,
                'Agree': 60,
                'Neutral': 25,
                'Disagree': 15,
                'Strongly Disagree': 5,
              },
              averageTimeSpent: 45,
            },
            // Add more question analytics...
          ],
          timeAnalytics: {
            averageCompletionTime: 12,
            medianCompletionTime: 10,
            completionTimeDistribution: {
              '0-5 min': 30,
              '5-10 min': 45,
              '10-15 min': 50,
              '15-20 min': 20,
              '20+ min': 5,
            },
          },
          scoreAnalytics: {
            averageScore: 4.2,
            medianScore: 4.0,
            scoreDistribution: {
              '1-2': 10,
              '2-3': 20,
              '3-4': 45,
              '4-5': 75,
            },
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [surveyId])

  if (isLoading || !analytics) {
    return <div>Loading analytics...</div>
  }

  const timeDistributionData = Object.entries(analytics.timeAnalytics.completionTimeDistribution).map(
    ([range, count]) => ({
      name: range,
      value: count,
    })
  )

  const scoreDistributionData = Object.entries(analytics.scoreAnalytics.scoreDistribution).map(
    ([range, count]) => ({
      name: range,
      value: count,
    })
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalResponses}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(analytics.completionRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.averageScore.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="time">
        <TabsList>
          <TabsTrigger value="time">Time Distribution</TabsTrigger>
          <TabsTrigger value="score">Score Distribution</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Completion Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="score">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-4">
            {analytics.questionAnalytics.map((question) => (
              <Card key={question.questionId}>
                <CardHeader>
                  <CardTitle>Question {question.questionId}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Response Distribution</h4>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(question.distribution || {}).map(
                            ([name, value]) => ({ name, value })
                          )}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Average Score</h4>
                        <p className="text-2xl font-bold">{question.averageScore?.toFixed(1)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Average Time Spent</h4>
                        <p className="text-2xl font-bold">{question.averageTimeSpent} seconds</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Response Count</h4>
                        <p className="text-2xl font-bold">{question.responseCount}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 