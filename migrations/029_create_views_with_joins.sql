CREATE OR REPLACE VIEW v_cargo_details AS
SELECT 
    c.id AS cargo_id,
    c.uuid AS cargo_uuid,
    c.tracking_number,
    c.delivery_number,
    c.origin_date,
    c.estimated_delivery_date,
    c.actual_delivery_date,
    c.weight_kg,
    c.value_declaration,
    cust.id AS customer_id,
    cust.first_name AS customer_first_name,
    cust.last_name AS customer_last_name,
    a.email AS customer_email,
    a.phone AS customer_phone,
    origin_country.name AS origin_country_name,
    origin_country.iso_code AS origin_country_code,
    dest_country.name AS destination_country_name,
    dest_country.iso_code AS destination_country_code,
    origin_branch.name AS origin_branch_name,
    dest_branch.name AS destination_branch_name,
    state.name AS current_state_name,
    state.code AS current_state_code,
    cargo_type.name AS cargo_type_name,
    shipment_type.name AS shipment_type_name,
    currency.code AS currency_code,
    currency.symbol AS currency_symbol,
    CASE 
        WHEN c.actual_delivery_date IS NOT NULL THEN true
        ELSE false
    END AS is_delivered,
    CASE 
        WHEN c.estimated_delivery_date < CURRENT_TIMESTAMP AND c.actual_delivery_date IS NULL THEN true
        ELSE false
    END AS is_delayed
FROM cargo c
INNER JOIN customer cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
INNER JOIN actor a ON cust.actor_id = a.id AND a.deleted_at IS NULL
INNER JOIN country origin_country ON c.origin_country_id = origin_country.id
INNER JOIN country dest_country ON c.destination_country_id = dest_country.id
LEFT JOIN branch origin_branch ON c.origin_branch_id = origin_branch.id AND origin_branch.deleted_at IS NULL
LEFT JOIN branch dest_branch ON c.destination_branch_id = dest_branch.id AND dest_branch.deleted_at IS NULL
LEFT JOIN state_enum state ON c.current_state_id = state.id AND state.deleted_at IS NULL
INNER JOIN cargo_type_enum cargo_type ON c.cargo_type_id = cargo_type.id AND cargo_type.deleted_at IS NULL
INNER JOIN shipment_type_enum shipment_type ON c.shipment_type_id = shipment_type.id AND shipment_type.deleted_at IS NULL
INNER JOIN currency_enum currency ON c.currency_id = currency.id AND currency.deleted_at IS NULL
WHERE c.deleted_at IS NULL;

CREATE OR REPLACE VIEW v_invoice_payment_summary AS
SELECT 
    i.id AS invoice_id,
    i.uuid AS invoice_uuid,
    i.invoice_number,
    i.invoice_date,
    i.subtotal,
    i.tax_amount,
    i.discount_amount,
    i.total_amount,
    i.is_main_invoice,
    i.is_additional_invoice,
    COUNT(DISTINCT p.id) AS payment_count,
    COALESCE(SUM(p.amount), 0) AS total_paid_amount,
    (i.total_amount - COALESCE(SUM(p.amount), 0)) AS remaining_amount,
    c.id AS cargo_id,
    c.tracking_number,
    cust.id AS customer_id,
    cust.first_name AS customer_first_name,
    cust.last_name AS customer_last_name,
    currency.code AS currency_code,
    currency.symbol AS currency_symbol,
    CASE
        WHEN COALESCE(SUM(p.amount), 0) >= i.total_amount THEN 'paid'
        WHEN COALESCE(SUM(p.amount), 0) > 0 THEN 'partially_paid'
        ELSE 'unpaid'
    END AS payment_status
FROM invoice i
INNER JOIN cargo c ON i.cargo_id = c.id AND c.deleted_at IS NULL
INNER JOIN customer cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
INNER JOIN currency_enum currency ON i.currency_id = currency.id AND currency.deleted_at IS NULL
LEFT JOIN payment p ON i.id = p.invoice_id AND p.deleted_at IS NULL
WHERE i.deleted_at IS NULL
GROUP BY i.id, i.uuid, i.invoice_number, i.invoice_date, i.subtotal, i.tax_amount, 
         i.discount_amount, i.total_amount, i.is_main_invoice, i.is_additional_invoice,
         c.id, c.tracking_number, cust.id, cust.first_name, cust.last_name,
         currency.code, currency.symbol;

