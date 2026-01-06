
CREATE TABLE IF NOT EXISTS dashboard_config (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    dashboard_name VARCHAR(200) NOT NULL,
    layout JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (user_type IN ('customer', 'employee', 'admin'))
);

CREATE TABLE IF NOT EXISTS dashboard_widget (
    id SERIAL PRIMARY KEY,
    dashboard_config_id INTEGER NOT NULL REFERENCES dashboard_config(id) ON DELETE CASCADE ON UPDATE CASCADE,
    widget_type VARCHAR(100) NOT NULL,
    widget_config JSONB NOT NULL,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 400,
    height INTEGER DEFAULT 300,
    refresh_interval_seconds INTEGER DEFAULT 60,
    widget_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboard_metric (
    id SERIAL PRIMARY KEY,
    metric_code VARCHAR(100) NOT NULL UNIQUE,
    metric_name VARCHAR(200) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    data_source VARCHAR(200) NOT NULL,
    calculation_query JSONB,
    refresh_interval_seconds INTEGER DEFAULT 300,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (metric_type IN ('count', 'sum', 'average', 'percentage', 'ratio', 'trend'))
);

CREATE TABLE IF NOT EXISTS time_series_data (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(20, 4) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS geo_coordinate (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy_meters DECIMAL(10, 2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route_visualization (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES route(id) ON DELETE CASCADE ON UPDATE CASCADE,
    visualization_data JSONB NOT NULL,
    map_style VARCHAR(100),
    zoom_level INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboard_config_user ON dashboard_config(user_id, user_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dashboard_widget_config_id ON dashboard_widget(dashboard_config_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_metric_code ON dashboard_metric(metric_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_time_series_data_entity ON time_series_data(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_time_series_data_timestamp ON time_series_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_time_series_data_metric ON time_series_data(metric_name);
CREATE INDEX IF NOT EXISTS idx_geo_coordinate_entity ON geo_coordinate(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_geo_coordinate_recorded_at ON geo_coordinate(recorded_at);
CREATE INDEX IF NOT EXISTS idx_route_visualization_route_id ON route_visualization(route_id);


