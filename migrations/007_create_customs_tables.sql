
CREATE TABLE IF NOT EXISTS customs_document_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    required_fields JSONB,
    country_specific BOOLEAN DEFAULT false,
    country_id INTEGER REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS cargo_customs_document (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    customs_document_type_id INTEGER NOT NULL REFERENCES customs_document_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    document_number VARCHAR(100),
    document_data JSONB,
    file_reference VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    is_verified BOOLEAN DEFAULT false,
    verified_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS tax_regulation_version (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    year INTEGER NOT NULL,
    regulation_data JSONB NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    UNIQUE(country_id, year),
    CHECK (effective_to IS NULL OR effective_to >= effective_from),
    CHECK (year >= 2000 AND year <= 2100)
);

CREATE TABLE IF NOT EXISTS customs_tax_calculation (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL REFERENCES cargo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    shipment_type_id INTEGER NOT NULL REFERENCES shipment_type_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    customs_duty_amount DECIMAL(15, 2) DEFAULT 0,
    vat_amount DECIMAL(15, 2) DEFAULT 0,
    additional_tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_tax_amount DECIMAL(15, 2) NOT NULL,
    
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    tax_regulation_version_id INTEGER REFERENCES tax_regulation_version(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    country_risk_id INTEGER REFERENCES country_risk(id) ON DELETE SET NULL ON UPDATE CASCADE,
    risk_check_passed BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION check_country_risk_threshold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.country_risk_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM country_risk cr
            WHERE cr.id = NEW.country_risk_id
            AND cr.risk_score <= 80
        ) THEN
            RAISE EXCEPTION 'Ülke risk skoru 80''den yüksek olamaz. Risk skoru kontrol başarısız.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_check_country_risk_threshold
BEFORE INSERT OR UPDATE ON customs_tax_calculation
FOR EACH ROW
EXECUTE FUNCTION check_country_risk_threshold();

CREATE INDEX IF NOT EXISTS idx_customs_document_type_code ON customs_document_type(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customs_document_type_country_id ON customs_document_type(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_customs_document_cargo_id ON cargo_customs_document(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_customs_document_type_id ON cargo_customs_document(customs_document_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tax_regulation_version_country_year ON tax_regulation_version(country_id, year) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customs_tax_calculation_cargo_id ON customs_tax_calculation(cargo_id);
CREATE INDEX IF NOT EXISTS idx_customs_tax_calculation_country_id ON customs_tax_calculation(country_id);
CREATE INDEX IF NOT EXISTS idx_customs_tax_calculation_date ON customs_tax_calculation(calculation_date);

