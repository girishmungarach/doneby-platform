export type JobListing = {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo: string;
    isVerified: boolean;
    rating: number;
    location: string;
  };
  location: {
    city: string;
    state: string;
    country: string;
    isRemote: boolean;
    isHybrid: boolean;
  };
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  salary: {
    min: number;
    max: number;
    currency: string;
    isPublic: boolean;
  };
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: Date;
  expiresAt: Date;
  applications: number;
  views: number;
  status: 'active' | 'closed' | 'draft';
  surveyId?: string; // For survey-based applications
};

export type JobFilter = {
  search?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    isRemote?: boolean;
    isHybrid?: boolean;
  };
  type?: JobListing['type'][];
  experience?: JobListing['experience'][];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  skills?: string[];
  company?: {
    id?: string;
    isVerified?: boolean;
    minRating?: number;
  };
  postedWithin?: '24h' | '7d' | '30d' | 'all';
  sortBy?: 'relevance' | 'date' | 'salary' | 'rating';
  sortOrder?: 'asc' | 'desc';
};

export type JobAlert = {
  id: string;
  userId: string;
  name: string;
  filters: JobFilter;
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
};

export type SavedJob = {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
  notes?: string;
  status: 'saved' | 'applied' | 'rejected' | 'interviewing' | 'offered';
};

export type JobRecommendation = {
  jobId: string;
  score: number;
  reasons: string[];
  matchPercentage: number;
  skillsMatch: {
    skill: string;
    match: boolean;
  }[];
};

export type JobSearchSuggestion = {
  type: 'job' | 'company' | 'skill' | 'location';
  id: string;
  text: string;
  count?: number;
};

export type JobListingResponse = {
  jobs: JobListing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  filters: JobFilter;
  recommendations?: JobRecommendation[];
}; 