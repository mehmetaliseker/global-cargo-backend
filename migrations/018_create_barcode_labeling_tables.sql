
CREATE TABLE IF NOT EXISTS packaging_type (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    type_code VARCHAR(50) NOT NULL UNIQUE,
    type_name VARCHAR(200) NOT NULL,
    description TEXT,
    special_requirements TEXT,
    cost_additional DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS cargo_barcode (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    barcode_type VARCHAR(50) NOT NULL,
    barcode_value VARCHAR(255) NOT NULL UNIQUE,
    barcode_image_reference VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo_qr_code (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER NOT NULL UNIQUE REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    qr_code_value TEXT NOT NULL UNIQUE,
    qr_code_image_reference VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS label_template (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    template_name VARCHAR(200) NOT NULL,
    template_code VARCHAR(50) NOT NULL UNIQUE,
    template_type VARCHAR(50) NOT NULL,
    template_layout JSONB NOT NULL,
    supported_languages JSONB,
    default_language_code VARCHAR(10) REFERENCES language(language_code) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS label_configuration (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    label_template_id INTEGER NOT NULL REFERENCES label_template(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE CASCADE ON UPDATE CASCADE,
    configuration_data JSONB NOT NULL,
    printer_settings JSONB,
    language_code VARCHAR(10) REFERENCES language(language_code) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS label_print_history (
    id SERIAL PRIMARY KEY,
    label_configuration_id INTEGER NOT NULL REFERENCES label_configuration(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    print_status VARCHAR(50) NOT NULL,
    printer_info VARCHAR(500),
    print_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    print_count INTEGER DEFAULT 1,
    error_message TEXT,
    print_duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (print_status IN ('success', 'failed', 'partial'))
);

CREATE INDEX IF NOT EXISTS idx_packaging_type_code ON packaging_type(type_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cargo_barcode_cargo_id ON cargo_barcode(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_barcode_value ON cargo_barcode(barcode_value);
CREATE INDEX IF NOT EXISTS idx_cargo_qr_code_cargo_id ON cargo_qr_code(cargo_id);
CREATE INDEX IF NOT EXISTS idx_cargo_qr_code_value ON cargo_qr_code(qr_code_value);
CREATE INDEX IF NOT EXISTS idx_label_template_code ON label_template(template_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_label_template_type ON label_template(template_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_label_configuration_cargo_id ON label_configuration(cargo_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_label_print_history_config_id ON label_print_history(label_configuration_id);
CREATE INDEX IF NOT EXISTS idx_label_print_history_status ON label_print_history(print_status);

