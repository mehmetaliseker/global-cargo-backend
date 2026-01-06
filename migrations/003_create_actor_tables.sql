CREATE TABLE IF NOT EXISTS actor (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    actor_type VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (actor_type IN ('customer', 'employee', 'partner'))
);

CREATE TABLE IF NOT EXISTS customer (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    actor_id INTEGER NOT NULL UNIQUE REFERENCES actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    identity_number VARCHAR(50),
    encrypted_identity_number BYTEA,
    country_id INTEGER REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    actor_id INTEGER NOT NULL UNIQUE REFERENCES actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    employee_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    country_id INTEGER REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS partner (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    actor_id INTEGER NOT NULL UNIQUE REFERENCES actor(id) ON DELETE CASCADE ON UPDATE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    tax_number VARCHAR(50),
    country_id INTEGER REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    api_active BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_actor_type ON actor(actor_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_actor_email ON actor(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_actor_id ON customer(actor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customer_country_id ON customer(country_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_employee_number ON employee(employee_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_actor_id ON employee(actor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_partner_actor_id ON partner(actor_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_partner_country_id ON partner(country_id) WHERE deleted_at IS NULL;

