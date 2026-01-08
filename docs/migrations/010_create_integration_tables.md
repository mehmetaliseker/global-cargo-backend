# Migration 010: Integration Tables

## 📋 Genel Bakış

Migration 010, Global Cargo Backend sistemine **Partner Entegrasyon** altyapısını ekler. Bu migration, harici sistemlerle entegrasyon için gerekli taban yapısını oluşturur ve partner bazlı konfigürasyon ve ülke eşleştirmesi yönetimini sağlar.

### Tablolar

1. **`partner_config`** - Partner entegrasyon konfigürasyonları
2. **`partner_country_mapping`** - Partner-ülke eşleştirmeleri

---

## 🏗️ Tablo Yapısı

### `partner_config`

Partner'lar için entegrasyon konfigürasyonlarını saklar. Her partner için tekil bir konfigürasyon kaydı bulunur.

```sql
CREATE TABLE IF NOT EXISTS partner_config (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    config_data JSONB,
    api_key_encrypted BYTEA,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    UNIQUE(partner_id)
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`partner_id`**: Partner referansı (UNIQUE constraint ile)
- **`config_data`**: JSONB formatında esnek konfigürasyon verisi
- **`api_key_encrypted`**: Şifrelenmiş API anahtarı (BYTEA)
- **`is_active`**: Aktif/pasif durumu
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **UNIQUE Constraint**: Her partner için tek bir aktif konfigürasyon
- **CASCADE DELETE**: Partner silindiğinde konfigürasyon da silinir
- **Soft Delete**: Fiziksel silme yapılmaz
- **Encrypted Storage**: API anahtarları şifrelenmiş olarak saklanır

### `partner_country_mapping`

Partner'ların hangi ülkelerde aktif olduğunu ve ülke bazlı özel konfigürasyonlarını saklar.

```sql
CREATE TABLE IF NOT EXISTS partner_country_mapping (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(id) ON DELETE CASCADE ON UPDATE CASCADE,
    country_id INTEGER NOT NULL REFERENCES country(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    is_active BOOLEAN DEFAULT true,
    mapping_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`partner_id`**: Partner referansı
- **`country_id`**: Ülke referansı
- **`is_active`**: Bu ülke için aktif/pasif durumu
- **`mapping_data`**: Ülke bazlı özel konfigürasyon verisi (JSONB)
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **UNIQUE Index**: Aktif kayıtlar için (partner_id, country_id) kombinasyonu tekil
- **RESTRICT DELETE**: Ülke silinemezken partner-ülke eşleştirmesi mevcutsa
- **CASCADE DELETE**: Partner silindiğinde eşleştirmeler de silinir
- **Soft Delete**: Fiziksel silme yapılmaz

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_partner_config_partner_id 
    ON partner_config(partner_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_partner_country_mapping_partner_id 
    ON partner_country_mapping(partner_id) WHERE deleted_at IS NULL AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_partner_country_mapping_country_id 
    ON partner_country_mapping(country_id) WHERE deleted_at IS NULL AND is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_partner_country_mapping_unique 
    ON partner_country_mapping(partner_id, country_id) 
    WHERE deleted_at IS NULL AND is_active = true;
```

---

## 🏛️ Mimari Tasarım

### Domain Yapısı

Integration domain'i, partner entegrasyonları için merkezi bir yönetim katmanı sağlar:

```
src/integration/
├── partner-config/
│   ├── repositories/
│   │   ├── partner-config.repository.interface.ts
│   │   └── partner-config.repository.ts
│   ├── services/
│   │   └── partner-config.service.ts
│   ├── controllers/
│   │   └── partner-config.controller.ts
│   ├── dto/
│   │   └── partner-config.dto.ts
│   └── partner-config.module.ts
├── partner-country-mapping/
│   ├── repositories/
│   │   ├── partner-country-mapping.repository.interface.ts
│   │   └── partner-country-mapping.repository.ts
│   ├── services/
│   │   └── partner-country-mapping.service.ts
│   ├── controllers/
│   │   └── partner-country-mapping.controller.ts
│   ├── dto/
│   │   └── partner-country-mapping.dto.ts
│   └── partner-country-mapping.module.ts
└── integration.module.ts
```

### Katmanlar

1. **Repository Layer**: Veritabanı erişimi, raw SQL sorguları
2. **Service Layer**: İş mantığı, veri dönüşümleri, güvenlik kontrolleri
3. **Controller Layer**: RESTful API endpoints
4. **DTO Layer**: Validasyon ve veri transfer nesneleri

---

## 🔐 Güvenlik Stratejisi

### API Key Şifreleme

API anahtarları AES-256-CBC algoritması ile şifrelenir:

- **Encryption Key**: Environment variable'dan alınır (`API_KEY_ENCRYPTION_KEY`)
- **IV (Initialization Vector)**: Her şifreleme için rastgele oluşturulur
- **Storage**: Şifrelenmiş veri BYTEA formatında saklanır
- **Response Masking**: API yanıtlarında `hasApiKey` boolean flag'i döner, gerçek anahtar asla expose edilmez

### Veri Güvenliği

- **Parameterized Queries**: SQL injection koruması
- **Transaction Isolation**: Tüm write işlemleri transaction içinde
- **Soft Delete**: Veri kaybı önlenir
- **Audit Trail**: Tüm değişiklikler `created_at` ve `updated_at` ile takip edilir

### Erişim Kontrolü

- **RBAC Ready**: Endpoint'ler RBAC koruması için hazır (gelecek implementasyon)
- **Partner Isolation**: Partner'lar kendi verilerine erişebilir
- **Validation**: DTO seviyesinde `class-validator` ile validasyon

---

## 📡 API Endpoints

### Partner Config Endpoints

#### Tüm Konfigürasyonları Listele

```http
GET /integration/partner-configs
```

**Response:**
```json
[
  {
    "id": 1,
    "partnerId": 10,
    "configData": {
      "apiVersion": "v2",
      "timeout": 30000,
      "retryAttempts": 3
    },
    "hasApiKey": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

#### Aktif Konfigürasyonları Listele

```http
GET /integration/partner-configs/active
```

#### Partner'a Göre Konfigürasyon Bul

```http
GET /integration/partner-configs/partner/:partnerId
```

#### ID'ye Göre Konfigürasyon Bul

```http
GET /integration/partner-configs/:id
```

#### Yeni Konfigürasyon Oluştur

```http
POST /integration/partner-configs
Content-Type: application/json

{
  "partnerId": 10,
  "configData": {
    "apiVersion": "v2",
    "timeout": 30000
  },
  "apiKey": "secret-api-key-here",
  "isActive": true
}
```

**Not**: `apiKey` alanı şifrelenerek saklanır, response'da dönmez.

#### Konfigürasyon Güncelle

```http
PUT /integration/partner-configs/:id
Content-Type: application/json

{
  "configData": {
    "apiVersion": "v3",
    "timeout": 60000
  },
  "isActive": false
}
```

### Partner Country Mapping Endpoints

#### Tüm Eşleştirmeleri Listele

```http
GET /integration/partner-country-mappings
```

#### Aktif Eşleştirmeleri Listele

```http
GET /integration/partner-country-mappings/active
```

#### Partner'a Göre Eşleştirmeleri Bul

```http
GET /integration/partner-country-mappings/partner/:partnerId
```

#### Partner'ın Aktif Eşleştirmelerini Bul

```http
GET /integration/partner-country-mappings/partner/:partnerId/active
```

#### Ülkeye Göre Eşleştirmeleri Bul

```http
GET /integration/partner-country-mappings/country/:countryId
```

#### Partner ve Ülkeye Göre Eşleştirme Bul

```http
GET /integration/partner-country-mappings/partner/:partnerId/country/:countryId
```

#### ID'ye Göre Eşleştirme Bul

```http
GET /integration/partner-country-mappings/:id
```

#### Yeni Eşleştirme Oluştur

```http
POST /integration/partner-country-mappings
Content-Type: application/json

{
  "partnerId": 10,
  "countryId": 1,
  "isActive": true,
  "mappingData": {
    "serviceCode": "EXPRESS",
    "cutoffTime": "15:00",
    "supportedServices": ["STANDARD", "EXPRESS", "OVERNIGHT"]
  }
}
```

#### Eşleştirme Güncelle

```http
PUT /integration/partner-country-mappings/:id
Content-Type: application/json

{
  "isActive": false,
  "mappingData": {
    "serviceCode": "STANDARD",
    "cutoffTime": "12:00"
  }
}
```

---

## 🔄 İş Kuralları

### Partner Config

1. **Tekillik**: Her partner için sadece bir aktif konfigürasyon olabilir
2. **API Key**: Opsiyonel, ancak sağlandığında mutlaka şifrelenir
3. **Config Data**: JSONB formatında esnek veri saklama
4. **Activation**: `is_active` flag'i ile entegrasyon aktif/pasif yapılabilir

### Partner Country Mapping

1. **Unique Constraint**: Aktif kayıtlar için (partner_id, country_id) kombinasyonu tekil
2. **Active Mapping**: Aynı partner-ülke kombinasyonu için sadece bir aktif eşleştirme
3. **Mapping Data**: Ülke bazlı özel konfigürasyonlar JSONB'de saklanır
4. **Cascade Delete**: Partner silindiğinde tüm eşleştirmeler soft delete olur

### Transaction Yönetimi

Tüm write işlemleri transaction içinde gerçekleştirilir:

- **Create**: Atomic insert işlemi
- **Update**: Atomic update işlemi
- **Soft Delete**: Atomic delete işlemi

---

## 🔧 Teknik Detaylar

### JSONB Veri Yönetimi

JSONB alanları için özel dönüşüm mantığı:

```typescript
// Repository'de JSON string'e çevirme
const result = await client.query(query, [
  JSON.stringify(configData)
]);

// Service'de JSONB'den object'e dönüşüm
if (entity.config_data) {
  if (typeof entity.config_data === 'string') {
    configData = JSON.parse(entity.config_data);
  } else {
    configData = entity.config_data as Record<string, unknown>;
  }
}
```

### API Key Şifreleme

```typescript
private async encryptApiKey(apiKey: string): Promise<Buffer> {
  const iv = randomBytes(16);
  const key = await scryptAsync(this.encryptionKey, 'salt', 32) as Buffer;
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(apiKey, 'utf8'),
    cipher.final(),
  ]);
  return Buffer.concat([iv, encrypted]);
}
```

### Environment Variable

`.env` dosyasına eklenmesi gereken:

```env
API_KEY_ENCRYPTION_KEY=<64-character-hex-string>
```

**Not**: Production ortamında bu key mutlaka güvenli bir secrets manager'dan alınmalıdır.

---

## 🌍 Gerçek Dünya Entegrasyon Senaryoları

### DHL Entegrasyonu

```json
{
  "partnerId": 1,
  "configData": {
    "apiVersion": "v3",
    "baseUrl": "https://api-eu.dhl.com",
    "timeout": 30000,
    "retryAttempts": 3,
    "rateLimiting": {
      "requestsPerSecond": 10,
      "burstLimit": 20
    }
  },
  "apiKey": "dhl-api-key-encrypted",
  "isActive": true
}
```

```json
{
  "partnerId": 1,
  "countryId": 1,
  "mappingData": {
    "serviceCode": "EXPRESS",
    "cutoffTime": "15:00",
    "supportedServices": ["STANDARD", "EXPRESS", "OVERNIGHT"],
    "additionalServices": ["COD", "INSURANCE"],
    "restrictions": {
      "maxWeight": 70,
      "maxDimensions": "120x80x80"
    }
  },
  "isActive": true
}
```

### FedEx Entegrasyonu

```json
{
  "partnerId": 2,
  "configData": {
    "apiVersion": "v1",
    "baseUrl": "https://apis.fedex.com",
    "authentication": {
      "type": "OAuth2",
      "tokenEndpoint": "/oauth/token"
    },
    "timeout": 45000
  },
  "apiKey": "fedex-client-id-encrypted",
  "isActive": true
}
```

### SAP ERP Entegrasyonu

```json
{
  "partnerId": 3,
  "configData": {
    "protocol": "RFC",
    "systemId": "SAP_PROD_01",
    "client": "100",
    "language": "TR",
    "connectionPool": {
      "minSize": 5,
      "maxSize": 20
    }
  },
  "apiKey": "sap-rfc-password-encrypted",
  "isActive": true
}
```

### Stripe Payment Entegrasyonu

```json
{
  "partnerId": 4,
  "configData": {
    "apiVersion": "2023-10-16",
    "mode": "live",
    "webhookSecret": "whsec_...",
    "idempotencyEnabled": true
  },
  "apiKey": "sk_live_...",
  "isActive": true
}
```

---

## 🔮 Gelecek Geliştirmeler

### Secrets Vault Entegrasyonu

Şu anki implementasyon environment variable kullanıyor, ancak production için:

- **AWS Secrets Manager**
- **Azure Key Vault**
- **HashiCorp Vault**
- **Google Secret Manager**

gibi enterprise secrets manager'lar entegre edilebilir.

### OAuth2 Desteği

Mevcut API key tabanlı authentication'a ek olarak:

- OAuth2 client credentials flow
- Refresh token yönetimi
- Token rotation otomasyonu

### Webhook Yönetimi

- Webhook endpoint kayıtları
- Signature verification
- Retry mekanizması
- Event logging

### Sync Job Yönetimi

- Scheduled sync jobs
- Manual trigger
- Job status tracking
- Error handling ve retry

### Rate Limiting & Throttling

- Partner bazlı rate limit konfigürasyonu
- Dynamic throttling
- Quota yönetimi

### Monitoring & Analytics

- Entegrasyon health checks
- API call metrics
- Error rate tracking
- Performance monitoring

---

## 📊 Veri Modelleri

### PartnerConfig Entity

```typescript
interface PartnerConfigEntity {
  id: number;
  partner_id: number;
  config_data?: Record<string, unknown>;
  api_key_encrypted?: Buffer;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

### PartnerCountryMapping Entity

```typescript
interface PartnerCountryMappingEntity {
  id: number;
  partner_id: number;
  country_id: number;
  is_active: boolean;
  mapping_data?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

---

## 🔍 Sorgu Örnekleri

### Aktif Partner Konfigürasyonlarını Getir

```sql
SELECT id, partner_id, config_data, is_active
FROM partner_config
WHERE is_active = true AND deleted_at IS NULL
ORDER BY created_at DESC;
```

### Partner'ın Aktif Ülke Eşleştirmelerini Getir

```sql
SELECT pcm.id, pcm.country_id, c.name as country_name, pcm.mapping_data
FROM partner_country_mapping pcm
INNER JOIN country c ON c.id = pcm.country_id
WHERE pcm.partner_id = $1 
  AND pcm.is_active = true 
  AND pcm.deleted_at IS NULL
ORDER BY c.name;
```

### Ülkeye Göre Aktif Partner'ları Bul

```sql
SELECT p.id, p.company_name, pc.config_data
FROM partner_country_mapping pcm
INNER JOIN partner p ON p.id = pcm.partner_id
INNER JOIN partner_config pc ON pc.partner_id = p.id
WHERE pcm.country_id = $1
  AND pcm.is_active = true
  AND pcm.deleted_at IS NULL
  AND pc.is_active = true
  AND pc.deleted_at IS NULL;
```

---

## ✅ Migration Kontrol Listesi

- [x] `partner_config` tablosu oluşturuldu
- [x] `partner_country_mapping` tablosu oluşturuldu
- [x] İndeksler oluşturuldu
- [x] Foreign key constraint'leri eklendi
- [x] Unique constraint'ler eklendi
- [x] Repository katmanı implementasyonu
- [x] Service katmanı implementasyonu
- [x] Controller katmanı implementasyonu
- [x] DTO validasyonları
- [x] Transaction desteği
- [x] Soft delete implementasyonu
- [x] API key şifreleme
- [x] JSONB veri yönetimi
- [x] Error handling
- [x] Module entegrasyonu
- [x] Dokümantasyon

---

## 🚨 Önemli Notlar

1. **API Key Güvenliği**: API anahtarları mutlaka şifrelenmiş olarak saklanmalı, hiçbir zaman plain text olarak loglanmamalı veya response'larda dönmemelidir.

2. **Environment Variable**: `API_KEY_ENCRYPTION_KEY` environment variable'ı production'da mutlaka güvenli bir şekilde yönetilmelidir.

3. **Transaction Isolation**: Tüm write işlemleri transaction içinde gerçekleştirilir, atomicity garanti edilir.

4. **Soft Delete**: Fiziksel silme işlemi yapılmaz, audit trail korunur.

5. **Unique Constraints**: Partner config için partner_id unique, partner-country mapping için aktif kayıtlar için (partner_id, country_id) unique'dir.

6. **JSONB Flexibility**: Config ve mapping data alanları JSONB kullanarak esnek veri yapılarına izin verir.

7. **Cascade Behavior**: Partner silindiğinde konfigürasyon ve eşleştirmeler de silinir (CASCADE), ancak ülke silinirken eşleştirmeler varsa silme engellenir (RESTRICT).

---

## 📚 İlgili Dokümantasyon

- [Migration 003: Actor Tables](./003_create_actor_tables.md)
- [Migration 002: Location Hierarchy](./002_create_location_hierarchy.md)
- [Partner Module Documentation](../../src/actor/partner/README.md)
- [Security Best Practices](../../docs/security.md)

---

**Migration 010 Tamamlandı** ✅

