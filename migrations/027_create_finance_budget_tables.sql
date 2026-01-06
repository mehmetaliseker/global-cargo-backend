CREATE TABLE IF NOT EXISTS cost_center (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    cost_center_code VARCHAR(50) NOT NULL UNIQUE,
    cost_center_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(200),
    budget_year INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (budget_year >= 2000 AND budget_year <= 2100)
);

CREATE TABLE IF NOT EXISTS cost_allocation (
    id SERIAL PRIMARY KEY,
    cost_center_id INTEGER NOT NULL REFERENCES cost_center(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    allocation_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    cost_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    allocation_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_budget (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    department_name VARCHAR(200) NOT NULL,
    budget_year INTEGER NOT NULL,
    budget_amount DECIMAL(15, 2) NOT NULL,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    available_amount DECIMAL(15, 2) GENERATED ALWAYS AS (budget_amount - spent_amount) STORED,
    budget_category VARCHAR(100),
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (budget_year >= 2000 AND budget_year <= 2100)
);

CREATE TABLE IF NOT EXISTS budget_tracking (
    id SERIAL PRIMARY KEY,
    department_budget_id INTEGER NOT NULL REFERENCES department_budget(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    expense_type VARCHAR(100) NOT NULL,
    expense_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    expense_date DATE NOT NULL,
    description TEXT,
    approved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profit_loss_analysis (
    id SERIAL PRIMARY KEY,
    business_unit VARCHAR(200) NOT NULL,
    analysis_period VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    revenue DECIMAL(15, 2) NOT NULL,
    cost DECIMAL(15, 2) NOT NULL,
    profit DECIMAL(15, 2) GENERATED ALWAYS AS (revenue - cost) STORED,
    profit_margin_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN revenue > 0 THEN ((revenue - cost) / revenue * 100) ELSE 0 END
    ) STORED,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (analysis_period IN ('month', 'quarter', 'year')),
    CHECK (period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_cost_center_code ON cost_center(cost_center_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cost_allocation_cost_center_id ON cost_allocation(cost_center_id);
CREATE INDEX IF NOT EXISTS idx_cost_allocation_type ON cost_allocation(allocation_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_department_budget_name_year ON department_budget(department_name, budget_year) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_department_budget_unique ON department_budget(department_name, budget_year, budget_category) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_budget_tracking_budget_id ON budget_tracking(department_budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_tracking_date ON budget_tracking(expense_date);
CREATE INDEX IF NOT EXISTS idx_profit_loss_analysis_business_unit ON profit_loss_analysis(business_unit);
CREATE INDEX IF NOT EXISTS idx_profit_loss_analysis_period ON profit_loss_analysis(period_start, period_end);

CREATE TABLE IF NOT EXISTS cash_flow (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance DECIMAL(15, 2) NOT NULL,
    closing_balance DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    inflow_amount DECIMAL(15, 2) DEFAULT 0,
    outflow_amount DECIMAL(15, 2) DEFAULT 0,
    net_cash_flow DECIMAL(15, 2) GENERATED ALWAYS AS (inflow_amount - outflow_amount) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS budget_projection (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    department_budget_id INTEGER NOT NULL REFERENCES department_budget(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    projection_period VARCHAR(50) NOT NULL,
    projected_amount DECIMAL(15, 2) NOT NULL,
    projection_method VARCHAR(100),
    projection_date DATE NOT NULL,
    confidence_level DECIMAL(5, 2),
    assumptions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (projection_period IN ('month', 'quarter', 'year', 'custom')),
    CHECK (confidence_level IS NULL OR (confidence_level >= 0 AND confidence_level <= 100))
);

CREATE TABLE IF NOT EXISTS financial_report (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    report_type VARCHAR(50) NOT NULL,
    report_period VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    consolidated_data JSONB NOT NULL,
    report_date DATE NOT NULL,
    generated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (report_type IN ('income_statement', 'balance_sheet', 'cash_flow')),
    CHECK (report_period IN ('month', 'quarter', 'year')),
    CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS budget_performance (
    id SERIAL PRIMARY KEY,
    department_budget_id INTEGER NOT NULL REFERENCES department_budget(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    performance_period VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    budgeted_amount DECIMAL(15, 2) NOT NULL,
    actual_amount DECIMAL(15, 2) NOT NULL,
    variance_amount DECIMAL(15, 2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
    variance_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN budgeted_amount > 0 THEN ((actual_amount - budgeted_amount) / budgeted_amount * 100) ELSE 0 END
    ) STORED,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (performance_period IN ('month', 'quarter', 'year')),
    CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS financial_control (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    control_type VARCHAR(100) NOT NULL,
    threshold_amount DECIMAL(15, 2) NOT NULL,
    approval_required BOOLEAN DEFAULT true,
    approval_chain_id INTEGER REFERENCES approval_chain(id) ON DELETE SET NULL ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS accounting_entry (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    entry_type VARCHAR(10) NOT NULL,
    account_code VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    reference_entity_type VARCHAR(100),
    reference_entity_id INTEGER,
    entry_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (entry_type IN ('debit', 'credit')),
    CHECK (amount > 0)
);

CREATE TABLE IF NOT EXISTS tax_calculation (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    tax_type VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(10, 4) NOT NULL,
    taxable_amount DECIMAL(15, 2) NOT NULL,
    calculated_tax DECIMAL(15, 2) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    tax_regulation_version_id INTEGER REFERENCES tax_regulation_version(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    calculation_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (tax_rate >= 0 AND tax_rate <= 100),
    CHECK (taxable_amount > 0),
    CHECK (calculated_tax >= 0)
);

CREATE TABLE IF NOT EXISTS financial_risk (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    risk_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    risk_score DECIMAL(5, 2) NOT NULL,
    mitigation_plan JSONB,
    risk_description TEXT,
    identified_date DATE NOT NULL,
    mitigation_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    CHECK (risk_score >= 0 AND risk_score <= 100),
    CHECK (mitigation_status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS cost_optimization (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    analysis_period VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    current_cost DECIMAL(15, 2) NOT NULL,
    optimized_cost DECIMAL(15, 2) NOT NULL,
    savings_potential DECIMAL(15, 2) GENERATED ALWAYS AS (current_cost - optimized_cost) STORED,
    recommendation JSONB,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    analyzed_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (analysis_period IN ('month', 'quarter', 'year')),
    CHECK (period_end >= period_start),
    CHECK (optimized_cost <= current_cost)
);

CREATE TABLE IF NOT EXISTS financial_comparison (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    comparison_type VARCHAR(50) NOT NULL,
    baseline_period VARCHAR(100) NOT NULL,
    comparison_period VARCHAR(100) NOT NULL,
    metrics JSONB NOT NULL,
    comparison_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (comparison_type IN ('year_over_year', 'period_over_period', 'budget_vs_actual'))
);

CREATE INDEX IF NOT EXISTS idx_cash_flow_period ON cash_flow(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_cash_flow_currency_id ON cash_flow(currency_id);
CREATE INDEX IF NOT EXISTS idx_budget_projection_department_budget_id ON budget_projection(department_budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_projection_period ON budget_projection(projection_period);
CREATE INDEX IF NOT EXISTS idx_financial_report_type ON financial_report(report_type);
CREATE INDEX IF NOT EXISTS idx_financial_report_period ON financial_report(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_budget_performance_department_budget_id ON budget_performance(department_budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_performance_period ON budget_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_financial_control_type ON financial_control(control_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_control_approval_chain_id ON financial_control(approval_chain_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounting_entry_account_code ON accounting_entry(account_code);
CREATE INDEX IF NOT EXISTS idx_accounting_entry_entry_date ON accounting_entry(entry_date);
CREATE INDEX IF NOT EXISTS idx_accounting_entry_reference ON accounting_entry(reference_entity_type, reference_entity_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculation_country_id ON tax_calculation(country_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculation_tax_type ON tax_calculation(tax_type);
CREATE INDEX IF NOT EXISTS idx_tax_calculation_calculation_date ON tax_calculation(calculation_date);
CREATE INDEX IF NOT EXISTS idx_financial_risk_risk_level ON financial_risk(risk_level);
CREATE INDEX IF NOT EXISTS idx_financial_risk_risk_type ON financial_risk(risk_type);
CREATE INDEX IF NOT EXISTS idx_financial_risk_identified_date ON financial_risk(identified_date);
CREATE INDEX IF NOT EXISTS idx_cost_optimization_period ON cost_optimization(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_cost_optimization_analysis_period ON cost_optimization(analysis_period);
CREATE INDEX IF NOT EXISTS idx_financial_comparison_type ON financial_comparison(comparison_type);
CREATE INDEX IF NOT EXISTS idx_financial_comparison_date ON financial_comparison(comparison_date);

