import { Database } from '@/lib/database.types';
import { Verification } from './verification';

export type UserRole = 'user' | 'admin';
export type TimelineEntryType = 'work' | 'education' | 'project' | 'achievement';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  linkedin: string | null;
  website: string | null;
  role: UserRole;
  is_profile_completed: boolean;
  is_public: boolean;
  verification_score: number;
  trust_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  created_at: string;
}

export interface ProfileSkill {
  id: string;
  profile_id: string;
  skill_id: string;
  level: SkillLevel;
  endorsement_count: number;
  created_at: string;
  updated_at: string;
  skill?: Skill;
}

export interface TimelineEntry {
  id: string;
  profile_id: string;
  type: TimelineEntryType;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  organization: string | null;
  url: string | null;
  metadata: Record<string, any>;
  verification_status: VerificationStatus;
  verification_count: number;
  created_at: string;
  updated_at: string;
  skills?: ProfileSkill[];
}

export interface Verification {
  id: string;
  timeline_entry_id: string;
  verifier_id: string;
  status: VerificationStatus;
  comment: string | null;
  evidence_url: string | null;
  created_at: string;
  updated_at: string;
  verifier?: Profile;
}

export interface Connection {
  id: string;
  profile_id: string;
  connected_profile_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  connected_profile?: Profile;
}

export interface Achievement {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  date: string;
  issuer: string | null;
  credential_url: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: string;
  profile_id: string;
  name: string;
  value: number;
  unit: string | null;
  date: string;
  source: string | null;
  created_at: string;
}

export interface FileEntry {
  id: string;
  timeline_entry_id: string;
  profile_id: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface ProfileWithDetails extends Profile {
  skills?: ProfileSkill[];
  timeline_entries?: TimelineEntry[];
  achievements?: Achievement[];
  metrics?: Metric[];
  connections?: Connection[];
  files?: FileEntry[];
}

export interface TrustMetrics {
  verification_score: number;
  endorsement_count: number;
  connection_count: number;
  achievement_count: number;
  verified_entries_count: number;
  last_verified_at: string | null;
}

export interface ProfileStats {
  total_skills: number;
  total_endorsements: number;
  total_connections: number;
  total_achievements: number;
  total_verified_entries: number;
  verification_rate: number;
  average_skill_level: number;
}

export type ProfileFormData = {
  username?: string;
  full_name: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  cover_image_url?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  is_public?: boolean;
};

export type TimelineEntryFormData = {
  type: TimelineEntryType;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  organization?: string;
  url?: string;
  skills?: string[];
  files?: File[];
};

export type AchievementFormData = {
  title: string;
  description?: string;
  date: string;
  issuer?: string;
  credential_url?: string;
};

export type MetricFormData = {
  name: string;
  value: number;
  unit?: string;
  date: string;
  source?: string;
};

export interface ProfileWithVerifications extends Profile {
  verifications: Verification[];
  verified_timeline_entries: number;
  verification_success_rate: number;
  average_verification_time: number;
}

export interface ProfileFilters {
  role?: Profile['role'];
  organization_id?: string;
  is_verified?: boolean;
  has_verifications?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface ProfileSort {
  field: 'created_at' | 'updated_at' | 'verified_timeline_entries' | 'verification_success_rate';
  direction: 'asc' | 'desc';
}

export interface ProfilePagination {
  page: number;
  page_size: number;
  total: number;
}

export interface ProfileResponse {
  data: ProfileWithVerifications[];
  stats: ProfileStats;
  pagination: ProfilePagination;
}

export interface ProfileVerificationSummary {
  total_verifications: number;
  pending_verifications: number;
  approved_verifications: number;
  rejected_verifications: number;
  verification_success_rate: number;
  average_verification_time: number;
  recent_verifications: Verification[];
} 