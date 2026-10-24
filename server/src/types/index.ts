// JanPehchaan Core TypeScript Types & Models

export type RationCardCategory = 'AAY' | 'BPL' | 'APL' | 'None';
export type TargetType = 'household' | 'individual';
export type FlagType = 'missing_field' | 'possible_duplicate' | 'inconsistent_data';
export type FlagSeverity = 'info' | 'warning' | 'critical';
export type FlagStatus = 'pending' | 'resolved' | 'dismissed';

export interface FamilyMember {
  id: string;
  family_id: string;
  full_name: string;
  relationship_to_head: string; // 'Self', 'Spouse', 'Son', 'Daughter', 'Mother', 'Father', etc.
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  student_status: boolean;
  disability_status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Family {
  id: string;
  family_head_name: string;
  ration_card_category: RationCardCategory;
  annual_household_income: number;
  address: string;
  district: string;
  state: string;
  pincode: string;
  created_at?: string;
  updated_at?: string;
  members?: FamilyMember[];
  review_flags?: ReviewFlag[];
}

export interface SchemeRule {
  id: string;
  scheme_id: string;
  rule_type: 'income_max' | 'ration_card_in' | 'age_min' | 'age_max' | 'student_required' | 'disability_required';
  criteria_key: string;
  operator: '<=' | '>=' | '==' | 'in';
  criteria_value: string;
  explanation_text: string;
}

export interface WelfareScheme {
  id: string;
  code: string;
  scheme_name: string;
  description: string;
  target_type: TargetType;
  department: string;
  benefit_summary: string;
  rules?: SchemeRule[];
}

export interface ReviewFlag {
  id: string;
  family_id: string;
  member_id?: string | null;
  flag_type: FlagType;
  severity: FlagSeverity;
  reason: string;
  status: FlagStatus;
  reviewer_notes?: string | null;
  created_at?: string;
  resolved_at?: string | null;
}

export interface ChangeLog {
  id: string;
  entity_type: 'family' | 'member';
  entity_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  changed_at?: string;
}

// Verification & Evaluation Result Types
export interface DuplicateCandidate {
  matched_family_id: string;
  matched_head_name: string;
  matched_address: string;
  matched_district: string;
  similarity_score: number;
  reason: string;
}

export interface VerificationSummary {
  family_id: string;
  overall_status: 'Valid' | 'Needs Review' | 'Critical Inconsistency';
  missing_fields: string[];
  inconsistencies: string[];
  possible_duplicates: DuplicateCandidate[];
  flags_created: number;
  disclaimer: string;
}

export interface SchemeMatchReason {
  condition: string;
  satisfied: boolean;
  explanation: string;
}

export interface SchemeEvaluationItem {
  scheme_id: string;
  scheme_code: string;
  scheme_name: string;
  department: string;
  target_type: TargetType;
  qualification_status: 'May Qualify' | 'Not Eligible' | 'Incomplete Information';
  benefit_summary: string;
  reasons: string[];
  matched_member?: {
    member_id: string;
    member_name: string;
    relationship: string;
  };
}

export interface SchemeEvaluationReport {
  family_id: string;
  evaluated_at: string;
  disclaimer: string;
  household_benefits: SchemeEvaluationItem[];
  individual_benefits: SchemeEvaluationItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

// User & Role Types (from Version 2)
export type UserRole = 'ADMIN' | 'OFFICER' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  created_at?: string;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'FLAGGED_DUPLICATE'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISBURSED';

export interface Application {
  id: string;
  referenceNo: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  householdId?: string | null;
  householdHeadName?: string | null;
  notes?: string | null;
  status: ApplicationStatus;
  duplicateFlag: boolean;
  duplicateReason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  citizens: number;
  households: number;
  schemes: number;
  applications: number;
  flagged: number;
  pending: number;
}

