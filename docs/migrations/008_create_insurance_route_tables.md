# Migration 008: Sigorta ve Rota Yönetimi Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sistemi için sigorta yönetimi, rota planlama, risk skorlama, kurye planlama ve karbon ayak izi takibi tablolarını oluşturur. Kargo gönderileri için sigorta poliçeleri, optimal rota seçimi, ülke bazlı risk değerlendirmeleri ve sürdürülebilirlik metrikleri için gerekli yapı kurulur.

### Oluşturulan Tablolar

1. **cargo_insurance** - Kargo sigorta poliçeleri
2. **route** - Rota tanımları ve alternatif rotalar
3. **route_risk_score** - Rota bazlı risk skorları
4. **cargo_route_assignment** - Kargo-rota atamaları
5. **courier_route_plan** - Kurye rota planları
6. **cargo_carbon_data** - Kargo karbon ayak izi verileri

## Sigorta Modeli Açıklaması

### Sigorta Nedir?

Sigorta, kargo gönderilerinin taşıma sırasında oluşabilecek hasar, kayıp veya zararlara karşı korunması için yapılan mali güvence işlemidir. Her kargo için:

- **Sigorta Poliçesi**: Benzersiz poliçe numarası ile takip
- **Sigortalı Değer**: Kargo değeri üzerinden sigortalı tutar
- **Prim Tutarı**: Sigorta için ödenen maliyet
- **Kapsam Türü**: Tam kapsam, kısmi kapsam vb.
- **Aktiflik Durumu**: Poliçe aktif/pasif durumu

### Gerçek Dünya Eşleştirmesi

#### 1. Sigorta Poliçesi Yönetimi

1. **Poliçe Oluşturma**:
   - Her kargo için bir sigorta poliçesi oluşturulabilir (1:1 ilişki)
   - Poliçe numarası benzersiz olmalı
   - Sigortalı değer ve prim tutarı belirlenir

2. **Sigorta Kapsamı**:
   - **Tam Kapsam**: Tüm riskler kapsanır
   - **Kısmi Kapsam**: Belirli riskler kapsanır
   - **Değer Bazlı**: Kargo değerine göre otomatik hesaplama

3. **Poliçe Durumları**:
   - **DRAFT**: Taslak aşaması
   - **ACTIVE**: Aktif ve geçerli
   - **CLAIMED**: Tazminat talebi yapılmış
   - **CLOSED**: Kapatılmış

4. **Poliçe Verileri**:
   - JSONB formatında esnek poliçe verileri
   - Şartlar, istisnalar, ek teminatlar
   - Gelecekte farklı sigorta şirketleri için uyumlu

#### 2. Sigorta İş Kuralları

- Aktif sigortalar değiştirilemez (immutable)
- Sadece aktif olmayan sigortalar güncellenebilir
- Poliçe numarası unique constraint ile garanti
- Son kullanma tarihi, düzenleme tarihinden önce olamaz

## Rota Planlama Modeli Açıklaması

### Rota Planlama Nedir?

Rota planlama, kargo gönderilerinin en optimal şekilde taşınması için dağıtım merkezleri arasındaki yolların belirlenmesi ve yönetilmesi sürecidir. Sistem şunları sağlar:

- **Rota Tanımları**: Dağıtım merkezleri arası rota tanımları
- **Alternatif Rotalar**: Ana rota için alternatif seçenekler
- **Risk Değerlendirmesi**: Rota bazlı risk skorları
- **Kargo Atamaları**: Kargoların rotalara atanması
- **Kurye Planlaması**: Kuryelerin rota planlaması

### Gerçek Dünya Eşleştirmesi

#### 1. Rota Yönetimi

1. **Rota Oluşturma**:
   - Başlangıç ve varış dağıtım merkezleri
   - Gönderi tipi (hava, kara, deniz)
   - Rota kodu (opsiyonel)
   - Tahmini süre ve mesafe

2. **Alternatif Rotalar**:
   - Ana rota için alternatif seçenekler
   - Farklı transit noktaları
   - Acil durumlar için yedek rotalar
   - Self-referential ilişki (main_route_id)

