# Migration 012: Audit & Archive Tables

## 📋 Genel Bakış

Migration 012, Global Cargo Backend sistemine **Merkezi Audit Logging ve Veri Arşivleme** altyapısını ekler. Bu migration, tüm sistem değişikliklerinin takibi, immutable audit kayıtları, veri arşivleme ve change data capture için gerekli taban yapısını oluşturur.

### Tablolar

1. **`audit_log`** - Merkezi audit logging
2. **`archive`** - Veri arşivleme
3. **`change_data_capture`** - Değişiklik takibi

---

## 🎯 Neden Audit Logging Kritik?

### Yasal ve Düzenleyici Gereksinimler

- **GDPR (EU)**: Veri işleme faaliyetlerinin kaydı
- **SOX (US)**: Finansal raporlama ve iç kontrollerin denetlenebilirliği
- **ISO 27001**: Bilgi güvenliği yönetim sistemleri için audit trail
- **HIPAA (US)**: Sağlık bilgilerine erişim kayıtları
- **PCI DSS**: Kart verilerine erişim logları

### İş Değeri

- **Forensic Investigation**: Güvenlik ihlallerinin araştırılması
- **Compliance Audits**: Düzenleyici denetimlere hazırlık
- **Data Lineage**: Veri kökeninin takibi
- **Change Tracking**: Sistem değişikliklerinin geriye dönük analizi
- **Accountability**: Kullanıcı eylemlerinin sorumluluğu

---

## 🏗️ Tablo Yapısı

### `audit_log`

Sistem genelinde tüm değişiklikleri kaydeden merkezi audit log tablosu.

```sql
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    record_uuid UUID,
    action VARCHAR(10) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    user_type VARCHAR(50),
    service_name VARCHAR(100),
    request_id VARCHAR(255),
    correlation_id VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`table_name`**: Değişiklik yapılan tablo adı
- **`record_id`**: Değişiklik yapılan kaydın ID'si
- **`record_uuid`**: Değişiklik yapılan kaydın UUID'si (opsiyonel)
- **`action`**: İşlem tipi (INSERT, UPDATE, DELETE)
- **`old_values`**: Değişiklik öncesi değerler (JSONB)
- **`new_values`**: Değişiklik sonrası değerler (JSONB)
- **`user_id`**: İşlemi yapan kullanıcı ID'si
- **`user_type`**: Kullanıcı tipi (customer, employee, system)
- **`service_name`**: İşlemi gerçekleştiren servis adı
- **`request_id`**: İstek takip ID'si
- **`correlation_id`**: İstek korelasyon ID'si
- **`ip_address`**: İşlemin yapıldığı IP adresi
- **`user_agent`**: İşlemin yapıldığı tarayıcı/istemci bilgisi
- **`timestamp`**: İşlem zamanı
- **`created_at`**: Kayıt oluşturulma zamanı

#### Özellikler

- **Immutable**: Audit kayıtları değiştirilemez veya silinemez
- **JSONB Storage**: Esnek veri saklama
- **Full Change History**: Her değişikliğin öncesi ve sonrası
- **Traceability**: Request ve correlation ID ile tam takip

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record 
    ON audit_log(table_name, record_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp 
    ON audit_log(timestamp);

CREATE INDEX IF NOT EXISTS idx_audit_log_action 
    ON audit_log(action);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id 
    ON audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_correlation_id 
    ON audit_log(correlation_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_request_id 
    ON audit_log(request_id);
```

### `archive`

Soğuk depolama için veri arşivleme tablosu.

