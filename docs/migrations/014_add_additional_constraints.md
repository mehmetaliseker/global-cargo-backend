# Migration 014: Additional Constraints

## 📋 Genel Bakış

Migration 014, Global Cargo Backend sistemine **veri bütünlüğü ve güvenlik için ek constraint'ler** ekler. Bu migration, mevcut tablolara immutability trigger'ları, unique constraint'ler ve otomatik timestamp güncelleme mekanizmalarını ekleyerek veri güvenliğini artırır.

### Constraint Kategorileri

1. **Immutable Table Triggers** - UPDATE/DELETE engelleme
2. **Unique Constraints** - Partial unique index'ler
3. **Automatic Timestamp Updates** - updated_at trigger'ları

---

## 🎯 Neden Constraint'ler Dağıtık Sistemlerde Kritik?

### Veri Bütünlüğü Garantisi

- **Database-Level Enforcement**: Application layer'dan bağımsız güvence
- **Race Condition Prevention**: Concurrent update'lerde veri tutarsızlığını önleme
- **Cascade Protection**: Yanlışlıkla yapılan silme/güncelleme işlemlerinin engellenmesi
- **Audit Trail Integrity**: Immutable log kayıtlarının korunması

### İş Mantığı Koruma

- **Calculation Integrity**: Fiyat ve vergi hesaplamalarının değiştirilemezliği
- **Insurance Immutability**: Sigorta kayıtlarının audit uyumluluğu
- **State History Preservation**: Kargo durum geçmişinin değişmezliği
- **Support Request Uniqueness**: Her cargo için tek aktif destek talebi

---

## 🏗️ Constraint Kategorileri

### 1. Immutable Table Triggers

Bu tablolar için UPDATE ve DELETE işlemleri trigger ile engellenir:

#### `cargo_state_history`
- **Amaç**: Kargo durum geçmişinin immutable olması
- **Gerekçe**: Audit trail bütünlüğü (Gereksinim 95)
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `audit_log`
- **Amaç**: Merkezi audit log kayıtlarının değiştirilemezliği
- **Gerekçe**: Compliance ve güvenlik gereksinimleri
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `archive`
- **Amaç**: Arşivlenmiş verilerin korunması
- **Gerekçe**: Veri saklama ve yasal uyumluluk
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `event_evidence`
- **Amaç**: Olay kanıtlarının değiştirilemezliği
- **Gerekçe**: Forensic investigation ve compliance
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `pricing_calculation`
- **Amaç**: Fiyat hesaplamalarının immutable olması
- **Gerekçe**: Finansal audit trail ve pricing history
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `cargo_insurance`
- **Amaç**: Sigorta kayıtlarının immutable olması
- **Gerekçe**: Sigorta uyumluluğu ve audit gereksinimleri
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

#### `customs_tax_calculation`
- **Amaç**: Gümrük vergi hesaplamalarının immutable olması
- **Gerekçe**: Vergi uyumluluğu ve geriye dönük hesaplama koruması
- **Davranış**: UPDATE ve DELETE işlemleri exception fırlatır

### 2. Unique Constraints

#### `customer_support_request.cargo_id`
- **Amaç**: Her cargo için tek aktif destek talebi
- **Constraint**: Partial unique index (NULL değilse ve silinmemişse)
- **İş Mantığı**: Bir cargo için aynı anda sadece bir açık destek talebi olabilir
- **İndex Adı**: `idx_customer_support_request_unique_cargo`

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_support_request_unique_cargo
    ON customer_support_request(cargo_id)
    WHERE cargo_id IS NOT NULL AND deleted_at IS NULL;
