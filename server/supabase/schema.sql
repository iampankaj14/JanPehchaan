-- JanPehchaan PostgreSQL Schema for Supabase
-- Hackathon Prototype Schema (Synthetic / Non-sensitive data)

-- 1. Families Table (Household level unit)
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_head_name TEXT NOT NULL,
    ration_card_category TEXT NOT NULL DEFAULT 'None', -- 'AAY', 'BPL', 'APL', 'None'
    annual_household_income NUMERIC NOT NULL DEFAULT 0,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Family Members Table (Individual level)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relationship_to_head TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    occupation TEXT NOT NULL DEFAULT 'None',
    student_status BOOLEAN NOT NULL DEFAULT false,
    disability_status BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Welfare Schemes Catalog
CREATE TABLE IF NOT EXISTS welfare_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    scheme_name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('household', 'individual')),
    department TEXT NOT NULL,
    benefit_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Scheme Eligibility Rules (Deterministic criteria)
CREATE TABLE IF NOT EXISTS scheme_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES welfare_schemes(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL,
    criteria_key TEXT NOT NULL,
    operator TEXT NOT NULL,
    criteria_value TEXT NOT NULL,
    explanation_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Review Flags (Records requiring frontline human attention)
CREATE TABLE IF NOT EXISTS review_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('missing_field', 'possible_duplicate', 'inconsistent_data')),
    severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 6. Change Logs (Audit trail for edits)
CREATE TABLE IF NOT EXISTS change_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('family', 'member')),
    entity_id UUID NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT NOT NULL DEFAULT 'Authorised Reviewer',
    changed_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_review_flags_family_id ON review_flags(family_id);
CREATE INDEX IF NOT EXISTS idx_review_flags_status ON review_flags(status);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_scheme_id ON scheme_rules(scheme_id);
