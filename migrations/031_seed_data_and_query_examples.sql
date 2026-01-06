INSERT INTO language (language_code, language_name, native_name, is_default) VALUES
    ('en', 'English', 'English', true),
    ('tr', 'Turkish', 'Türkçe', false),
    ('de', 'German', 'Deutsch', false),
    ('fr', 'French', 'Français', false),
    ('es', 'Spanish', 'Español', false),
    ('ar', 'Arabic', 'العربية', false)
ON CONFLICT (language_code) DO NOTHING;
--Dil tanımlarını ekler (İngilizce, Türkçe, Almanca, Fransızca, İspanyolca, Arapça).


INSERT INTO currency_enum (code, name, symbol) VALUES
    ('USD', 'US Dollar', '$'),
    ('EUR', 'Euro', '€'),
    ('TRY', 'Turkish Lira', '₺'),
    ('GBP', 'British Pound', '£'),
    ('JPY', 'Japanese Yen', '¥'),
    ('CNY', 'Chinese Yuan', '¥')
ON CONFLICT (code) DO NOTHING;
--Para birimi enum değerlerini ekler (USD, EUR, TRY, GBP, JPY, CNY).

INSERT INTO state_enum (code, name, description) VALUES
    ('created', 'Oluşturuldu', 'Kargo oluşturuldu'),
    ('customs_review', 'Gümrük İncelemesi', 'Gümrük incelemesi sürüyor'),
    ('transit', 'Yolda', 'Kargo transit durumunda'),
    ('delayed', 'Gecikmiş', 'Kargo gecikme durumunda'),
    ('delivered', 'Teslim Edildi', 'Kargo teslim edildi'),
    ('returned', 'İade Edildi', 'Kargo iade edildi'),
    ('cancelled', 'İptal Edildi', 'Kargo iptal edildi')
ON CONFLICT (code) DO NOTHING;
--Kargo durum enum değerlerini ekler (oluşturuldu, transit, teslim edildi, iptal edildi vb.).

INSERT INTO shipment_type_enum (code, name, description) VALUES
    ('land', 'Kara Taşımacılığı', 'Kara yolu ile taşıma'),
    ('air', 'Hava Taşımacılığı', 'Hava yolu ile taşıma'),
    ('sea', 'Deniz Taşımacılığı', 'Deniz yolu ile taşıma'),
    ('express', 'Express', 'Hızlı teslimat')
ON CONFLICT (code) DO NOTHING;
--Gönderim tipi enum değerlerini ekler (kara, hava, deniz, express).

INSERT INTO delivery_option_enum (code, name, description) VALUES
    ('door', 'Kapıya Bırakma', 'Kapıya bırakılır'),
    ('neighbor', 'Komşuya Teslim', 'Komşuya teslim edilir'),
    ('signature', 'İmza Zorunlu', 'İmza ile teslim edilir')
ON CONFLICT (code) DO NOTHING;
--Teslimat seçenekleri enum değerlerini ekler (kapıya bırakma, komşuya teslim, imza zorunlu).


INSERT INTO cargo_type_enum (code, name, description) VALUES
    ('fragile', 'Kırılabilir', 'Kırılabilir ürün'),
    ('hazardous', 'Tehlikeli Madde', 'Tehlikeli madde içeren'),
    ('sensitive', 'Hassas', 'Hassas ürün'),
    ('standard', 'Standart', 'Standart kargo')
ON CONFLICT (code) DO NOTHING;
--Kargo tipi enum değerlerini ekler (kırılabilir, tehlikeli, hassas, standart).


INSERT INTO payment_method_enum (code, name, description) VALUES
    ('credit_card', 'Kredi Kartı', 'Kredi kartı ile ödeme'),
    ('debit_card', 'Banka Kartı', 'Banka kartı ile ödeme'),
    ('cash_on_delivery', 'Kapıda Ödeme', 'Kapıda nakit ödeme'),
    ('bank_transfer', 'Banka Havalesi', 'Banka havalesi ile ödeme')
ON CONFLICT (code) DO NOTHING;
--Ödeme yöntemi enum değerlerini ekler (kredi kartı, banka kartı, kapıda ödeme, havale).


INSERT INTO payment_status_enum (code, name, description) VALUES
    ('pending', 'Beklemede', 'Ödeme beklemede'),
    ('approved', 'Onaylandı', 'Ödeme onaylandı'),
    ('rejected', 'Reddedildi', 'Ödeme reddedildi'),
    ('refunded', 'İade Edildi', 'Ödeme iade edildi'),
    ('processing', 'İşleniyor', 'Ödeme işleniyor')
ON CONFLICT (code) DO NOTHING;
--Ödeme durumu enum değerlerini ekler (beklemede, onaylandı, reddedildi, iade edildi, işleniyor).

INSERT INTO shipment_type_enum (code, name)
VALUES
    ('STANDARD', 'Standart Gönderi'),
    ('EXPRESS', 'Hızlı Gönderi'),
    ('INTERNATIONAL', 'Uluslararası Gönderi')
ON CONFLICT (code) DO NOTHING;
-- gönderi tipi enum değerlerini ekler

INSERT INTO country (iso_code, iso_code_2, name, is_active) VALUES
    ('TUR', 'TR', 'Turkey', true),
    ('USA', 'US', 'United States', true),
    ('DEU', 'DE', 'Germany', true),
    ('FRA', 'FR', 'France', true),
    ('GBR', 'GB', 'United Kingdom', true),
    ('CHN', 'CN', 'China', true),
    ('ITA', 'IT', 'Italy', true),
    ('ESP', 'ES', 'Spain', true),
    ('NLD', 'NL', 'Netherlands', true),
    ('BEL', 'BE', 'Belgium', true)
ON CONFLICT (iso_code) DO NOTHING;
--Ülke bilgilerini ekler (Türkiye, ABD, Almanya, Fransa, İngiltere, Çin, İtalya, İspanya, Hollanda, Belçika).