3. **Rota Aktiflik**:
   - Rotalar aktif/pasif olarak işaretlenebilir
   - Pasif rotalara yeni atama yapılamaz
   - Mevcut atamalar korunur

#### 2. Rota Risk Skorlama

1. **Risk Değerlendirmesi**:
   - Her rota için ülke bazlı risk skoru
   - Başlangıç ve varış ülkesi dikkate alınır
   - Risk seviyesi (düşük, orta, yüksek)
   - Risk skoru (0-100 arası)

2. **Minimum Risk Eşiği**:
   - Her rota için minimum kabul edilebilir risk eşiği
   - Risk skoru minimum eşiğin altında olamaz
   - CHECK constraint ile zorunlu kontrol

#### 3. Kargo-Rota Ataması

1. **Atama İşlemi**:
   - Her kargo için bir aktif rota ataması
   - Atama tarihi ve atayan çalışan kaydedilir
   - Yeni atama yapıldığında eski atama otomatik pasifleştirilir

2. **Atama Kuralları**:
   - Her kargo için sadece bir aktif atama olabilir
   - UNIQUE constraint ile aktif atamalar garanti edilir
   - Geçmiş atamalar korunur (soft delete değil, is_active flag)

#### 4. Kurye Rota Planlaması

1. **Plan Oluşturma**:
   - Kurye (employee) bazlı rota planları
   - Plan tarihi ve durum bilgisi
   - Başlangıç ve bitiş saatleri
   - Toplam kargo sayısı

2. **Plan Durumları**:
   - **scheduled**: Planlanmış
   - **in_progress**: Devam ediyor
   - **completed**: Tamamlanmış
   - **cancelled**: İptal edilmiş

#### 5. Karbon Ayak İzi Takibi

1. **Karbon Verisi**:
   - Her kargo için karbon ayak izi değeri
   - Hesaplama metodu (GHG Protocol, ISO 14064 vb.)
   - Gönderi tipi bazlı karbon emisyonu
   - Mesafe bazlı hesaplama

2. **Sürdürülebilirlik**:
   - Karbon nötr hedeflerine ulaşmak için veri toplama
   - Çevresel raporlama için metrikler
   - Gelecekte karbon offset entegrasyonu

## Tablo İlişkileri

### Ana İlişkiler

```
cargo_insurance
  ├── cargo (cargo_id) - RESTRICT, UNIQUE
  └── currency_enum (currency_id) - RESTRICT

route
  ├── distribution_center (origin_distribution_center_id) - RESTRICT
  ├── distribution_center (destination_distribution_center_id) - RESTRICT
  ├── shipment_type_enum (shipment_type_id) - RESTRICT
  └── route (main_route_id) - SET NULL (self-referential)

route_risk_score
  ├── route (route_id) - CASCADE
  ├── country (origin_country_id) - RESTRICT
  └── country (destination_country_id) - RESTRICT

cargo_route_assignment
  ├── cargo (cargo_id) - RESTRICT
  ├── route (route_id) - RESTRICT
  └── employee (assigned_by) - SET NULL

courier_route_plan
  ├── employee (employee_id) - RESTRICT
  ├── route (route_id) - RESTRICT
  └── (soft delete: deleted_at)

cargo_carbon_data
  ├── cargo (cargo_id) - RESTRICT, UNIQUE
  └── shipment_type_enum (shipment_type_id) - RESTRICT
```

### Foreign Key Stratejileri

- **RESTRICT**: Ana tablolar (cargo, route, employee) silinemez
- **CASCADE**: Rota silinirse risk skorları silinir
- **SET NULL**: Employee veya main route silinirse referanslar NULL olur
- **UNIQUE**: Her kargo için bir sigorta, bir karbon verisi

## Backend Implementasyonu

### Oluşturulan Modüller

#### Insurance Domain

1. **CargoInsuranceModule** - `src/insurance/cargo-insurance/cargo-insurance.module.ts`
   - Sigorta poliçesi yönetimi
   - Kargo bazlı sigorta sorguları
   - Poliçe aktifleştirme işlemleri

#### Routing Domain

1. **RouteModule** - `src/routing/route/route.module.ts`
   - Rota tanım yönetimi
   - Alternatif rota sorguları
   - Dağıtım merkezi bazlı rotalar

