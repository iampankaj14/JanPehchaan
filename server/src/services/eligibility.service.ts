import {
  Family,
  FamilyMember,
  WelfareScheme,
  SchemeEvaluationReport,
  SchemeEvaluationItem
} from '../types';

export class EligibilityService {
  /**
   * Evaluates all schemes against a household and its individual members.
   */
  static evaluateFamilyEligibility(
    family: Family,
    members: FamilyMember[],
    schemes: WelfareScheme[]
  ): SchemeEvaluationReport {
    const householdBenefits: SchemeEvaluationItem[] = [];
    const individualBenefits: SchemeEvaluationItem[] = [];

    // Check if critical household data is missing
    const hasIncome = family.annual_household_income !== undefined && family.annual_household_income >= 0;

    for (const scheme of schemes) {
      if (scheme.target_type === 'household') {
        const item = this.evaluateHouseholdScheme(family, scheme, hasIncome);
        householdBenefits.push(item);
      } else if (scheme.target_type === 'individual') {
        const items = this.evaluateIndividualScheme(family, members, scheme, hasIncome);
        individualBenefits.push(...items);
      }
    }

    return {
      family_id: family.id,
      evaluated_at: new Date().toISOString(),
      disclaimer: 'Eligibility results are guidance based on prototype simulation rules — not an official government approval or entitlement.',
      household_benefits: householdBenefits,
      individual_benefits: individualBenefits
    };
  }

  /**
   * Evaluates schemes meant for the entire household.
   */
  private static evaluateHouseholdScheme(
    family: Family,
    scheme: WelfareScheme,
    hasIncome: boolean
  ): SchemeEvaluationItem {
    const reasons: string[] = [];
    let eligible = true;

    if (!hasIncome) {
      return {
        scheme_id: scheme.id,
        scheme_code: scheme.code,
        scheme_name: scheme.scheme_name,
        department: scheme.department,
        target_type: 'household',
        qualification_status: 'Incomplete Information',
        benefit_summary: scheme.benefit_summary,
        reasons: ['Household income is not provided or invalid. Please update the record.']
      };
    }

    if (scheme.rules && scheme.rules.length > 0) {
      for (const rule of scheme.rules) {
        if (rule.rule_type === 'income_max') {
          const limit = parseFloat(rule.criteria_value);
          if (family.annual_household_income <= limit) {
            reasons.push(`Household annual income (₹${family.annual_household_income.toLocaleString('en-IN')}) is within the ₹${limit.toLocaleString('en-IN')} limit.`);
          } else {
            eligible = false;
            reasons.push(`Household annual income (₹${family.annual_household_income.toLocaleString('en-IN')}) exceeds the ceiling of ₹${limit.toLocaleString('en-IN')}.`);
          }
        } else if (rule.rule_type === 'ration_card_in') {
          const allowed = rule.criteria_value.split(',').map(s => s.trim().toUpperCase());
          if (allowed.includes(family.ration_card_category.toUpperCase())) {
            reasons.push(`Ration card category (${family.ration_card_category}) meets eligible criteria (${allowed.join(', ')}).`);
          } else {
            eligible = false;
            reasons.push(`Current ration card category (${family.ration_card_category}) does not qualify (required: ${allowed.join(' or ')}).`);
          }
        }
      }
    }

    return {
      scheme_id: scheme.id,
      scheme_code: scheme.code,
      scheme_name: scheme.scheme_name,
      department: scheme.department,
      target_type: 'household',
      qualification_status: eligible ? 'May Qualify' : 'Not Eligible',
      benefit_summary: scheme.benefit_summary,
      reasons
    };
  }

  /**
   * Evaluates schemes meant for specific individuals (students, seniors, etc.).
   */
  private static evaluateIndividualScheme(
    family: Family,
    members: FamilyMember[],
    scheme: WelfareScheme,
    hasIncome: boolean
  ): SchemeEvaluationItem[] {
    const results: SchemeEvaluationItem[] = [];

    for (const member of members) {
      const reasons: string[] = [];
      let eligible = true;

      if (!hasIncome) {
        results.push({
          scheme_id: scheme.id,
          scheme_code: scheme.code,
          scheme_name: scheme.scheme_name,
          department: scheme.department,
          target_type: 'individual',
          qualification_status: 'Incomplete Information',
          benefit_summary: scheme.benefit_summary,
          reasons: ['Household income missing or unverified.'],
          matched_member: {
            member_id: member.id,
            member_name: member.full_name,
            relationship: member.relationship_to_head
          }
        });
        continue;
      }

      if (scheme.rules && scheme.rules.length > 0) {
        for (const rule of scheme.rules) {
          if (rule.rule_type === 'student_required') {
            if (member.student_status) {
              reasons.push(`${member.full_name} is currently an actively enrolled student.`);
            } else {
              eligible = false;
              reasons.push(`${member.full_name} is not marked as a student.`);
            }
          } else if (rule.rule_type === 'age_min') {
            const minAge = parseInt(rule.criteria_value, 10);
            if (member.age >= minAge) {
              reasons.push(`Age (${member.age}) satisfies minimum requirement of ${minAge} years.`);
            } else {
              eligible = false;
              reasons.push(`Age (${member.age}) is below minimum requirement of ${minAge} years.`);
            }
          } else if (rule.rule_type === 'age_max') {
            const maxAge = parseInt(rule.criteria_value, 10);
            if (member.age <= maxAge) {
              reasons.push(`Age (${member.age}) is within eligible maximum age of ${maxAge} years.`);
            } else {
              eligible = false;
              reasons.push(`Age (${member.age}) exceeds maximum age limit of ${maxAge} years.`);
            }
          } else if (rule.rule_type === 'disability_required') {
            if (member.disability_status) {
              reasons.push(`${member.full_name} has registered disability status.`);
            } else {
              eligible = false;
              reasons.push(`${member.full_name} is not registered with disability status.`);
            }
          } else if (rule.rule_type === 'income_max') {
            const limit = parseFloat(rule.criteria_value);
            if (family.annual_household_income <= limit) {
              reasons.push(`Family income (₹${family.annual_household_income.toLocaleString('en-IN')}) qualifies under ceiling of ₹${limit.toLocaleString('en-IN')}.`);
            } else {
              eligible = false;
              reasons.push(`Family income exceeds the scheme cap of ₹${limit.toLocaleString('en-IN')}.`);
            }
          }
        }
      }

      // Only present individuals who either qualify or are close (so UI isn't cluttered with 0-match seniors)
      if (eligible || (scheme.code === 'SCHOLARSHIP_POST_MATRIC' && member.student_status) || (scheme.code === 'OLD_AGE_PENSION' && member.age >= 55)) {
        results.push({
          scheme_id: scheme.id,
          scheme_code: scheme.code,
          scheme_name: scheme.scheme_name,
          department: scheme.department,
          target_type: 'individual',
          qualification_status: eligible ? 'May Qualify' : 'Not Eligible',
          benefit_summary: scheme.benefit_summary,
          reasons,
          matched_member: {
            member_id: member.id,
            member_name: member.full_name,
            relationship: member.relationship_to_head
          }
        });
      }
    }

    return results;
  }
}