INSERT INTO role (code, name, description, is_active) VALUES
    ('admin', 'Yönetici', 'Sistem yöneticisi', true),
    ('customer_service', 'Müşteri Hizmetleri', 'Müşteri hizmetleri personeli', true),
    ('courier', 'Kurye', 'Kargo dağıtım personeli', true),
    ('warehouse_staff', 'Depo Personeli', 'Depo işlem personeli', true),
    ('accounting', 'Muhasebe', 'Muhasebe personeli', true),
    ('driver', 'Şoför', 'Araç sürücüsü', true),
    ('supervisor', 'Süpervizör', 'İş süpervizörü', true)
ON CONFLICT (code) DO NOTHING;
--Rol tanımlarını ekler (yönetici, müşteri hizmetleri, kurye, depo personeli, muhasebe, şoför, süpervizör).


INSERT INTO permission (code, name, resource, action, description, is_active) VALUES
    ('cargo_create', 'Kargo Oluştur', 'cargo', 'create', 'Yeni kargo oluşturma yetkisi', true),
    ('cargo_read', 'Kargo Görüntüle', 'cargo', 'read', 'Kargo bilgilerini görüntüleme yetkisi', true),
    ('cargo_update', 'Kargo Güncelle', 'cargo', 'update', 'Kargo bilgilerini güncelleme yetkisi', true),
    ('invoice_create', 'Fatura Oluştur', 'invoice', 'create', 'Fatura oluşturma yetkisi', true),
    ('invoice_read', 'Fatura Görüntüle', 'invoice', 'read', 'Fatura görüntüleme yetkisi', true),
    ('customer_read', 'Müşteri Görüntüle', 'customer', 'read', 'Müşteri bilgilerini görüntüleme yetkisi', true),
    ('customer_update', 'Müşteri Güncelle', 'customer', 'update', 'Müşteri bilgilerini güncelleme yetkisi', true),
    ('warehouse_read', 'Depo Görüntüle', 'warehouse', 'read', 'Depo bilgilerini görüntüleme yetkisi', true),
    ('warehouse_update', 'Depo Güncelle', 'warehouse', 'update', 'Depo bilgilerini güncelleme yetkisi', true),
    ('vehicle_read', 'Araç Görüntüle', 'vehicle', 'read', 'Araç bilgilerini görüntüleme yetkisi', true)
ON CONFLICT (code) DO NOTHING;
--Yetki tanımlarını ekler (kargo oluşturma, görüntüleme, güncelleme, fatura işlemleri, müşteri işlemleri vb.).


INSERT INTO exchange_rate (from_currency_id, to_currency_id, rate_value, effective_date, source, is_active)
SELECT 
    (SELECT id FROM currency_enum WHERE code = 'USD'),
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    32.50,
    CURRENT_DATE,
    'central_bank',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM exchange_rate 
    WHERE from_currency_id = (SELECT id FROM currency_enum WHERE code = 'USD')
    AND to_currency_id = (SELECT id FROM currency_enum WHERE code = 'TRY')
    AND effective_date = CURRENT_DATE
);
--USD > TRY kurunu, aynı gün için zaten kayıt yoksa exchange_rate tablosuna ekler.


INSERT INTO exchange_rate (from_currency_id, to_currency_id, rate_value, effective_date, source, is_active)
SELECT 
    (SELECT id FROM currency_enum WHERE code = 'EUR'),
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    35.20,
    CURRENT_DATE,
    'central_bank',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM exchange_rate 
    WHERE from_currency_id = (SELECT id FROM currency_enum WHERE code = 'EUR')
    AND to_currency_id = (SELECT id FROM currency_enum WHERE code = 'TRY')
    AND effective_date = CURRENT_DATE
);
--EUR > TRY kurunu, aynı gün için zaten kayıt yoksa exchange_rate tablosuna ekler.


INSERT INTO exchange_rate (from_currency_id, to_currency_id, rate_value, effective_date, source, is_active)
SELECT 
    (SELECT id FROM currency_enum WHERE code = 'GBP'),
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    41.30,
    CURRENT_DATE,
    'central_bank',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM exchange_rate 
    WHERE from_currency_id = (SELECT id FROM currency_enum WHERE code = 'GBP')
    AND to_currency_id = (SELECT id FROM currency_enum WHERE code = 'TRY')
    AND effective_date = CURRENT_DATE
);
--GBP > TRY kurunu, aynı gün için zaten kayıt yoksa exchange_rate tablosuna ekler. 


INSERT INTO vehicle_type (type_code, type_name, description, default_capacity_weight_kg, default_capacity_volume_cubic_meter, is_active) VALUES
    ('truck_small', 'Küçük Kamyon', 'Küçük kamyon', 5000.00, 20.00, true),
    ('truck_large', 'Büyük Kamyon', 'Büyük kamyon', 20000.00, 80.00, true),
    ('van', 'Kamyonet', 'Kamyonet', 1500.00, 10.00, true),
    ('aircraft', 'Uçak', 'Hava taşımacılığı', 30000.00, 200.00, true),
    ('ship', 'Gemi', 'Deniz taşımacılığı', 1000000.00, 5000.00, true),
    ('motorcycle', 'Motosiklet', 'Hızlı teslimat motosikleti', 150.00, 1.00, true)
ON CONFLICT (type_code) DO NOTHING;
--Araç tipi tanımlarını ekler (küçük kamyon, büyük kamyon, kamyonet, uçak, gemi, motosiklet).


INSERT INTO delivery_time_slot (time_slot_code, start_time, end_time, available_slots, is_active) VALUES
    ('morning', '09:00:00', '12:00:00', 20, true),
    ('afternoon', '13:00:00', '17:00:00', 20, true),
    ('evening', '18:00:00', '20:00:00', 10, true),
    ('full_day', '09:00:00', '20:00:00', 50, true)
