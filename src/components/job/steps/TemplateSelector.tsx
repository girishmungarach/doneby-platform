import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Briefcase, Code, Users, BarChart, PenTool, PlusCircle } from 'lucide-react'
import { JOB_CATEGORIES, JOB_TYPES, JOB_EXPERIENCE_LEVELS } from '@/lib/types/job'

const JOB_TEMPLATES = [
  {
    id: 'software_engineer',
    title: 'Software Engineer',
    category: 'engineering',
    type: 'full_time',
    experience_level: 'mid',
    icon: <Code className="w-6 h-6" />,
    description: 'Develop and maintain software applications, collaborate with cross-functional teams, and ensure code quality.',
    requirements: [
      'Bachelor's degree in Computer Science or related field',
      '2+ years of experience in software development',
      'Proficiency in JavaScript/TypeScript',
      'Experience with React or similar frameworks',
    ],
    benefits: [
      'Health insurance',
      'Flexible work hours',
      'Remote work options',
    ],
  },
  {
    id: 'product_manager',
    title: 'Product Manager',
    category: 'product',
    type: 'full_time',
    experience_level: 'senior',
    icon: <BarChart className="w-6 h-6" />,
    description: 'Lead product strategy, define requirements, and work closely with engineering and design teams to deliver value.',
    requirements: [
      'Bachelor's degree in Business or related field',
      '5+ years of product management experience',
      'Strong communication and leadership skills',
    ],
    benefits: [
      'Stock options',
      'Professional development budget',
    ],
  },
  {
    id: 'designer',
    title: 'UI/UX Designer',
    category: 'design',
    type: 'contract',
    experience_level: 'mid',
    icon: <PenTool className="w-6 h-6" />,
    description: 'Design user interfaces and experiences, create wireframes and prototypes, and collaborate with product teams.',
    requirements: [
      'Portfolio of design projects',
      'Experience with Figma or Sketch',
      'Understanding of user-centered design principles',
    ],
    benefits: [
      'Remote work',
      'Flexible schedule',
    ],
  },
  {
    id: 'hr_manager',
    title: 'HR Manager',
    category: 'hr',
    type: 'full_time',
    experience_level: 'senior',
    icon: <Users className="w-6 h-6" />,
    description: 'Manage HR operations, recruitment, and employee relations. Foster a positive workplace culture.',
    requirements: [
      'Bachelor's degree in Human Resources or related field',
      '5+ years of HR experience',
      'Strong interpersonal skills',
    ],
    benefits: [
      'Comprehensive health benefits',
      'Paid time off',
    ],
  },
]

interface TemplateSelectorProps {
  onSelect: (template: any) => void
  onBack: () => void
}

export function TemplateSelector({ onSelect, onBack }: TemplateSelectorProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filteredTemplates = JOB_TEMPLATES.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select a Job Template</CardTitle>
          <CardDescription>Choose a template to pre-fill job details, or start from scratch.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-64">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`border-2 transition-colors cursor-pointer ${selected === template.id ? 'border-primary' : 'border-muted'}`}
                  onClick={() => setSelected(template.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-2">
                    {template.icon}
                    <div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-medium mb-1">Requirements:</div>
                    <ul className="list-disc list-inside text-xs mb-2">
                      {template.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                    <div className="text-xs font-medium mb-1">Benefits:</div>
                    <ul className="list-disc list-inside text-xs">
                      {template.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => selected && onSelect(JOB_TEMPLATES.find(t => t.id === selected))}
              disabled={!selected}
              className="flex-1"
            >
              Use Selected Template
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onSelect(null)}
              className="flex-1"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Start from Scratch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 