CREATE OR REPLACE VIEW v_cargo_product_details AS
SELECT 
    c.id AS cargo_id,
    c.tracking_number,
    c.origin_date,
    c.estimated_delivery_date,
    c.weight_kg AS cargo_weight,
    c.value_declaration AS cargo_value_declaration,
    COUNT(p.id) AS product_count,
    SUM(p.quantity) AS total_product_quantity,
    SUM(p.unit_value * p.quantity) AS total_product_value,
    json_agg(
        json_build_object(
            'product_id', p.id,
            'product_code', p.product_code,
            'name', p.name,
            'quantity', p.quantity,
            'unit_value', p.unit_value,
            'total_value', p.unit_value * p.quantity,
            'currency', p_currency.code
        )
        ORDER BY p.id
    ) FILTER (WHERE p.id IS NOT NULL) AS products_json,
    cust.first_name AS customer_first_name,
    cust.last_name AS customer_last_name,
    cargo_currency.code AS cargo_currency_code
FROM cargo c
INNER JOIN customer cust ON c.customer_id = cust.id AND cust.deleted_at IS NULL
INNER JOIN currency_enum cargo_currency ON c.currency_id = cargo_currency.id AND cargo_currency.deleted_at IS NULL
LEFT JOIN product p ON c.id = p.cargo_id AND p.deleted_at IS NULL
LEFT JOIN currency_enum p_currency ON p.currency_id = p_currency.id AND p_currency.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.tracking_number, c.origin_date, c.estimated_delivery_date,
         c.weight_kg, c.value_declaration, cust.first_name, cust.last_name,
         cargo_currency.code;

CREATE OR REPLACE VIEW v_employee_roles AS
SELECT 
    e.id AS employee_id,
    e.uuid AS employee_uuid,
    e.employee_number,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    e.hire_date,
    a.email,
    a.phone,
    COUNT(DISTINCT er.role_id) AS role_count,
    json_agg(
        json_build_object(
            'role_id', r.id,
            'role_code', r.code,
            'role_name', r.name,
            'assigned_at', er.assigned_at
        )
        ORDER BY r.code
    ) FILTER (WHERE r.id IS NOT NULL AND er.is_active = true AND er.deleted_at IS NULL) AS roles_json
FROM employee e
INNER JOIN actor a ON e.actor_id = a.id AND a.deleted_at IS NULL
LEFT JOIN employee_role er ON e.id = er.employee_id AND er.deleted_at IS NULL AND er.is_active = true
LEFT JOIN role r ON er.role_id = r.id AND r.deleted_at IS NULL
WHERE e.deleted_at IS NULL AND e.is_active = true
GROUP BY e.id, e.uuid, e.employee_number, e.first_name, e.last_name,
         e.department, e.position, e.hire_date, a.email, a.phone;

CREATE OR REPLACE VIEW v_cargo_movement_history AS
SELECT 
    cmh.id AS movement_id,
    cmh.cargo_id,
    c.tracking_number,
    cmh.movement_date,
    cmh.status,
    cmh.description,
    cmh.location_type,
    b.name AS branch_name,
    b.code AS branch_code,
    dc.name AS distribution_center_name,
    dc.code AS distribution_center_code,
    country.name AS country_name,
    state.name AS current_state_name,
    ROW_NUMBER() OVER (PARTITION BY cmh.cargo_id ORDER BY cmh.movement_date DESC) AS movement_order