```sql
CREATE TABLE IF NOT EXISTS archive (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    source_table_name VARCHAR(100) NOT NULL,
    source_record_id INTEGER NOT NULL,
    source_record_uuid UUID,
    archive_type VARCHAR(50) NOT NULL,
    archive_data JSONB NOT NULL,
    archive_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    archived_by INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    archive_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`uuid`**: Arşiv kaydı UUID'si (tekil)
- **`source_table_name`**: Arşivlenen verinin kaynak tablo adı
- **`source_record_id`**: Arşivlenen kaydın ID'si
- **`source_record_uuid`**: Arşivlenen kaydın UUID'si (opsiyonel)
- **`archive_type`**: Arşiv tipi (cold_storage, compliance, backup)
- **`archive_data`**: Arşivlenen veri (JSONB, tam snapshot)
- **`archive_date`**: Arşivlenme tarihi
- **`archived_by`**: Arşivleme işlemini yapan çalışan
- **`archive_reason`**: Arşivleme nedeni
- **`created_at`**: Kayıt oluşturulma zamanı

#### Özellikler

- **Read-Only**: Arşivlenen veriler değiştirilemez
- **Full Snapshot**: Kayıtların tam kopyası saklanır
- **Retention Ready**: Compliance için uzun süreli saklama

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_archive_source_table_record 
    ON archive(source_table_name, source_record_id);

CREATE INDEX IF NOT EXISTS idx_archive_archive_type 
    ON archive(archive_type);

CREATE INDEX IF NOT EXISTS idx_archive_archive_date 
    ON archive(archive_date);
```

### `change_data_capture`

Change Data Capture (CDC) için değişiklik takibi tablosu.

```sql
CREATE TABLE IF NOT EXISTS change_data_capture (
    id SERIAL PRIMARY KEY,
    source_table VARCHAR(100) NOT NULL,
    source_record_id INTEGER NOT NULL,
    source_record_uuid UUID,
    change_type VARCHAR(10) NOT NULL,
    change_data JSONB NOT NULL,
    change_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`source_table`**: Değişiklik kaynağı tablo adı
- **`source_record_id`**: Değişiklik yapılan kayıt ID'si
- **`source_record_uuid`**: Değişiklik yapılan kayıt UUID'si (opsiyonel)
- **`change_type`**: Değişiklik tipi (INSERT, UPDATE, DELETE)
- **`change_data`**: Değişiklik verisi (JSONB)
- **`change_timestamp`**: Değişiklik zamanı
- **`processed`**: İşlendi mi? (default: false)
- **`processed_at`**: İşlenme zamanı (opsiyonel)
- **`created_at`**: Kayıt oluşturulma zamanı

#### Özellikler

- **Event Sourcing Ready**: Olay tabanlı mimari için hazır
- **Async Processing**: İşlenmemiş kayıtlar için flag
- **CDC Pattern**: Değişiklikleri yakalayıp işleme almak için

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_cdc_source_table_record 
    ON change_data_capture(source_table, source_record_id);

CREATE INDEX IF NOT EXISTS idx_cdc_change_timestamp 
    ON change_data_capture(change_timestamp);

CREATE INDEX IF NOT EXISTS idx_cdc_processed 
    ON change_data_capture(processed) WHERE processed = false;
```

---

## 🔐 Audit vs Business Data Separation

### Ayrım Prensipleri

1. **Immutable Audit Tables**: Audit tablolarına UPDATE/DELETE yapılamaz
2. **Soft Delete Only**: Business tablolarında soft delete kullanılır
3. **No Foreign Keys**: Audit tabloları business tablolarına FK ile bağlanmaz
4. **Separate Storage**: Audit verileri ayrı storage'da tutulabilir

### Avantajlar

- **Tam Denetlenebilirlik**: Audit kayıtları asla değiştirilemez
- **Performance**: Business sorguları audit verilerinden etkilenmez
- **Compliance**: Yasal gereksinimler karşılanır
- **Security**: Audit verileri korunur

---

## 📦 Arşiv Stratejisi

### Hot vs Cold Storage

- **Hot Audit Logs**: Son 90 gün, aktif sorgulanan
- **Warm Archive**: 90 gün - 1 yıl, nadiren sorgulanan
- **Cold Archive**: 1+ yıl, compliance için saklanan

### Arşivleme Kuralları

