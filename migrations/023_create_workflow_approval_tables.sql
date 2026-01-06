
CREATE TABLE IF NOT EXISTS workflow_definition (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    workflow_name VARCHAR(200) NOT NULL,
    workflow_code VARCHAR(50) NOT NULL UNIQUE,
    workflow_type VARCHAR(100) NOT NULL,
    steps JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS workflow_instance (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    workflow_definition_id INTEGER NOT NULL REFERENCES workflow_definition(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_step (
    id SERIAL PRIMARY KEY,
    workflow_definition_id INTEGER NOT NULL REFERENCES workflow_definition(id) ON DELETE CASCADE ON UPDATE CASCADE,
    step_order INTEGER NOT NULL,
    step_name VARCHAR(200) NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    required_role_id INTEGER REFERENCES role(id) ON DELETE SET NULL ON UPDATE CASCADE,
    required_permission_code VARCHAR(100),
    auto_approve_condition JSONB,
    timeout_hours INTEGER,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workflow_definition_id, step_order)
);

CREATE TABLE IF NOT EXISTS approval_chain (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    chain_name VARCHAR(200) NOT NULL,
    chain_code VARCHAR(50) NOT NULL UNIQUE,
    entity_type VARCHAR(100) NOT NULL,
    approval_levels JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS approval_request (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    approval_chain_id INTEGER NOT NULL REFERENCES approval_chain(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    requested_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    current_level INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS approval_history (
    id SERIAL PRIMARY KEY,
    approval_request_id INTEGER NOT NULL REFERENCES approval_request(id) ON DELETE CASCADE ON UPDATE CASCADE,
    approver_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    approval_level INTEGER NOT NULL,
    decision VARCHAR(50) NOT NULL,
    decision_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (decision IN ('approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_workflow_definition_code ON workflow_definition(workflow_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workflow_definition_type ON workflow_definition(workflow_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_workflow_instance_entity ON workflow_instance(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instance_status ON workflow_instance(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_workflow_step_definition_id ON workflow_step(workflow_definition_id);
CREATE INDEX IF NOT EXISTS idx_approval_chain_code ON approval_chain(chain_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_approval_request_entity ON approval_request(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_approval_request_status ON approval_request(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_approval_history_request_id ON approval_history(approval_request_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_approver_id ON approval_history(approver_id);

