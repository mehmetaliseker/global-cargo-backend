
CREATE TABLE IF NOT EXISTS notification_template (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(200) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    language_code VARCHAR(10) REFERENCES language(language_code) ON DELETE RESTRICT ON UPDATE CASCADE,
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (notification_type IN ('sms', 'email', 'push'))
);

CREATE TABLE IF NOT EXISTS notification_queue (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    notification_template_id INTEGER REFERENCES notification_template(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_id INTEGER NOT NULL,
    notification_data JSONB NOT NULL,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    scheduled_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (retry_count <= max_retries)
);

CREATE TABLE IF NOT EXISTS notification_log (
    id SERIAL PRIMARY KEY,
    notification_queue_id INTEGER NOT NULL REFERENCES notification_queue(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    delivery_status VARCHAR(50) NOT NULL,
    error_message TEXT,
    provider_response JSONB,
    provider_name VARCHAR(100),
    delivery_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_notification_preference (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    preference_level VARCHAR(50) DEFAULT 'all',
    sms_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (preference_level IN ('none', 'important_only', 'all'))
);

CREATE TABLE IF NOT EXISTS alert_rule (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    alert_name VARCHAR(200) NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    severity_level VARCHAR(50) DEFAULT 'medium',
    notification_template_id INTEGER REFERENCES notification_template(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (severity_level IN ('low', 'medium', 'high', 'critical'))
);

CREATE TABLE IF NOT EXISTS alert_log (
    id SERIAL PRIMARY KEY,
    alert_rule_id INTEGER NOT NULL REFERENCES alert_rule(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    alert_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notification_template_code ON notification_template(template_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notification_template_type ON notification_template(notification_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled_time ON notification_queue(scheduled_time) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notification_queue_recipient ON notification_queue(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_queue_id ON notification_log(notification_queue_id);
CREATE INDEX IF NOT EXISTS idx_customer_notification_preference_customer_id ON customer_notification_preference(customer_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_notification_preference_unique ON customer_notification_preference(customer_id, notification_type) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_alert_rule_is_active ON alert_rule(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alert_log_entity ON alert_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_alert_log_status ON alert_log(status) WHERE status = 'pending';

