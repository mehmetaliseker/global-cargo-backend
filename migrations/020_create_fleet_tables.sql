
CREATE TABLE IF NOT EXISTS vehicle_type (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(50) NOT NULL UNIQUE,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    default_capacity_weight_kg DECIMAL(15, 2),
    default_capacity_volume_cubic_meter DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    vehicle_code VARCHAR(50) NOT NULL UNIQUE,
    license_plate VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type_id INTEGER REFERENCES vehicle_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    vehicle_type_override VARCHAR(50),
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    capacity_weight_kg DECIMAL(15, 2),
    capacity_volume_cubic_meter DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT true,
    is_in_use BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (year >= 1900 AND year <= 2100)
);

CREATE TABLE IF NOT EXISTS vehicle_maintenance (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    maintenance_date DATE NOT NULL,
    next_maintenance_date DATE,
    cost DECIMAL(15, 2),
    description TEXT,
    service_provider VARCHAR(200),
    odometer_reading INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (next_maintenance_date IS NULL OR next_maintenance_date >= maintenance_date)
);

CREATE TABLE IF NOT EXISTS vehicle_cargo_assignment (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    route_id INTEGER REFERENCES route(id) ON DELETE SET NULL ON UPDATE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    loaded_date TIMESTAMP WITH TIME ZONE,
    unloaded_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (loaded_date IS NULL OR loaded_date >= assigned_date),
    CHECK (unloaded_date IS NULL OR unloaded_date >= loaded_date)
);

CREATE TABLE IF NOT EXISTS vehicle_route (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    route_id INTEGER NOT NULL REFERENCES route(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    driver_id INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    actual_departure TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_location_history (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE ON UPDATE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    speed_kmh DECIMAL(10, 2),
    direction_degrees DECIMAL(5, 2),
    gps_accuracy_meters DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_fuel_log (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    fuel_type VARCHAR(50) NOT NULL,
    fuel_amount_liters DECIMAL(10, 3) NOT NULL CHECK (fuel_amount_liters > 0),
    cost DECIMAL(15, 2) NOT NULL,
    odometer_reading INTEGER,
    refuel_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    refuel_location VARCHAR(200),
    refueled_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_cost (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicle(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cost_type VARCHAR(50) NOT NULL,
    cost_amount DECIMAL(15, 2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (period_end IS NULL OR period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_type_code ON vehicle_type(type_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicle_code ON vehicle(vehicle_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicle_license_plate ON vehicle(license_plate) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehicle_is_in_use ON vehicle(is_in_use) WHERE deleted_at IS NULL AND is_in_use = true;
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_vehicle_id ON vehicle_maintenance(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_next_date ON vehicle_maintenance(next_maintenance_date) WHERE next_maintenance_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vehicle_cargo_assignment_vehicle_id ON vehicle_cargo_assignment(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_cargo_assignment_cargo_id ON vehicle_cargo_assignment(cargo_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_route_vehicle_id ON vehicle_route(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_route_status ON vehicle_route(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_location_history_vehicle_id ON vehicle_location_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_location_history_timestamp ON vehicle_location_history(location_timestamp);
CREATE INDEX IF NOT EXISTS idx_vehicle_fuel_log_vehicle_id ON vehicle_fuel_log(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_fuel_log_date ON vehicle_fuel_log(refuel_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_cost_vehicle_id ON vehicle_cost(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_cost_period ON vehicle_cost(period_start, period_end);

