# Migration 005: Kargo Yönetim Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sisteminin çekirdek iş mantığını oluşturur. Kargo gönderileri, ürünler, durum geçmişi, hareket geçmişi, teslimat tercihleri, iade talepleri, hasar raporları ve olay logları için tablolar oluşturulur.

### Oluşturulan Tablolar

1. **cargo** - Ana kargo tablosu
2. **product** - Kargo içindeki ürünler
3. **product_value_history** - Ürün değer geçmişi
4. **cargo_state_history** - Kargo durum geçmişi
5. **cargo_movement_history** - Kargo hareket geçmişi
6. **cargo_delivery_preference** - Teslimat tercihleri
7. **cargo_return_request** - İade talepleri
8. **cargo_damage_report** - Hasar raporları
9. **event_evidence** - Olay kanıtları
10. **cargo_event_log** - Kargo olay logları

## Cargo Domain Açıklaması

### Kargo Nedir?

Kargo, müşteriler tarafından gönderilen fiziksel paketlerdir. Her kargo:
- **Tracking Number**: Benzersiz takip numarası
- **Customer**: Gönderen müşteri
- **Origin/Destination**: Başlangıç ve varış lokasyonları
- **Cargo Type**: Kargo tipi (döküman, paket, palet)
- **Shipment Type**: Gönderi tipi (standart, ekspres, ekonomi)
- **Weight & Dimensions**: Ağırlık ve boyutlar
- **Value Declaration**: Beyan edilen değer
- **Current State**: Mevcut durum

### Gerçek Dünya Eşleştirmesi

#### 1. Kargo Oluşturma Süreci

1. **Müşteri Kaydı**: Müşteri sisteme kayıtlı olmalı (customer tablosu)
2. **Kargo Bilgileri**: 
   - Gönderen ve alıcı bilgileri
   - Başlangıç ve varış ülkeleri
   - Kargo tipi ve gönderi tipi
   - Ağırlık ve boyutlar
   - Beyan edilen değer
3. **Tracking Number**: Sistem otomatik olarak benzersiz tracking number oluşturur
4. **Initial State**: Kargo ilk durumu ile oluşturulur (örn: PENDING)

#### 2. Ürün Yönetimi

- Her kargo birden fazla ürün içerebilir (maksimum 5 ürün - trigger ile kontrol)
- Her ürün için:
  - Ürün kodu (unique)
  - Ad, açıklama
  - Miktar
  - Birim değer
  - Para birimi

#### 3. Durum Takibi

- Kargo durumu değiştiğinde `cargo_state_history` tablosuna kayıt eklenir
- Her durum değişikliği:
  - Hangi duruma geçildi
  - Ne zaman değişti
  - Kim değiştirdi (employee)
  - Açıklama

#### 4. Hareket Takibi

- Kargo lokasyonlar arasında hareket ederken `cargo_movement_history` tablosuna kayıt eklenir
- Her hareket:
  - Hangi lokasyona gitti (branch veya distribution_center)
  - Ne zaman hareket etti
  - Durum ve açıklama

#### 5. Teslimat Tercihleri

- Müşteriler teslimat seçeneklerini tercih sırasına göre belirleyebilir
- Örnek: Önce kapıdan kapıya, sonra şubeden teslim

#### 6. İade ve Hasar Yönetimi

- **İade Talepleri**: Müşteriler kargo iadesi talep edebilir
- **Hasar Raporları**: Kargo hasarlı gelirse rapor oluşturulur
- Her ikisi de müşteri ve çalışan tarafından yönetilir

#### 7. Olay Logları

- Sistemdeki tüm önemli olaylar `cargo_event_log` tablosuna kaydedilir
- Örnek olaylar: Teslim alındı, depoya girdi, yola çıktı, teslim edildi

## Tablo İlişkileri

### Ana İlişkiler

