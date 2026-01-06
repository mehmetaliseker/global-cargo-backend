
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS permission (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS role_permission (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permission(id) ON DELETE CASCADE ON UPDATE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS employee_role (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_role_code ON role(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_permission_code ON permission(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_permission_resource ON permission(resource) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_role_permission_role_id ON role_permission(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permission_permission_id ON role_permission(permission_id);
CREATE INDEX IF NOT EXISTS idx_employee_role_employee_id ON employee_role(employee_id) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_employee_role_role_id ON employee_role(role_id) WHERE deleted_at IS NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_employee_role_unique ON employee_role(employee_id, role_id) WHERE deleted_at IS NULL AND is_active = true;

