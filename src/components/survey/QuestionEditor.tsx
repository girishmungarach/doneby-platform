import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { Question, QuestionType, QuestionValidation } from '@/lib/types/survey'

interface QuestionEditorProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
}

export function QuestionEditor({ question, onUpdate }: QuestionEditorProps) {
  const [showValidation, setShowValidation] = useState(false)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ description: e.target.value })
  }

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ isRequired: checked })
  }

  const handleAddOption = () => {
    const newOption = {
      id: crypto.randomUUID(),
      text: '',
      value: '',
    }
    onUpdate({
      options: [...(question.options || []), newOption],
    })
  }

  const handleOptionChange = (optionId: string, field: 'text' | 'value', value: string) => {
    onUpdate({
      options: question.options?.map(opt =>
        opt.id === optionId ? { ...opt, [field]: value } : opt
      ),
    })
  }

  const handleDeleteOption = (optionId: string) => {
    onUpdate({
      options: question.options?.filter(opt => opt.id !== optionId),
    })
  }

  const handleValidationChange = (validation: Partial<QuestionValidation>) => {
    onUpdate({
      validation: {
        ...question.validation,
        ...validation,
      },
    })
  }

  const renderQuestionTypeEditor = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                    placeholder="Option text"
                  />
                  <Input
                    value={option.value}
                    onChange={(e) => handleOptionChange(option.id, 'value', e.target.value)}
                    placeholder="Option value"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Rating</Label>
                <Input
                  type="number"
                  value={question.validation?.minValue || 1}
                  onChange={(e) => handleValidationChange({ minValue: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Maximum Rating</Label>
                <Input
                  type="number"
                  value={question.validation?.maxValue || 5}
                  onChange={(e) => handleValidationChange({ maxValue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      case 'file_upload':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Allowed File Types</Label>
                <Input
                  value={question.validation?.fileTypes?.join(', ') || ''}
                  onChange={(e) => handleValidationChange({
                    fileTypes: e.target.value.split(',').map(t => t.trim()),
                  })}
                  placeholder="pdf, doc, docx"
                />
              </div>
              <div>
                <Label>Maximum File Size (MB)</Label>
                <Input
                  type="number"
                  value={question.validation?.maxFileSize ? question.validation.maxFileSize / (1024 * 1024) : 5}
                  onChange={(e) => handleValidationChange({
                    maxFileSize: Number(e.target.value) * 1024 * 1024,
                  })}
                />
              </div>
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Duration (seconds)</Label>
              <Input
                type="number"
                value={question.validation?.maxDuration || 60}
                onChange={(e) => handleValidationChange({ maxDuration: Number(e.target.value) })}
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Length</Label>
                <Input
                  type="number"
                  value={question.validation?.minLength || 0}
                  onChange={(e) => handleValidationChange({ minLength: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Maximum Length</Label>
                <Input
                  type="number"
                  value={question.validation?.maxLength || 1000}
                  onChange={(e) => handleValidationChange({ maxLength: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Value</Label>
                <Input
                  type="number"
                  value={question.validation?.minValue || 0}
                  onChange={(e) => handleValidationChange({ minValue: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={question.validation?.maxValue || 100}
                  onChange={(e) => handleValidationChange({ maxValue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Question Title</Label>
        <Input
          value={question.title}
          onChange={handleTitleChange}
          placeholder="Enter your question"
        />
      </div>

      <div>
        <Label>Description (Optional)</Label>
        <Textarea
          value={question.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Add a description or instructions"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={question.isRequired}
          onCheckedChange={handleRequiredChange}
        />
        <Label htmlFor="required">Required</Label>
      </div>

      {renderQuestionTypeEditor()}

      <div className="flex items-center space-x-2">
        <Switch
          id="validation"
          checked={showValidation}
          onCheckedChange={setShowValidation}
        />
        <Label htmlFor="validation">Show Advanced Validation</Label>
      </div>

      {showValidation && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>Validation Pattern (Regex)</Label>
                <Input
                  value={question.validation?.pattern || ''}
                  onChange={(e) => handleValidationChange({ pattern: e.target.value })}
                  placeholder="^[A-Za-z]+$"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 