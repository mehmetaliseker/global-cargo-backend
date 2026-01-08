# Migration 013: System Management Tables

## 📋 Genel Bakış

Migration 013, Global Cargo Backend sistemine **Sistem Yönetimi (System Management)** altyapısını ekler. Bu migration, platform konfigürasyonu, döviz kurları, bakım logları ve yedekleme logları için gerekli taban yapısını oluşturur.

### Tablolar

1. **`exchange_rate`** - Döviz kurları
2. **`system_config`** - Sistem konfigürasyonu
3. **`maintenance_log`** - Bakım logları
4. **`backup_log`** - Yedekleme logları

**⚠️ Not**: `cargo_analytics` tablosu bu migration'da oluşturulmuştur ancak Analytics modülünde implement edilecektir.

---

## 🎯 Sistem Verisi vs İş Verisi

### Ayrım Prensipleri

**Sistem Yönetimi Modülü** sadece **operasyonel ve konfigürasyon** verilerini içerir:

- ✅ **Exchange Rate**: Fiyatlandırma ve faturalama için kullanılan döviz kurları
- ✅ **System Config**: Platform ayarları ve konfigürasyon değerleri
- ✅ **Maintenance Log**: Operasyonel bakım kayıtları
- ✅ **Backup Log**: Yedekleme ve restore doğrulama kayıtları

**İş Verisi** ise diğer domain modüllerinde bulunur:

- ❌ Cargo, Customer, Employee (Actor domain)
- ❌ Invoice, Payment (Billing domain)
- ❌ Support Tickets (Support domain)
- ❌ HR Records (HR domain)

### Neden Ayrı?

1. **Farklı Yaşam Döngüsü**: Sistem verileri iş verilerinden farklı güncellenir
2. **Farklı Erişim Kontrolü**: Sistem verilerine sadece admin erişimi
3. **Farklı Audit Stratejisi**: Sistem değişiklikleri özel takip gerektirir
4. **Operasyonel Odak**: İş mantığından bağımsız yönetim gerektirir

---

## 🏗️ Tablo Yapısı

### `exchange_rate`

Farklı para birimleri arasındaki döviz kurlarını saklar. Fiyatlandırma ve faturalama modüllerinde kullanılır.

```sql
CREATE TABLE IF NOT EXISTS exchange_rate (
    id SERIAL PRIMARY KEY,
    from_currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    to_currency_id INTEGER NOT NULL REFERENCES currency_enum(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    rate_value DECIMAL(20, 8) NOT NULL,
    effective_date DATE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (from_currency_id != to_currency_id),
    CHECK (rate_value > 0)
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`from_currency_id`**: Kaynak para birimi (RESTRICT DELETE)
- **`to_currency_id`**: Hedef para birimi (RESTRICT DELETE)
- **`rate_value`**: Kur değeri (DECIMAL(20, 8))
- **`effective_date`**: Geçerlilik tarihi
- **`timestamp`**: Kur güncellenme zamanı
- **`source`**: Kur kaynağı (ör: "TCMB", "ECB", "Manual")
- **`is_active`**: Aktif/pasif durumu
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **UNIQUE Constraint**: (from_currency_id, to_currency_id, effective_date) kombinasyonu tekil
- **CHECK Constraint**: Aynı para biriminden aynı para birimine kur olamaz
- **CHECK Constraint**: Kur değeri pozitif olmalı
- **Soft Delete**: Fiziksel silme yapılmaz
- **RESTRICT DELETE**: Para birimi silinemez eğer kur kaydı varsa

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_exchange_rate_currencies 
    ON exchange_rate(from_currency_id, to_currency_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_exchange_rate_effective_date 
    ON exchange_rate(effective_date) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_exchange_rate_timestamp 
    ON exchange_rate(timestamp) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_exchange_rate_unique 
    ON exchange_rate(from_currency_id, to_currency_id, effective_date) WHERE deleted_at IS NULL;
```

### `system_config`

Platform genelinde kullanılan konfigürasyon değerlerini saklar.

