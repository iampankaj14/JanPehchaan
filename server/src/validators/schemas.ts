import { z } from 'zod';

export const createFamilySchema = z.object({
  family_head_name: z.string().trim().min(2, 'Head of household name must be at least 2 characters'),
  ration_card_category: z.enum(['AAY', 'BPL', 'APL', 'None'] as const).default('None'),
  annual_household_income: z.number().min(0, 'Annual income cannot be negative'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters'),
  district: z.string().trim().min(2, 'District is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'PIN code must be a valid 6-digit number')
});

export const updateFamilySchema = createFamilySchema.partial();

export const createMemberSchema = z.object({
  full_name: z.string().trim().min(2, 'Member name must be at least 2 characters'),
  relationship_to_head: z.string().trim().min(2, 'Relationship to head is required (e.g. Self, Spouse, Son)'),
  age: z.number().int().min(0, 'Age cannot be negative').max(125, 'Age must be 125 or under'),
  gender: z.enum(['Male', 'Female', 'Other'] as const),
  occupation: z.string().trim().default('None'),
  student_status: z.boolean().default(false),
  disability_status: z.boolean().default(false)
});

export const updateMemberSchema = createMemberSchema.partial();

export const updateReviewFlagSchema = z.object({
  status: z.enum(['resolved', 'dismissed'] as const),
  reviewer_notes: z.string().trim().min(5, 'Reviewer notes must provide at least 5 characters of justification')
});
