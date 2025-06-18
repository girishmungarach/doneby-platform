import { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircle, Save, Eye, Settings, BarChart } from 'lucide-react'
import { Question, Survey, QuestionType } from '@/lib/types/survey'
import { QuestionEditor } from './QuestionEditor'
import { QuestionList } from './QuestionList'
import { SurveyPreview } from './SurveyPreview'
import { SurveySettings } from './SurveySettings'
import { SurveyAnalytics } from './SurveyAnalytics'
import { useToast } from '@/components/ui/use-toast'

interface SurveyBuilderProps {
  initialSurvey?: Survey
  onSave: (survey: Survey) => void
  onPublish: (survey: Survey) => void
}

export function SurveyBuilder({ initialSurvey, onSave, onPublish }: SurveyBuilderProps) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey || {
    id: '',
    jobId: '',
    title: 'Untitled Survey',
    questions: [],
    isActive: false,
    settings: {
      allowPartialSave: true,
      showProgress: true,
      randomizeQuestions: false,
      requireAllQuestions: true,
    },
    analytics: {
      totalResponses: 0,
      averageCompletionTime: 0,
      completionRate: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [activeTab, setActiveTab] = useState('builder')
  const { toast } = useToast()

  const handleAddQuestion = useCallback((type: QuestionType) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      title: 'New Question',
      order: survey.questions.length,
      isRequired: false,
    }

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }, [survey.questions.length])

  const handleUpdateQuestion = useCallback((questionId: string, updates: Partial<Question>) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }))
  }, [])

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
    }))
  }, [])

  const handleReorderQuestions = useCallback((questionId: string, newOrder: number) => {
    setSurvey(prev => {
      const questions = [...prev.questions]
      const oldIndex = questions.findIndex(q => q.id === questionId)
      const question = questions[oldIndex]
      questions.splice(oldIndex, 1)
      questions.splice(newOrder, 0, question)
      return {
        ...prev,
        questions: questions.map((q, index) => ({ ...q, order: index })),
      }
    })
  }, [])

  const handleSave = useCallback(() => {
    onSave(survey)
    toast({
      title: 'Survey saved',
      description: 'Your changes have been saved successfully.',
    })
  }, [survey, onSave, toast])

  const handlePublish = useCallback(() => {
    onPublish(survey)
    toast({
      title: 'Survey published',
      description: 'Your survey is now live and ready to accept responses.',
    })
  }, [survey, onPublish, toast])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{survey.title}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!survey.questions.length}
            >
              Publish
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Survey Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <QuestionList
                      questions={survey.questions}
                      onUpdate={handleUpdateQuestion}
                      onDelete={handleDeleteQuestion}
                      onReorder={handleReorderQuestions}
                    />
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleAddQuestion('text')}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Question Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('multiple_choice')}
                    >
                      Multiple Choice
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('text')}
                    >
                      Text
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('rating')}
                    >
                      Rating
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('file_upload')}
                    >
                      File Upload
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('video')}
                    >
                      Video
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('boolean')}
                    >
                      Yes/No
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('number')}
                    >
                      Number
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddQuestion('date')}
                    >
                      Date
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <SurveyPreview survey={survey} />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <SurveySettings
              settings={survey.settings}
              onUpdate={settings => setSurvey(prev => ({ ...prev, settings }))}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <SurveyAnalytics surveyId={survey.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  )
} 