- **Otomatik Arşivleme**: Belirli süre sonra otomatik arşivlenir
- **Batch Processing**: Toplu arşivleme işlemleri
- **Checksum Verification**: Veri bütünlüğü kontrolü
- **Read-Only Access**: Arşivlenen veriler salt okunur

### Retention Policies

| Veri Tipi | Retention Süresi | Gerekçe |
|-----------|------------------|---------|
| Financial Logs | 10 yıl | SOX, Vergi Mevzuatı |
| HR Logs | 7 yıl | İş Kanunu |
| Auth Logs | 2 yıl | Güvenlik |
| General Audit | 5 yıl | Genel Compliance |
| Archive | Süresiz | Compliance |

---

## 🏛️ Mimari Tasarım

### Domain Yapısı

Audit domain'i, sistem genelinde audit ve arşiv yönetimi için merkezi bir yönetim katmanı sağlar:

```
src/audit/
├── audit-log/
│   ├── repositories/
│   │   ├── audit-log.repository.interface.ts
│   │   └── audit-log.repository.ts
│   ├── services/
│   │   └── audit-log.service.ts
│   ├── controllers/
│   │   └── audit-log.controller.ts
│   ├── dto/
│   │   └── audit-log.dto.ts
│   └── audit-log.module.ts
├── archive/
│   ├── repositories/
│   │   ├── archive.repository.interface.ts
│   │   └── archive.repository.ts
│   ├── services/
│   │   └── archive.service.ts
│   ├── controllers/
│   │   └── archive.controller.ts
│   ├── dto/
│   │   └── archive.dto.ts
│   └── archive.module.ts
├── change-data-capture/
│   ├── repositories/
│   │   ├── change-data-capture.repository.interface.ts
│   │   └── change-data-capture.repository.ts
│   ├── services/
│   │   └── change-data-capture.service.ts
│   ├── controllers/
│   │   └── change-data-capture.controller.ts
│   ├── dto/
│   │   └── change-data-capture.dto.ts
│   └── change-data-capture.module.ts
└── audit.module.ts
```

### Katmanlar

1. **Repository Layer**: Read-only sorgular, parametrize edilmiş SQL
2. **Service Layer**: Business logic, veri dönüşümleri, validasyonlar
3. **Controller Layer**: Read-only RESTful API endpoints
4. **DTO Layer**: Validasyon ve veri transfer nesneleri

---

## 🔒 Güvenlik ve Immutability Kuralları

### Immutability

- **NO UPDATE**: Audit kayıtları güncellenemez
- **NO DELETE**: Audit kayıtları silinemez
- **Append-Only**: Sadece yeni kayıt eklenebilir
- **Database Level**: DB constraint'leri ile korunur

### Erişim Kontrolü

- **Admin Role**: Tüm audit verilerine erişim
- **Compliance Role**: Compliance denetimi için erişim
- **Read-Only**: Tüm endpoint'ler GET-only
- **Customer Access**: Müşteriler audit verilerine erişemez

### Hassas Veri Masking

- **PII Masking**: Kişisel bilgiler maskeleme
- **Query Layer**: Service katmanında maskelenir
- **Selective Access**: Rol bazlı görünürlük

---

## 📡 API Endpoints

### Audit Log Endpoints

#### Audit Logları Sorgula

```http
GET /audit/logs?tableName=cargo&recordId=123&startDate=2024-01-01&endDate=2024-01-31
```

**Query Parameters:**
- `tableName`: Tablo adı
- `recordId`: Kayıt ID'si
- `recordUuid`: Kayıt UUID'si
- `action`: İşlem tipi (INSERT, UPDATE, DELETE)
- `userId`: Kullanıcı ID'si
- `requestId`: İstek ID'si
- `correlationId`: Korelasyon ID'si
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi

