
CREATE TABLE IF NOT EXISTS cargo_insurance (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    insurance_policy_number VARCHAR(100) NOT NULL UNIQUE,
    insured_value DECIMAL(15, 2) NOT NULL,
    premium_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    coverage_type VARCHAR(100),
    policy_data JSONB,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    origin_distribution_center_id INTEGER NOT NULL REFERENCES distribution_center(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_distribution_center_id INTEGER NOT NULL REFERENCES distribution_center(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    shipment_type_id INTEGER NOT NULL REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    route_code VARCHAR(50) UNIQUE,
    estimated_duration_hours INTEGER,
    distance_km DECIMAL(10, 2),
    
    is_alternative_route BOOLEAN DEFAULT false,
    main_route_id INTEGER REFERENCES route(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (origin_distribution_center_id != destination_distribution_center_id)
);

CREATE TABLE IF NOT EXISTS route_risk_score (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES route(id) ON DELETE CASCADE ON UPDATE CASCADE,
    origin_country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    risk_level VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5, 2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    minimum_risk_threshold DECIMAL(5, 2) DEFAULT 30,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE route_risk_score
ADD CONSTRAINT check_minimum_risk_threshold
CHECK (risk_score >= minimum_risk_threshold);

CREATE TABLE IF NOT EXISTS cargo_route_assignment (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    route_id INTEGER NOT NULL REFERENCES route(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courier_route_plan (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    route_id INTEGER NOT NULL REFERENCES route(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    plan_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    total_cargo_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS cargo_carbon_data (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    carbon_footprint_value DECIMAL(10, 4) NOT NULL,
    calculation_method VARCHAR(100),
    shipment_type_id INTEGER REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    distance_km DECIMAL(10, 2),
    calculation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cargo_insurance_cargo_id ON cargo_insurance(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_insurance_policy_number ON cargo_insurance(insurance_policy_number);
CREATE INDEX IF NOT EXISTS idx_route_origin_center_id ON route(origin_distribution_center_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_route_destination_center_id ON route(destination_distribution_center_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_route_shipment_type_id ON route(shipment_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_route_risk_score_route_id ON route_risk_score(route_id);
CREATE INDEX IF NOT EXISTS idx_route_risk_score_countries ON route_risk_score(origin_country_id, destination_country_id);
CREATE INDEX IF NOT EXISTS idx_cargo_route_assignment_cargo_id ON cargo_route_assignment(cargo_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cargo_route_assignment_route_id ON cargo_route_assignment(route_id) WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cargo_route_assignment_unique ON cargo_route_assignment(cargo_id, route_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_courier_route_plan_employee_id ON courier_route_plan(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_courier_route_plan_plan_date ON courier_route_plan(plan_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_carbon_data_cargo_id ON cargo_carbon_data(cargo_id);

