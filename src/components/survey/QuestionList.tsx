import { useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Card } from '@/components/ui/card'
import { Question } from '@/lib/types/survey'
import { QuestionEditor } from './QuestionEditor'
import { GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuestionListProps {
  questions: Question[]
  onUpdate: (questionId: string, updates: Partial<Question>) => void
  onDelete: (questionId: string) => void
  onReorder: (questionId: string, newOrder: number) => void
}

interface DragItem {
  id: string
  type: string
  index: number
}

export function QuestionList({ questions, onUpdate, onDelete, onReorder }: QuestionListProps) {
  const moveQuestion = useCallback((dragIndex: number, hoverIndex: number) => {
    const question = questions[dragIndex]
    onReorder(question.id, hoverIndex)
  }, [questions, onReorder])

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          index={index}
          moveQuestion={moveQuestion}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

interface QuestionItemProps {
  question: Question
  index: number
  moveQuestion: (dragIndex: number, hoverIndex: number) => void
  onUpdate: (questionId: string, updates: Partial<Question>) => void
  onDelete: (questionId: string) => void
}

function QuestionItem({ question, index, moveQuestion, onUpdate, onDelete }: QuestionItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'QUESTION',
    item: { id: question.id, type: 'QUESTION', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover: (item: DragItem) => {
      if (item.index === index) {
        return
      }
      moveQuestion(item.index, index)
      item.index = index
    },
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="cursor-move">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <QuestionEditor
              question={question}
              onUpdate={(updates) => onUpdate(question.id, updates)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(question.id)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
} 