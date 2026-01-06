
CREATE TABLE IF NOT EXISTS user_session (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    actor_id INTEGER NOT NULL REFERENCES actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    actor_type VARCHAR(50) NOT NULL,
    session_token_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    logout_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (actor_type IN ('customer', 'employee', 'partner'))
);

CREATE TABLE IF NOT EXISTS login_history (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER NOT NULL REFERENCES actor(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    login_status VARCHAR(50) NOT NULL,
    failure_reason TEXT,
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (login_status IN ('success', 'failed'))
);

CREATE TABLE IF NOT EXISTS security_policy (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    policy_type VARCHAR(50) NOT NULL UNIQUE,
    policy_rules JSONB NOT NULL,
    min_password_length INTEGER DEFAULT 8,
    password_complexity_required BOOLEAN DEFAULT true,
    password_expiry_days INTEGER,
    session_timeout_minutes INTEGER DEFAULT 30,
    max_failed_login_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS two_factor_auth (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER NOT NULL UNIQUE REFERENCES actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    two_factor_method VARCHAR(50) NOT NULL,
    secret_key_encrypted BYTEA,
    backup_codes_encrypted BYTEA,
    phone_number_encrypted BYTEA,
    is_enabled BOOLEAN DEFAULT false,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (two_factor_method IN ('sms', 'email', 'authenticator'))
);

CREATE TABLE IF NOT EXISTS api_rate_limit (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    endpoint_pattern VARCHAR(500) NOT NULL,
    rate_limit_count INTEGER NOT NULL CHECK (rate_limit_count > 0),
    time_window_seconds INTEGER NOT NULL CHECK (time_window_seconds > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS api_access_log (
    id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES actor(id) ON DELETE SET NULL ON UPDATE CASCADE,
    api_key_id INTEGER,
    endpoint VARCHAR(500) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(50),
    request_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INTEGER,
    status_code INTEGER,
    rate_limit_hit BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_incident (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL,
    severity_level VARCHAR(50) NOT NULL,
    actor_id INTEGER REFERENCES actor(id) ON DELETE SET NULL ON UPDATE CASCADE,
    description TEXT NOT NULL,
    incident_details JSONB,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_action TEXT,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (severity_level IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_user_session_actor_id ON user_session(actor_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_session_token_hash ON user_session(session_token_hash) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_session_expires_at ON user_session(expires_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_login_history_actor_id ON login_history(actor_id);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time);
CREATE INDEX IF NOT EXISTS idx_login_history_status ON login_history(login_status);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_actor_id ON two_factor_auth(actor_id) WHERE is_enabled = true;
CREATE INDEX IF NOT EXISTS idx_api_rate_limit_endpoint ON api_rate_limit(endpoint_pattern) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_access_log_actor_id ON api_access_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_api_access_log_request_time ON api_access_log(request_time);
CREATE INDEX IF NOT EXISTS idx_api_access_log_rate_limit ON api_access_log(rate_limit_hit) WHERE rate_limit_hit = true;
CREATE INDEX IF NOT EXISTS idx_security_incident_actor_id ON security_incident(actor_id);
CREATE INDEX IF NOT EXISTS idx_security_incident_severity ON security_incident(severity_level);
CREATE INDEX IF NOT EXISTS idx_security_incident_resolved ON security_incident(resolved_at) WHERE resolved_at IS NULL;