```

### 3. Automatic Timestamp Updates

Aşağıdaki tablolarda `updated_at` kolonu otomatik olarak güncellenir:

- `cargo`
- `customer`
- `employee`
- `invoice`
- `payment`

**Fonksiyon**: `update_updated_at_column()`
**Davranış**: Her UPDATE işleminde `updated_at` kolonu `CURRENT_TIMESTAMP` ile güncellenir

---

## 🔐 Database Constraints vs Application Validation

### Database-Level Constraints (Migration 014)

**Avantajlar**:
- ✅ **Güvenlik**: Application layer bypass edilemez
- ✅ **Concurrency Safe**: Race condition'lardan bağımsız
- ✅ **Performance**: Index kullanımı ile hızlı kontrol
- ✅ **Data Integrity**: Her zaman aktif ve çalışır

**Örnek**: Unique constraint violation → Database exception → Service layer'da yakalanır

### Application-Level Validation

**Kullanım Alanları**:
- ✅ **Business Logic**: Karmaşık iş kuralları
- ✅ **User Experience**: Hızlı geri bildirim (database'e gitmeden)
- ✅ **Data Formatting**: String format, email validation
- ✅ **Pre-validation**: Database'e gitmeden önce kontrol

**Örnek**: `createDto.cargoId` kontrolü → Service layer'da önceden kontrol

### İdeal Kombinasyon

```typescript
// Service Layer: Pre-validation (UX için hızlı)
async create(createDto: CreateCustomerSupportRequestDto) {
  if (createDto.cargoId) {
    const existing = await this.repository.findByCargoId(createDto.cargoId);
    if (existing && !existing.deleted_at) {
      throw new BadRequestException('An active support request already exists');
    }
  }

  try {
    // Repository Layer: Database constraint (güvenlik)
    return await this.repository.create(...);
  } catch (error) {
    // Database constraint violation handling
    if (error.message.includes('unique')) {
      throw new BadRequestException('Constraint violation: duplicate entry');
    }
    throw error;
  }
}
```

---

## 🛠️ Service Layer Alignment

### cargo_insurance Service

**Değişiklikler**:
- ❌ `update()` metodu kaldırıldı → `BadRequestException` fırlatır
- ❌ `activate()` metodu kaldırıldı → `BadRequestException` fırlatır
- ✅ `create()` metodu korundu (immutable constraint INSERT'e izin verir)

**Repository**:
- ❌ `ICargoInsuranceRepository.update()` metodu interface'ten kaldırıldı
- ❌ `CargoInsuranceRepository.update()` implementation kaldırıldı

**Controller**:
- ❌ `PUT /insurance/cargo/:id` endpoint'i kaldırıldı
- ❌ `PUT /insurance/cargo/:id/activate` endpoint'i kaldırıldı

### customs_tax_calculation Service

**Durum**:
- ✅ Zaten immutable (update metodu yok)
- ✅ Sadece `create()` metodu mevcut
- ✅ Migration trigger'ı ile korunuyor

### pricing_calculation Service

**Durum**:
- ✅ Zaten immutable (update metodu yok)
- ✅ Sadece read-only operations mevcut
- ✅ Migration trigger'ı ile korunuyor

### customer_support_request Service

**Değişiklikler**:
- ✅ `create()` metoduna unique cargo_id kontrolü eklendi
- ✅ Repository'de pre-check eklendi
- ✅ Error handling ile constraint violation yakalanıyor

**Repository**:
```typescript
async create(...) {
  // Pre-check: Unique constraint kontrolü
  if (cargoId !== null) {
    const existing = await client.query(checkQuery, [cargoId]);
    if (existing.rows.length > 0) {
      throw new Error('An active support request already exists');
    }
  }
  // INSERT işlemi
}
```

**Service**:
```typescript
async create(createDto) {
  try {
    return await this.repository.create(...);
  } catch (error) {
    // Constraint violation handling
    if (error.message.includes('unique') || 
        error.message.includes('already exists')) {
      throw new BadRequestException(...);
    }
    throw error;
  }
}
```

---

## 📊 Error Handling Strategy

### Constraint Violation Mapping

| Database Error | HTTP Status | Exception Type | User Message |
|---------------|-------------|----------------|--------------|
| Unique constraint violation | `409 Conflict` / `400 BadRequest` | `BadRequestException` | "An active support request already exists for cargo {id}" |
| UPDATE on immutable table | `400 BadRequest` | `BadRequestException` | "Update operation is not allowed. Records are immutable." |
| DELETE on immutable table | `400 BadRequest` | `BadRequestException` | "Delete operation is not allowed. Records are immutable." |
| Foreign key violation | `400 BadRequest` | `BadRequestException` | "Referenced record does not exist" |
| Check constraint violation | `400 BadRequest` | `BadRequestException` | Constraint-specific message |

### Error Handling Pattern

```typescript
// Pattern 1: Pre-validation (Service Layer)
if (violatesConstraint) {
  throw new BadRequestException('User-friendly message');
}

