
CREATE TABLE IF NOT EXISTS country (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    iso_code VARCHAR(3) NOT NULL UNIQUE,
    iso_code_2 VARCHAR(2) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS country_risk (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE CASCADE ON UPDATE CASCADE,
    risk_level VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    UNIQUE(country_id)
);

CREATE TABLE IF NOT EXISTS region (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS city (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    region_id INTEGER NOT NULL REFERENCES region(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS district (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    city_id INTEGER NOT NULL REFERENCES city(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS branch (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    district_id INTEGER NOT NULL REFERENCES district(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS distribution_center (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    city_id INTEGER REFERENCES city(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    is_transfer_point BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_country_iso_code ON country(iso_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_region_country_id ON region(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_city_region_id ON city(region_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_district_city_id ON district(city_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_branch_district_id ON branch(district_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_distribution_center_country_id ON distribution_center(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_distribution_center_city_id ON distribution_center(city_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_country_risk_country_id ON country_risk(country_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_region_country_name_unique ON region(country_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_city_region_name_unique ON city(region_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_district_city_name_unique ON district(city_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_branch_district_name_unique ON branch(district_id, name) WHERE deleted_at IS NULL;