FROM cargo_movement_history cmh
INNER JOIN cargo c ON cmh.cargo_id = c.id AND c.deleted_at IS NULL
LEFT JOIN branch b ON cmh.branch_id = b.id AND cmh.location_type = 'branch' AND b.deleted_at IS NULL
LEFT JOIN distribution_center dc ON cmh.distribution_center_id = dc.id AND cmh.location_type = 'distribution_center' AND dc.deleted_at IS NULL
LEFT JOIN country ON (b.district_id IS NOT NULL AND country.id = (
        SELECT co.id FROM country co
        JOIN region r ON co.id = r.country_id
        JOIN city ci ON r.id = ci.region_id
        JOIN district d ON ci.id = d.city_id
        JOIN branch br ON d.id = br.district_id
        WHERE br.id = b.id LIMIT 1
    )) OR (dc.country_id = country.id)
LEFT JOIN state_enum state ON c.current_state_id = state.id AND state.deleted_at IS NULL
ORDER BY cmh.cargo_id, cmh.movement_date DESC;

CREATE OR REPLACE VIEW v_customs_tax_details AS
SELECT 
    c.id AS cargo_id,
    c.tracking_number,
    ctc.id AS tax_calculation_id,
    ctc.customs_duty_amount,
    ctc.vat_amount,
    ctc.additional_tax_amount,
    ctc.total_tax_amount,
    ctc.calculation_date,
    country.name AS tax_country_name,
    country.iso_code AS tax_country_code,
    country_risk.risk_level,
    country_risk.risk_score,
    trv.year AS regulation_year,
    trv.effective_from AS regulation_effective_from,
    shipment_type.name AS shipment_type_name,
    c.value_declaration,
    currency.code AS currency_code
FROM cargo c
INNER JOIN customs_tax_calculation ctc ON c.id = ctc.cargo_id
INNER JOIN country ON ctc.country_id = country.id
LEFT JOIN country_risk ON country.id = country_risk.country_id AND country_risk.deleted_at IS NULL
LEFT JOIN tax_regulation_version trv ON ctc.tax_regulation_version_id = trv.id AND trv.deleted_at IS NULL
INNER JOIN shipment_type_enum shipment_type ON ctc.shipment_type_id = shipment_type.id AND shipment_type.deleted_at IS NULL
INNER JOIN currency_enum currency ON c.currency_id = currency.id AND currency.deleted_at IS NULL
WHERE c.deleted_at IS NULL
ORDER BY ctc.calculation_date DESC;

CREATE OR REPLACE VIEW v_partner_commission_summary AS
SELECT 
    p.id AS partner_id,
    p.uuid AS partner_uuid,
    p.company_name,
    a.email AS partner_email,
    a.phone AS partner_phone,
    country.name AS partner_country_name,
    COUNT(DISTINCT cc.id) AS commission_calculation_count,
    SUM(cc.commission_amount) AS total_commission_amount,
    SUM(cc.base_amount) AS total_base_amount,
    currency.code AS currency_code,
    MAX(cc.calculation_date) AS last_commission_date
FROM partner p
INNER JOIN actor a ON p.actor_id = a.id AND a.deleted_at IS NULL
LEFT JOIN country ON p.country_id = country.id
LEFT JOIN commission_calculation cc ON p.id = (
    SELECT partner_id FROM partner_commission 
    WHERE id = cc.partner_commission_id AND deleted_at IS NULL LIMIT 1
)
LEFT JOIN currency_enum currency ON cc.currency_id = currency.id AND currency.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.uuid, p.company_name, a.email, a.phone, country.name, currency.code;

CREATE OR REPLACE VIEW v_cargo_state_timeline AS
SELECT 
    c.id AS cargo_id,
    c.tracking_number,
    csh.id AS state_history_id,
    csh.state_id,
    state.name AS state_name,
    state.code AS state_code,
    csh.event_time,
    csh.description,
    e.first_name || ' ' || e.last_name AS changed_by_employee,
    e.employee_number,
    LAG(state.code) OVER (PARTITION BY c.id ORDER BY csh.event_time) AS previous_state,
    LEAD(state.code) OVER (PARTITION BY c.id ORDER BY csh.event_time) AS next_state,
    csh.event_time - LAG(csh.event_time) OVER (PARTITION BY c.id ORDER BY csh.event_time) AS time_in_previous_state
