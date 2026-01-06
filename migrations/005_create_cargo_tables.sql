
CREATE TABLE IF NOT EXISTS cargo (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    delivery_number VARCHAR(50) UNIQUE,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    origin_branch_id INTEGER REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_branch_id INTEGER REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    origin_country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    origin_date TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    
    cargo_type_id INTEGER NOT NULL REFERENCES cargo_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    shipment_type_id INTEGER NOT NULL REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    weight_kg DECIMAL(10, 3) NOT NULL CHECK (weight_kg > 0),
    length_cm DECIMAL(10, 2),
    width_cm DECIMAL(10, 2),
    height_cm DECIMAL(10, 2),
    volumetric_weight_kg DECIMAL(10, 3),
    
    value_declaration DECIMAL(15, 2),
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    current_state_id INTEGER REFERENCES state_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    undelivered_cancel_threshold_hours INTEGER DEFAULT 168,
    is_auto_cancelled BOOLEAN DEFAULT false,
    auto_cancel_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    product_code VARCHAR(100) NOT NULL UNIQUE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_value DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE OR REPLACE FUNCTION check_max_products_per_cargo()
RETURNS TRIGGER AS $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count
    FROM product
    WHERE cargo_id = NEW.cargo_id AND deleted_at IS NULL;
    
    IF product_count > 5 THEN
        RAISE EXCEPTION 'Bir kargoda maksimum 5 ürün olabilir. Mevcut ürün sayısı: %', product_count;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_max_products_per_cargo ON product;

CREATE TRIGGER trigger_check_max_products_per_cargo
    BEFORE INSERT OR UPDATE ON product
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NULL)
    EXECUTE FUNCTION check_max_products_per_cargo();

CREATE TABLE IF NOT EXISTS product_value_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    value DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo_state_history (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    state_id INTEGER NOT NULL REFERENCES state_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    changed_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo_movement_history (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    location_type VARCHAR(50) NOT NULL,
    branch_id INTEGER REFERENCES branch(id) ON DELETE SET NULL ON UPDATE CASCADE,
    distribution_center_id INTEGER REFERENCES distribution_center(id) ON DELETE SET NULL ON UPDATE CASCADE,
    movement_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (location_type = 'branch' AND branch_id IS NOT NULL AND distribution_center_id IS NULL) OR
        (location_type = 'distribution_center' AND distribution_center_id IS NOT NULL AND branch_id IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS cargo_delivery_preference (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    delivery_option_id INTEGER NOT NULL REFERENCES delivery_option_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    preference_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cargo_id, delivery_option_id)
);

CREATE TABLE IF NOT EXISTS cargo_return_request (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    requested_by INTEGER REFERENCES customer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    processed_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    processed_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS cargo_damage_report (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    damage_description TEXT NOT NULL,
    severity VARCHAR(50),
    reported_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reported_by INTEGER REFERENCES customer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    investigated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    investigation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS event_evidence (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_reference_id INTEGER NOT NULL,
    photo_hash VARCHAR(255),
    report_hash VARCHAR(255),
    document_hash VARCHAR(255),
    evidence_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo_event_log (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_id INTEGER,
    location_type VARCHAR(50),
    employee_id INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_cargo_state_history_event_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.event_time := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cargo_state_history_event_time
    BEFORE INSERT ON cargo_state_history
    FOR EACH ROW
    EXECUTE FUNCTION set_cargo_state_history_event_time();

CREATE OR REPLACE FUNCTION set_cargo_event_log_event_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.event_time := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cargo_event_log_event_time
    BEFORE INSERT ON cargo_event_log
    FOR EACH ROW
    EXECUTE FUNCTION set_cargo_event_log_event_time();

CREATE INDEX IF NOT EXISTS idx_cargo_tracking_number ON cargo(tracking_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_delivery_number ON cargo(delivery_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_customer_id ON cargo(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_origin_country_id ON cargo(origin_country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_destination_country_id ON cargo(destination_country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_current_state_id ON cargo(current_state_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_estimated_delivery_date ON cargo(estimated_delivery_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_cargo_id ON product(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_product_code ON product(product_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_state_history_cargo_id ON cargo_state_history(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_state_history_state_id ON cargo_state_history(state_id);
CREATE INDEX IF NOT EXISTS idx_cargo_state_history_event_time ON cargo_state_history(event_time);
CREATE INDEX IF NOT EXISTS idx_cargo_movement_history_cargo_id ON cargo_movement_history(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_movement_history_movement_date ON cargo_movement_history(movement_date);
CREATE INDEX IF NOT EXISTS idx_cargo_event_log_cargo_id ON cargo_event_log(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_event_log_event_time ON cargo_event_log(event_time);

