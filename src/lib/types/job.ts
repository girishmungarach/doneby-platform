import { z } from 'zod'

// --- Job Categories, Types, Experience Levels ---
export const JOB_TYPES = [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'temporary',
  'freelance',
  'volunteer',
  'apprenticeship',
] as const
export type JobType = typeof JOB_TYPES[number]

export const JOB_CATEGORIES = [
  'engineering',
  'design',
  'product',
  'marketing',
  'sales',
  'operations',
  'customer_support',
  'finance',
  'hr',
  'legal',
  'education',
  'healthcare',
  'other',
] as const
export type JobCategory = typeof JOB_CATEGORIES[number]

export const JOB_EXPERIENCE_LEVELS = [
  'entry',
  'mid',
  'senior',
  'lead',
  'director',
  'executive',
] as const
export type JobExperienceLevel = typeof JOB_EXPERIENCE_LEVELS[number]

export const JOB_LOCATION_TYPES = [
  'onsite',
  'remote',
  'hybrid',
] as const
export type JobLocationType = typeof JOB_LOCATION_TYPES[number]

// --- Compensation ---
export const CompensationSchema = z.object({
  type: z.enum(['salary', 'hourly', 'project', 'equity']),
  currency: z.string().min(1),
  min: z.number().min(0),
  max: z.number().min(0),
  periodicity: z.enum(['year', 'month', 'week', 'day', 'hour']).optional(),
  equity_percent: z.number().min(0).max(100).optional(),
})
export type Compensation = z.infer<typeof CompensationSchema>

// --- Requirements & Qualifications ---
export const JOB_REQUIREMENT_CATEGORIES = [
  { id: 'skill', name: 'Skill' },
  { id: 'education', name: 'Education' },
  { id: 'experience', name: 'Experience' },
  { id: 'certification', name: 'Certification' },
  { id: 'language', name: 'Language' },
  { id: 'other', name: 'Other' },
] as const
export type JobRequirementCategory = typeof JOB_REQUIREMENT_CATEGORIES[number]['id']

export const JobRequirementSchema = z.object({
  id: z.string(),
  type: z.enum(['required', 'preferred']),
  description: z.string().min(1),
  category: z.string(),
})
export type JobRequirement = z.infer<typeof JobRequirementSchema>

// --- Benefits ---
export const JOB_BENEFIT_CATEGORIES = [
  { id: 'health', name: 'Health' },
  { id: 'retirement', name: 'Retirement' },
  { id: 'paid_time_off', name: 'Paid Time Off' },
  { id: 'flexible', name: 'Flexible Schedule' },
  { id: 'remote', name: 'Remote Work' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'learning', name: 'Learning & Development' },
  { id: 'other', name: 'Other' },
] as const
export type JobBenefitCategory = typeof JOB_BENEFIT_CATEGORIES[number]['id']

export const JobBenefitSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
})
export type JobBenefit = z.infer<typeof JobBenefitSchema>

// --- Skills Integration ---
export const JobSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
})
export type JobSkill = z.infer<typeof JobSkillSchema>

// --- Location ---
export const JobLocationSchema = z.object({
  type: z.enum(['onsite', 'remote', 'hybrid']),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
})
export type JobLocation = z.infer<typeof JobLocationSchema>

// --- Analytics & Metrics ---
export const JobAnalyticsSchema = z.object({
  views: z.number().default(0),
  applications: z.number().default(0),
  saves: z.number().default(0),
  shares: z.number().default(0),
  conversion_rate: z.number().default(0),
  average_screening_score: z.number().default(0),
  source_analytics: z.record(z.string(), z.number()).default({}),
  status_distribution: z.record(z.string(), z.number()).default({}),
})
export type JobAnalytics = z.infer<typeof JobAnalyticsSchema>

// --- Application Workflow & Status ---
export const JOB_APPLICATION_STATUS = [
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
] as const
export type JobApplicationStatus = typeof JOB_APPLICATION_STATUS[number]

export const JobApplicationSchema = z.object({
  id: z.string(),
  applicant_id: z.string(),
  status: z.enum(JOB_APPLICATION_STATUS),
  applied_at: z.string(),
  updated_at: z.string().optional(),
  screening_score: z.number().optional(),
  notes: z.string().optional(),
})
export type JobApplication = z.infer<typeof JobApplicationSchema>

// --- Main Job Posting Schema ---
export const JobPostingSchema = z.object({
  id: z.string().optional(),
  company_id: z.string(),
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  type: z.enum(JOB_TYPES),
  category: z.enum(JOB_CATEGORIES),
  experience_level: z.enum(JOB_EXPERIENCE_LEVELS),
  location: JobLocationSchema,
  compensation: CompensationSchema,
  requirements: z.array(JobRequirementSchema),
  benefits: z.array(JobBenefitSchema),
  skills: z.array(JobSkillSchema),
  applications: z.array(JobApplicationSchema),
  analytics: JobAnalyticsSchema,
  status: z.enum(['draft', 'open', 'closed', 'paused', 'archived']),
  posted_at: z.string().optional(),
  updated_at: z.string().optional(),
  expires_at: z.string().optional(),
  tags: z.array(z.string()).optional(),
  company_profile: z.any().optional(), // For integration with company profiles
})
export type JobPosting = z.infer<typeof JobPostingSchema>

// --- Search & Filtering Types ---
export interface JobSearchFilters {
  keyword?: string
  category?: JobCategory
  type?: JobType
  experience_level?: JobExperienceLevel
  location_type?: JobLocationType
  country?: string
  company_id?: string
  status?: 'open' | 'closed' | 'paused' | 'archived'
  min_salary?: number
  max_salary?: number
  skills?: string[]
  tags?: string[]
}

export interface JobSortOption {
  field: 'posted_at' | 'title' | 'company' | 'salary' | 'applications' | 'views'
  direction: 'asc' | 'desc'
}

// --- Export all schemas for use in forms/components ---
export const JobSchemas = {
  JobPostingSchema,
  JobRequirementSchema,
  JobBenefitSchema,
  JobSkillSchema,
  JobLocationSchema,
  CompensationSchema,
  JobAnalyticsSchema,
  JobApplicationSchema,
} 