FROM cargo c
INNER JOIN cargo_state_history csh ON c.id = csh.cargo_id
INNER JOIN state_enum state ON csh.state_id = state.id AND state.deleted_at IS NULL
LEFT JOIN employee e ON csh.changed_by = e.id AND e.deleted_at IS NULL
WHERE c.deleted_at IS NULL
ORDER BY c.id, csh.event_time;

CREATE OR REPLACE VIEW v_pricing_calculation_details AS
SELECT 
    c.id AS cargo_id,
    c.tracking_number,
    pc.id AS pricing_calculation_id,
    pc.calculation_timestamp,
    pc.base_price,
    pc.shipping_cost,
    pc.insurance_cost,
    pc.tax_cost,
    pc.customs_cost,
    pc.total_amount,
    currency.code AS currency_code,
    currency.symbol AS currency_symbol,
    json_agg(
        json_build_object(
            'cost_type', pcd.cost_type,
            'amount', pcd.amount,
            'description', pcd.description
        )
        ORDER BY pcd.id
    ) FILTER (WHERE pcd.id IS NOT NULL) AS cost_details_json,
    e.first_name || ' ' || e.last_name AS calculated_by_employee
FROM cargo c
INNER JOIN pricing_calculation pc ON c.id = pc.cargo_id
INNER JOIN currency_enum currency ON pc.currency_id = currency.id AND currency.deleted_at IS NULL
LEFT JOIN pricing_calculation_detail pcd ON pc.id = pcd.pricing_calculation_id
LEFT JOIN employee e ON pc.calculated_by = e.id AND e.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.tracking_number, pc.id, pc.calculation_timestamp,
         pc.base_price, pc.shipping_cost, pc.insurance_cost, pc.tax_cost,
         pc.customs_cost, pc.total_amount, currency.code, currency.symbol,
         e.first_name, e.last_name;

CREATE OR REPLACE VIEW v_customer_cargo_summary AS
SELECT 
    cust.id AS customer_id,
    cust.uuid AS customer_uuid,
    cust.first_name,
    cust.last_name,
    a.email,
    a.phone,
    cust.registration_date,
    cust.is_verified,
    COUNT(DISTINCT c.id) AS total_cargo_count,
    COUNT(DISTINCT CASE WHEN c.actual_delivery_date IS NOT NULL THEN c.id END) AS delivered_cargo_count,
    COUNT(DISTINCT CASE WHEN c.actual_delivery_date IS NULL AND c.estimated_delivery_date < CURRENT_TIMESTAMP THEN c.id END) AS delayed_cargo_count,
    SUM(c.value_declaration) AS total_cargo_value,
    COUNT(DISTINCT i.id) AS total_invoice_count,
    SUM(i.total_amount) AS total_invoice_amount,
    COUNT(DISTINCT p.id) AS total_payment_count,
    SUM(p.amount) AS total_paid_amount,
    currency.code AS currency_code
FROM customer cust
INNER JOIN actor a ON cust.actor_id = a.id AND a.deleted_at IS NULL
LEFT JOIN cargo c ON cust.id = c.customer_id AND c.deleted_at IS NULL
LEFT JOIN invoice i ON c.id = i.cargo_id AND i.deleted_at IS NULL
LEFT JOIN payment p ON i.id = p.invoice_id AND p.deleted_at IS NULL
LEFT JOIN currency_enum currency ON COALESCE(c.currency_id, i.currency_id, p.currency_id) = currency.id AND currency.deleted_at IS NULL
WHERE cust.deleted_at IS NULL
GROUP BY cust.id, cust.uuid, cust.first_name, cust.last_name,
         a.email, a.phone, cust.registration_date, cust.is_verified,
         currency.code;

CREATE OR REPLACE VIEW v_vehicle_route_details AS
SELECT 
    v.id AS vehicle_id,
    v.vehicle_code,
    v.license_plate,
    v.vehicle_type_override,
    v.capacity_weight_kg,
    vr.id AS vehicle_route_id,
    r.id AS route_id,
    r.route_code,
    origin_dc.name AS origin_distribution_center,
    dest_dc.name AS destination_distribution_center,
    shipment_type.name AS shipment_type_name,
    r.estimated_duration_hours,
    e.first_name || ' ' || e.last_name AS driver_name,
    e.employee_number AS driver_number,
    vr.departure_time,
    vr.arrival_time,
    vr.actual_departure,
    vr.actual_arrival,
    vr.status AS route_status