**Response:**
```json
[
  {
    "id": 1,
    "tableName": "cargo",
    "recordId": 123,
    "recordUuid": "550e8400-e29b-41d4-a716-446655440000",
    "action": "UPDATE",
    "oldValues": {
      "status": "in_transit",
      "updated_at": "2024-01-15T10:00:00Z"
    },
    "newValues": {
      "status": "delivered",
      "updated_at": "2024-01-15T11:00:00Z"
    },
    "userId": 5,
    "userType": "employee",
    "serviceName": "CargoService",
    "requestId": "req-abc-123",
    "correlationId": "corr-xyz-456",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-15T11:00:00Z",
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

#### Tablo Bazlı Audit Logları

```http
GET /audit/logs/table/:tableName
```

#### Kayıt Bazlı Audit Trail

```http
GET /audit/logs/table/:tableName/record/:recordId
```

#### UUID Bazlı Audit Trail

```http
GET /audit/logs/table/:tableName/uuid/:recordUuid
```

#### İşlem Tipine Göre Filtrele

```http
GET /audit/logs/action/:action
```

#### Kullanıcı Bazlı Audit Logları

```http
GET /audit/logs/user/:userId
```

#### İstek ID'sine Göre Filtrele

```http
GET /audit/logs/request/:requestId
```

#### Korelasyon ID'sine Göre Filtrele

```http
GET /audit/logs/correlation/:correlationId
```

#### ID ile Audit Log Bul

```http
GET /audit/logs/:id
```

### Archive Endpoints

#### Arşiv Kayıtlarını Sorgula

```http
GET /audit/archives?sourceTableName=cargo&archiveType=cold_storage&startDate=2024-01-01
```

**Query Parameters:**
- `sourceTableName`: Kaynak tablo adı
- `sourceRecordId`: Kaynak kayıt ID'si
- `sourceRecordUuid`: Kaynak kayıt UUID'si
- `archiveType`: Arşiv tipi
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi
- `archivedBy`: Arşivleyen çalışan ID'si

#### Tablo Bazlı Arşivler

```http
GET /audit/archives/table/:sourceTableName
```

#### Kayıt Bazlı Arşivler

```http
GET /audit/archives/table/:sourceTableName/record/:sourceRecordId
```

#### UUID Bazlı Arşivler

```http
GET /audit/archives/table/:sourceTableName/uuid/:sourceRecordUuid
```

#### Arşiv Tipine Göre Filtrele

```http
GET /audit/archives/type/:archiveType
```

#### Arşivleyen Çalışana Göre Filtrele

```http
GET /audit/archives/archived-by/:employeeId
```

#### UUID ile Arşiv Bul

```http
GET /audit/archives/uuid/:uuid
```

#### ID ile Arşiv Bul

```http
GET /audit/archives/:id
```

### Change Data Capture Endpoints

#### CDC Kayıtlarını Sorgula

```http
GET /audit/change-data-capture?sourceTable=cargo&processed=false
```

#### İşlenmemiş CDC Kayıtları

```http
GET /audit/change-data-capture/unprocessed
```

#### İşlenmiş/İşlenmemiş Filtrele

```http
GET /audit/change-data-capture/processed/:processed
```

#### Tablo Bazlı CDC Kayıtları

```http
GET /audit/change-data-capture/table/:sourceTable
```

#### Kayıt Bazlı CDC Geçmişi

```http
GET /audit/change-data-capture/table/:sourceTable/record/:sourceRecordId
```

#### Değişiklik Tipine Göre Filtrele

```http
GET /audit/change-data-capture/change-type/:changeType
```

#### ID ile CDC Kaydı Bul

```http
GET /audit/change-data-capture/:id
```

---

## 📊 Veri Modelleri

### AuditLog Entity

```typescript
interface AuditLogEntity {
  id: number;
  table_name: string;
  record_id: number;
  record_uuid?: string;
  action: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  user_id?: number;
  user_type?: string;
  service_name?: string;
  request_id?: string;
  correlation_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
  created_at: Date;
}
```

### Archive Entity

```typescript
interface ArchiveEntity {
  id: number;
  uuid: string;
  source_table_name: string;
  source_record_id: number;
  source_record_uuid?: string;
  archive_type: string;
  archive_data: Record<string, unknown>;
  archive_date: Date;
  archived_by?: number;
  archive_reason?: string;
  created_at: Date;
}
```

### ChangeDataCapture Entity

```typescript
interface ChangeDataCaptureEntity {
  id: number;
  source_table: string;
  source_record_id: number;
  source_record_uuid?: string;
  change_type: string;
  change_data: Record<string, unknown>;
  change_timestamp: Date;
  processed: boolean;
  processed_at?: Date;
  created_at: Date;
}
```

---

## 🔍 Sorgu Örnekleri

### Bir Kaydın Tüm Değişiklik Geçmişi

```sql
SELECT 
    al.id,
    al.action,
    al.old_values,
    al.new_values,
    al.user_id,
    al.timestamp
