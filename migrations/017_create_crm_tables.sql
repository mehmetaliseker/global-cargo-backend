

CREATE TABLE IF NOT EXISTS customer_segment (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    segment_code VARCHAR(50) NOT NULL UNIQUE,
    segment_name VARCHAR(200) NOT NULL,
    criteria JSONB,
    priority INTEGER DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS customer_segment_assignment (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    customer_segment_id INTEGER NOT NULL REFERENCES customer_segment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS loyalty_program (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    program_name VARCHAR(200) NOT NULL,
    description TEXT,
    point_conversion_rate DECIMAL(10, 4) NOT NULL,
    tier_levels JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS customer_loyalty_points (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL UNIQUE REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    loyalty_program_id INTEGER NOT NULL REFERENCES loyalty_program(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    total_points DECIMAL(15, 2) DEFAULT 0,
    available_points DECIMAL(15, 2) DEFAULT 0,
    expired_points DECIMAL(15, 2) DEFAULT 0,
    current_tier VARCHAR(50),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_transaction (
    id SERIAL PRIMARY KEY,
    customer_loyalty_points_id INTEGER NOT NULL REFERENCES customer_loyalty_points(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    points_amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    related_entity_type VARCHAR(50),
    related_entity_id INTEGER,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted'))
);

CREATE TABLE IF NOT EXISTS customer_review (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    review_text TEXT,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS review_rating (
    id SERIAL PRIMARY KEY,
    customer_review_id INTEGER NOT NULL REFERENCES customer_review(id) ON DELETE CASCADE ON UPDATE CASCADE,
    rating_type VARCHAR(50) NOT NULL,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_review_id, rating_type)
);

CREATE TABLE IF NOT EXISTS customer_credit_limit (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL UNIQUE REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    credit_limit_amount DECIMAL(15, 2) NOT NULL CHECK (credit_limit_amount >= 0),
    used_amount DECIMAL(15, 2) DEFAULT 0 CHECK (used_amount >= 0),
    available_amount DECIMAL(15, 2) GENERATED ALWAYS AS (credit_limit_amount - used_amount) STORED,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    payment_id INTEGER REFERENCES payment(id) ON DELETE SET NULL ON UPDATE CASCADE,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    payment_method VARCHAR(50),
    status VARCHAR(50),
    late_payment_flag BOOLEAN DEFAULT false,
    days_late INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_note (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    note_text TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general',
    created_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS customer_tag (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    tag_name VARCHAR(100) NOT NULL UNIQUE,
    tag_color VARCHAR(20),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS customer_tag_assignment (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    customer_tag_id INTEGER NOT NULL REFERENCES customer_tag(id) ON DELETE CASCADE ON UPDATE CASCADE,
    assigned_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, customer_tag_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_segment_code ON customer_segment(segment_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_segment_assignment_customer_id ON customer_segment_assignment(customer_id) WHERE deleted_at IS NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_segment_assignment_unique ON customer_segment_assignment(customer_id, customer_segment_id) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_points_customer_id ON customer_loyalty_points(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transaction_customer_points_id ON loyalty_transaction(customer_loyalty_points_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transaction_date ON loyalty_transaction(transaction_date);
CREATE INDEX IF NOT EXISTS idx_customer_review_customer_id ON customer_review(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_review_cargo_id ON customer_review(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_review_rating ON customer_review(overall_rating) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_credit_limit_customer_id ON customer_credit_limit(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_customer_id ON payment_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_date ON payment_history(payment_date);
CREATE INDEX IF NOT EXISTS idx_customer_note_customer_id ON customer_note(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_tag_assignment_customer_id ON customer_tag_assignment(customer_id);

