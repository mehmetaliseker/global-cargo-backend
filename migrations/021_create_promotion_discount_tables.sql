
CREATE TABLE IF NOT EXISTS promotion (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    promotion_code VARCHAR(50) NOT NULL UNIQUE,
    promotion_name VARCHAR(200) NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    min_purchase_amount DECIMAL(15, 2),
    max_discount_amount DECIMAL(15, 2),
    applicable_to_cargo_types JSONB,
    applicable_to_shipment_types JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (discount_type IN ('percentage', 'fixed_amount')),
    CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CHECK (used_count <= COALESCE(usage_limit, 999999999))
);

CREATE TABLE IF NOT EXISTS promotion_code (
    id SERIAL PRIMARY KEY,
    promotion_id INTEGER NOT NULL REFERENCES promotion(id) ON DELETE CASCADE ON UPDATE CASCADE,
    code_value VARCHAR(50) NOT NULL UNIQUE,
    is_single_use BOOLEAN DEFAULT false,
    used_by INTEGER REFERENCES customer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotion_usage (
    id SERIAL PRIMARY KEY,
    promotion_id INTEGER NOT NULL REFERENCES promotion(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    promotion_code_id INTEGER REFERENCES promotion_code(id) ON DELETE SET NULL ON UPDATE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    invoice_id INTEGER REFERENCES invoice(id) ON DELETE SET NULL ON UPDATE CASCADE,
    used_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    discount_applied DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (cargo_id IS NOT NULL OR invoice_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS coupon (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(15, 2) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    usage_limit_per_customer INTEGER DEFAULT 1,
    min_purchase_amount DECIMAL(15, 2),
    applicable_to_cargo_types JSONB,
    applicable_to_shipment_types JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (discount_type IN ('percentage', 'fixed_amount')),
    CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

CREATE TABLE IF NOT EXISTS coupon_redemption (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER NOT NULL REFERENCES coupon(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    invoice_id INTEGER REFERENCES invoice(id) ON DELETE SET NULL ON UPDATE CASCADE,
    redeemed_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    discount_applied DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (cargo_id IS NOT NULL OR invoice_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS seasonal_pricing_rule (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    rule_name VARCHAR(200) NOT NULL,
    season_period_start DATE NOT NULL,
    season_period_end DATE NOT NULL,
    shipment_type_id INTEGER REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    price_multiplier DECIMAL(5, 2) DEFAULT 1.0 CHECK (price_multiplier > 0),
    additional_fee DECIMAL(15, 2) DEFAULT 0,
    applicable_countries JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (season_period_end >= season_period_start)
);

CREATE TABLE IF NOT EXISTS bulk_discount_rule (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    rule_name VARCHAR(200) NOT NULL,
    min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
    discount_percentage DECIMAL(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    applicable_to VARCHAR(50) DEFAULT 'all',
    applicable_customer_segment_ids JSONB,
    applicable_institution_ids JSONB,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CHECK (applicable_to IN ('all', 'customer_segment', 'institution'))
);

CREATE INDEX IF NOT EXISTS idx_promotion_code ON promotion(promotion_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_promotion_valid_dates ON promotion(valid_from, valid_to) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotion_code_value ON promotion_code(code_value) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotion_usage_customer_id ON promotion_usage(customer_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_date ON promotion_usage(used_date);
CREATE INDEX IF NOT EXISTS idx_coupon_code ON coupon(coupon_code) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupon_redemption_customer_id ON coupon_redemption(customer_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_rule_dates ON seasonal_pricing_rule(season_period_start, season_period_end) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bulk_discount_rule_valid_dates ON bulk_discount_rule(valid_from, valid_to) WHERE deleted_at IS NULL;