2. **RouteRiskScoreModule** - `src/routing/route-risk-score/route-risk-score.module.ts`
   - Rota risk skoru yönetimi
   - Ülke bazlı risk sorguları
   - Risk seviyesi filtreleme

3. **CargoRouteAssignmentModule** - `src/routing/cargo-route-assignment/cargo-route-assignment.module.ts`
   - Kargo-rota atama yönetimi
   - Aktif atama sorguları
   - Atama pasifleştirme

4. **CourierRoutePlanModule** - `src/routing/courier-route-plan/courier-route-plan.module.ts`
   - Kurye rota plan yönetimi
   - Tarih bazlı plan sorguları
   - Durum bazlı filtreleme

5. **CargoCarbonDataModule** - `src/routing/cargo-carbon-data/cargo-carbon-data.module.ts`
   - Karbon ayak izi veri yönetimi
   - Gönderi tipi bazlı sorgular
   - Sürdürülebilirlik metrikleri

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Transaction desteği (write işlemleri için)
- JSONB veri yönetimi (sigorta policy_data)

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri
- Exception handling
- İş kuralı kontrolleri (aktif sigorta değiştirilemez, risk skoru kontrolü vb.)

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları
- Query parameter desteği

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları (@Min)
- Date string validasyonları
- JSONB validasyonları (@IsObject)

### Tasarım Kararları

1. **Sigorta Yönetimi**: 
   - Her kargo için bir sigorta (UNIQUE constraint)
   - Aktif sigortalar değiştirilemez (immutable)
   - Poliçe numarası unique
   - Soft delete yok (immutable yapı)

2. **Rota Yönetimi**: 
   - Self-referential ilişki (alternatif rotalar)
   - Soft delete desteği
   - Origin ve destination aynı olamaz (CHECK constraint)
   - Rota kodu unique (opsiyonel)

3. **Risk Skorlama**: 
   - Her rota için bir risk skoru (1:1)
   - Risk skoru minimum eşiğin altında olamaz
   - CHECK constraint ile zorunlu kontrol
   - Ülke bazlı risk değerlendirmesi

4. **Kargo Atama**: 
   - Her kargo için bir aktif atama
   - Yeni atama yapıldığında eski atama pasifleştirilir
   - UNIQUE constraint ile aktif atamalar garanti
   - Geçmiş atamalar korunur

5. **Kurye Planlama**: 
   - Soft delete desteği
   - Durum bazlı filtreleme
   - Tarih bazlı sorgular
   - Toplam kargo sayısı takibi

6. **Karbon Verileri**: 
   - Her kargo için bir karbon verisi (UNIQUE)
   - Hesaplama metodu takibi
   - Gönderi tipi ve mesafe bazlı hesaplama
   - Sürdürülebilirlik raporlaması için hazır

## API Genel Bakış

### Insurance API Endpoint'leri

- `GET /insurance/cargo` - Tüm sigortaları listele
- `GET /insurance/cargo/active` - Aktif sigortaları listele
- `GET /insurance/cargo/status?active=true` - Duruma göre sigortaları listele
- `GET /insurance/cargo/cargo/:cargoId` - Kargoya göre sigorta bul
- `GET /insurance/cargo/policy/:policyNumber` - Poliçe numarası ile sigorta bul
- `GET /insurance/cargo/:id` - ID ile sigorta bul
- `POST /insurance/cargo` - Yeni sigorta poliçesi oluştur
- `PUT /insurance/cargo/:id` - Sigorta güncelle (sadece aktif olmayan)
- `PUT /insurance/cargo/:id/activate` - Sigortayı aktifleştir/pasifleştir

### Routing API Endpoint'leri

#### Route Endpoint'leri

