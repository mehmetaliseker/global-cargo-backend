
CREATE TABLE IF NOT EXISTS cold_chain_cargo (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    required_temperature_min DECIMAL(5, 2) NOT NULL,
    required_temperature_max DECIMAL(5, 2) NOT NULL,
    temperature_unit VARCHAR(10) DEFAULT 'celsius',
    cold_chain_type VARCHAR(50) NOT NULL,
    monitoring_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (required_temperature_max >= required_temperature_min),
    CHECK (temperature_unit IN ('celsius', 'fahrenheit')),
    CHECK (cold_chain_type IN ('frozen', 'refrigerated', 'chilled'))
);

CREATE TABLE IF NOT EXISTS temperature_log (
    id SERIAL PRIMARY KEY,
    cold_chain_cargo_id INTEGER NOT NULL REFERENCES cold_chain_cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    temperature_value DECIMAL(5, 2) NOT NULL,
    measurement_location VARCHAR(100),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recorded_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    sensor_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS temperature_alert (
    id SERIAL PRIMARY KEY,
    temperature_log_id INTEGER NOT NULL REFERENCES temperature_log(id) ON DELETE CASCADE ON UPDATE CASCADE,
    cold_chain_cargo_id INTEGER NOT NULL REFERENCES cold_chain_cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    threshold_exceeded_by DECIMAL(5, 2) NOT NULL,
    alert_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (alert_type IN ('too_high', 'too_low'))
);

CREATE TABLE IF NOT EXISTS delivery_time_slot (
    id SERIAL PRIMARY KEY,
    time_slot_code VARCHAR(50) NOT NULL UNIQUE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
    available_slots INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS time_slot_booking (
    id SERIAL PRIMARY KEY,
    delivery_time_slot_id INTEGER NOT NULL REFERENCES delivery_time_slot(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    booking_date DATE NOT NULL,
    booked_time_slot TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'booked',
    customer_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS special_packaging_requirement (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    packaging_type_id INTEGER REFERENCES packaging_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    requirement_description TEXT NOT NULL,
    is_fulfilled BOOLEAN DEFAULT false,
    fulfilled_date TIMESTAMP WITH TIME ZONE,
    fulfilled_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hazardous_material_detail (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    hazard_class VARCHAR(50) NOT NULL,
    un_number VARCHAR(10),
    packing_group VARCHAR(10),
    proper_shipping_name TEXT NOT NULL,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(50),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hazmat_certificate (
    id SERIAL PRIMARY KEY,
    hazardous_material_detail_id INTEGER NOT NULL REFERENCES hazardous_material_detail(id) ON DELETE CASCADE ON UPDATE CASCADE,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    issuing_authority VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certificate_file_reference VARCHAR(500),
    is_valid BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
);

CREATE INDEX IF NOT EXISTS idx_cold_chain_cargo_cargo_id ON cold_chain_cargo(cargo_id);
CREATE INDEX IF NOT EXISTS idx_temperature_log_cargo_id ON temperature_log(cold_chain_cargo_id);
CREATE INDEX IF NOT EXISTS idx_temperature_log_recorded_at ON temperature_log(recorded_at);
CREATE INDEX IF NOT EXISTS idx_temperature_alert_status ON temperature_alert(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_delivery_time_slot_code ON delivery_time_slot(time_slot_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_time_slot_booking_cargo_id ON time_slot_booking(cargo_id);
CREATE INDEX IF NOT EXISTS idx_time_slot_booking_date ON time_slot_booking(booking_date);
CREATE INDEX IF NOT EXISTS idx_special_packaging_requirement_cargo_id ON special_packaging_requirement(cargo_id);
CREATE INDEX IF NOT EXISTS idx_hazardous_material_detail_cargo_id ON hazardous_material_detail(cargo_id);
CREATE INDEX IF NOT EXISTS idx_hazmat_certificate_un_number ON hazmat_certificate(certificate_number);
CREATE INDEX IF NOT EXISTS idx_hazmat_certificate_valid ON hazmat_certificate(is_valid) WHERE is_valid = true;