ON CONFLICT (time_slot_code) DO NOTHING;
--Teslimat zaman slotlarını ekler (sabah, öğleden sonra, akşam, tam gün).


INSERT INTO packaging_type (type_code, type_name, description, cost_additional, is_active) VALUES
    ('standard', 'Standart Ambalaj', 'Standart kargo ambalajı', 0.00, true),
    ('reinforced', 'Sağlam Ambalaj', 'Güçlendirilmiş ambalaj', 50.00, true),
    ('refrigerated', 'Soğutmalı Ambalaj', 'Soğuk zincir ambalajı', 100.00, true),
    ('hazardous', 'Tehlikeli Madde Ambalajı', 'Tehlikeli madde için özel ambalaj', 200.00, true),
    ('fragile_extra', 'Kırılgan Ekstra', 'Kırılgan ürünler için ekstra koruma', 75.00, true)
ON CONFLICT (type_code) DO NOTHING;
--Ambalaj tipi tanımlarını ekler (standart, sağlam, soğutmalı, tehlikeli madde, kırılgan ekstra).


INSERT INTO customer_segment (segment_code, segment_name, criteria, priority, discount_percentage, is_active) VALUES
    ('vip', 'VIP Müşteri', '{"min_total_orders": 100, "min_monthly_spending": 5000}', 1, 15.00, true),
    ('premium', 'Premium Müşteri', '{"min_total_orders": 50, "min_monthly_spending": 2000}', 2, 10.00, true),
    ('regular', 'Standart Müşteri', '{"min_total_orders": 10}', 3, 5.00, true),
    ('new', 'Yeni Müşteri', '{"max_total_orders": 5}', 4, 0.00, true)
ON CONFLICT (segment_code) DO NOTHING;
--Müşteri segment tanımlarını ekler (VIP, Premium, Standart, Yeni müşteri).


INSERT INTO loyalty_program (program_name, description, point_conversion_rate, tier_levels, is_active) VALUES
    ('Standard Loyalty', 'Standart sadakat programı', 0.10, 
     '{"bronze": {"threshold": 0, "discount": 0}, "silver": {"threshold": 1000, "discount": 5}, "gold": {"threshold": 5000, "discount": 10}, "platinum": {"threshold": 10000, "discount": 15}}', 
     true)
ON CONFLICT DO NOTHING;
--Sadakat programı tanımını ekler (bronze, silver, gold, platinum seviyeleri ile).


INSERT INTO notification_template (template_code, template_name, notification_type, subject_template, body_template, language_code, variables, is_active)
SELECT 
    'cargo_status_update',
    'Kargo Durum Güncelleme',
    'sms',
    'Kargo Durumu',
    'Sayın {customer_name}, {tracking_number} takip numaralı kargonuz {status} durumuna geçti.',
    'tr',
    '{"customer_name": "string", "tracking_number": "string", "status": "string"}'::jsonb,
    true
WHERE NOT EXISTS (SELECT 1 FROM notification_template WHERE template_code = 'cargo_status_update');
--Kargo durum güncelleme SMS şablonunu ekler (template_code yoksa).


INSERT INTO notification_template (template_code, template_name, notification_type, subject_template, body_template, language_code, variables, is_active)
SELECT 
    'cargo_status_update_email',
    'Kargo Durum Güncelleme (Email)',
    'email',
    'Kargo Durum Güncellemesi',
    '<html><body><p>Sayın {customer_name},</p><p>{tracking_number} takip numaralı kargonuz {status} durumuna geçti.</p></body></html>',
    'tr',
    '{"customer_name": "string", "tracking_number": "string", "status": "string"}'::jsonb,
    true
WHERE NOT EXISTS (SELECT 1 FROM notification_template WHERE template_code = 'cargo_status_update_email');
--Kargo durum güncelleme email şablonunu ekler (template_code yoksa).


INSERT INTO workflow_definition (workflow_name, workflow_code, workflow_type, steps, is_active) VALUES
    ('İade Onay Süreci', 'return_approval', 'cargo_return_approval',
     '[{"step": 1, "name": "Başvuru Değerlendirme", "type": "approval", "required_role": "customer_service"}, {"step": 2, "name": "Müdür Onayı", "type": "approval", "required_role": "admin"}]'::jsonb,
     true),
    ('Fatura Onay Süreci', 'invoice_approval', 'invoice_approval',
     '[{"step": 1, "name": "Muhasebe Kontrolü", "type": "approval", "required_role": "accounting"}]'::jsonb,
     true)
ON CONFLICT (workflow_code) DO NOTHING;
--İş akışı tanımlarını ekler (iade onay süreci, fatura onay süreci).


INSERT INTO approval_chain (chain_name, chain_code, entity_type, approval_levels, is_active) VALUES
    ('İade Onay Zinciri', 'return_approval_chain', 'cargo_return_request',
     '[{"level": 1, "role": "customer_service", "required": true}, {"level": 2, "role": "admin", "required": true}]'::jsonb,
     true),
    ('Yüksek Tutarlı Fatura Onay', 'high_amount_invoice_approval', 'invoice',
     '[{"level": 1, "role": "accounting", "required": true}, {"level": 2, "role": "admin", "required": true}]'::jsonb,
     true)
ON CONFLICT (chain_code) DO NOTHING;
--Onay zinciri tanımlarını ekler (iade onay zinciri, yüksek tutarlı fatura onayı).


INSERT INTO actor (actor_type, email, phone, address, is_active) VALUES
    ('customer', 'john.doe@example.com', '+905551234567', 'İstanbul, Türkiye', true),
    ('employee', 'manager@cargo.com', '+905559876543', 'Ankara, Türkiye', true),
    ('partner', 'partner@example.com', '+905557654321', 'İzmir, Türkiye', true)
ON CONFLICT DO NOTHING;
--Aktör kayıtlarını ekler (müşteri, çalışan, partner örnekleri).