```
cargo
  ├── customer (customer_id) - RESTRICT
  ├── origin_branch (origin_branch_id) - RESTRICT
  ├── destination_branch (destination_branch_id) - RESTRICT
  ├── origin_country (origin_country_id) - RESTRICT
  ├── destination_country (destination_country_id) - RESTRICT
  ├── cargo_type_enum (cargo_type_id) - RESTRICT
  ├── shipment_type_enum (shipment_type_id) - RESTRICT
  ├── currency_enum (currency_id) - RESTRICT
  └── state_enum (current_state_id) - RESTRICT

product
  └── cargo (cargo_id) - CASCADE
      └── currency_enum (currency_id) - RESTRICT

cargo_state_history
  ├── cargo (cargo_id) - CASCADE
  ├── state_enum (state_id) - RESTRICT
  └── employee (changed_by) - SET NULL

cargo_movement_history
  ├── cargo (cargo_id) - CASCADE
  ├── branch (branch_id) - SET NULL
  └── distribution_center (distribution_center_id) - SET NULL

cargo_delivery_preference
  ├── cargo (cargo_id) - CASCADE
  └── delivery_option_enum (delivery_option_id) - RESTRICT

cargo_return_request
  ├── cargo (cargo_id) - RESTRICT (UNIQUE)
  ├── customer (requested_by) - SET NULL
  └── employee (processed_by) - SET NULL

cargo_damage_report
  ├── cargo (cargo_id) - RESTRICT (UNIQUE)
  ├── customer (reported_by) - SET NULL
  └── employee (investigated_by) - SET NULL

cargo_event_log
  ├── cargo (cargo_id) - CASCADE
  └── employee (employee_id) - SET NULL
```

### Foreign Key Stratejileri

