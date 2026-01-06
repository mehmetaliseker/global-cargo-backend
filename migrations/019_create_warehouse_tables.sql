
CREATE TABLE IF NOT EXISTS warehouse (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    warehouse_code VARCHAR(50) NOT NULL UNIQUE,
    warehouse_name VARCHAR(200) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    city_id INTEGER REFERENCES city(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity_volume_cubic_meter DECIMAL(15, 2),
    capacity_weight_kg DECIMAL(15, 2),
    current_utilization_percentage DECIMAL(5, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS warehouse_location (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE ON UPDATE CASCADE,
    location_code VARCHAR(50) NOT NULL,
    location_type VARCHAR(50),
    coordinates_x DECIMAL(10, 2),
    coordinates_y DECIMAL(10, 2),
    coordinates_z DECIMAL(10, 2),
    capacity_volume DECIMAL(15, 2),
    capacity_weight DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS warehouse_capacity (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE ON UPDATE CASCADE,
    capacity_type VARCHAR(50) NOT NULL,
    max_capacity DECIMAL(15, 2) NOT NULL,
    current_usage DECIMAL(15, 2) DEFAULT 0,
    alert_threshold_percentage DECIMAL(5, 2) DEFAULT 80,
    measurement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (capacity_type IN ('volume', 'weight', 'area'))
);

CREATE TABLE IF NOT EXISTS container (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    container_code VARCHAR(50) NOT NULL UNIQUE,
    container_type VARCHAR(50),
    warehouse_id INTEGER REFERENCES warehouse(id) ON DELETE SET NULL ON UPDATE CASCADE,
    dimensions_length_cm DECIMAL(10, 2),
    dimensions_width_cm DECIMAL(10, 2),
    dimensions_height_cm DECIMAL(10, 2),
    weight_capacity_kg DECIMAL(15, 2),
    volume_capacity_cubic_meter DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT true,
    is_in_use BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS container_cargo_assignment (
    id SERIAL PRIMARY KEY,
    container_id INTEGER NOT NULL REFERENCES container(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    loaded_date TIMESTAMP WITH TIME ZONE,
    unloaded_date TIMESTAMP WITH TIME ZONE,
    position_in_container VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (loaded_date IS NULL OR loaded_date >= assigned_date),
    CHECK (unloaded_date IS NULL OR unloaded_date >= loaded_date)
);

CREATE TABLE IF NOT EXISTS warehouse_stock (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_category VARCHAR(100),
    current_quantity INTEGER DEFAULT 0,
    min_threshold INTEGER DEFAULT 0,
    max_threshold INTEGER,
    unit_of_measure VARCHAR(50) DEFAULT 'piece',
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_alert (
    id SERIAL PRIMARY KEY,
    warehouse_stock_id INTEGER NOT NULL REFERENCES warehouse_stock(id) ON DELETE CASCADE ON UPDATE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    alert_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_quantity INTEGER,
    threshold_value INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (alert_type IN ('low_stock', 'overstock', 'expiring_soon'))
);

CREATE TABLE IF NOT EXISTS warehouse_receipt (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    receipt_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    received_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    cargo_list JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consolidation_order (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    warehouse_id INTEGER NOT NULL REFERENCES warehouse(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    origin_cargos JSONB NOT NULL,
    destination_country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    consolidation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    created_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_warehouse_code ON warehouse(warehouse_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_warehouse_country_id ON warehouse(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_warehouse_location_warehouse_id ON warehouse_location(warehouse_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_warehouse_location_unique ON warehouse_location(warehouse_id, location_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_warehouse_capacity_warehouse_id ON warehouse_capacity(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_container_code ON container(container_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_container_warehouse_id ON container(warehouse_id) WHERE deleted_at IS NULL AND is_in_use = true;
CREATE INDEX IF NOT EXISTS idx_container_cargo_assignment_container_id ON container_cargo_assignment(container_id);
CREATE INDEX IF NOT EXISTS idx_container_cargo_assignment_cargo_id ON container_cargo_assignment(cargo_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_stock_warehouse_id ON warehouse_stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_alert_status ON stock_alert(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_warehouse_receipt_number ON warehouse_receipt(receipt_number);
CREATE INDEX IF NOT EXISTS idx_warehouse_receipt_warehouse_id ON warehouse_receipt(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_consolidation_order_number ON consolidation_order(order_number);
CREATE INDEX IF NOT EXISTS idx_consolidation_order_warehouse_id ON consolidation_order(warehouse_id);