- `GET /routing/routes` - Tüm rotaları listele
- `GET /routing/routes/active` - Aktif rotaları listele
- `GET /routing/routes/origin/:originId` - Başlangıç merkezine göre rotalar
- `GET /routing/routes/destination/:destinationId` - Varış merkezine göre rotalar
- `GET /routing/routes/shipment-type/:shipmentTypeId` - Gönderi tipine göre rotalar
- `GET /routing/routes/main-route/:mainRouteId` - Ana rota altındaki rotalar
- `GET /routing/routes/main-route/:mainRouteId/alternatives` - Alternatif rotalar
- `GET /routing/routes/code/:routeCode` - Rota kodu ile rota bul
- `GET /routing/routes/uuid/:uuid` - UUID ile rota bul
- `GET /routing/routes/:id` - ID ile rota bul
- `POST /routing/routes` - Yeni rota oluştur
- `PUT /routing/routes/:id` - Rota güncelle

#### Route Risk Score Endpoint'leri

- `GET /routing/route-risk-scores` - Tüm risk skorlarını listele
- `GET /routing/route-risk-scores/route/:routeId` - Rota bazlı risk skoru bul
- `GET /routing/route-risk-scores/origin-country/:originCountryId` - Başlangıç ülkesine göre risk skorları
- `GET /routing/route-risk-scores/destination-country/:destinationCountryId` - Varış ülkesine göre risk skorları
- `GET /routing/route-risk-scores/countries/:originCountryId/:destinationCountryId` - Ülke çiftine göre risk skorları
- `GET /routing/route-risk-scores/risk-level/:riskLevel` - Risk seviyesine göre risk skorları
- `GET /routing/route-risk-scores/:id` - ID ile risk skoru bul
- `POST /routing/route-risk-scores` - Yeni risk skoru oluştur
- `PUT /routing/route-risk-scores/:id` - Risk skoru güncelle

#### Cargo Route Assignment Endpoint'leri

- `GET /routing/cargo-route-assignments` - Tüm atamaları listele
- `GET /routing/cargo-route-assignments/active` - Aktif atamaları listele
- `GET /routing/cargo-route-assignments/cargo/:cargoId` - Kargo bazlı atama bul
- `GET /routing/cargo-route-assignments/cargo/:cargoId/active` - Kargo bazlı aktif atama bul
- `GET /routing/cargo-route-assignments/route/:routeId` - Rota bazlı atamalar
- `GET /routing/cargo-route-assignments/route/:routeId/active` - Rota bazlı aktif atamalar
- `GET /routing/cargo-route-assignments/:id` - ID ile atama bul
- `POST /routing/cargo-route-assignments` - Yeni atama oluştur (eski aktif atama otomatik pasifleştirilir)
- `POST /routing/cargo-route-assignments/:id/deactivate` - Atamayı pasifleştir

#### Courier Route Plan Endpoint'leri

- `GET /routing/courier-route-plans` - Tüm planları listele
- `GET /routing/courier-route-plans/employee/:employeeId` - Kurye bazlı planlar
- `GET /routing/courier-route-plans/employee/:employeeId/date?planDate=2024-01-01` - Kurye ve tarih bazlı planlar
- `GET /routing/courier-route-plans/route/:routeId` - Rota bazlı planlar
- `GET /routing/courier-route-plans/plan-date?planDate=2024-01-01` - Tarih bazlı planlar
- `GET /routing/courier-route-plans/status/:status` - Durum bazlı planlar
- `GET /routing/courier-route-plans/:id` - ID ile plan bul
- `POST /routing/courier-route-plans` - Yeni plan oluştur
- `PUT /routing/courier-route-plans/:id` - Plan güncelle

#### Cargo Carbon Data Endpoint'leri

- `GET /routing/cargo-carbon-data` - Tüm karbon verilerini listele
- `GET /routing/cargo-carbon-data/cargo/:cargoId` - Kargo bazlı karbon verisi bul
- `GET /routing/cargo-carbon-data/shipment-type/:shipmentTypeId` - Gönderi tipine göre karbon verileri
- `GET /routing/cargo-carbon-data/:id` - ID ile karbon verisi bul
- `POST /routing/cargo-carbon-data` - Yeni karbon verisi oluştur
- `PUT /routing/cargo-carbon-data/:id` - Karbon verisi güncelle

### Örnek Response'lar