// Pattern 2: Database constraint catch (Service Layer)
try {
  return await this.repository.create(...);
} catch (error) {
  if (error.message.includes('unique')) {
    throw new BadRequestException('Constraint violation message');
  }
  throw error;
}

// Pattern 3: Repository pre-check (Repository Layer)
if (cargoId !== null) {
  const existing = await client.query(checkQuery, [cargoId]);
  if (existing.rows.length > 0) {
    throw new Error('Detailed error message');
  }
}
```

---

## 🚫 Engellenen Geçersiz Durumlar

### Örnek 1: Cargo Insurance Update Denemesi

**Önceki Durum** (Migration 014 öncesi):
```typescript
// Mümkündü, ancak audit trail'i bozuyordu
PUT /insurance/cargo/123
{
  "isActive": false,
  "premiumAmount": 5000
}
```

**Sonraki Durum** (Migration 014 sonrası):
```typescript
PUT /insurance/cargo/123
// Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "Update operation is not allowed on cargo insurance records. Insurance records are immutable."
}
```

**Engellenen Senaryo**:
- ❌ Sigorta kayıtlarının güncellenmesi
- ❌ Finansal audit trail'in bozulması
- ❌ Yasal uyumluluk ihlalleri

### Örnek 2: Duplicate Support Request

**Önceki Durum** (Migration 014 öncesi):
```typescript
// Mümkündü, ancak iş mantığına aykırıydı
POST /support/requests
{
  "cargoId": 123,
  "customerId": 456,
  ...
}
// Başarılı

POST /support/requests
{
  "cargoId": 123,  // Aynı cargo
  "customerId": 456,
  ...
}
// Başarılı (yanlış!)
```

**Sonraki Durum** (Migration 014 sonrası):
```typescript
POST /support/requests
{
  "cargoId": 123,
  ...
}
// Başarılı

POST /support/requests
{
  "cargoId": 123,  // Aynı cargo
  ...
}
// Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "An active support request already exists for cargo 123"
}
```

**Engellenen Senaryo**:
- ❌ Bir cargo için birden fazla aktif destek talebi
- ❌ Support team confusion
- ❌ Ticket duplicate tracking

### Örnek 3: Pricing Calculation Manipulation

**Önceki Durum** (Migration 014 öncesi):
```sql
-- Teorik olarak mümkün (eğer update metodu varsaydı)
UPDATE pricing_calculation
SET total_amount = 1000
WHERE id = 123;
```

**Sonraki Durum** (Migration 014 sonrası):
```sql
UPDATE pricing_calculation
SET total_amount = 1000
WHERE id = 123;
-- Error: "cargo_state_history tablosunda UPDATE ve DELETE işlemleri yasaktır (Gereksinim 95)"
```

**Engellenen Senaryo**:
- ❌ Fiyat hesaplamalarının manipülasyonu
- ❌ Finansal fraud
- ❌ Audit trail bozulması

---

## 🔄 Backward Compatibility Considerations

### Breaking Changes

#### 1. cargo_insurance API

**Breaking Change**:
- ❌ `PUT /insurance/cargo/:id` endpoint'i kaldırıldı
- ❌ `PUT /insurance/cargo/:id/activate` endpoint'i kaldırıldı

**Migration Path**:
- ✅ Mevcut API consumer'lar için deprecation notice
- ✅ API documentation güncellemesi
- ✅ Error response'da açıklayıcı mesaj

**Alternatif Çözüm**:
- Yeni sigorta kaydı oluşturma (`POST /insurance/cargo`)
- Eski kayıt immutable olarak kalır
- Yeni kayıt ile eskisini soft-delete etme (eğer gerekirse)

#### 2. customer_support_request Behavior

**Breaking Change**:
- ❌ Artık bir cargo için sadece bir aktif destek talebi oluşturulabilir

**Migration Path**:
- ✅ Mevcut duplicate kayıtlar migration'dan önce temizlenmeli
- ✅ Application layer'da validation eklendi (hızlı feedback)
- ✅ Database constraint (güvenlik layer)

**Data Migration**:
```sql
-- Migration 014 öncesi: Duplicate kayıtları kontrol et
SELECT cargo_id, COUNT(*) as count
FROM customer_support_request
WHERE cargo_id IS NOT NULL AND deleted_at IS NULL
GROUP BY cargo_id
HAVING COUNT(*) > 1;

