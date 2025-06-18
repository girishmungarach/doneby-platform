import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Survey, Question } from '@/lib/types/survey'
import { QuestionPreview } from './QuestionPreview'

interface SurveyPreviewProps {
  survey: Survey
}

export function SurveyPreview({ survey }: SurveyPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = survey.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Survey responses:', answers)
      // Reset preview
      setCurrentQuestionIndex(0)
      setAnswers({})
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0
  const canProceed = currentQuestion.isRequired
    ? answers[currentQuestion.id] !== undefined
    : true

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
          {survey.description && (
            <p className="text-muted-foreground">{survey.description}</p>
          )}
        </CardHeader>
        <CardContent>
          {survey.settings.showProgress && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="space-y-6">
            <QuestionPreview
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={(value) => handleAnswer(currentQuestion.id, value)}
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 