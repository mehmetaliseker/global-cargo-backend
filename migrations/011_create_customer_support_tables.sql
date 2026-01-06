
CREATE TABLE IF NOT EXISTS customer_support_request (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    request_type VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    assigned_to INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS customer_support_response (
    id SERIAL PRIMARY KEY,
    support_request_id INTEGER NOT NULL REFERENCES customer_support_request(id) ON DELETE CASCADE ON UPDATE CASCADE,
    employee_id INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    response_content TEXT NOT NULL,
    is_resolution BOOLEAN DEFAULT false,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);


CREATE INDEX IF NOT EXISTS idx_customer_support_request_customer_id ON customer_support_request(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_request_cargo_id ON customer_support_request(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_request_status ON customer_support_request(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_request_priority ON customer_support_request(priority) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_request_assigned_to ON customer_support_request(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_response_support_request_id ON customer_support_response(support_request_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_response_employee_id ON customer_support_response(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_support_response_is_resolution ON customer_support_response(is_resolution) WHERE deleted_at IS NULL;

