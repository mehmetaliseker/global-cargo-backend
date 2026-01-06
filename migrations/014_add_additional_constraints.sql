

CREATE OR REPLACE FUNCTION prevent_cargo_state_history_update_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'cargo_state_history tablosunda UPDATE ve DELETE iþlemleri yasaktýr (Gereksinim 95)';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_prevent_cargo_state_history_update
    BEFORE UPDATE ON cargo_state_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_cargo_state_history_delete
    BEFORE DELETE ON cargo_state_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_audit_log_update
    BEFORE UPDATE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_audit_log_delete
    BEFORE DELETE ON audit_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();


CREATE TRIGGER IF NOT EXISTS trigger_prevent_archive_update
    BEFORE UPDATE ON archive
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_archive_delete
    BEFORE DELETE ON archive
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_event_evidence_update
    BEFORE UPDATE ON event_evidence
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_event_evidence_delete
    BEFORE DELETE ON event_evidence
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_pricing_calculation_update
    BEFORE UPDATE ON pricing_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_pricing_calculation_delete
    BEFORE DELETE ON pricing_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_cargo_insurance_update
    BEFORE UPDATE ON cargo_insurance
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_cargo_insurance_delete
    BEFORE DELETE ON cargo_insurance
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_customs_tax_calculation_update
    BEFORE UPDATE ON customs_tax_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER IF NOT EXISTS trigger_prevent_customs_tax_calculation_delete
    BEFORE DELETE ON customs_tax_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_support_request_unique_cargo
    ON customer_support_request(cargo_id)
    WHERE cargo_id IS NOT NULL AND deleted_at IS NULL;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_cargo_updated_at
    BEFORE UPDATE ON cargo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_update_customer_updated_at
    BEFORE UPDATE ON customer
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_update_employee_updated_at
    BEFORE UPDATE ON employee
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_update_invoice_updated_at
    BEFORE UPDATE ON invoice
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_update_payment_updated_at
    BEFORE UPDATE ON payment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

