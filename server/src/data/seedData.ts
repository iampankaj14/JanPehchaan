import { Family, FamilyMember, WelfareScheme, ReviewFlag } from '../types';

export const initialFamilies: Family[] = [
  {
    id: 'fam_demo_101',
    family_head_name: 'Ramesh Kumar Sharma',
    ration_card_category: 'BPL',
    annual_household_income: 95000,
    address: 'House 42, Ward 3, Gandhi Nagar',
    district: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302015',
    created_at: '2026-10-20T09:00:00Z',
    updated_at: '2026-10-20T09:00:00Z',
  },
  {
    id: 'fam_demo_102',
    family_head_name: 'Rajesh Devi',
    ration_card_category: 'None',
    annual_household_income: -5000, // Intentional inconsistency for testing
    address: 'Plot 18, Near Temple',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '', // Intentional missing field
    created_at: '2026-10-21T10:30:00Z',
    updated_at: '2026-10-21T10:30:00Z',
  },
  {
    id: 'fam_demo_103',
    family_head_name: 'Ramesh K Sharma', // Similar to fam_demo_101
    ration_card_category: 'BPL',
    annual_household_income: 92000,
    address: 'House 44, Ward 5, Gandhi Nagar',
    district: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302015',
    created_at: '2026-10-22T14:15:00Z',
    updated_at: '2026-10-22T14:15:00Z',
  }
];

export const initialMembers: FamilyMember[] = [
  // Members for Family 101 (Ramesh Kumar Sharma)
  {
    id: 'mem_101_1',
    family_id: 'fam_demo_101',
    full_name: 'Ramesh Kumar Sharma',
    relationship_to_head: 'Self',
    age: 48,
    gender: 'Male',
    occupation: 'Carpenter',
    student_status: false,
    disability_status: false,
    created_at: '2026-10-20T09:00:00Z'
  },
  {
    id: 'mem_101_2',
    family_id: 'fam_demo_101',
    full_name: 'Sunita Sharma',
    relationship_to_head: 'Spouse',
    age: 44,
    gender: 'Female',
    occupation: 'Homemaker',
    student_status: false,
    disability_status: false,
    created_at: '2026-10-20T09:00:00Z'
  },
  {
    id: 'mem_101_3',
    family_id: 'fam_demo_101',
    full_name: 'Rohan Sharma',
    relationship_to_head: 'Son',
    age: 19,
    gender: 'Male',
    occupation: 'College Student',
    student_status: true,
    disability_status: false,
    created_at: '2026-10-20T09:00:00Z'
  },
  {
    id: 'mem_101_4',
    family_id: 'fam_demo_101',
    full_name: 'Priya Sharma',
    relationship_to_head: 'Daughter',
    age: 16,
    gender: 'Female',
    occupation: 'High School Student',
    student_status: true,
    disability_status: false,
    created_at: '2026-10-20T09:00:00Z'
  },

  // Members for Family 102 (Discrepancy Demo)
  {
    id: 'mem_102_1',
    family_id: 'fam_demo_102',
    full_name: 'Rajesh Devi',
    relationship_to_head: 'Self',
    age: 22,
    gender: 'Female',
    occupation: 'Daily Wage',
    student_status: false,
    disability_status: false,
    created_at: '2026-10-21T10:30:00Z'
  },
  {
    id: 'mem_102_2',
    family_id: 'fam_demo_102',
    full_name: 'Ankit Kumar',
    relationship_to_head: 'Son',
    age: 28, // Son older than mother - inconsistency!
    gender: 'Male',
    occupation: 'Unemployed',
    student_status: false,
    disability_status: false,
    created_at: '2026-10-21T10:30:00Z'
  },

  // Members for Family 103 (Possible duplicate demo)
  {
    id: 'mem_103_1',
    family_id: 'fam_demo_103',
    full_name: 'Ramesh K Sharma',
    relationship_to_head: 'Self',
    age: 49,
    gender: 'Male',
    occupation: 'Carpenter',
    student_status: false,
    disability_status: false,
    created_at: '2026-10-22T14:15:00Z'
  }
];

