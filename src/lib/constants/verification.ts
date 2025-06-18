export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const

export const EVIDENCE_TYPES = {
  DOCUMENT: 'document',
  TESTIMONIAL: 'testimonial',
  CERTIFICATION: 'certification',
  OTHER: 'other',
} as const

export const VERIFICATION_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  APPEALED: 'appealed',
} as const

export const VERIFICATION_SORT_FIELDS = {
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  VERIFIED_AT: 'verified_at',
  STATUS: 'status',
} as const

export const VERIFICATION_SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

export const VERIFICATION_REJECTION_REASONS = {
  INSUFFICIENT_EVIDENCE: 'Insufficient evidence provided',
  EVIDENCE_EXPIRED: 'Evidence has expired',
  EVIDENCE_INVALID: 'Evidence appears to be invalid',
  SUSPICIOUS_ACTIVITY: 'Suspicious activity detected',
  OTHER: 'Other reason',
} as const

export const VERIFICATION_METADATA_KEYS = {
  EVIDENCE_EXPIRY: 'evidence_expiry',
  VERIFICATION_METHOD: 'verification_method',
  VERIFICATION_SOURCE: 'verification_source',
  VERIFICATION_NOTES: 'verification_notes',
  APPEAL_STATUS: 'appeal_status',
  APPEAL_REASON: 'appeal_reason',
} as const

export const VERIFICATION_ERROR_MESSAGES = {
  INVALID_STATUS: 'Invalid verification status',
  INVALID_EVIDENCE_TYPE: 'Invalid evidence type',
  INVALID_ACTION: 'Invalid verification action',
  INVALID_SORT_FIELD: 'Invalid sort field',
  INVALID_SORT_DIRECTION: 'Invalid sort direction',
  INVALID_PAGE_SIZE: 'Invalid page size',
  INVALID_REJECTION_REASON: 'Invalid rejection reason',
  VERIFICATION_NOT_FOUND: 'Verification not found',
  EVIDENCE_NOT_FOUND: 'Evidence not found',
  AUDIT_LOG_NOT_FOUND: 'Audit log not found',
  UNAUTHORIZED: 'Unauthorized to perform this action',
  INVALID_VERIFICATION_REQUEST: 'Invalid verification request',
} as const

export const VERIFICATION_SUCCESS_MESSAGES = {
  VERIFICATION_CREATED: 'Verification request created successfully',
  VERIFICATION_UPDATED: 'Verification status updated successfully',
  EVIDENCE_ADDED: 'Evidence added successfully',
  AUDIT_LOG_ADDED: 'Audit log added successfully',
  VERIFICATION_APPROVED: 'Verification approved successfully',
  VERIFICATION_REJECTED: 'Verification rejected successfully',
  VERIFICATION_APPEALED: 'Verification appeal submitted successfully',
} as const 