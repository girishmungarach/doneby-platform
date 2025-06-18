import { JobListing, Survey, SurveyQuestion } from '@/lib/types/job-listing'

export function formatSalary(job: JobListing) {
  if (!job.salary.isPublic) return 'Salary not disclosed'
  return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
}

export function isProfileVerified(verificationItems: { status: string }[]) {
  return verificationItems.every(item => item.status === 'verified')
}

export function validateSurveyResponse(question: SurveyQuestion, response: any): string | null {
  if (question.required && (!response || (Array.isArray(response) && response.length === 0))) {
    return 'This question is required'
  }
  if (question.type === 'multiple_choice' && question.maxSelections && Array.isArray(response)) {
    if (response.length > question.maxSelections) {
      return `You can select at most ${question.maxSelections} options`
    }
  }
  if (question.type === 'text' && question.maxLength && typeof response === 'string') {
    if (response.length > question.maxLength) {
      return `Response must be at most ${question.maxLength} characters`
    }
  }
  return null
} 