**Cargo Insurance Response:**
```json
{
  "id": 1,
  "cargoId": 10,
  "insurancePolicyNumber": "INS-2024-001",
  "insuredValue": 10000.00,
  "premiumAmount": 150.00,
  "currencyId": 1,
  "coverageType": "FULL_COVERAGE",
  "policyData": {
    "terms": "All risks covered",
    "exclusions": ["war", "nuclear"],
    "deductible": 100
  },
  "issueDate": "2024-01-01T00:00:00.000Z",
  "expiryDate": "2024-12-31T23:59:59.000Z",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Route Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "originDistributionCenterId": 5,
  "destinationDistributionCenterId": 10,
  "shipmentTypeId": 2,
  "routeCode": "ROUTE-IST-ANK-001",
  "estimatedDurationHours": 24,
  "distanceKm": 563.5,
  "isAlternativeRoute": false,
  "mainRouteId": null,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Route Risk Score Response:**
```json
{
  "id": 1,
  "routeId": 1,
  "originCountryId": 1,
  "destinationCountryId": 2,
  "riskLevel": "LOW",
  "riskScore": 25.50,
  "minimumRiskThreshold": 30.00,
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Cargo Route Assignment Response:**
```json
{
  "id": 1,
  "cargoId": 10,
  "routeId": 1,
  "assignedDate": "2024-01-01T00:00:00.000Z",
  "assignedBy": 5,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Courier Route Plan Response:**
```json
{
  "id": 1,
  "employeeId": 8,
  "routeId": 1,
  "planDate": "2024-01-15T00:00:00.000Z",
  "status": "scheduled",
  "startTime": "2024-01-15T08:00:00.000Z",
  "endTime": "2024-01-15T17:00:00.000Z",
  "totalCargoCount": 25,
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-10T00:00:00.000Z",
  "deletedAt": null
}
```

**Cargo Carbon Data Response:**
```json
{
  "id": 1,
  "cargoId": 10,
  "carbonFootprintValue": 12.3456,
  "calculationMethod": "GHG Protocol",
  "shipmentTypeId": 2,
  "distanceKm": 563.5,
  "calculationTimestamp": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## İşlem Akışı

### Sigorta Yönetimi Akışı

1. **Poliçe Oluşturma**:
   - Kargo için sigorta poliçesi oluşturulur
   - Poliçe numarası benzersiz olmalı
   - Sigortalı değer ve prim tutarı belirlenir
   - Başlangıçta is_active = true olarak oluşturulur

2. **Poliçe Aktivasyon**:
   - Aktif olmayan poliçeler güncellenebilir
   - Aktif sigortalar değiştirilemez
   - Aktivasyon endpoint'i ile durum değiştirilebilir

### Rota Planlama Akışı

1. **Rota Tanımlama**:
   - Dağıtım merkezleri arası rota tanımlanır
   - Gönderi tipi seçilir
   - Mesafe ve tahmini süre belirlenir
   - Rota kodu atanır (opsiyonel)

2. **Alternatif Rota Ekleme**:
   - Ana rota için alternatif seçenekler eklenir
   - main_route_id ile ana rotaya bağlanır
   - Acil durumlar için yedek rotalar

3. **Risk Değerlendirmesi**:
   - Rota için ülke bazlı risk skoru oluşturulur
   - Risk skoru minimum eşiğin üzerinde olmalı
   - CHECK constraint ile otomatik kontrol

4. **Kargo Atama**:
   - Kargo için en uygun rota seçilir
   - Yeni atama yapıldığında eski atama pasifleştirilir
   - Atama tarihi ve atayan çalışan kaydedilir

5. **Kurye Planlama**:
   - Kurye için rota planı oluşturulur
   - Plan tarihi ve durum belirlenir
   - Başlangıç ve bitiş saatleri planlanır
   - Toplam kargo sayısı takip edilir

6. **Karbon Hesaplama**:
   - Kargo için karbon ayak izi hesaplanır
   - Hesaplama metodu kaydedilir
   - Gönderi tipi ve mesafe dikkate alınır
   - Sürdürülebilirlik raporlaması için veri toplanır

## İş Kuralları ve Validasyonlar

### Sigorta Kuralları

1. **Poliçe Tekilliği**:
   - Her kargo için sadece bir sigorta poliçesi olabilir (UNIQUE constraint)
   - Poliçe numarası benzersiz olmalı

2. **Aktiflik Kuralı**:
   - Aktif sigortalar değiştirilemez (immutable)
   - Sadece aktif olmayan sigortalar güncellenebilir
   - Aktivasyon endpoint'i ile durum değiştirilebilir

3. **Tarih Kuralı**:
   - Son kullanma tarihi, düzenleme tarihinden önce olamaz

### Rota Kuralları

1. **Rota Tekilliği**:
   - Origin ve destination aynı olamaz (CHECK constraint)
   - Rota kodu unique (opsiyonel)

2. **Alternatif Rota Kuralı**:
   - Alternatif rotalar için main_route_id zorunlu
   - Ana rotalar için main_route_id null olmalı

3. **Soft Delete Kuralı**:
   - Rotalar soft delete ile silinir
   - Silinen rotalara yeni atama yapılamaz

### Risk Skoru Kuralları

1. **Risk Skoru Tekilliği**:
   - Her rota için bir risk skoru (1:1 ilişki)
   - Risk skoru 0-100 arası olmalı (CHECK constraint)

2. **Minimum Eşik Kuralı**:
   - Risk skoru minimum eşiğin altında olamaz
   - CHECK constraint ile zorunlu kontrol
   - Default minimum eşik: 30.00

### Kargo Atama Kuralları

1. **Aktif Atama Tekilliği**:
   - Her kargo için sadece bir aktif atama olabilir
   - UNIQUE constraint ile aktif atamalar garanti
   - Yeni atama yapıldığında eski atama otomatik pasifleştirilir

2. **Geçmiş Atamalar**:
   - Geçmiş atamalar korunur (soft delete değil)
   - is_active flag ile aktif/pasif ayrımı

### Kurye Planlama Kuralları

1. **Tarih Kuralı**:
   - Bitiş saati, başlangıç saatinden önce olamaz

2. **Soft Delete Kuralı**:
   - Planlar soft delete ile silinir
   - Silinen planlar sorgularda görünmez

### Karbon Verileri Kuralları

1. **Tekillik Kuralı**:
   - Her kargo için bir karbon verisi (UNIQUE constraint)

2. **Hesaplama Metodu**:
   - Hesaplama metodu kaydedilir (GHG Protocol, ISO 14064 vb.)
   - Gönderi tipi ve mesafe bazlı hesaplama

## SQL Kullanım Örnekleri

### Transaction İle Sigorta Oluşturma

```typescript
// Service katmanında
await this.cargoInsuranceRepository.create(
  cargoId,
  insurancePolicyNumber,
  insuredValue,
  premiumAmount,
  currencyId,
  coverageType,
  policyData,
  issueDate,
  expiryDate
);
```

### Rota Oluşturma ve Risk Skoru Ekleme

```typescript
// Service katmanında
const route = await this.routeRepository.create(
  originDistributionCenterId,
  destinationDistributionCenterId,
  shipmentTypeId,
  routeCode,
  estimatedDurationHours,
  distanceKm,
  isAlternativeRoute,
  mainRouteId
);

const riskScore = await this.routeRiskScoreRepository.create(
  route.id,
  originCountryId,
  destinationCountryId,
  riskLevel,
  riskScore,
  minimumRiskThreshold
);
```

### Kargo Atama (Eski Atama Pasifleştirme)

```typescript
// Repository katmanında transaction içinde
// 1. Mevcut aktif atama pasifleştirilir
await client.query(
  'UPDATE cargo_route_assignment SET is_active = false WHERE cargo_id = $1 AND is_active = true',
  [cargoId]
);

// 2. Yeni atama oluşturulur
await client.query(
  'INSERT INTO cargo_route_assignment (cargo_id, route_id, assigned_by, is_active) VALUES ($1, $2, $3, true)',
  [cargoId, routeId, assignedBy]
);
```

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, operasyonel yönetimin temelini oluşturur:

1. **Sigorta Yönetimi**: Kargo gönderileri için sigorta poliçesi yönetimi
2. **Rota Planlama**: Optimal rota seçimi ve yönetimi
3. **Risk Yönetimi**: Rota bazlı risk değerlendirmesi
4. **Operasyonel Planlama**: Kurye planlama ve atama yönetimi
5. **Sürdürülebilirlik**: Karbon ayak izi takibi ve raporlama

### Migration 001-007 ile İlişkisi

- **Migration 001**: Enum tabloları (currency, shipment_type)
- **Migration 002**: Lokasyon hiyerarşisi (distribution_center, country)
- **Migration 003**: Actor sistemi (employee - atama ve planlama için)
- **Migration 005**: Cargo tablosu (sigorta, atama, karbon verisi için)
- **Migration 007**: Gümrük işlemleri (rota ile entegre)

### Gelecek Migration'larla İlişkisi

- **Migration 020**: Filo yönetimi (rota ile entegre)
- **Migration 024**: Analytics ve raporlama (karbon verileri ile)
- **Migration 028**: Kalite ve uyumluluk (risk yönetimi ile)

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Ana tablolar (cargo, route, employee) silinemez
  - CASCADE: Rota silinirse risk skorları silinir
  - SET NULL: Employee veya main route silinirse referanslar NULL olur
- **Unique Constraints**: 
  - cargo_insurance: cargo_id, insurance_policy_number
  - route: route_code
  - cargo_carbon_data: cargo_id
  - cargo_route_assignment: cargo_id, route_id (aktif atamalar için)
- **Check Constraints**: 
  - route: origin_distribution_center_id != destination_distribution_center_id
  - route_risk_score: risk_score >= 0 AND risk_score <= 100
  - route_risk_score: risk_score >= minimum_risk_threshold
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` ve `is_active = true` koşulları ile sadece aktif kayıtlar index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Time-based Index'ler**: Plan date, assigned date için index'ler
- **Composite Index'ler**: Country pair, cargo-route pair için index'ler

## Gelecek Entegrasyonlar

### AI-Powered Routing

1. **Optimal Rota Seçimi**: 
   - Makine öğrenmesi ile en optimal rota önerisi
   - Trafik, hava durumu, tarihsel veriler
   - Gerçek zamanlı rota optimizasyonu

2. **Risk Tahmini**: 
   - AI ile risk skoru tahmini
   - Tarihsel veriler ve pattern'ler
   - Otomatik risk skoru güncelleme

### Sigorta Entegrasyonu

1. **Sigorta Şirketi API'leri**: 
   - Otomatik poliçe oluşturma
   - Prim hesaplama
   - Tazminat talebi yönetimi

2. **Risk Bazlı Prim**: 
   - Rota risk skoruna göre prim hesaplama
   - Dinamik prim oranları
   - Otomatik prim güncelleme

### Sürdürülebilirlik Entegrasyonu

1. **Karbon Offset**: 
   - Karbon offset hesaplama
   - Offset projeleri ile entegrasyon
   - Karbon nötr hedefleri

2. **Sürdürülebilirlik Raporlama**: 
   - GHG Protocol uyumlu raporlama
   - Scope 3 emisyon hesaplama
   - Çevresel etki analizi

## Cargo, Customs ve Billing Entegrasyonu

### Cargo Entegrasyonu

- Her kargo için sigorta poliçesi oluşturulabilir
- Kargolar rotalara atanabilir
- Karbon ayak izi verisi takip edilir
- Kargo silinirse sigorta ve karbon verisi silinir (RESTRICT)

### Customs Entegrasyonu

- Rota risk skorları, gümrük risk kontrolleri ile entegre edilebilir
- Risk bazlı gümrük işlemleri önceliklendirme
- Ülke bazlı risk değerlendirmesi koordinasyonu

### Billing Entegrasyonu

- Sigorta prim tutarları, pricing calculation'a dahil edilir
- Rota bazlı maliyetler fiyatlandırmaya yansıtılır
- Karbon offset maliyetleri faturaya eklenebilir

## Notlar

- Tüm para tutarları DECIMAL tipinde, float kullanılmaz
- Aktif sigortalar değiştirilemez (immutable)
- Her kargo için bir aktif rota ataması olabilir
- Risk skoru minimum eşiğin altında olamaz
- Karbon verileri sürdürülebilirlik raporlaması için hazır
- Soft delete ile geçmiş veriler korunur (route, courier_route_plan)
- Rota kodu unique (opsiyonel)
- Alternatif rotalar self-referential ilişki ile yönetilir