- **RESTRICT**: Ana tablolar (customer, country, enum'lar) silinemez
- **CASCADE**: Kargo silinirse ilişkili kayıtlar (product, history) silinir
- **SET NULL**: Employee veya customer silinirse referanslar NULL olur (audit trail korunur)

## Backend Implementasyonu

### Oluşturulan Modüller

Her tablo için ayrı bir NestJS modülü oluşturulmuştur:

1. **CargoModule** - `src/cargo/cargo/cargo.module.ts`
   - Ana kargo yönetimi
   - Tracking number ile arama
   - Müşteri, ülke, durum bazlı sorgular

2. **ProductModule** - `src/cargo/product/product.module.ts`
   - Ürün yönetimi
   - Kargo bazlı ürün listeleme
   - Ürün kodu ile arama

3. **CargoStateHistoryModule** - `src/cargo/cargo-state-history/cargo-state-history.module.ts`
   - Durum geçmişi yönetimi
   - Kargo bazlı durum geçmişi
   - Zaman sıralı listeleme

4. **CargoMovementHistoryModule** - `src/cargo/cargo-movement-history/cargo-movement-history.module.ts`
   - Hareket geçmişi yönetimi
   - Kargo bazlı hareket geçmişi
   - Lokasyon tipi yönetimi

5. **CargoDeliveryPreferenceModule** - `src/cargo/cargo-delivery-preference/cargo-delivery-preference.module.ts`
   - Teslimat tercihi yönetimi
   - Tercih sırası yönetimi

6. **CargoReturnRequestModule** - `src/cargo/cargo-return-request/cargo-return-request.module.ts`
   - İade talebi yönetimi
   - Durum bazlı filtreleme

7. **CargoDamageReportModule** - `src/cargo/cargo-damage-report/cargo-damage-report.module.ts`
   - Hasar raporu yönetimi
   - Şiddet bazlı filtreleme

8. **CargoEventLogModule** - `src/cargo/cargo-event-log/cargo-event-log.module.ts`
   - Olay log yönetimi
   - Olay tipi bazlı filtreleme

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Soft delete desteği (uygun tablolarda)

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları
- Query parameter desteği

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları
- Date string validasyonları

### Tasarım Kararları

1. **Tracking Number**: Unique constraint ile benzersizlik garantisi
2. **Product Limit**: Trigger ile maksimum 5 ürün kontrolü
3. **State History**: Her durum değişikliği kaydedilir
4. **Movement History**: Lokasyon değişiklikleri kaydedilir
5. **Delivery Preference**: Tercih sırası ile çoklu seçenek
6. **Return Request**: Her kargo için tek iade talebi (UNIQUE)
7. **Damage Report**: Her kargo için tek hasar raporu (UNIQUE)
8. **Event Log**: Tüm önemli olaylar loglanır

## API Genel Bakış

### Cargo Endpoint'leri

- `GET /cargo` - Tüm kargoları listele
- `GET /cargo/tracking/:trackingNumber` - Tracking number ile kargo bul
- `GET /cargo/delivery/:deliveryNumber` - Delivery number ile kargo bul
- `GET /cargo/customer/:customerId` - Müşteriye göre kargoları listele
- `GET /cargo/origin-country/:originCountryId` - Başlangıç ülkesine göre kargoları listele
- `GET /cargo/destination-country/:destinationCountryId` - Varış ülkesine göre kargoları listele
- `GET /cargo/state/:stateId` - Duruma göre kargoları listele
- `GET /cargo/estimated-delivery?startDate=&endDate=` - Tahmini teslimat tarihine göre kargoları listele
- `GET /cargo/uuid/:uuid` - UUID ile kargo bul
- `GET /cargo/:id` - ID ile kargo bul

### Product Endpoint'leri

- `GET /cargo/products` - Tüm ürünleri listele
- `GET /cargo/products/cargo/:cargoId` - Kargoya göre ürünleri listele
- `GET /cargo/products/product-code/:productCode` - Ürün kodu ile ürün bul
- `GET /cargo/products/uuid/:uuid` - UUID ile ürün bul
- `GET /cargo/products/:id` - ID ile ürün bul

### Cargo State History Endpoint'leri

- `GET /cargo/state-history` - Tüm durum geçmişlerini listele
- `GET /cargo/state-history/cargo/:cargoId` - Kargoya göre durum geçmişini listele
- `GET /cargo/state-history/cargo/:cargoId/ordered` - Kargoya göre zaman sıralı durum geçmişi
- `GET /cargo/state-history/state/:stateId` - Duruma göre geçmişleri listele
- `GET /cargo/state-history/:id` - ID ile durum geçmişi bul

### Cargo Movement History Endpoint'leri

- `GET /cargo/movement-history` - Tüm hareket geçmişlerini listele
- `GET /cargo/movement-history/cargo/:cargoId` - Kargoya göre hareket geçmişini listele
- `GET /cargo/movement-history/cargo/:cargoId/ordered` - Kargoya göre zaman sıralı hareket geçmişi
- `GET /cargo/movement-history/:id` - ID ile hareket geçmişi bul

### Cargo Delivery Preference Endpoint'leri

- `GET /cargo/delivery-preferences` - Tüm teslimat tercihlerini listele
- `GET /cargo/delivery-preferences/cargo/:cargoId` - Kargoya göre teslimat tercihlerini listele
- `GET /cargo/delivery-preferences/delivery-option/:deliveryOptionId` - Teslimat seçeneğine göre tercihleri listele
- `GET /cargo/delivery-preferences/:id` - ID ile teslimat tercihi bul

### Cargo Return Request Endpoint'leri

- `GET /cargo/return-requests` - Tüm iade taleplerini listele
- `GET /cargo/return-requests/cargo/:cargoId` - Kargoya göre iade talebi bul
- `GET /cargo/return-requests/status/:status` - Duruma göre iade taleplerini listele
- `GET /cargo/return-requests/:id` - ID ile iade talebi bul

### Cargo Damage Report Endpoint'leri

- `GET /cargo/damage-reports` - Tüm hasar raporlarını listele
- `GET /cargo/damage-reports/cargo/:cargoId` - Kargoya göre hasar raporu bul
- `GET /cargo/damage-reports/severity/:severity` - Şiddete göre hasar raporlarını listele
- `GET /cargo/damage-reports/:id` - ID ile hasar raporu bul

### Cargo Event Log Endpoint'leri

- `GET /cargo/event-logs` - Tüm olay loglarını listele
- `GET /cargo/event-logs/cargo/:cargoId` - Kargoya göre olay loglarını listele
- `GET /cargo/event-logs/cargo/:cargoId/ordered` - Kargoya göre zaman sıralı olay logları
- `GET /cargo/event-logs/event-type/:eventType` - Olay tipine göre logları listele
- `GET /cargo/event-logs/:id` - ID ile olay logu bul

### Örnek Response'lar

**Cargo Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "trackingNumber": "TRK-2024-001",
  "deliveryNumber": "DLV-2024-001",
  "customerId": 10,
  "originBranchId": 5,
  "destinationBranchId": 8,
  "originCountryId": 1,
  "destinationCountryId": 2,
  "originDate": "2024-01-01T00:00:00.000Z",
  "estimatedDeliveryDate": "2024-01-05T00:00:00.000Z",
  "actualDeliveryDate": null,
  "cargoTypeId": 1,
  "shipmentTypeId": 2,
  "weightKg": 5.5,
  "lengthCm": 30,
  "widthCm": 20,
  "heightCm": 15,
  "volumetricWeightKg": 4.5,
  "valueDeclaration": 1000.00,
  "currencyId": 1,
  "currentStateId": 2,
  "undeliveredCancelThresholdHours": 168,
  "isAutoCancelled": false,
  "autoCancelDate": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Product Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "productCode": "PRD-001",
  "cargoId": 1,
  "name": "Laptop",
  "description": "Dell XPS 15",
  "quantity": 1,
  "unitValue": 1000.00,
  "currencyId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

## İşlem Akışı

### Kargo Oluşturma Akışı

1. **Müşteri Doğrulama**: Müşteri sistemde kayıtlı ve doğrulanmış olmalı
2. **Lokasyon Doğrulama**: Başlangıç ve varış ülkeleri geçerli olmalı
3. **Enum Değerleri**: Cargo type, shipment type, currency, state enum'lardan seçilmeli
4. **Tracking Number**: Sistem otomatik olarak benzersiz tracking number oluşturur
5. **Initial State**: Kargo ilk durumu ile oluşturulur
6. **State History**: İlk durum `cargo_state_history` tablosuna kaydedilir

### Durum Değişikliği Akışı

1. **Durum Doğrulama**: Yeni durum geçerli bir state enum değeri olmalı
2. **Yetki Kontrolü**: Çalışanın durum değiştirme yetkisi olmalı (gelecekte RBAC ile)
3. **State History**: Durum değişikliği `cargo_state_history` tablosuna kaydedilir
4. **Event Log**: Durum değişikliği `cargo_event_log` tablosuna kaydedilir
5. **Cargo Update**: `cargo.current_state_id` güncellenir

### Hareket Takibi Akışı

1. **Lokasyon Doğrulama**: Branch veya distribution center geçerli olmalı
2. **Location Type**: 'branch' veya 'distribution_center' olmalı
3. **Movement History**: Hareket `cargo_movement_history` tablosuna kaydedilir
4. **Event Log**: Hareket `cargo_event_log` tablosuna kaydedilir

## Güvenlik ve Gelecek Hazırlığı

### RBAC Entegrasyonu

Gelecekteki RBAC sistemi ile:

1. **Permission Kontrolü**: 
   - `cargo.create` - Kargo oluşturma
   - `cargo.read` - Kargo okuma
   - `cargo.update` - Kargo güncelleme
   - `cargo.delete` - Kargo silme
   - `cargo.state.change` - Durum değiştirme
   - `cargo.movement.track` - Hareket takibi

2. **Role Bazlı Erişim**:
   - Warehouse Manager: Depo işlemleri
   - Customer Service: Müşteri hizmetleri
   - Operations: Operasyon yönetimi

### Actor-Based Ownership

- Her kargo bir müşteriye aittir (`customer_id`)
- Müşteriler sadece kendi kargolarını görebilir (gelecekte)
- Çalışanlar tüm kargoları görebilir (yetkiye göre)

### Lokasyon Bütünlüğü

- Başlangıç ve varış ülkeleri zorunludur
- Branch'ler ülke hiyerarşisine uygun olmalı
- Distribution center'lar ülke bazlı olmalı

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, kargo yönetim sisteminin çekirdeğini oluşturur:

1. **Kargo Yönetimi**: Ana kargo tablosu ve ilişkileri
2. **Ürün Yönetimi**: Kargo içindeki ürünler
3. **Takip Sistemi**: Durum ve hareket geçmişi
4. **Müşteri Hizmetleri**: İade ve hasar yönetimi
5. **Olay Loglama**: Sistem olaylarının kaydı

### Migration 001-004 ile İlişkisi

- **Migration 001**: Enum tabloları (cargo_type, shipment_type, state, currency, delivery_option)
- **Migration 002**: Lokasyon hiyerarşisi (country, branch, distribution_center)
- **Migration 003**: Actor sistemi (customer, employee)
- **Migration 004**: RBAC sistemi (gelecekteki yetkilendirme için)

### Gelecek Migration'larla İlişkisi

- **Migration 006**: Fiyatlandırma ve fatura tabloları
- **Migration 008**: Rota ve sigorta tabloları
- **Migration 016**: Authentication tabloları (RBAC entegrasyonu)
- **Migration 019**: Depo yönetimi tabloları

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Ana tablolar silinemez
  - CASCADE: Kargo silinirse ilişkili kayıtlar silinir
  - SET NULL: Employee/customer silinirse referanslar NULL olur
- **Unique Constraints**: 
  - cargo: tracking_number, delivery_number
  - product: product_code
  - cargo_return_request: cargo_id (UNIQUE)
  - cargo_damage_report: cargo_id (UNIQUE)
- **Check Constraints**: 
  - cargo: weight_kg > 0
  - product: quantity > 0
  - cargo_movement_history: location_type kontrolü
- **Triggers**: 
  - Maksimum 5 ürün kontrolü
  - Event time otomatik ayarlama
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Composite Index'ler**: Tracking number, customer ID, state ID için index'ler
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Time-based Index'ler**: Event time, movement date için index'ler

## Notlar

- Kargo sistemi tracking-ready yapıda tasarlanmıştır
- Ürün limiti trigger ile kontrol edilir (maksimum 5 ürün)
- Durum ve hareket geçmişi immutable (değiştirilemez)
- İade ve hasar raporları her kargo için tekil (UNIQUE constraint)
- Olay logları audit trail için kullanılır
- Tüm tarih alanları timezone-aware (TIMESTAMP WITH TIME ZONE)