INSERT INTO customer (actor_id, first_name, last_name, country_id, is_verified)
SELECT 
    (SELECT id FROM actor WHERE email = 'john.doe@example.com'),
    'John',
    'Doe',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    true
WHERE NOT EXISTS (SELECT 1 FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com'));
--Örnek müşteri kaydını ekler (John Doe, actor_id yoksa).


INSERT INTO employee (actor_id, employee_number, first_name, last_name, hire_date, department, position, country_id, is_active)
SELECT 
    (SELECT id FROM actor WHERE email = 'manager@cargo.com'),
    'EMP001',
    'Ahmet',
    'Yılmaz',
    CURRENT_DATE - INTERVAL '5 years',
    'Yönetim',
    'Yönetici',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    true
WHERE NOT EXISTS (SELECT 1 FROM employee WHERE employee_number = 'EMP001');
--Örnek çalışan kaydını ekler (Ahmet Yılmaz, EMP001 numarası yoksa).


INSERT INTO partner (actor_id, company_name, country_id, api_active, is_active)
SELECT 
    (SELECT id FROM actor WHERE email = 'partner@example.com'),
    'Örnek Kargo Partner A.Ş.',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    true,
    true
WHERE NOT EXISTS (SELECT 1 FROM partner WHERE actor_id = (SELECT id FROM actor WHERE email = 'partner@example.com'));
--Örnek partner kaydını ekler (Örnek Kargo Partner A.Ş., actor_id yoksa).


INSERT INTO region (country_id, name, code, is_active)
SELECT 
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    'Marmara',
    'MAR',
    true
WHERE NOT EXISTS (SELECT 1 FROM region WHERE code = 'MAR' AND country_id = (SELECT id FROM country WHERE iso_code = 'TUR'));
--Marmara bölgesi kaydını ekler (Türkiye için, code yoksa).


INSERT INTO city (region_id, name, code, is_active)
SELECT 
    (SELECT id FROM region WHERE code = 'MAR'),
    'İstanbul',
    'IST',
    true
WHERE NOT EXISTS (SELECT 1 FROM city WHERE code = 'IST');
--İstanbul şehir kaydını ekler (Marmara bölgesi için, code yoksa).

INSERT INTO district (city_id, name, code, is_active)
SELECT
    (SELECT id FROM city WHERE code = 'IST'),
    'Taksim',
    'IST-TAKSIM',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM district WHERE code = 'IST-TAKSIM'
);
--Bu sorgu, İstanbul şehrine bağlı Taksim adlı bir district ekler.
INSERT INTO branch (
    district_id,
    name,
    code,
    address,
    phone,
    email,
    is_active
)
SELECT
    (SELECT id FROM district WHERE code = 'IST-TAKSIM'),
    'İstanbul Merkez Şube',
    'IST-001',
    'Taksim, İstanbul',
    '+90 212 000 00 00',
    'istanbul@cargo.com',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM branch WHERE code = 'IST-001'
);
--İstanbul Merkez Şube kaydını ekler (İstanbul için, code yoksa).


INSERT INTO institution_agreement (institution_name, institution_code, discount_percentage, valid_from, is_active, auto_apply) VALUES
    ('Ege Üniversitesi', 'EGE-UNI', 15.00, CURRENT_DATE, true, true),
    ('İstanbul Teknik Üniversitesi', 'ITU', 12.00, CURRENT_DATE, true, true),
    ('Ankara Üniversitesi', 'ANK-UNI', 10.00, CURRENT_DATE, true, false)
ON CONFLICT DO NOTHING;
--Kurum anlaşmalarını ekler (Ege Üniversitesi, İTÜ, Ankara Üniversitesi).


INSERT INTO warehouse (warehouse_code, warehouse_name, country_id, city_id, address, is_active)
SELECT 
    'WH-IST-001',
    'İstanbul Ana Depo',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    (SELECT id FROM city WHERE code = 'IST'),
    'İstanbul Depo Adresi',
    true
WHERE NOT EXISTS (SELECT 1 FROM warehouse WHERE warehouse_code = 'WH-IST-001');
--İstanbul Ana Depo kaydını ekler (warehouse_code yoksa).


INSERT INTO warehouse_location (warehouse_id, location_code, location_type, is_active)
SELECT 
    (SELECT id FROM warehouse WHERE warehouse_code = 'WH-IST-001'),
    'A-01-01',
    'shelf',
    true
WHERE NOT EXISTS (SELECT 1 FROM warehouse_location WHERE warehouse_id = (SELECT id FROM warehouse WHERE warehouse_code = 'WH-IST-001') AND location_code = 'A-01-01');
--Depo lokasyon kaydını ekler (A-01-01 shelf, warehouse_id ve location_code kombinasyonu yoksa).


INSERT INTO vehicle (vehicle_code, license_plate, vehicle_type_id, capacity_weight_kg, capacity_volume_cubic_meter, is_active)
SELECT 
    'VEH-001',
    '34ABC123',
    (SELECT id FROM vehicle_type WHERE type_code = 'truck_large'),
    20000.00,
    80.00,
    true
WHERE NOT EXISTS (SELECT 1 FROM vehicle WHERE vehicle_code = 'VEH-001');
--Örnek araç kaydını ekler (34ABC123 plakalı, VEH-001 kodu yoksa).