FROM vehicle v
LEFT JOIN vehicle_route vr ON v.id = vr.vehicle_id
LEFT JOIN route r ON vr.route_id = r.id AND r.deleted_at IS NULL
LEFT JOIN distribution_center origin_dc ON r.origin_distribution_center_id = origin_dc.id AND origin_dc.deleted_at IS NULL
LEFT JOIN distribution_center dest_dc ON r.destination_distribution_center_id = dest_dc.id AND dest_dc.deleted_at IS NULL
LEFT JOIN shipment_type_enum shipment_type ON r.shipment_type_id = shipment_type.id AND shipment_type.deleted_at IS NULL
LEFT JOIN employee e ON vr.driver_id = e.id AND e.deleted_at IS NULL
WHERE v.deleted_at IS NULL;

CREATE OR REPLACE VIEW v_warehouse_stock_summary AS
SELECT 
    w.id AS warehouse_id,
    w.warehouse_code,
    w.warehouse_name,
    country.name AS warehouse_country,
    city.name AS warehouse_city,
    w.capacity_volume_cubic_meter,
    w.capacity_weight_kg,
    w.current_utilization_percentage,
    COUNT(DISTINCT wl.id) AS location_count,
    COUNT(DISTINCT ws.id) AS stock_item_count,
    SUM(ws.current_quantity) AS total_stock_quantity
FROM warehouse w
INNER JOIN country ON w.country_id = country.id
LEFT JOIN city ON w.city_id = city.id AND city.deleted_at IS NULL
LEFT JOIN warehouse_location wl ON w.id = wl.warehouse_id AND wl.deleted_at IS NULL
LEFT JOIN warehouse_stock ws ON w.id = ws.warehouse_id
WHERE w.deleted_at IS NULL
GROUP BY w.id, w.warehouse_code, w.warehouse_name, country.name, city.name,
         w.capacity_volume_cubic_meter, w.capacity_weight_kg, w.current_utilization_percentage;

COMMENT ON VIEW v_cargo_details IS 'Kargo detayları view - Customer, Country, State, Shipment Type JOIN';
COMMENT ON VIEW v_invoice_payment_summary IS 'Fatura ve ödeme özet view - Invoice, Payment, Cargo, Customer JOIN';
COMMENT ON VIEW v_cargo_product_details IS 'Kargo ve ürün detay view - Cargo, Product, Currency JOIN';
COMMENT ON VIEW v_employee_roles IS 'Çalışan ve rol view - Employee, Actor, Role, Permission JOIN';
COMMENT ON VIEW v_cargo_movement_history IS 'Kargo hareket geçmişi view - Cargo, Branch, DistributionCenter, State JOIN';
COMMENT ON VIEW v_customs_tax_details IS 'Gümrük vergi detay view - Cargo, CustomsTaxCalculation, Country, TaxRegulation JOIN';
COMMENT ON VIEW v_partner_commission_summary IS 'Partner komisyon özet view - Partner, Actor, CommissionCalculation, Cargo JOIN';
COMMENT ON VIEW v_cargo_state_timeline IS 'Kargo durum zaman çizelgesi view - Cargo, CargoStateHistory, StateEnum, Employee JOIN';
COMMENT ON VIEW v_pricing_calculation_details IS 'Fiyatlandırma detay view - Cargo, PricingCalculation, PricingCalculationDetail, Currency JOIN';
COMMENT ON VIEW v_customer_cargo_summary IS 'Müşteri kargo özet view - Customer, Actor, Cargo, Invoice, Payment JOIN';
COMMENT ON VIEW v_vehicle_route_details IS 'Araç rota detay view - Vehicle, VehicleRoute, Route, DistributionCenter, Employee JOIN';
COMMENT ON VIEW v_warehouse_stock_summary IS 'Depo stok özet view - Warehouse, WarehouseLocation, WarehouseStock, Country JOIN';