FROM audit_log al
WHERE al.table_name = 'cargo' 
  AND al.record_id = 123
ORDER BY al.timestamp ASC;
```

### Belirli Bir Tarih Aralığındaki Tüm Değişiklikler

```sql
SELECT 
    al.table_name,
    al.record_id,
    al.action,
    COUNT(*) as change_count
FROM audit_log al
WHERE al.timestamp >= '2024-01-01'::timestamp
  AND al.timestamp <= '2024-01-31'::timestamp
GROUP BY al.table_name, al.record_id, al.action
ORDER BY change_count DESC;
```

### Bir Kullanıcının Tüm İşlemleri

```sql
SELECT 
    al.table_name,
    al.action,
    al.timestamp,
    al.ip_address
FROM audit_log al
WHERE al.user_id = 5
ORDER BY al.timestamp DESC
LIMIT 100;
```

### İşlenmemiş CDC Kayıtları

```sql
SELECT 
    cdc.id,
    cdc.source_table,
    cdc.source_record_id,
    cdc.change_type,
    cdc.change_timestamp
FROM change_data_capture cdc
WHERE cdc.processed = false
ORDER BY cdc.change_timestamp ASC
LIMIT 1000;
```

### Belirli Bir Tablo İçin Arşivlenmiş Kayıtlar

```sql
SELECT 
    a.id,
    a.source_record_id,
    a.archive_type,
    a.archive_date,
    a.archive_reason
FROM archive a
WHERE a.source_table_name = 'customer'
  AND a.archive_date >= '2024-01-01'::timestamp
ORDER BY a.archive_date DESC;
```

---

## 🔄 Örnek Audit Flow'ları

### Senaryo 1: Cargo Durum Değişikliği

```typescript
// 1. Cargo durumu güncellenir
UPDATE cargo SET status = 'delivered' WHERE id = 123;

// 2. Trigger otomatik olarak audit log oluşturur
INSERT INTO audit_log (
    table_name, record_id, record_uuid, action,
    old_values, new_values, user_id, timestamp
) VALUES (
    'cargo', 123, '550e8400-...', 'UPDATE',
    '{"status": "in_transit"}',
    '{"status": "delivered"}',
    5, CURRENT_TIMESTAMP
);

// 3. CDC kaydı oluşturulur
INSERT INTO change_data_capture (
    source_table, source_record_id, change_type,
    change_data, processed
) VALUES (
    'cargo', 123, 'UPDATE',
    '{"status": "delivered"}',
    false
);
```

### Senaryo 2: Müşteri Bilgisi Güncelleme

```typescript
// 1. Müşteri bilgisi güncellenir
UPDATE customer SET first_name = 'Ahmet' WHERE id = 456;