-- Duplicate kayıtları temizle (en eski açık kalsın)
WITH ranked AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY cargo_id ORDER BY created_at ASC) as rn
  FROM customer_support_request
  WHERE cargo_id IS NOT NULL AND deleted_at IS NULL
)
UPDATE customer_support_request
SET deleted_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 1
);
```

---

## ⚠️ Migration Risk Assessment

### Yüksek Risk Alanları

#### 1. Immutable Table Triggers

**Risk**: Mevcut UPDATE/DELETE işlemleri çalışmayacak
**Etki**: API breaking change
**Çözüm**: 
- ✅ Service layer'da metodlar kaldırıldı
- ✅ Controller endpoint'leri kaldırıldı
- ✅ Error handling ile açıklayıcı mesajlar

#### 2. Unique Constraint Violations

**Risk**: Mevcut duplicate kayıtlar constraint'i ihlal edebilir
**Etki**: Migration sırasında hata
**Çözüm**:
- ✅ Partial index kullanıldı (`WHERE deleted_at IS NULL`)
- ✅ Migration öncesi duplicate temizliği gerekli
- ✅ Application layer'da pre-validation eklendi

#### 3. Automatic Timestamp Updates

**Risk**: Mevcut kod `updated_at`'i manuel set ediyorsa redundant olur
**Etki**: Düşük risk (trigger override eder, ancak kod gereksiz olur)
**Çözüm**:
- ✅ Trigger her zaman çalışır (database-level)
- ✅ Application layer'daki `updated_at` set'leri çalışmaya devam eder (sorun yok)
- ✅ Future optimization: Application layer'daki `updated_at` set'leri kaldırılabilir (optional)

### Test Senaryoları

1. **Immutable Table Test**:
   - ❌ `cargo_insurance` UPDATE denemesi → `BadRequestException`
   - ❌ `pricing_calculation` UPDATE denemesi → Database exception
   - ✅ `cargo_insurance` CREATE çalışır

2. **Unique Constraint Test**:
   - ❌ Duplicate `customer_support_request` → `BadRequestException`
   - ✅ İki farklı cargo için destek talebi → Başarılı
   - ✅ NULL cargo_id ile multiple request → Başarılı

3. **Timestamp Update Test**:
   - ✅ `cargo` UPDATE → `updated_at` otomatik güncellenir
   - ✅ `invoice` UPDATE → `updated_at` otomatik güncellenir

---

## 🔙 Rollback Strategy

### Rollback Senaryoları

#### Senaryo 1: Trigger'ları Kaldırma

```sql
-- Immutable table trigger'larını kaldır
DROP TRIGGER IF EXISTS trigger_prevent_cargo_state_history_update ON cargo_state_history;
DROP TRIGGER IF EXISTS trigger_prevent_cargo_state_history_delete ON cargo_state_history;
DROP TRIGGER IF EXISTS trigger_prevent_audit_log_update ON audit_log;
DROP TRIGGER IF EXISTS trigger_prevent_audit_log_delete ON audit_log;
DROP TRIGGER IF EXISTS trigger_prevent_archive_update ON archive;
DROP TRIGGER IF EXISTS trigger_prevent_archive_delete ON archive;
DROP TRIGGER IF EXISTS trigger_prevent_event_evidence_update ON event_evidence;
DROP TRIGGER IF EXISTS trigger_prevent_event_evidence_delete ON event_evidence;
DROP TRIGGER IF EXISTS trigger_prevent_pricing_calculation_update ON pricing_calculation;
DROP TRIGGER IF EXISTS trigger_prevent_pricing_calculation_delete ON pricing_calculation;
DROP TRIGGER IF EXISTS trigger_prevent_cargo_insurance_update ON cargo_insurance;
DROP TRIGGER IF EXISTS trigger_prevent_cargo_insurance_delete ON cargo_insurance;
DROP TRIGGER IF EXISTS trigger_prevent_customs_tax_calculation_update ON customs_tax_calculation;
DROP TRIGGER IF EXISTS trigger_prevent_customs_tax_calculation_delete ON customs_tax_calculation;

