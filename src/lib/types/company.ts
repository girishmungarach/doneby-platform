import { z } from 'zod'

export const CompanySizeSchema = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001+',
])

export const CompanyIndustrySchema = z.enum([
  'technology',
  'healthcare',
  'finance',
  'education',
  'retail',
  'manufacturing',
  'media',
  'non_profit',
  'government',
  'other',
])

export const CompanyVerificationStatusSchema = z.enum([
  'pending',
  'in_progress',
  'verified',
  'rejected',
  'suspended',
])

export const CompanyDocumentSchema = z.object({
  id: z.string(),
  type: z.enum([
    'business_license',
    'tax_certificate',
    'incorporation_document',
    'bank_statement',
    'utility_bill',
    'other',
  ]),
  url: z.string().url(),
  status: z.enum(['pending', 'verified', 'rejected']),
  verified_at: z.string().optional(),
  verified_by: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export const CompanyTeamMemberSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  role: z.enum([
    'admin',
    'hiring_manager',
    'recruiter',
    'interviewer',
    'viewer',
  ]),
  permissions: z.array(z.string()),
  joined_at: z.string(),
  status: z.enum(['active', 'inactive', 'pending']),
})

export const CompanyCultureSchema = z.object({
  values: z.array(z.string()),
  mission: z.string(),
  vision: z.string(),
  benefits: z.array(z.string()),
  perks: z.array(z.string()),
  work_environment: z.string(),
  diversity_initiatives: z.array(z.string()),
})

export const CompanyMetricsSchema = z.object({
  total_hires: z.number(),
  average_time_to_hire: z.number(),
  candidate_satisfaction: z.number(),
  retention_rate: z.number(),
  diversity_metrics: z.record(z.number()),
  hiring_success_rate: z.number(),
})

export const CompanyProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  website: z.string().url(),
  logo_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  size: CompanySizeSchema,
  industry: CompanyIndustrySchema,
  founded_year: z.number(),
  headquarters: z.object({
    city: z.string(),
    country: z.string(),
    address: z.string().optional(),
  }),
  locations: z.array(z.object({
    city: z.string(),
    country: z.string(),
    address: z.string().optional(),
    is_headquarters: z.boolean(),
  })),
  social_links: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
  contact_email: z.string().email(),
  phone: z.string().optional(),
  verification_status: CompanyVerificationStatusSchema,
  verification_documents: z.array(CompanyDocumentSchema),
  team_members: z.array(CompanyTeamMemberSchema),
  culture: CompanyCultureSchema,
  metrics: CompanyMetricsSchema,
  badges: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    awarded_at: z.string(),
    icon: z.string(),
  })),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CompanySize = z.infer<typeof CompanySizeSchema>
export type CompanyIndustry = z.infer<typeof CompanyIndustrySchema>
export type CompanyVerificationStatus = z.infer<typeof CompanyVerificationStatusSchema>
export type CompanyDocument = z.infer<typeof CompanyDocumentSchema>
export type CompanyTeamMember = z.infer<typeof CompanyTeamMemberSchema>
export type CompanyCulture = z.infer<typeof CompanyCultureSchema>
export type CompanyMetrics = z.infer<typeof CompanyMetricsSchema>
export type CompanyProfile = z.infer<typeof CompanyProfileSchema>

export const COMPANY_SIZES: CompanySize[] = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001+',
]

export const COMPANY_INDUSTRIES: CompanyIndustry[] = [
  'technology',
  'healthcare',
  'finance',
  'education',
  'retail',
  'manufacturing',
  'media',
  'non_profit',
  'government',
  'other',
]

export const COMPANY_VERIFICATION_DOCUMENTS = [
  {
    type: 'business_license',
    name: 'Business License',
    description: 'Official business registration document',
    required: true,
  },
  {
    type: 'tax_certificate',
    name: 'Tax Certificate',
    description: 'Tax registration or compliance certificate',
    required: true,
  },
  {
    type: 'incorporation_document',
    name: 'Incorporation Document',
    description: 'Company incorporation or registration document',
    required: true,
  },
  {
    type: 'bank_statement',
    name: 'Bank Statement',
    description: 'Recent bank statement showing business activity',
    required: false,
  },
  {
    type: 'utility_bill',
    name: 'Utility Bill',
    description: 'Recent utility bill showing business address',
    required: false,
  },
]

export const COMPANY_TEAM_ROLES = [
  {
    role: 'admin',
    name: 'Administrator',
    description: 'Full access to company profile and settings',
    permissions: ['manage_company', 'manage_team', 'manage_jobs', 'view_analytics'],
  },
  {
    role: 'hiring_manager',
    name: 'Hiring Manager',
    description: 'Can manage job postings and hiring process',
    permissions: ['manage_jobs', 'manage_candidates', 'view_analytics'],
  },
  {
    role: 'recruiter',
    name: 'Recruiter',
    description: 'Can post jobs and manage candidates',
    permissions: ['post_jobs', 'manage_candidates'],
  },
  {
    role: 'interviewer',
    name: 'Interviewer',
    description: 'Can conduct interviews and provide feedback',
    permissions: ['view_candidates', 'provide_feedback'],
  },
  {
    role: 'viewer',
    name: 'Viewer',
    description: 'Can view company profile and job postings',
    permissions: ['view_company', 'view_jobs'],
  },
] 