// 2. Audit log
INSERT INTO audit_log (
    table_name, record_id, action,
    old_values, new_values, user_id, 
    request_id, ip_address, timestamp
) VALUES (
    'customer', 456, 'UPDATE',
    '{"first_name": "Ali"}',
    '{"first_name": "Ahmet"}',
    10,
    'req-xyz-789',
    '192.168.1.100',
    CURRENT_TIMESTAMP
);
```

### Senaryo 3: Veri Arşivleme

```typescript
// 1. Eski bir cargo kaydı arşivlenir
INSERT INTO archive (
    source_table_name, source_record_id, source_record_uuid,
    archive_type, archive_data, archived_by, archive_reason
) VALUES (
    'cargo', 789, '550e8400-...',
    'cold_storage',
    '{"id": 789, "tracking_number": "TRK123", ...}',
    5,
    '5 yıllık retention policy gereği arşivlendi'
);
```

---

## 🔮 Gelecek Geliştirmeler

### SIEM Entegrasyonu

- **Splunk**: Audit loglarının Splunk'a aktarılması
- **ELK Stack**: Elasticsearch, Logstash, Kibana entegrasyonu
- **Splunk HEC**: HTTP Event Collector ile real-time gönderim
- **Alert Rules**: Anormal aktivite uyarıları

### Data Lake Entegrasyonu

- **AWS S3**: Arşivlenmiş verilerin S3'e aktarılması
- **Azure Data Lake**: Microsoft Azure Data Lake Storage
- **Parquet Format**: Verimli depolama formatı
- **Data Catalog**: Metadata yönetimi

### Machine Learning

- **Anomaly Detection**: Anormal aktivite tespiti
- **Predictive Analytics**: Trend analizi
- **Fraud Detection**: Dolandırıcılık tespiti
- **Pattern Recognition**: Desen tanıma

### Real-time Processing

- **Kafka Integration**: Event streaming
- **CDC Replication**: Real-time replication
- **WebSocket Notifications**: Real-time uyarılar
- **Event Sourcing**: Olay tabanlı mimari

### Advanced Analytics

- **Dashboard**: Audit metrikleri dashboard'u
- **Reporting**: Compliance raporları
- **Data Visualization**: Grafana, Power BI entegrasyonu
- **Custom Reports**: Özel raporlar

---

## ✅ Migration Kontrol Listesi

- [x] `audit_log` tablosu oluşturuldu
- [x] `archive` tablosu oluşturuldu
- [x] `change_data_capture` tablosu oluşturuldu
- [x] İndeksler oluşturuldu
- [x] Trigger fonksiyonu oluşturuldu (`audit_cargo_changes`)
- [x] Repository katmanı implementasyonu
- [x] Service katmanı implementasyonu
- [x] Controller katmanı implementasyonu (read-only)
- [x] DTO validasyonları
- [x] JSONB veri yönetimi
- [x] Query filtreleme desteği
- [x] Module entegrasyonu
- [x] Dokümantasyon

---

## 🚨 Önemli Notlar

1. **Immutability**: Audit kayıtları asla değiştirilemez veya silinemez. Bu, compliance ve güvenlik için kritiktir.

2. **Performance**: Audit loglarında limit kullanımı (1000-5000 kayıt) performans için önemlidir.

3. **JSONB Storage**: Esnek veri saklama için JSONB kullanılır, ancak sorgu performansı göz önünde bulundurulmalıdır.

4. **CDC Processing**: İşlenmemiş CDC kayıtları için batch job'lar çalıştırılmalıdır.

5. **Archive Retention**: Arşivlenmiş veriler için retention policy'leri uygulanmalıdır.

6. **Access Control**: Audit verilerine erişim RBAC ile kontrol edilmelidir.

7. **Data Masking**: Hassas veriler query layer'da maskelenmelidir.

8. **Correlation ID**: Distributed tracing için correlation ID kullanılmalıdır.

9. **Request ID**: Her API isteği için unique request ID oluşturulmalıdır.

10. **Trigger Function**: `audit_cargo_changes()` fonksiyonu örnek bir trigger fonksiyonudur, diğer tablolar için de benzer trigger'lar oluşturulabilir.

---

## 📚 İlgili Dokümantasyon

- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [SOX Compliance Requirements](https://www.soxlaw.com/)
- [ISO 27001 Information Security](https://www.iso.org/isoiec-27001-information-security.html)
- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)

---

**Migration 012 Tamamlandı** ✅
