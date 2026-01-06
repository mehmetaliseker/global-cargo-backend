
CREATE TRIGGER trigger_prevent_commission_calculation_update
    BEFORE UPDATE ON commission_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_commission_calculation_delete
    BEFORE DELETE ON commission_calculation
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_notification_log_update
    BEFORE UPDATE ON notification_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_notification_log_delete
    BEFORE DELETE ON notification_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_api_access_log_update
    BEFORE UPDATE ON api_access_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_api_access_log_delete
    BEFORE DELETE ON api_access_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_label_print_history_update
    BEFORE UPDATE ON label_print_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_label_print_history_delete
    BEFORE DELETE ON label_print_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_product_value_history_update
    BEFORE UPDATE ON product_value_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_product_value_history_delete
    BEFORE DELETE ON product_value_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_cargo_event_log_update
    BEFORE UPDATE ON cargo_event_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_cargo_event_log_delete
    BEFORE DELETE ON cargo_event_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_login_history_update
    BEFORE UPDATE ON login_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_login_history_delete
    BEFORE DELETE ON login_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_change_data_capture_update
    BEFORE UPDATE ON change_data_capture
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_change_data_capture_delete
    BEFORE DELETE ON change_data_capture
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_cargo_movement_history_update
    BEFORE UPDATE ON cargo_movement_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_cargo_movement_history_delete
    BEFORE DELETE ON cargo_movement_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_approval_history_update
    BEFORE UPDATE ON approval_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_approval_history_delete
    BEFORE DELETE ON approval_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_loyalty_transaction_update
    BEFORE UPDATE ON loyalty_transaction
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_loyalty_transaction_delete
    BEFORE DELETE ON loyalty_transaction
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_payment_history_update
    BEFORE UPDATE ON payment_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_payment_history_delete
    BEFORE DELETE ON payment_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_vehicle_location_history_update
    BEFORE UPDATE ON vehicle_location_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_vehicle_location_history_delete
    BEFORE DELETE ON vehicle_location_history
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER  trigger_prevent_temperature_log_update
    BEFORE UPDATE ON temperature_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_temperature_log_delete
    BEFORE DELETE ON temperature_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_vehicle_fuel_log_update
    BEFORE UPDATE ON vehicle_fuel_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_vehicle_fuel_log_delete
    BEFORE DELETE ON vehicle_fuel_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_time_series_data_update
    BEFORE UPDATE ON time_series_data
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_time_series_data_delete
    BEFORE DELETE ON time_series_data
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_alert_log_update
    BEFORE UPDATE ON alert_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_alert_log_delete
    BEFORE DELETE ON alert_log
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_promotion_usage_update
    BEFORE UPDATE ON promotion_usage
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_promotion_usage_delete
    BEFORE DELETE ON promotion_usage
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_coupon_redemption_update
    BEFORE UPDATE ON coupon_redemption
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_coupon_redemption_delete
    BEFORE DELETE ON coupon_redemption
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_warehouse_receipt_update
    BEFORE UPDATE ON warehouse_receipt
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_warehouse_receipt_delete
    BEFORE DELETE ON warehouse_receipt
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_stock_alert_update
    BEFORE UPDATE ON stock_alert
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_stock_alert_delete
    BEFORE DELETE ON stock_alert
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_temperature_alert_update
    BEFORE UPDATE ON temperature_alert
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_temperature_alert_delete
    BEFORE DELETE ON temperature_alert
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_sla_breach_update
    BEFORE UPDATE ON sla_breach
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_sla_breach_delete
    BEFORE DELETE ON sla_breach
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_commission_payment_update
    BEFORE UPDATE ON commission_payment
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_commission_payment_delete
    BEFORE DELETE ON commission_payment
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_disaster_recovery_test_update
    BEFORE UPDATE ON disaster_recovery_test
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();

CREATE TRIGGER trigger_prevent_disaster_recovery_test_delete
    BEFORE DELETE ON disaster_recovery_test
    FOR EACH ROW
    EXECUTE FUNCTION prevent_cargo_state_history_update_delete();