-- Function'ı kaldır
DROP FUNCTION IF EXISTS prevent_cargo_state_history_update_delete();
```

#### Senaryo 2: Unique Index'i Kaldırma

```sql
DROP INDEX IF EXISTS idx_customer_support_request_unique_cargo;
```

#### Senaryo 3: Timestamp Trigger'larını Kaldırma

```sql
DROP TRIGGER IF EXISTS trigger_update_cargo_updated_at ON cargo;
DROP TRIGGER IF EXISTS trigger_update_customer_updated_at ON customer;
DROP TRIGGER IF EXISTS trigger_update_employee_updated_at ON employee;
DROP TRIGGER IF EXISTS trigger_update_invoice_updated_at ON invoice;
DROP TRIGGER IF EXISTS trigger_update_payment_updated_at ON payment;

DROP FUNCTION IF EXISTS update_updated_at_column();
```

**Dikkat**: Rollback sonrası application layer'daki değişiklikler (service metodları, controller endpoint'leri) manuel olarak geri alınmalıdır.

---

## 🔮 Future-Proofing Notes

### Potential Enhancements

1. **Constraint Violation Exception Handler**:
   - Global exception filter ile constraint violation'ları otomatik yakalama
   - PostgreSQL error code'larına göre mapping (23505 = unique violation, 23503 = foreign key violation)

2. **Application Layer Optimization**:
   - `updated_at` manuel set'lerini kaldırma (trigger zaten yapıyor)
   - Repository pattern'de `updated_at` kolonunu optional yapma

3. **Monitoring & Alerting**:
   - Constraint violation metric'leri
   - Immutable table update denemesi alert'leri
   - Unique constraint violation rate tracking

4. **Documentation**:
   - API documentation'da immutable table'ları belirtme
   - OpenAPI schema'da 400/409 response'ları ekleme
   - Developer guide'da constraint'ler hakkında bilgi

5. **Testing**:
   - Integration test'lerde constraint violation senaryoları
   - E2E test'lerde immutable table behavior
   - Load test'lerde unique constraint concurrency

---

## 📝 Özet

Migration 014, Global Cargo Backend sistemine kritik veri bütünlüğü constraint'lerini ekler:

### Eklenen Özellikler

✅ **7 immutable table trigger'ı** - UPDATE/DELETE engelleme
✅ **1 unique constraint** - customer_support_request cargo_id
✅ **5 automatic timestamp trigger'ı** - updated_at otomatik güncelleme

### Etkilenen Modüller

- `cargo_insurance` - Immutable yapıldı, update metodları kaldırıldı
- `customer_support_request` - Unique constraint eklendi, pre-validation eklendi
- `cargo`, `customer`, `employee`, `invoice`, `payment` - Automatic timestamp updates

### Breaking Changes

- ❌ `PUT /insurance/cargo/:id` endpoint'i kaldırıldı
- ❌ `PUT /insurance/cargo/:id/activate` endpoint'i kaldırıldı
- ❌ customer_support_request için duplicate cargo_id artık mümkün değil

### Güvenlik İyileştirmeleri

- ✅ Database-level immutability garantisi
- ✅ Application layer bypass edilemez constraint'ler
- ✅ Audit trail bütünlüğü koruması
- ✅ Financial calculation immutability

---

**Sonraki Migration**: Migration 015 bekleniyor.
