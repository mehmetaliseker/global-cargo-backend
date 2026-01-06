
CREATE TABLE IF NOT EXISTS compliance_certificate (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    certificate_type VARCHAR(100) NOT NULL,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    issuing_authority VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    scope JSONB,
    certificate_file_reference VARCHAR(500),
    is_valid BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
);

CREATE TABLE IF NOT EXISTS compliance_audit (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    audit_type VARCHAR(100) NOT NULL,
    audit_date DATE NOT NULL,
    auditor_name VARCHAR(200),
    auditor_organization VARCHAR(200),
    findings JSONB,
    compliance_status VARCHAR(50) NOT NULL,
    action_items JSONB,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (compliance_status IN ('compliant', 'non_compliant', 'partial'))
);

CREATE TABLE IF NOT EXISTS quality_checklist (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    checklist_name VARCHAR(200) NOT NULL,
    checklist_type VARCHAR(100) NOT NULL,
    items JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS quality_check_result (
    id SERIAL PRIMARY KEY,
    quality_checklist_id INTEGER NOT NULL REFERENCES quality_checklist(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    checked_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    check_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    results JSONB NOT NULL,
    pass_status VARCHAR(50) NOT NULL,
    issues_found TEXT,
    corrective_actions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (pass_status IN ('passed', 'failed', 'partial'))
);

CREATE TABLE IF NOT EXISTS business_continuity_plan (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    plan_name VARCHAR(200) NOT NULL,
    plan_version VARCHAR(50) NOT NULL,
    document_reference VARCHAR(500),
    last_reviewed_date DATE,
    next_review_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (next_review_date IS NULL OR next_review_date >= last_reviewed_date)
);

CREATE TABLE IF NOT EXISTS disaster_recovery_test (
    id SERIAL PRIMARY KEY,
    business_continuity_plan_id INTEGER NOT NULL REFERENCES business_continuity_plan(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    test_date DATE NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_results TEXT NOT NULL,
    pass_status VARCHAR(50) NOT NULL,
    issues_found TEXT,
    corrective_actions TEXT,
    next_test_date DATE,
    tested_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (pass_status IN ('passed', 'failed', 'partial')),
    CHECK (next_test_date IS NULL OR next_test_date >= test_date)
);

CREATE INDEX IF NOT EXISTS idx_compliance_certificate_type ON compliance_certificate(certificate_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compliance_certificate_number ON compliance_certificate(certificate_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compliance_certificate_valid ON compliance_certificate(is_valid) WHERE deleted_at IS NULL AND is_valid = true;
CREATE INDEX IF NOT EXISTS idx_compliance_audit_type ON compliance_audit(audit_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compliance_audit_date ON compliance_audit(audit_date);
CREATE INDEX IF NOT EXISTS idx_quality_checklist_type ON quality_checklist(checklist_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_quality_check_result_entity ON quality_check_result(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_quality_check_result_status ON quality_check_result(pass_status);
CREATE INDEX IF NOT EXISTS idx_business_continuity_plan_name ON business_continuity_plan(plan_name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_test_plan_id ON disaster_recovery_test(business_continuity_plan_id);
CREATE INDEX IF NOT EXISTS idx_disaster_recovery_test_date ON disaster_recovery_test(test_date);