```sql
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_type VARCHAR(50),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    updated_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`config_key`**: Konfigürasyon anahtarı (UNIQUE)
- **`config_value`**: Konfigürasyon değeri (TEXT, şifrelenebilir)
- **`config_type`**: Konfigürasyon tipi (ör: "email", "api", "feature_flag")
- **`description`**: Açıklama
- **`is_encrypted`**: Şifreli mi? (default: false)
- **`updated_by`**: Son güncelleyen çalışan (SET NULL DELETE)
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **UNIQUE Constraint**: Her config_key tekil
- **Encryption Ready**: `is_encrypted` flag'i ile şifreleme desteği
- **Soft Delete**: Fiziksel silme yapılmaz
- **Masking**: Şifreli değerler API'de maskelenir ("***ENCRYPTED***")

#### Şifreleme Stratejisi

- **Şu An**: Şifreleme mantığı implement edilmemiş, sadece flag var
- **Gelecek**: AES-256 şifreleme implement edilecek
- **API Response**: Şifreli değerler maskelenir, gerçek değer dönmez

### `maintenance_log`

Sistem bakım işlemlerinin loglarını saklar. Immutable log tablosu (soft delete yok).

```sql
CREATE TABLE IF NOT EXISTS maintenance_log (
    id SERIAL PRIMARY KEY,
    maintenance_type VARCHAR(100) NOT NULL,
    execution_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    duration_seconds INTEGER,
    details JSONB,
    executed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`maintenance_type`**: Bakım tipi (ör: "database_migration", "cache_clear", "index_rebuild")
- **`execution_date`**: Çalıştırma tarihi
- **`status`**: Durum (pending, running, completed, failed)
- **`duration_seconds`**: Süre (saniye)
- **`details`**: Detaylı bilgiler (JSONB)
- **`executed_by`**: Çalıştıran kullanıcı
- **`created_at`**, **`updated_at`**: Audit alanları

#### Özellikler

- **Immutable**: Log kayıtları değiştirilemez veya silinemez
- **No Soft Delete**: `deleted_at` alanı yok
- **JSONB Storage**: Esnek detay saklama

### `backup_log`

Yedekleme işlemlerinin loglarını saklar. Immutable log tablosu (soft delete yok).

```sql
CREATE TABLE IF NOT EXISTS backup_log (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    execution_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    duration_seconds INTEGER,
    restore_test_date TIMESTAMP WITH TIME ZONE,
    restore_test_status VARCHAR(50),
    restore_test_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`backup_type`**: Yedekleme tipi (ör: "full", "incremental", "database", "files")
- **`execution_date`**: Çalıştırma tarihi
- **`status`**: Durum (pending, running, completed, failed)
- **`file_path`**: Yedek dosya yolu
- **`file_size_bytes`**: Dosya boyutu (byte)
- **`duration_seconds`**: Süre (saniye)
- **`restore_test_date`**: Restore test tarihi
- **`restore_test_status`**: Restore test durumu
- **`restore_test_details`**: Restore test detayları
- **`created_at`**, **`updated_at`**: Audit alanları

#### Özellikler

- **Immutable**: Log kayıtları değiştirilemez veya silinemez
- **No Soft Delete**: `deleted_at` alanı yok
- **Restore Verification**: Restore test bilgileri saklanır

---

## 🏛️ Mimari Tasarım

### Domain Yapısı

System domain'i, platform konfigürasyonu ve operasyonel loglar için merkezi bir yönetim katmanı sağlar:

```
src/system/
├── exchange-rate/
│   ├── repositories/
│   │   ├── exchange-rate.repository.interface.ts
│   │   └── exchange-rate.repository.ts
│   ├── services/
│   │   └── exchange-rate.service.ts
│   ├── controllers/
│   │   └── exchange-rate.controller.ts
│   ├── dto/
│   │   └── exchange-rate.dto.ts
│   └── exchange-rate.module.ts
├── system-config/
│   ├── repositories/
│   │   ├── system-config.repository.interface.ts
│   │   └── system-config.repository.ts
│   ├── services/
│   │   └── system-config.service.ts
│   ├── controllers/
│   │   └── system-config.controller.ts
│   ├── dto/
│   │   └── system-config.dto.ts
│   └── system-config.module.ts
├── maintenance-log/
│   ├── repositories/
│   │   ├── maintenance-log.repository.interface.ts
│   │   └── maintenance-log.repository.ts
│   ├── services/
│   │   └── maintenance-log.service.ts
│   ├── controllers/
│   │   └── maintenance-log.controller.ts
│   ├── dto/
│   │   └── maintenance-log.dto.ts
│   └── maintenance-log.module.ts
├── backup-log/
│   ├── repositories/
│   │   ├── backup-log.repository.interface.ts
│   │   └── backup-log.repository.ts
│   ├── services/
│   │   └── backup-log.service.ts
│   ├── controllers/
│   │   └── backup-log.controller.ts
│   ├── dto/
│   │   └── backup-log.dto.ts
│   └── backup-log.module.ts
└── system.module.ts
```

### Katmanlar

1. **Repository Layer**: Raw SQL sorguları, parametrize edilmiş queries
2. **Service Layer**: Business logic, veri dönüşümleri, masking
3. **Controller Layer**: Read-only RESTful API endpoints
4. **DTO Layer**: Validasyon ve veri transfer nesneleri

---

## 🔄 Exchange Rate Kullanımı

### Fiyatlandırma Modülünde Kullanım

Exchange rate'ler fiyatlandırma ve faturalama modüllerinde kullanılır:

```typescript
// Fiyatlandırma hesaplaması sırasında
const basePrice = 100; // USD
const targetCurrency = 'TRY';
const exchangeRate = await exchangeRateService.findByCurrenciesAndDate(
  usdCurrencyId,
  tryCurrencyId,
  new Date(),
);
const convertedPrice = basePrice * exchangeRate.rateValue;
```

### Kur Güncelleme Stratejisi

- **Otomatik**: Harici API'lerden günlük kur çekimi (TCMB, ECB)
- **Manuel**: Admin panelinden manuel güncelleme
- **Tarih Bazlı**: Her tarih için ayrı kur kaydı
- **Aktif/Pasif**: Eski kurlar pasif edilir

---

## 🔐 Sistem Konfigürasyonu ve Şifreleme

### Konfigürasyon Tipleri

- **email**: Email sunucu ayarları
- **api**: Harici API anahtarları
- **feature_flag**: Feature toggle değerleri
- **integration**: Entegrasyon ayarları
- **security**: Güvenlik ayarları

### Şifreleme Stratejisi

**Şu Anki Durum**:
- `is_encrypted` flag'i mevcut
- Gerçek şifreleme mantığı implement edilmemiş
- API response'larda şifreli değerler maskelenir: `"***ENCRYPTED***"`

**Gelecek Implementasyon**:
- AES-256-CBC şifreleme
- Environment variable'dan encryption key
- Service katmanında encrypt/decrypt metodları

### Örnek Kullanım

```typescript
// Şifrelenmiş config değeri
{
  "configKey": "smtp_password",
  "configValue": "***ENCRYPTED***",
  "isEncrypted": true,
  "configType": "email"
}
```

---

## 📡 API Endpoints

### Exchange Rate Endpoints

#### Tüm Kurları Listele

```http
GET /system/exchange-rates
```

#### Aktif Kurları Listele

```http
GET /system/exchange-rates/active
```

#### Para Birimlerine Göre Kur Bul

```http
GET /system/exchange-rates/from/:fromCurrencyId/to/:toCurrencyId
```

#### Para Birimleri ve Tarihe Göre Kur Bul

```http
GET /system/exchange-rates/from/:fromCurrencyId/to/:toCurrencyId/date/:effectiveDate
```

#### Geçerlilik Tarihine Göre Kurları Bul

```http
GET /system/exchange-rates/effective-date/:effectiveDate
```

#### Kaynak Para Birimine Göre Kurları Bul

```http
GET /system/exchange-rates/from-currency/:currencyId
```

#### Hedef Para Birimine Göre Kurları Bul

```http
GET /system/exchange-rates/to-currency/:currencyId
```

#### ID ile Kur Bul

```http
GET /system/exchange-rates/:id
```

### System Config Endpoints

#### Tüm Konfigürasyonları Listele

```http
GET /system/configs
```

#### Tipine Göre Konfigürasyonları Bul

```http
GET /system/configs/type/:configType
```

#### Anahtara Göre Konfigürasyon Bul

```http
GET /system/configs/key/:configKey
```

**Response:**
```json
{
  "id": 1,
  "configKey": "smtp_host",
  "configValue": "smtp.example.com",
  "configType": "email",
  "description": "SMTP server address",
  "isEncrypted": false,
  "updatedBy": 5,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### ID ile Konfigürasyon Bul

```http
GET /system/configs/:id
```

### Maintenance Log Endpoints

#### Tüm Bakım Loglarını Listele

```http
GET /system/maintenance-logs
```

#### Bakım Tipine Göre Filtrele

```http
GET /system/maintenance-logs/type/:maintenanceType
```

#### Duruma Göre Filtrele

```http
GET /system/maintenance-logs/status/:status
```

#### Tarih Aralığına Göre Filtrele

```http
GET /system/maintenance-logs/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### ID ile Bakım Log Bul

```http
GET /system/maintenance-logs/:id
```

### Backup Log Endpoints

#### Tüm Yedekleme Loglarını Listele

```http
GET /system/backup-logs
```

#### Yedekleme Tipine Göre Filtrele

```http
GET /system/backup-logs/type/:backupType
```

#### Duruma Göre Filtrele

```http
GET /system/backup-logs/status/:status
```

#### Tarih Aralığına Göre Filtrele

```http
GET /system/backup-logs/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### ID ile Yedekleme Log Bul

```http
GET /system/backup-logs/:id
```

---

## 🔒 Güvenlik ve Erişim Kontrolü

### Read-Only Controllers

Tüm endpoint'ler **GET-only**'dir. Write işlemleri (CREATE, UPDATE, DELETE) gelecek migration'larda implement edilecektir.

**Neden Read-Only?**
- System management verileri hassas
- Admin-only işlemler RBAC guard'ları ile korunmalı
- Şimdilik sadece görüntüleme yetkisi verildi

### Şifreli Değer Masking

- Şifreli config değerleri API'de maskelenir
- Gerçek değerler asla expose edilmez
- `isEncrypted: true` flag'i ile belirtilir

### Future RBAC Integration

```typescript
// TODO: Add AdminGuard for write operations in future migrations
@UseGuards(AdminGuard)
@Post()
async create(...) { ... }
```

---

## 📊 Veri Modelleri

### ExchangeRate Entity

```typescript
interface ExchangeRateEntity {
  id: number;
  from_currency_id: number;
  to_currency_id: number;
  rate_value: number;
  effective_date: Date;
  timestamp: Date;
  source?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

### SystemConfig Entity

```typescript
interface SystemConfigEntity {
  id: number;
  config_key: string;
  config_value?: string;
  config_type?: string;
  description?: string;
  is_encrypted: boolean;
  updated_by?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

### MaintenanceLog Entity

```typescript
interface MaintenanceLogEntity {
  id: number;
  maintenance_type: string;
  execution_date: Date;
  status: string;
  duration_seconds?: number;
  details?: Record<string, unknown>;
  executed_by?: string;
  created_at: Date;
  updated_at: Date;
}
```

### BackupLog Entity

```typescript
interface BackupLogEntity {
  id: number;
  backup_type: string;
  execution_date: Date;
  status: string;
  file_path?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  restore_test_date?: Date;
  restore_test_status?: string;
  restore_test_details?: string;
  created_at: Date;
  updated_at: Date;
}
```

---

## 🔍 Sorgu Örnekleri

### Belirli Bir Tarihte Aktif Kurları Getir

```sql
SELECT er.id, er.from_currency_id, er.to_currency_id, er.rate_value, er.effective_date
FROM exchange_rate er
WHERE er.effective_date <= '2024-01-15'::date
  AND er.is_active = true
  AND er.deleted_at IS NULL
ORDER BY er.effective_date DESC, er.timestamp DESC;
```

### Şifrelenmiş Konfigürasyonları Getir

```sql
SELECT id, config_key, config_type, description
FROM system_config
WHERE is_encrypted = true
  AND deleted_at IS NULL
ORDER BY config_key;
```

### Son 7 Günün Bakım Loglarını Getir

```sql
SELECT id, maintenance_type, execution_date, status, duration_seconds
FROM maintenance_log
WHERE execution_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY execution_date DESC;
```

### Başarılı Yedekleme Loglarını Getir

```sql
SELECT id, backup_type, execution_date, file_size_bytes, duration_seconds
FROM backup_log
WHERE status = 'completed'
ORDER BY execution_date DESC
LIMIT 100;
```

---

## 🚀 Operasyonel Senaryolar

### Senaryo 1: Döviz Kuru Güncelleme

1. TCMB API'den günlük kurlar çekilir
2. Her para birimi çifti için yeni kur kaydı oluşturulur
3. Eski kurlar pasif edilir (`is_active = false`)
4. Fiyatlandırma modülü yeni kurları kullanır

### Senaryo 2: Sistem Konfigürasyonu Güncelleme

1. Admin panelinden config değeri güncellenir
2. Hassas değerler şifrelenir (`is_encrypted = true`)
3. `updated_by` alanı güncellenir
4. API'de şifreli değerler maskelenir

### Senaryo 3: Bakım İşlemi Loglama

1. Bakım scripti çalıştırılır
2. Maintenance log kaydı oluşturulur (`status = 'running'`)
3. İşlem tamamlandığında log güncellenir (`status = 'completed'`)
4. Süre ve detaylar kaydedilir

### Senaryo 4: Yedekleme ve Restore Doğrulama

1. Otomatik yedekleme scripti çalışır
2. Backup log kaydı oluşturulur
3. Restore test otomatik çalıştırılır
4. Test sonuçları log'a yazılır

---

## 🔮 Gelecek Geliştirmeler

### RBAC Entegrasyonu

- **AdminGuard**: Write işlemleri için admin yetkisi kontrolü
- **ConfigGuard**: Konfigürasyon değişiklikleri için özel yetki
- **Audit Integration**: Sistem değişikliklerinin audit log'a yazılması

### Şifreleme Implementasyonu

- **AES-256-CBC**: Gerçek şifreleme algoritması
- **Key Management**: Encryption key yönetimi
- **Rotation**: Key rotation stratejisi

### Otomatik Kur Güncelleme

- **Scheduled Jobs**: Günlük kur güncelleme job'ları
- **API Integration**: TCMB, ECB gibi harici kaynaklardan kur çekme
- **Fallback Mechanism**: API hatası durumunda fallback stratejisi

### Monitoring ve Alerting

- **Backup Status Monitoring**: Yedekleme başarısızlık uyarıları
- **Maintenance Window Tracking**: Bakım pencere takibi
- **Config Change Alerts**: Kritik config değişiklik uyarıları

---

## ⚠️ Önemli Notlar

1. **Read-Only Controllers**: Şu anki implementasyonda tüm endpoint'ler GET-only'dir. Write işlemleri gelecek migration'larda eklenecektir.

2. **Encryption**: Şifreleme mantığı henüz implement edilmemiştir. Sadece `is_encrypted` flag'i ve masking mevcut.

3. **Immutable Logs**: `maintenance_log` ve `backup_log` tablolarında soft delete yok, kayıtlar immutable'dır.

4. **Exchange Rate Precision**: Kur değerleri `DECIMAL(20, 8)` ile yüksek hassasiyetle saklanır.

5. **Unique Constraints**: Exchange rate için (from_currency_id, to_currency_id, effective_date) kombinasyonu tekil.

6. **CHECK Constraints**: Exchange rate tablosunda aynı para biriminden aynı para birimine kur olamaz ve kur değeri pozitif olmalı.

7. **Cargo Analytics Exclusion**: `cargo_analytics` tablosu bu migration'da oluşturulmuştur ancak Analytics modülünde implement edilecektir.

---

## 📚 İlgili Dokümantasyon

- [Migration 001: Enum & Lookup Tables](./001_create_enum_lookup_tables.md) - Currency enum tanımları
- [Migration 006: Pricing & Invoice Tables](./006_create_pricing_invoice_tables.md) - Exchange rate kullanımı
- [Migration 012: Audit & Archive Tables](./012_create_audit_archive_tables.md) - Sistem değişiklik audit'i

---

**Migration 013 Tamamlandı** ✅
