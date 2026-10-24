import { Family, FamilyMember, FlagType, FlagSeverity } from '../types';

export interface ValidationIssue {
  type: FlagType;
  severity: FlagSeverity;
  reason: string;
  memberId?: string;
}

export class ValidationService {
  /**
   * Performs deterministic quality and consistency checks on a family and its members.
   */
  static validateFamilyRecord(family: Family, members: FamilyMember[] = []): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Required Family Fields
    if (!family.family_head_name || family.family_head_name.trim().length === 0) {
      issues.push({
        type: 'missing_field',
        severity: 'critical',
        reason: 'Head of household name is missing.'
      });
    }

    if (!family.address || family.address.trim().length === 0) {
      issues.push({
        type: 'missing_field',
        severity: 'warning',
        reason: 'Residential address is missing.'
      });
    }

    if (!family.district || family.district.trim().length === 0) {
      issues.push({
        type: 'missing_field',
        severity: 'warning',
        reason: 'District name is missing.'
      });
    }

    if (!family.pincode || family.pincode.trim().length !== 6 || !/^\d{6}$/.test(family.pincode.trim())) {
      issues.push({
        type: 'missing_field',
        severity: 'warning',
        reason: 'Valid 6-digit postal code (PIN code) is missing or incomplete.'
      });
    }

    // 2. Household Financial Consistency
    if (family.annual_household_income === undefined || family.annual_household_income === null) {
      issues.push({
        type: 'missing_field',
        severity: 'warning',
        reason: 'Annual household income is not stated.'
      });
    } else if (family.annual_household_income < 0) {
      issues.push({
        type: 'inconsistent_data',
        severity: 'critical',
        reason: `Annual household income cannot be negative (entered: ₹${family.annual_household_income}).`
      });
    }

    // 3. Family Members Validation
    if (!members || members.length === 0) {
      issues.push({
        type: 'missing_field',
        severity: 'critical',
        reason: 'No family members are listed in this household record.'
      });
      return issues;
    }

    // Identify Household Head in members list
    const headMember = members.find(
      m => m.relationship_to_head.toLowerCase() === 'self' ||
           m.full_name.toLowerCase().trim() === family.family_head_name.toLowerCase().trim()
    );

    if (!headMember) {
      issues.push({
        type: 'inconsistent_data',
        severity: 'warning',
        reason: 'No member is designated with relationship "Self" matching the Head of Household.'
      });
    } else if (headMember.age < 18) {
      issues.push({
        type: 'inconsistent_data',
        severity: 'critical',
        reason: `Head of household (${headMember.full_name}) is listed as ${headMember.age} years old. Head must be at least 18.`,
        memberId: headMember.id
      });
    }

    // Check Member specific logic
    members.forEach(member => {
      // Age sanity
      if (member.age < 0 || member.age > 125) {
        issues.push({
          type: 'inconsistent_data',
          severity: 'critical',
          reason: `Invalid age (${member.age}) recorded for member ${member.full_name}.`,
          memberId: member.id
        });
      }

      // Generational consistency: child cannot be older than head
      if (['son', 'daughter'].includes(member.relationship_to_head.toLowerCase()) && headMember) {
        if (member.age >= headMember.age) {
          issues.push({
            type: 'inconsistent_data',
            severity: 'critical',
            reason: `Age conflict: ${member.relationship_to_head} (${member.full_name}, age ${member.age}) cannot be older than head of household (${headMember.full_name}, age ${headMember.age}).`,
            memberId: member.id
          });
        } else if (headMember.age - member.age < 12) {
          issues.push({
            type: 'inconsistent_data',
            severity: 'warning',
            reason: `Unusual age gap: Only ${headMember.age - member.age} years difference between head of household and ${member.relationship_to_head} (${member.full_name}).`,
            memberId: member.id
          });
        }
      }
    });

    return issues;
  }
}
