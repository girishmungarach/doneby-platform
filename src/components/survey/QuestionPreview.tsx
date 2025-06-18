import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Question } from '@/lib/types/survey'
import { Upload, Video, AlertCircle } from 'lucide-react'

interface QuestionPreviewProps {
  question: Question
  value: any
  onChange: (value: any) => void
}

export function QuestionPreview({ question, value, onChange }: QuestionPreviewProps) {
  const [error, setError] = useState<string | null>(null)

  const validateAnswer = (answer: any): boolean => {
    if (question.isRequired && (answer === undefined || answer === '')) {
      setError('This question is required')
      return false
    }

    if (answer === undefined || answer === '') {
      return true
    }

    const validation = question.validation
    if (!validation) return true

    if (validation.pattern && typeof answer === 'string') {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(answer)) {
        setError('Invalid format')
        return false
      }
    }

    if (validation.minLength && typeof answer === 'string' && answer.length < validation.minLength) {
      setError(`Minimum length is ${validation.minLength} characters`)
      return false
    }

    if (validation.maxLength && typeof answer === 'string' && answer.length > validation.maxLength) {
      setError(`Maximum length is ${validation.maxLength} characters`)
      return false
    }

    if (validation.minValue !== undefined && typeof answer === 'number' && answer < validation.minValue) {
      setError(`Minimum value is ${validation.minValue}`)
      return false
    }

    if (validation.maxValue !== undefined && typeof answer === 'number' && answer > validation.maxValue) {
      setError(`Maximum value is ${validation.maxValue}`)
      return false
    }

    setError(null)
    return true
  }

  const handleChange = (newValue: any) => {
    if (validateAnswer(newValue)) {
      onChange(newValue)
    }
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={handleChange}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter your answer"
            className="min-h-[100px]"
          />
        )

      case 'rating':
        return (
          <div className="space-y-4">
            <Slider
              value={[value || 0]}
              min={question.validation?.minValue || 1}
              max={question.validation?.maxValue || 5}
              step={1}
              onValueChange={([newValue]) => handleChange(newValue)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.validation?.minValue || 1}</span>
              <span>{value || 0}</span>
              <span>{question.validation?.maxValue || 5}</span>
            </div>
          </div>
        )

      case 'file_upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                {question.validation?.fileTypes?.join(', ')} files up to{' '}
                {question.validation?.maxFileSize
                  ? Math.round(question.validation.maxFileSize / (1024 * 1024))
                  : 5}{' '}
                MB
              </p>
              <Input
                type="file"
                className="hidden"
                accept={question.validation?.fileTypes?.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (
                      question.validation?.maxFileSize &&
                      file.size > question.validation.maxFileSize
                    ) {
                      setError(`File size must be less than ${Math.round(question.validation.maxFileSize / (1024 * 1024))} MB`)
                      return
                    }
                    handleChange(file)
                  }
                }}
              />
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Record a video response
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum duration: {question.validation?.maxDuration || 60} seconds
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // Implement video recording functionality
                  console.log('Start video recording')
                }}
              >
                Start Recording
              </Button>
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="boolean"
              checked={value || false}
              onCheckedChange={handleChange}
            />
            <Label htmlFor="boolean">Yes</Label>
          </div>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={question.validation?.minValue}
            max={question.validation?.maxValue}
            placeholder="Enter a number"
          />
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {question.title}
              {question.isRequired && <span className="text-destructive ml-1">*</span>}
            </h3>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {question.description}
              </p>
            )}
          </div>

          {renderQuestionInput()}

          {error && (
            <div className="flex items-center text-destructive text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 