
CREATE TABLE IF NOT EXISTS hr_kpi (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    kpi_type VARCHAR(50) NOT NULL,
    kpi_value DECIMAL(10, 2) NOT NULL,
    kpi_period VARCHAR(50),
    period_start_date DATE,
    period_end_date DATE,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    calculated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (period_end_date IS NULL OR period_end_date >= period_start_date)
);

CREATE TABLE IF NOT EXISTS employee_salary (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    base_salary DECIMAL(15, 2) NOT NULL,
    bonus_amount DECIMAL(15, 2) DEFAULT 0,
    prim_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    period_start_date DATE NOT NULL,
    period_end_date DATE,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (period_end_date IS NULL OR period_end_date >= period_start_date),
    CHECK (total_amount = base_salary + bonus_amount + prim_amount)
);

CREATE TABLE IF NOT EXISTS employee_leave_request (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP WITH TIME ZONE,
    approver_id INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS employee_training (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    training_level VARCHAR(50) NOT NULL,
    competency_criteria TEXT,
    training_type VARCHAR(100),
    completion_date DATE,
    certificate_number VARCHAR(100),
    certificate_file_reference VARCHAR(255),
    is_certified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS employee_performance_reward (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employee(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    reward_type VARCHAR(50) NOT NULL,
    reward_amount DECIMAL(15, 2),
    reward_description TEXT,
    performance_period_start DATE,
    performance_period_end DATE,
    awarded_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    awarded_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (performance_period_end IS NULL OR performance_period_end >= performance_period_start)
);

CREATE INDEX IF NOT EXISTS idx_hr_kpi_employee_id ON hr_kpi(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hr_kpi_kpi_type ON hr_kpi(kpi_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hr_kpi_period ON hr_kpi(period_start_date, period_end_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_salary_employee_id ON employee_salary(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_salary_period ON employee_salary(period_start_date, period_end_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_leave_request_employee_id ON employee_leave_request(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_leave_request_status ON employee_leave_request(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_leave_request_dates ON employee_leave_request(start_date, end_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_training_employee_id ON employee_training(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employee_performance_reward_employee_id ON employee_performance_reward(employee_id) WHERE deleted_at IS NULL;