INSERT INTO cargo (tracking_number, customer_id, origin_branch_id, destination_branch_id, origin_country_id, destination_country_id, origin_date, cargo_type_id, shipment_type_id, weight_kg, value_declaration, currency_id, current_state_id)
SELECT 
    'TRK123456789',
    (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com')),
    (SELECT id FROM branch WHERE code = 'IST-001'),
    (SELECT id FROM branch WHERE code = 'IST-001'),
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    CURRENT_TIMESTAMP,
    (SELECT id FROM cargo_type_enum WHERE code = 'standard'),
    (SELECT id FROM shipment_type_enum WHERE code = 'express'),
    5.500,
    1000.00,
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    (SELECT id FROM state_enum WHERE code = 'created')
WHERE NOT EXISTS (SELECT 1 FROM cargo WHERE tracking_number = 'TRK123456789');
--Örnek kargo kaydını ekler (TRK123456789 takip numaralı, tracking_number yoksa).


INSERT INTO product (product_code, cargo_id, name, description, quantity, unit_value, currency_id)
SELECT 
    'PROD-001',
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    'Örnek Ürün',
    'Test ürünü açıklaması',
    2,
    500.00,
    (SELECT id FROM currency_enum WHERE code = 'TRY')
WHERE NOT EXISTS (SELECT 1 FROM product WHERE product_code = 'PROD-001');
--Örnek ürün kaydını ekler (PROD-001 kodlu, product_code yoksa).


INSERT INTO invoice (
    cargo_id,
    invoice_number,
    invoice_date,
    is_main_invoice,
    is_additional_invoice,
    invoice_type,
    subtotal,
    tax_amount,
    discount_amount,
    total_amount,
    currency_id
)
SELECT
    c.id,
    'INV-001',
    CURRENT_DATE,
    true,
    false,
    'standard',   
    1000.00,      
    200.00,       
    0.00,         
    1200.00,      
    cur.id
FROM cargo c
JOIN currency_enum cur ON cur.code = 'TRY'
WHERE c.tracking_number = 'TRK123456789'
  AND NOT EXISTS (
      SELECT 1 FROM invoice WHERE invoice_number = 'INV-001'
  );

--Örnek fatura kaydını ekler (INV-001 numaralı, invoice_number yoksa).


INSERT INTO payment (
    invoice_id,
    cargo_id,
    payment_method_id,
    amount,
    currency_id,
    payment_status_id
)
SELECT
    i.id,
    c.id,
    pm.id,
    1200.00,
    cur.id,
    ps.id
FROM invoice i
JOIN cargo c ON c.tracking_number = 'TRK123456789'
JOIN payment_method_enum pm ON pm.code = 'credit_card'
JOIN payment_status_enum ps ON ps.code = 'approved'
JOIN currency_enum cur ON cur.code = 'TRY'
WHERE i.invoice_number = 'INV-001'
  AND NOT EXISTS (
      SELECT 1 FROM payment WHERE invoice_id = i.id
  );
--Örnek ödeme kaydını ekler (INV-001 faturası için, invoice_id yoksa).


INSERT INTO cargo_state_history (cargo_id, state_id, event_time, description, changed_by)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    (SELECT id FROM state_enum WHERE code = 'created'),
    CURRENT_TIMESTAMP,
    'Kargo oluşturuldu',
    (SELECT id FROM employee WHERE employee_number = 'EMP001')
WHERE NOT EXISTS (SELECT 1 FROM cargo_state_history WHERE cargo_id = (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789') AND state_id = (SELECT id FROM state_enum WHERE code = 'created'));
--Kargo durum geçmişi kaydını ekler (created durumu için, cargo_id ve state_id kombinasyonu yoksa).


INSERT INTO employee_role (employee_id, role_id)
SELECT 
    (SELECT id FROM employee WHERE employee_number = 'EMP001'),
    (SELECT id FROM role WHERE code = 'admin')
WHERE NOT EXISTS (SELECT 1 FROM employee_role WHERE employee_id = (SELECT id FROM employee WHERE employee_number = 'EMP001') AND role_id = (SELECT id FROM role WHERE code = 'admin'));
--Çalışan-rol ilişkisini ekler (EMP001 çalışanına admin rolü atar, ilişki yoksa).


INSERT INTO role_permission (role_id, permission_id)
SELECT 
    (SELECT id FROM role WHERE code = 'admin'),
    (SELECT id FROM permission WHERE code = 'cargo_create')
WHERE NOT EXISTS (SELECT 1 FROM role_permission WHERE role_id = (SELECT id FROM role WHERE code = 'admin') AND permission_id = (SELECT id FROM permission WHERE code = 'cargo_create'));
--Rol-yetki ilişkisini ekler (admin rolüne cargo_create yetkisi verir, ilişki yoksa).


INSERT INTO customer_segment_assignment (customer_id, customer_segment_id, assigned_date, assigned_by)
SELECT 
    (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com')),
    (SELECT id FROM customer_segment WHERE segment_code = 'new'),
    CURRENT_DATE,
    (SELECT id FROM employee WHERE employee_number = 'EMP001')
WHERE NOT EXISTS (SELECT 1 FROM customer_segment_assignment WHERE customer_id = (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com')));
--Müşteri-segment atamasını ekler (John Doe'yu yeni müşteri segmentine atar, customer_id yoksa).


INSERT INTO customer_loyalty_points (customer_id, total_points, current_tier, loyalty_program_id)
SELECT 
    (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com')),
    0,
    'bronze',
    (SELECT id FROM loyalty_program LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM customer_loyalty_points WHERE customer_id = (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com')));
--Müşteri sadakat puanı kaydını ekler (John Doe için bronze seviye ile başlatır, customer_id yoksa).


INSERT INTO promotion (
    promotion_code,
    promotion_name,
    discount_type,
    discount_value,
    valid_from,
    valid_to,
    usage_limit,
    is_active
)
VALUES
    (
        'NEWUSER10',
        'Yeni Kullanıcı İndirimi',
        'percentage',
        10.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 year',
        1000,
        true
    ),
    (
        'BULK20',
        'Toplu Gönderim İndirimi',
        'percentage',
        20.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        500,
        true
    )
ON CONFLICT (promotion_code) DO NOTHING;
--Promosyon kayıtlarını ekler (Yeni Kullanıcı İndirimi, Toplu Gönderim İndirimi).

INSERT INTO coupon (
    coupon_code,
    discount_type,
    discount_value,
    valid_from,
    valid_to,
    usage_limit_per_customer,
    min_purchase_amount,
    applicable_to_cargo_types,
    applicable_to_shipment_types,
    is_active
)
VALUES
(
    'SUMMER2024',
    'percentage',
    15.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 months',
    9999,
    0.00,
    NULL,
    NULL,
    true
),
(
    'FIRST50',
    'fixed_amount',
    50.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    1,
    0.00,
    NULL,
    NULL,
    true
)
ON CONFLICT (coupon_code) DO NOTHING;

--Kupon kayıtlarını ekler (Yaz Kampanyası, İlk Kargo İndirimi).



INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
    ('undelivered_cancel_threshold_hours', '168', 'integer', 'Teslim alınmayan kargolar için otomatik iptal eşiği (saat)'),
    ('estimated_delivery_calculation_delay_hours', '12', 'integer', 'Tahmini teslim süresi hesaplama gecikmesi (saat)'),
    ('max_products_per_cargo', '5', 'integer', 'Bir kargoda maksimum ürün sayısı'),
    ('archive_lifecycle_active_years', '1', 'integer', 'Aktif transactional storage yılı'),
    ('archive_lifecycle_archive_years', '3', 'integer', 'Arşiv depolama yılı'),
    ('partition_threshold_rows', '10000000', 'integer', 'Partitioning eşiği (satır sayısı)')
ON CONFLICT (config_key) DO NOTHING;
--Sistem yapılandırma değerlerini ekler (iptal eşiği, teslim süresi gecikmesi, maksimum ürün sayısı vb.).


INSERT INTO region (country_id, name, code, is_active)
SELECT id, 'Anadolu', 'ANA', true FROM country WHERE iso_code = 'TUR'
ON CONFLICT DO NOTHING;
--Anadolu bölgesi kaydını ekler (Türkiye için).


INSERT INTO city (region_id, name, code, is_active)
SELECT (SELECT id FROM region WHERE code = 'ANA'), 'Ankara', 'ANK', true
ON CONFLICT DO NOTHING;
--Ankara şehir kaydını ekler (Anadolu bölgesi için).


INSERT INTO branch (
    district_id,
    name,
    code,
    address,
    is_active
)
SELECT
    d.id,
    'Ankara Merkez Şube',
    'ANK-001',
    'Kızılay, Ankara',
    true
FROM district d
JOIN city c ON c.id = d.city_id
WHERE c.code = 'ANK'
  AND d.code = 'KIZILAY'
  AND NOT EXISTS (
      SELECT 1 FROM branch WHERE code = 'ANK-001'
  );
--Ankara Merkez Şube kaydını ekler (Ankara için).


INSERT INTO distribution_center (
    code,
    name,
    country_id,
    city_id,
    address,
    is_active
)
SELECT
    'DC-IST-001',
    'İstanbul Dağıtım Merkezi',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    (SELECT id FROM city WHERE code = 'IST'),
    'İstanbul',
    true
ON CONFLICT (code) DO NOTHING;
--İstanbul Dağıtım Merkezi kaydını ekler.

INSERT INTO distribution_center (
    code, name, country_id, city_id, address, is_active
)
SELECT
    'DC-ANK-001',
    'Ankara Dağıtım Merkezi',
    (SELECT id FROM country WHERE iso_code = 'TUR'),
    (SELECT id FROM city WHERE code = 'ANK'),
    'Ankara',
    true
ON CONFLICT (code) DO NOTHING;
--Ankara Dağıtım Merkezi kaydını ekler.

INSERT INTO route (
    route_code,
    origin_distribution_center_id,
    destination_distribution_center_id,
    shipment_type_id,
    estimated_duration_hours,
    distance_km,
    is_alternative_route,
    is_active
)
VALUES (
    'RT-IST-ANK-001',
    (SELECT id FROM distribution_center WHERE code = 'DC-IST-001'),
    (SELECT id FROM distribution_center WHERE code = 'DC-ANK-001'),
    (SELECT id FROM shipment_type_enum WHERE code = 'STANDARD'),
    8,
    450,
    false,
    true
);
--Rota kaydını ekler (RT-001 kodlu, İstanbul merkezler arası).

INSERT INTO container (container_code, container_type, warehouse_id, dimensions_length_cm, dimensions_width_cm, dimensions_height_cm, is_active)
SELECT 'CONT-001', 'standard', (SELECT id FROM warehouse WHERE warehouse_code = 'WH-IST-001'), 1200, 800, 800, true
ON CONFLICT DO NOTHING;
--Konteyner kaydını ekler (CONT-001 kodlu, standart tip).


INSERT INTO container_cargo_assignment (container_id, cargo_id, assigned_date)
SELECT (SELECT id FROM container WHERE container_code = 'CONT-001'),
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;
--Konteyner-kargo atamasını ekler (CONT-001 ve TRK123456789).


INSERT INTO pricing_calculation (cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost, total_amount, currency_id, shipment_type_id)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    1000.00, 150.00, 50.00, 0.00, 0.00, 1200.00,
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    (SELECT id FROM shipment_type_enum WHERE code = 'express')
ON CONFLICT DO NOTHING;
--Fiyatlandırma hesaplama kaydını ekler (TRK123456789 kargosu için toplam 1200 TL).


INSERT INTO pricing_calculation_detail (pricing_calculation_id, cost_type, amount, description)
SELECT (SELECT id FROM pricing_calculation WHERE cargo_id = (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789')),
    'base_shipping', 150.00, 'Temel kargo ücreti'
ON CONFLICT DO NOTHING;
--Fiyatlandırma detay kaydını ekler (temel kargo ücreti 150 TL).


INSERT INTO cargo_delivery_preference (cargo_id, delivery_option_id)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    (SELECT id FROM delivery_option_enum WHERE code = 'signature')
ON CONFLICT DO NOTHING;
--Kargo teslimat tercihini ekler (imza zorunlu seçeneği).


INSERT INTO cargo_barcode (cargo_id, barcode_value, barcode_type)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    '1234567890123', 'CODE128'
ON CONFLICT DO NOTHING;
--Kargo barkod kaydını ekler (1234567890123 CODE128 tipinde).


INSERT INTO cargo_qr_code (cargo_id, qr_code_value)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    'QR-1234567890123'
ON CONFLICT DO NOTHING;
--Kargo QR kod kaydını ekler (QR-1234567890123).


INSERT INTO cargo_insurance (
    cargo_id,
    insurance_policy_number,
    insured_value,
    premium_amount,
    currency_id,
    coverage_type,
    issue_date,
    expiry_date,
    is_active
)
SELECT
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    'POL-TRK-123456',
    1000.00,
    50.00,
    (SELECT id FROM currency_enum WHERE code = 'TRY'),
    'standard',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    true
ON CONFLICT DO NOTHING;
--Kargo sigorta kaydını ekler (1000 TL değer, 50 TL prim, standart tip).

INSERT INTO vehicle_cargo_assignment (vehicle_id, cargo_id, route_id, assigned_date)
SELECT 
    (SELECT id FROM vehicle WHERE vehicle_code = 'VEH-001'),
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    (SELECT id FROM route WHERE route_code = 'RT-001'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM vehicle_cargo_assignment WHERE vehicle_id = (SELECT id FROM vehicle WHERE vehicle_code = 'VEH-001') AND cargo_id = (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'));
--Araç-kargo atamasını ekler (VEH-001, TRK123456789, RT-001, atama yoksa).


INSERT INTO cargo_movement_history (cargo_id, location_type, branch_id, movement_date, status, description)
SELECT 
    (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789'),
    'branch',
    (SELECT id FROM branch WHERE code = 'IST-001'),
    CURRENT_TIMESTAMP,
    'in_transit',
    'Kargo şubeye teslim edildi'
WHERE NOT EXISTS (SELECT 1 FROM cargo_movement_history WHERE cargo_id = (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789') AND movement_date >= CURRENT_DATE);
--Kargo hareket geçmişi kaydını ekler (şubeye teslim, aynı gün kayıt yoksa).
-----------------------------------------------------

UPDATE cargo 
SET current_state_id = (SELECT id FROM state_enum WHERE code = 'transit'),
    updated_at = CURRENT_TIMESTAMP
WHERE tracking_number = 'TRK123456789' 
AND current_state_id = (SELECT id FROM state_enum WHERE code = 'created');
--Kargo durumunu günceller (TRK123456789 takip numaralı kargonun durumunu 'created'den 'transit'e değiştirir).

UPDATE customer 
SET is_verified = true,
    updated_at = CURRENT_TIMESTAMP
WHERE actor_id IN (SELECT id FROM actor WHERE email = 'john.doe@example.com');
--Müşteri doğrulama durumunu günceller (John Doe müşterisini doğrulanmış olarak işaretler).

UPDATE employee 
SET is_active = true,
    updated_at = CURRENT_TIMESTAMP
WHERE employee_number = 'EMP001';
--Çalışan aktiflik durumunu günceller (EMP001 numaralı çalışanı aktif yapar).

UPDATE invoice 
SET total_amount = 1300.00,
    updated_at = CURRENT_TIMESTAMP
WHERE invoice_number = 'INV-001';
--Fatura toplam tutarını günceller (INV-001 numaralı faturanın tutarını 1300.00 TL'ye çıkarır).

UPDATE warehouse 
SET current_utilization_percentage = 45.50,
    updated_at = CURRENT_TIMESTAMP
WHERE warehouse_code = 'WH-IST-001';
--Depo kullanım oranını günceller (WH-IST-001 kodlu deponun kullanım oranını %45.50 yapar).

UPDATE vehicle 
SET is_in_use = false,
    updated_at = CURRENT_TIMESTAMP
WHERE vehicle_code = 'VEH-001';
--Araç kullanım durumunu günceller (VEH-001 kodlu aracı kullanım dışı yapar).

UPDATE payment 
SET payment_status_id = (SELECT id FROM payment_status_enum WHERE code = 'approved'),
    updated_at = CURRENT_TIMESTAMP
WHERE invoice_id = (SELECT id FROM invoice WHERE invoice_number = 'INV-001');
--Ödeme durumunu günceller (INV-001 faturasına ait ödemeyi 'approved' durumuna alır).

UPDATE country 
SET is_active = true
WHERE iso_code = 'TUR';
--Ülke aktiflik durumunu günceller (Türkiye'yi aktif yapar).

UPDATE role 
SET is_active = true
WHERE code = 'admin';
--Rol aktiflik durumunu günceller (admin rolünü aktif yapar).

UPDATE employee_salary 
SET status = 'paid',
    payment_date = CURRENT_DATE,
    updated_at = CURRENT_TIMESTAMP
WHERE employee_id = (SELECT id FROM employee WHERE employee_number = 'EMP001')
AND status = 'pending';
--Çalışan maaş durumunu günceller (EMP001 çalışanının beklemedeki maaşını ödendi olarak işaretler).

DELETE FROM customer_segment_assignment 
WHERE customer_id = (SELECT id FROM customer WHERE actor_id = (SELECT id FROM actor WHERE email = 'john.doe@example.com'))
AND customer_segment_id = (SELECT id FROM customer_segment WHERE segment_code = 'new');
--Müşteri-segment atamasını siler (John Doe'nun yeni müşteri segmenti atamasını kaldırır).

DELETE FROM product 
WHERE cargo_id = (SELECT id FROM cargo WHERE tracking_number = 'TRK123456789')
AND product_code = 'PROD-001';
--Ürün kaydını siler (TRK123456789 kargosuna ait PROD-001 kodlu ürünü siler).

DELETE FROM employee_role 
WHERE employee_id = (SELECT id FROM employee WHERE employee_number = 'EMP001')
AND role_id = (SELECT id FROM role WHERE code = 'admin');
--Çalışan-rol ilişkisini siler (EMP001 çalışanından admin rolünü kaldırır).

DELETE FROM role_permission 
WHERE role_id = (SELECT id FROM role WHERE code = 'admin')
AND permission_id = (SELECT id FROM permission WHERE code = 'cargo_create');
--Rol-yetki ilişkisini siler (admin rolünden cargo_create yetkisini kaldırır).

DELETE FROM warehouse_location 
WHERE warehouse_id = (SELECT id FROM warehouse WHERE warehouse_code = 'WH-IST-001')
AND location_code = 'A-01-01';
--Depo lokasyon kaydını siler (WH-IST-001 deposundaki A-01-01 lokasyonunu siler).

DELETE FROM cargo 
WHERE tracking_number = 'TRK123456789'
AND current_state_id = (SELECT id FROM state_enum WHERE code = 'cancelled');
--Kargo kaydını siler (TRK123456789 takip numaralı ve iptal edilmiş kargoyu siler).

DELETE FROM invoice 
WHERE invoice_number = 'INV-001'
AND is_additional_invoice = false;
--Fatura kaydını siler (INV-001 numaralı ve ek fatura olmayan faturayı siler).

DELETE FROM payment 
WHERE invoice_id = (SELECT id FROM invoice WHERE invoice_number = 'INV-001')
AND payment_status_id = (SELECT id FROM payment_status_enum WHERE code = 'refunded');
--Ödeme kaydını siler (INV-001 faturasına ait ve iade edilmiş ödemeyi siler).

DELETE FROM exchange_rate 
WHERE from_currency_id = (SELECT id FROM currency_enum WHERE code = 'GBP')
AND to_currency_id = (SELECT id FROM currency_enum WHERE code = 'TRY')
AND effective_date < CURRENT_DATE - INTERVAL '1 year';
--Eski döviz kuru kayıtlarını siler (GBP > TRY kurlarının 1 yıldan eski olanlarını siler).

DELETE FROM promotion 
WHERE valid_to < CURRENT_DATE
AND is_active = false;
--Süresi dolmuş promosyonları siler (geçerlilik tarihi geçmiş ve aktif olmayan promosyonları siler).

DELETE FROM coupon 
WHERE valid_to < CURRENT_DATE
AND is_active = false;
--Süresi dolmuş kuponları siler (geçerlilik tarihi geçmiş ve aktif olmayan kuponları siler).




SELECT * FROM cargo 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;
--Tüm kargo kayıtlarını en yeni tarih sırasına göre listeler (tek tablo SELECT).

SELECT code, name, description 
FROM state_enum 
WHERE code IN ('created', 'transit', 'delivered')
ORDER BY code;
--Belirli kargo durumlarını listeler (created, transit, delivered durumlarını kod sırasına göre gösterir).

SELECT c.tracking_number, c.value_declaration, cu.first_name, cu.last_name
FROM cargo c
INNER JOIN customer cu ON c.customer_id = cu.id
WHERE c.deleted_at IS NULL 
AND cu.deleted_at IS NULL;
--Kargo ve müşteri bilgilerini birleştirir (iki tablo SELECT - kargo takip numarası, değer beyanı ve müşteri adı soyadı).

SELECT i.invoice_number, i.total_amount, c.tracking_number, p.amount as payment_amount
FROM invoice i
INNER JOIN cargo c ON i.cargo_id = c.id
INNER JOIN payment p ON p.invoice_id = i.id
WHERE i.deleted_at IS NULL
AND c.deleted_at IS NULL
AND p.deleted_at IS NULL;
--Fatura, kargo ve ödeme bilgilerini birleştirir (üç tablo SELECT - fatura numarası, toplam tutar, takip numarası ve ödeme tutarı).

SELECT w.warehouse_name, wl.location_code, wl.location_type
FROM warehouse w
INNER JOIN warehouse_location wl ON w.id = wl.warehouse_id
WHERE w.deleted_at IS NULL
AND wl.deleted_at IS NULL;
--Depo ve depo lokasyon bilgilerini birleştirir (iki tablo SELECT - depo adı, lokasyon kodu ve lokasyon tipi).

SELECT c.tracking_number, cs.event_time, se.name as state_name, e.first_name || ' ' || e.last_name as changed_by_name
FROM cargo c
INNER JOIN cargo_state_history cs ON c.id = cs.cargo_id
INNER JOIN state_enum se ON cs.state_id = se.id
LEFT JOIN employee e ON cs.changed_by = e.id
WHERE c.deleted_at IS NULL
ORDER BY cs.event_time DESC;
--Kargo durum geçmişini detaylı olarak listeler (dört tablo SELECT - takip numarası, olay zamanı, durum adı ve değiştiren kişi adı).

SELECT i.invoice_number, c.tracking_number, cu.first_name, cu.last_name, p.amount, pms.name as payment_status
FROM invoice i
INNER JOIN cargo c ON i.cargo_id = c.id
INNER JOIN customer cu ON c.customer_id = cu.id
INNER JOIN payment p ON p.invoice_id = i.id
INNER JOIN payment_status_enum pms ON p.payment_status_id = pms.id
WHERE i.deleted_at IS NULL
AND c.deleted_at IS NULL
AND cu.deleted_at IS NULL
AND p.deleted_at IS NULL;
--Fatura, kargo, müşteri, ödeme ve ödeme durumu bilgilerini birleştirir (beş tablo SELECT - fatura numarası, takip numarası, müşteri bilgileri, ödeme tutarı ve ödeme durumu).

SELECT c.tracking_number, b.name as branch_name
FROM cargo c
INNER JOIN branch b ON c.origin_branch_id = b.id
WHERE c.deleted_at IS NULL
AND b.deleted_at IS NULL;
--Kargo ve şube bilgilerini birleştirir (iki tablo SELECT - takip numarası ve çıkış şube adı).
