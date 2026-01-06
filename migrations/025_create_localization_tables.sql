
CREATE TABLE IF NOT EXISTS translation (
    id SERIAL PRIMARY KEY,
    translation_key VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES language(language_code) ON DELETE RESTRICT ON UPDATE CASCADE,
    translation_value TEXT NOT NULL,
    context VARCHAR(100),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS localized_content (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(100) NOT NULL,
    content_key VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES language(language_code) ON DELETE RESTRICT ON UPDATE CASCADE,
    content_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS locale_setting (
    id SERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL UNIQUE,
    country_id INTEGER REFERENCES country(id) ON DELETE SET NULL ON UPDATE CASCADE,
    date_format VARCHAR(50) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(50) DEFAULT 'HH24:MI:SS',
    currency_format VARCHAR(50) DEFAULT 'symbol',
    number_format VARCHAR(50) DEFAULT 'standard',
    timezone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS regional_config (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    region_id INTEGER REFERENCES region(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (country_id IS NOT NULL OR region_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS legal_document (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES language(language_code) ON DELETE RESTRICT ON UPDATE CASCADE,
    content TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS terms_conditions_version (
    id SERIAL PRIMARY KEY,
    version_number VARCHAR(50) NOT NULL,
    language_code VARCHAR(10) NOT NULL REFERENCES language(language_code) ON DELETE RESTRICT ON UPDATE CASCADE,
    content TEXT NOT NULL,
    effective_date DATE NOT NULL,
    requires_acceptance BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_translation_key_lang ON translation(translation_key, language_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_localized_content_type_key ON localized_content(content_type, content_key) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_locale_setting_code ON locale_setting(locale_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_regional_config_country_id ON regional_config(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_legal_document_type ON legal_document(document_type, language_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_terms_conditions_version ON terms_conditions_version(version_number, language_code) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_translation_unique ON translation(translation_key, language_code, context) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_localized_content_unique ON localized_content(content_type, content_key, language_code) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_regional_config_unique ON regional_config(country_id, region_id, config_key) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_legal_document_unique ON legal_document(document_type, language_code, version) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_conditions_version_unique ON terms_conditions_version(version_number, language_code) WHERE deleted_at IS NULL;


