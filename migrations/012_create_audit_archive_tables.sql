
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    record_uuid UUID,
    action VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    user_type VARCHAR(50),
    service_name VARCHAR(100),
    request_id VARCHAR(255),
    correlation_id VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS archive (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    source_table_name VARCHAR(100) NOT NULL,
    source_record_id INTEGER NOT NULL,
    source_record_uuid UUID,
    archive_type VARCHAR(50) NOT NULL,
    archive_data JSONB NOT NULL,
    archive_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    archived_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    archive_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS change_data_capture (
    id SERIAL PRIMARY KEY,
    source_table VARCHAR(100) NOT NULL,
    source_record_id INTEGER NOT NULL,
    source_record_uuid UUID,
    change_type VARCHAR(10) NOT NULL,
    change_data JSONB NOT NULL,
    change_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_correlation_id ON audit_log(correlation_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_request_id ON audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_archive_source_table_record ON archive(source_table_name, source_record_id);
CREATE INDEX IF NOT EXISTS idx_archive_archive_type ON archive(archive_type);
CREATE INDEX IF NOT EXISTS idx_archive_archive_date ON archive(archive_date);
CREATE INDEX IF NOT EXISTS idx_cdc_source_table_record ON change_data_capture(source_table, source_record_id);
CREATE INDEX IF NOT EXISTS idx_cdc_change_timestamp ON change_data_capture(change_timestamp);
CREATE INDEX IF NOT EXISTS idx_cdc_processed ON change_data_capture(processed) WHERE processed = false;

CREATE OR REPLACE FUNCTION audit_cargo_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name, record_id, record_uuid, action, new_values
        ) VALUES (
            TG_TABLE_NAME, NEW.id, NEW.uuid, 'INSERT', to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            table_name, record_id, record_uuid, action, old_values, new_values
        ) VALUES (
            TG_TABLE_NAME, NEW.id, NEW.uuid, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name, record_id, record_uuid, action, old_values
        ) VALUES (
            TG_TABLE_NAME, OLD.id, OLD.uuid, 'DELETE', to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