export const initialSchemes: WelfareScheme[] = [
  {
    id: 'sch_nfsa_ration',
    code: 'NFSA_RATION',
    scheme_name: 'National Food Security Card (Sample)',
    description: 'Subsidised food grains for eligible low-income and vulnerable households.',
    target_type: 'household',
    department: 'Department of Food and Public Distribution',
    benefit_summary: 'Monthly subsidised food grains (wheat/rice) for the entire household.',
    rules: [
      {
        id: 'rule_nfsa_1',
        scheme_id: 'sch_nfsa_ration',
        rule_type: 'income_max',
        criteria_key: 'annual_household_income',
        operator: '<=',
        criteria_value: '120000',
        explanation_text: 'Household annual income must not exceed ₹1,20,000'
      },
      {
        id: 'rule_nfsa_2',
        scheme_id: 'sch_nfsa_ration',
        rule_type: 'ration_card_in',
        criteria_key: 'ration_card_category',
        operator: 'in',
        criteria_value: 'AAY,BPL',
        explanation_text: 'Household must be categorized under BPL or AAY'
      }
    ]
  },
  {
    id: 'sch_pmay_housing',
    code: 'PMAY_HOUSING',
    scheme_name: 'Affordable Housing Grant (Sample)',
    description: 'Financial assistance to low-income families for pucca house construction.',
    target_type: 'household',
    department: 'Ministry of Housing and Urban Affairs',
    benefit_summary: 'Direct financial subsidy of up to ₹1,50,000 for house construction.',
    rules: [
      {
        id: 'rule_pmay_1',
        scheme_id: 'sch_pmay_housing',
        rule_type: 'income_max',
        criteria_key: 'annual_household_income',
        operator: '<=',
        criteria_value: '180000',
        explanation_text: 'Household income must be under ₹1,80,000 per year'
      }
    ]
  },
  {
    id: 'sch_post_matric_scholarship',
    code: 'SCHOLARSHIP_POST_MATRIC',
    scheme_name: 'Post-Matric Higher Education Scholarship (Sample)',
    description: 'Financial aid for students pursuing college or vocational training.',
    target_type: 'individual',
    department: 'Ministry of Social Justice and Empowerment',
    benefit_summary: 'Annual reimbursement of tuition fees and monthly maintenance stipend.',
    rules: [
      {
        id: 'rule_schol_1',
        scheme_id: 'sch_post_matric_scholarship',
        rule_type: 'student_required',
        criteria_key: 'student_status',
        operator: '==',
        criteria_value: 'true',
        explanation_text: 'Applicant must be an actively enrolled student'
      },
      {
        id: 'rule_schol_2',
        scheme_id: 'sch_post_matric_scholarship',
        rule_type: 'age_min',
        criteria_key: 'age',
        operator: '>=',
        criteria_value: '16',
        explanation_text: 'Minimum student age is 16 years'
      },
      {
        id: 'rule_schol_3',
        scheme_id: 'sch_post_matric_scholarship',
        rule_type: 'age_max',
        criteria_key: 'age',
        operator: '<=',
        criteria_value: '25',
        explanation_text: 'Maximum student age is 25 years'
      },
      {
        id: 'rule_schol_4',
        scheme_id: 'sch_post_matric_scholarship',
        rule_type: 'income_max',
        criteria_key: 'annual_household_income',
        operator: '<=',
        criteria_value: '250000',
        explanation_text: 'Family income ceiling is ₹2,50,000 per year'
      }
    ]
  },
  {
    id: 'sch_senior_pension',
    code: 'OLD_AGE_PENSION',
    scheme_name: 'Senior Citizen Social Security Pension (Sample)',
    description: 'Monthly pension for senior citizens from low-income families.',
    target_type: 'individual',
    department: 'Department of Social Welfare',
    benefit_summary: 'Monthly direct benefit transfer of ₹1,000 to the senior citizen.',
    rules: [
      {
        id: 'rule_pen_1',
        scheme_id: 'sch_senior_pension',
        rule_type: 'age_min',
        criteria_key: 'age',
        operator: '>=',
        criteria_value: '60',
        explanation_text: 'Individual must be 60 years of age or older'
      },
      {
        id: 'rule_pen_2',
        scheme_id: 'sch_senior_pension',
        rule_type: 'income_max',
        criteria_key: 'annual_household_income',
        operator: '<=',
        criteria_value: '100000',
        explanation_text: 'Household annual income must not exceed ₹1,00,000'
      }
    ]
  }
];

export const initialReviewFlags: ReviewFlag[] = [
  {
    id: 'flag_demo_1',
    family_id: 'fam_demo_103',
    flag_type: 'possible_duplicate',
    severity: 'warning',
    reason: 'Possible duplicate detected: Head name "Ramesh K Sharma" closely matches "Ramesh Kumar Sharma" in same district (Jaipur, Pincode 302015).',
    status: 'pending',
    reviewer_notes: null,
    created_at: '2026-10-22T14:15:00Z'
  }
];
