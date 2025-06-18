import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Survey, SurveyQuestion } from '@/lib/types/job-listing'

interface SurveyResponseProps {
  survey: Survey
  onComplete: (responses: Record<string, any>) => void
  onNext: () => void
  onBack: () => void
}

export function SurveyResponse({ survey, onComplete, onNext, onBack }: SurveyResponseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = survey.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100

  const validateResponse = (question: SurveyQuestion, response: any): boolean => {
    if (question.required && (!response || (Array.isArray(response) && response.length === 0))) {
      setError('This question is required')
      return false
    }
    if (question.type === 'multiple_choice' && question.maxSelections && Array.isArray(response)) {
      if (response.length > question.maxSelections) {
        setError(`You can select at most ${question.maxSelections} options`)
        return false
      }
    }
    if (question.type === 'text' && question.maxLength && typeof response === 'string') {
      if (response.length > question.maxLength) {
        setError(`Response must be at most ${question.maxLength} characters`)
        return false
      }
    }
    setError(null)
    return true
  }

  const handleNext = () => {
    const response = responses[currentQuestion.id]
    if (!validateResponse(currentQuestion, response)) return
    if (currentQuestionIndex === survey.questions.length - 1) {
      onComplete(responses)
      onNext()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      onBack()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleResponseChange = (value: any) => {
    setResponses((prev) => ({ ...prev, [currentQuestion.id]: value }))
    setError(null)
  }

  const renderQuestion = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            className="min-h-[100px]"
          />
        )
      case 'single_choice':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={handleResponseChange}
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={Array.isArray(responses[question.id]) && responses[question.id].includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentResponses = Array.isArray(responses[question.id]) ? responses[question.id] : []
                    handleResponseChange(
                      checked
                        ? [...currentResponses, option.value]
                        : currentResponses.filter((v: string) => v !== option.value)
                    )
                  }}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {survey.questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{currentQuestion.title}</h3>
              {currentQuestion.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentQuestion.description}</p>
              )}
            </div>
            {renderQuestion(currentQuestion)}
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            {currentQuestion.required && <p className="text-xs text-muted-foreground mt-2">* Required</p>}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
        <Button onClick={handleNext} className="flex-1">
          {currentQuestionIndex === survey.questions.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  )
} 