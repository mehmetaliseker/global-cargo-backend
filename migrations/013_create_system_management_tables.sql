
CREATE TABLE IF NOT EXISTS exchange_rate (
    id SERIAL PRIMARY KEY,
    from_currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    to_currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    rate_value DECIMAL(20, 8) NOT NULL,
    effective_date DATE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (from_currency_id != to_currency_id),
    CHECK (rate_value > 0)
);

CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_type VARCHAR(50),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    updated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS maintenance_log (
    id SERIAL PRIMARY KEY,
    maintenance_type VARCHAR(100) NOT NULL,
    execution_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    duration_seconds INTEGER,
    details JSONB,
    executed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backup_log (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    execution_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    duration_seconds INTEGER,
    restore_test_date TIMESTAMP WITH TIME ZONE,
    restore_test_status VARCHAR(50),
    restore_test_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo_analytics (
    id SERIAL PRIMARY KEY,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 4) NOT NULL,
    metric_period_start DATE NOT NULL,
    metric_period_end DATE,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (metric_period_end IS NULL OR metric_period_end >= metric_period_start)
);

CREATE INDEX IF NOT EXISTS idx_exchange_rate_currencies ON exchange_rate(from_currency_id, to_currency_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exchange_rate_effective_date ON exchange_rate(effective_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exchange_rate_timestamp ON exchange_rate(timestamp) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_exchange_rate_unique ON exchange_rate(from_currency_id, to_currency_id, effective_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_maintenance_log_execution_date ON maintenance_log(execution_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_log_status ON maintenance_log(status);
CREATE INDEX IF NOT EXISTS idx_backup_log_execution_date ON backup_log(execution_date);
CREATE INDEX IF NOT EXISTS idx_backup_log_status ON backup_log(status);
CREATE INDEX IF NOT EXISTS idx_cargo_analytics_metric_type ON cargo_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_cargo_analytics_period ON cargo_analytics(metric_period_start, metric_period_end);

