
CREATE TABLE IF NOT EXISTS partner_commission (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    commission_type VARCHAR(50) NOT NULL,
    commission_rate DECIMAL(10, 4) NOT NULL,
    applicable_to_cargo_types JSONB,
    applicable_to_shipment_types JSONB,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (commission_type IN ('percentage', 'fixed_amount')),
    CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

CREATE TABLE IF NOT EXISTS commission_calculation (
    id SERIAL PRIMARY KEY,
    partner_commission_id INTEGER NOT NULL REFERENCES partner_commission(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    base_amount DECIMAL(15, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commission_payment (
    id SERIAL PRIMARY KEY,
    commission_calculation_id INTEGER NOT NULL REFERENCES commission_calculation(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    payment_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_performance (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    performance_period VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    kpi_data JSONB NOT NULL,
    score DECIMAL(5, 2) CHECK (score >= 0 AND score <= 100),
    rating VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (performance_period IN ('month', 'quarter', 'year')),
    CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS partner_kpi (
    id SERIAL PRIMARY KEY,
    partner_performance_id INTEGER NOT NULL REFERENCES partner_performance(id) ON DELETE CASCADE ON UPDATE CASCADE,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_value DECIMAL(15, 4) NOT NULL,
    target_value DECIMAL(15, 4),
    achievement_percentage DECIMAL(5, 2),
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_agreement (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    agreement_type VARCHAR(100) NOT NULL,
    agreement_number VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    terms JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS sla_tracking (
    id SERIAL PRIMARY KEY,
    partner_agreement_id INTEGER NOT NULL REFERENCES partner_agreement(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sla_metric_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(15, 4) NOT NULL,
    actual_value DECIMAL(15, 4),
    measurement_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'compliant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sla_breach (
    id SERIAL PRIMARY KEY,
    sla_tracking_id INTEGER NOT NULL REFERENCES sla_tracking(id) ON DELETE CASCADE ON UPDATE CASCADE,
    breach_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    breach_severity VARCHAR(50) DEFAULT 'minor',
    breach_description TEXT NOT NULL,
    resolution_action TEXT,
    resolved_date TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (breach_severity IN ('minor', 'major', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_partner_commission_partner_id ON partner_commission(partner_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_partner_commission_valid_dates ON partner_commission(valid_from, valid_to) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_commission_calculation_partner_commission_id ON commission_calculation(partner_commission_id);
CREATE INDEX IF NOT EXISTS idx_commission_calculation_cargo_id ON commission_calculation(cargo_id);
CREATE INDEX IF NOT EXISTS idx_commission_payment_calculation_id ON commission_payment(commission_calculation_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_partner_id ON partner_performance(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_performance_period ON partner_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_partner_kpi_performance_id ON partner_kpi(partner_performance_id);
CREATE INDEX IF NOT EXISTS idx_partner_agreement_partner_id ON partner_agreement(partner_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_partner_agreement_number ON partner_agreement(agreement_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sla_tracking_agreement_id ON sla_tracking(partner_agreement_id);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_status ON sla_tracking(status);
CREATE INDEX IF NOT EXISTS idx_sla_breach_severity ON sla_breach(breach_severity);

