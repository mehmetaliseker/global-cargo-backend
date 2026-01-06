
CREATE TABLE IF NOT EXISTS pricing_calculation (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    base_price DECIMAL(15, 2) NOT NULL,
    shipping_cost DECIMAL(15, 2) NOT NULL,
    insurance_cost DECIMAL(15, 2) DEFAULT 0,
    tax_cost DECIMAL(15, 2) DEFAULT 0,
    customs_cost DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    shipment_type_id INTEGER NOT NULL REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    calculation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    calculated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_calculation_detail (
    id SERIAL PRIMARY KEY,
    pricing_calculation_id INTEGER NOT NULL REFERENCES pricing_calculation(id) ON DELETE CASCADE ON UPDATE CASCADE,
    cost_type VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    calculation_factor JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institution_agreement (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    institution_name VARCHAR(200) NOT NULL,
    institution_code VARCHAR(50) UNIQUE,
    discount_percentage DECIMAL(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_active BOOLEAN DEFAULT true,
    auto_apply BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

CREATE TABLE IF NOT EXISTS invoice (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    is_main_invoice BOOLEAN DEFAULT true,
    is_additional_invoice BOOLEAN DEFAULT false,
    invoice_type VARCHAR(50),
    
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    institution_agreement_id INTEGER REFERENCES institution_agreement(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (is_main_invoice != is_additional_invoice OR (is_main_invoice = true AND is_additional_invoice = false))
);

CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    invoice_id INTEGER NOT NULL REFERENCES invoice(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    payment_method_id INTEGER NOT NULL REFERENCES payment_method_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    payment_status_id INTEGER NOT NULL REFERENCES payment_status_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    masked_card_number VARCHAR(19),
    card_last_four VARCHAR(4),
    card_token VARCHAR(255),
    cardholder_name_encrypted BYTEA,
    
    transaction_id VARCHAR(255),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (amount > 0)
);

CREATE TABLE IF NOT EXISTS payment_refund (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payment(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    refund_reason VARCHAR(200) NOT NULL,
    refund_amount DECIMAL(15, 2) NOT NULL,
    refund_status VARCHAR(50) DEFAULT 'pending',
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP WITH TIME ZONE,
    processed_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (refund_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_pricing_calculation_cargo_id ON pricing_calculation(cargo_id);
CREATE INDEX IF NOT EXISTS idx_pricing_calculation_timestamp ON pricing_calculation(calculation_timestamp);
CREATE INDEX IF NOT EXISTS idx_pricing_calculation_detail_pricing_id ON pricing_calculation_detail(pricing_calculation_id);
CREATE INDEX IF NOT EXISTS idx_invoice_cargo_id ON invoice(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_invoice_invoice_number ON invoice(invoice_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_invoice_date ON invoice(invoice_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_invoice_id ON payment(invoice_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_cargo_id ON payment(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_status_id ON payment(payment_status_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_transaction_date ON payment(transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payment_refund_payment_id ON payment_refund(payment_id) WHERE deleted_at IS NULL;

