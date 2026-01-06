
CREATE TABLE IF NOT EXISTS partner_config (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    config_data JSONB,
    api_key_encrypted BYTEA,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    UNIQUE(partner_id)
);

CREATE TABLE IF NOT EXISTS partner_country_mapping (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    mapping_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_partner_config_partner_id ON partner_config(partner_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_partner_country_mapping_partner_id ON partner_country_mapping(partner_id) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_partner_country_mapping_country_id ON partner_country_mapping(country_id) WHERE deleted_at IS NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_country_mapping_unique ON partner_country_mapping(partner_id, country_id) WHERE deleted_at IS NULL AND is_active = true;