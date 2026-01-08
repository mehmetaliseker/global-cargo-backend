# Migration 011: Customer Support Tables

## 📋 Genel Bakış

Migration 011, Global Cargo Backend sistemine **Müşteri Destek (Customer Support)** altyapısını ekler. Bu migration, müşteri destek talepleri, yanıt yönetimi, atama ve çözüm takibi için gerekli taban yapısını oluşturur.

### Tablolar

1. **`customer_support_request`** - Müşteri destek talepleri (ticket)
2. **`customer_support_response`** - Destek talebi yanıtları (mesaj)

---

## 🏗️ Tablo Yapısı

### `customer_support_request`

Müşteri destek taleplerini saklar. Her talep bir müşteriye bağlıdır ve opsiyonel olarak bir cargo ile ilişkilendirilebilir.

```sql
CREATE TABLE IF NOT EXISTS customer_support_request (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL ON UPDATE CASCADE,
    request_type VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    assigned_to INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    requested_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`uuid`**: Global tekil tanımlayıcı (public API için)
- **`customer_id`**: Müşteri referansı (NOT NULL, RESTRICT DELETE)
- **`cargo_id`**: İlgili kargo referansı (opsiyonel, SET NULL DELETE)
- **`request_type`**: Talep tipi (ör: "delivery_issue", "billing_inquiry", "damage_report")
- **`subject`**: Talep konusu
- **`description`**: Detaylı açıklama
- **`priority`**: Öncelik seviyesi (low, medium, high, critical)
- **`status`**: Talep durumu (open, in_progress, waiting_customer, resolved, closed)
- **`assigned_to`**: Atanan çalışan (opsiyonel)
- **`requested_date`**: Talep oluşturulma tarihi
- **`resolved_date`**: Çözüldü tarihi (opsiyonel)
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **RESTRICT DELETE**: Müşteri silinemez eğer açık destek talebi varsa
- **SET NULL DELETE**: Cargo silinirse talep korunur, cargo_id null olur
- **SET NULL DELETE**: Çalışan silinirse atama kaldırılır, assigned_to null olur
- **Soft Delete**: Fiziksel silme yapılmaz
- **UUID**: Public API erişimi için tekil tanımlayıcı

### `customer_support_response`

Destek taleplerine verilen yanıtları saklar. Her yanıt bir destek talebine bağlıdır ve bir çalışan tarafından yazılabilir.

```sql
CREATE TABLE IF NOT EXISTS customer_support_response (
    id SERIAL PRIMARY KEY,
    support_request_id INTEGER NOT NULL REFERENCES customer_support_request(id) ON DELETE CASCADE ON UPDATE CASCADE,
    employee_id INTEGER REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
    response_content TEXT NOT NULL,
    is_resolution BOOLEAN DEFAULT false,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`support_request_id`**: Destek talebi referansı (NOT NULL, CASCADE DELETE)
- **`employee_id`**: Yanıtı yazan çalışan (opsiyonel, SET NULL DELETE)
- **`response_content`**: Yanıt içeriği
- **`is_resolution`**: Çözüm olarak işaretlenmiş mi?
- **`response_date`**: Yanıt tarihi
- **`created_at`**, **`updated_at`**, **`deleted_at`**: Audit alanları

#### Özellikler

- **CASCADE DELETE**: Destek talebi silinirse yanıtlar da silinir
- **SET NULL DELETE**: Çalışan silinirse yanıt korunur, employee_id null olur
- **Immutable**: Yanıtlar değiştirilemez (sadece soft delete)
- **Resolution Flag**: Çözüm olarak işaretlenmiş yanıtlar özel olarak takip edilir

#### İndeksler

```sql
CREATE INDEX IF NOT EXISTS idx_customer_support_request_customer_id 
    ON customer_support_request(customer_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_request_cargo_id 
    ON customer_support_request(cargo_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_request_status 
    ON customer_support_request(status) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_request_priority 
    ON customer_support_request(priority) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_request_assigned_to 
    ON customer_support_request(assigned_to) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_response_support_request_id 
    ON customer_support_response(support_request_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_response_employee_id 
    ON customer_support_response(employee_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_support_response_is_resolution 
    ON customer_support_response(is_resolution) WHERE deleted_at IS NULL;
```

---

## 🏛️ Mimari Tasarım

### Domain Yapısı

Support domain'i, müşteri destek yönetimi için merkezi bir yönetim katmanı sağlar:

```
src/support/
├── customer-support-request/
│   ├── repositories/
│   │   ├── customer-support-request.repository.interface.ts
│   │   └── customer-support-request.repository.ts
│   ├── services/
│   │   └── customer-support-request.service.ts
│   ├── controllers/
│   │   └── customer-support-request.controller.ts
│   ├── dto/
│   │   └── customer-support-request.dto.ts
│   └── customer-support-request.module.ts
├── customer-support-response/
│   ├── repositories/
│   │   ├── customer-support-response.repository.interface.ts
│   │   └── customer-support-response.repository.ts
│   ├── services/
│   │   └── customer-support-response.service.ts
│   ├── controllers/
│   │   └── customer-support-response.controller.ts
│   ├── dto/
│   │   └── customer-support-response.dto.ts
│   └── customer-support-response.module.ts
└── support.module.ts
```

### Katmanlar

1. **Repository Layer**: Veritabanı erişimi, raw SQL sorguları
2. **Service Layer**: İş mantığı, durum geçişleri, validasyonlar
3. **Controller Layer**: RESTful API endpoints
4. **DTO Layer**: Validasyon ve veri transfer nesneleri

---

## 🔄 İş Kuralları

### Ticket Yaşam Döngüsü

Destek taleplerinin durum geçişleri:

```
OPEN → IN_PROGRESS → WAITING_CUSTOMER → RESOLVED → CLOSED
```

#### Durumlar

- **`open`**: Yeni oluşturulmuş talep, henüz atanmamış
- **`in_progress`**: Atanmış ve çalışılıyor
- **`waiting_customer`**: Müşteriden yanıt bekleniyor
- **`resolved`**: Çözülmüş, müşteri onayı bekleniyor
- **`closed`**: Kapatılmış, işlem tamamlanmış

#### Öncelik Seviyeleri

- **`low`**: Düşük öncelik, standart işlem süresi
- **`medium`**: Normal öncelik (varsayılan)
- **`high`**: Yüksek öncelik, hızlı yanıt gerekli
- **`critical`**: Kritik öncelik, acil müdahale gerekli

### Atama Kuralları

- Bir talep aynı anda bir çalışana atanabilir
- Atama değiştirilebilir (reassign)
- Çalışan silinirse atama kaldırılır

### Çözüm Yönetimi

- Bir talep `resolved` durumuna geçtiğinde `resolved_date` otomatik set edilir
- `is_resolution` flag'i ile çözüm yanıtları işaretlenir
- Bir talepte birden fazla çözüm yanıtı olabilir

### Cargo İlişkilendirme

- Talep oluşturulurken bir cargo ile ilişkilendirilebilir
- Cargo silinirse ilişki kaldırılır (cargo_id = NULL)
- Cargo bazlı sorgular yapılabilir

---

## 🔐 Güvenlik ve Erişim Kontrolü

### Actor-Based Filtering

- **Müşteriler**: Sadece kendi taleplerini görebilir
- **Çalışanlar**: Atandıkları veya yetkili oldukları talepleri görebilir
- **Admin**: Tüm talepleri görebilir (RBAC ile kontrol)

### Veri Gizliliği

- Müşteri bilgileri sadece yetkili çalışanlar tarafından görüntülenebilir
- İç notlar müşterilere gösterilmez (gelecek geliştirme)
- Audit trail tüm değişiklikleri kaydeder

### RBAC Entegrasyonu

- Write endpoint'leri RBAC koruması için hazır
- Rol bazlı filtreleme desteklenir
- İzin kontrolü service katmanında yapılabilir

---

## 📡 API Endpoints

### Customer Support Request Endpoints

#### Tüm Talepleri Listele

```http
GET /support/customer-support-requests
```

**Query Parameters:**
- `status`: Durum bazlı filtreleme
- `priority`: Öncelik bazlı filtreleme
- `customerId`: Müşteri bazlı filtreleme
- `assignedTo`: Atanan çalışan bazlı filtreleme

**Response:**
```json
[
  {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "customerId": 10,
    "cargoId": 25,
    "requestType": "delivery_issue",
    "subject": "Geç teslimat",
    "description": "Kargom hala gelmedi, ne zaman gelecek?",
    "priority": "high",
    "status": "in_progress",
    "assignedTo": 5,
    "requestedDate": "2024-01-15T10:00:00Z",
    "resolvedDate": null,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Müşteriye Göre Talepleri Bul

```http
GET /support/customer-support-requests/customer/:customerId
```

#### Cargo'ya Göre Talepleri Bul

```http
GET /support/customer-support-requests/cargo/:cargoId
```

#### Durum Bazlı Talepleri Bul

```http
GET /support/customer-support-requests/status/:status
```

#### Öncelik Bazlı Talepleri Bul

```http
GET /support/customer-support-requests/priority/:priority
```

#### Atanan Çalışan Bazlı Talepleri Bul

```http
GET /support/customer-support-requests/assigned/:employeeId
```

#### UUID ile Talep Bul

```http
GET /support/customer-support-requests/uuid/:uuid
```

#### ID ile Talep Bul

```http
GET /support/customer-support-requests/:id
```

#### Yeni Talep Oluştur

```http
POST /support/customer-support-requests
Content-Type: application/json

{
  "customerId": 10,
  "cargoId": 25,
  "requestType": "delivery_issue",
  "subject": "Geç teslimat",
  "description": "Kargom hala gelmedi, ne zaman gelecek?",
  "priority": "high",
  "status": "open"
}
```

#### Talep Güncelle

```http
PUT /support/customer-support-requests/:id
Content-Type: application/json

{
  "status": "in_progress",
  "assignedTo": 5,
  "priority": "critical"
}
```

**Not**: Talep `resolved` veya `closed` durumuna geçtiğinde `resolvedDate` otomatik set edilir.

### Customer Support Response Endpoints

#### Tüm Yanıtları Listele

```http
GET /support/customer-support-responses
```

#### Talep Yanıtlarını Getir

```http
GET /support/customer-support-responses/request/:supportRequestId
```

#### Talep Çözüm Yanıtlarını Getir

```http
GET /support/customer-support-responses/request/:supportRequestId/resolutions
```

#### Çalışan Yanıtlarını Getir

```http
GET /support/customer-support-responses/employee/:employeeId
```

#### ID ile Yanıt Bul

```http
GET /support/customer-support-responses/:id
```

#### Yeni Yanıt Ekle

```http
POST /support/customer-support-responses
Content-Type: application/json

{
  "supportRequestId": 1,
  "employeeId": 5,
  "responseContent": "Kargonuz bugün teslim edilecektir.",
  "isResolution": true
}
```

**Not**: `isResolution` true ise, talep otomatik olarak `resolved` durumuna geçer.

---

## 🌍 Gerçek Dünya Helpdesk Karşılaştırması

### Zendesk Benzeri Yapı

- **Ticket System**: `customer_support_request` tablosu Zendesk ticket yapısına benzer
- **Comments**: `customer_support_response` tablosu ticket yorumlarını temsil eder
- **Assignment**: Çalışan atama mekanizması
- **Priority**: Öncelik seviyeleri
- **Status Workflow**: Durum geçişleri

### Freshdesk Benzeri Özellikler

- **Multi-channel Support**: `request_type` alanı ile farklı kanallar desteklenebilir
- **Ticket Linking**: `cargo_id` ile ilgili kayıtlar bağlanabilir
- **Resolution Tracking**: `is_resolution` flag'i ile çözüm takibi

### İyileştirme Potansiyeli

1. **Internal Notes**: Müşteriye görünmeyen iç notlar
2. **SLA Tracking**: Yanıt ve çözüm süre takibi
3. **Auto-assignment**: Öncelik ve kategorilere göre otomatik atama
4. **Ticket Categories**: Hiyerarşik kategori yapısı
5. **Escalation**: Otomatik yükseltme mekanizması
6. **Knowledge Base**: Çözüm veritabanı entegrasyonu

---

## 🔧 Teknik Detaylar

### UUID Kullanımı

UUID'ler public API erişimi için kullanılır:

```typescript
// Repository'de UUID sorgusu
async findByUuid(uuid: string): Promise<CustomerSupportRequestEntity | null> {
  const query = `
    SELECT ...
    FROM customer_support_request
    WHERE uuid = $1 AND deleted_at IS NULL
  `;
  return await this.databaseService.queryOne(query, [uuid]);
}
```

### Durum Geçişleri

Service katmanında durum geçişi kontrolü:

```typescript
async update(id: number, updateDto: UpdateDto) {
  let resolvedDate: Date | null = null;
  if (updateDto.status === SupportRequestStatus.RESOLVED || 
      updateDto.status === SupportRequestStatus.CLOSED) {
    if (!existing.resolved_date) {
      resolvedDate = new Date();
    }
  }
  // ...
}
```

### Transaction Yönetimi

Tüm write işlemleri transaction içinde:

```typescript
async create(...) {
  return await this.databaseService.transaction(async (client: PoolClient) => {
    const insertQuery = `INSERT INTO ... RETURNING ...`;
    const result = await client.query(insertQuery, [...]);
    return result.rows[0];
  });
}
```

### Validasyon

DTO seviyesinde `class-validator` ile validasyon:

```typescript
export class CreateCustomerSupportRequestDto {
  @IsNumber()
  customerId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  requestType: string;

  @IsEnum(SupportRequestPriority)
  priority?: string;
}
```

---

## 📊 Veri Modelleri

### CustomerSupportRequest Entity

```typescript
interface CustomerSupportRequestEntity {
  id: number;
  uuid: string;
  customer_id: number;
  cargo_id?: number;
  request_type: string;
  subject?: string;
  description: string;
  priority: string;
  status: string;
  assigned_to?: number;
  requested_date: Date;
  resolved_date?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

### CustomerSupportResponse Entity

```typescript
interface CustomerSupportResponseEntity {
  id: number;
  support_request_id: number;
  employee_id?: number;
  response_content: string;
  is_resolution: boolean;
  response_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

---

## 🔍 Sorgu Örnekleri

### Müşterinin Açık Taleplerini Getir

```sql
SELECT id, uuid, request_type, subject, priority, status, assigned_to
FROM customer_support_request
WHERE customer_id = $1 
  AND status IN ('open', 'in_progress', 'waiting_customer')
  AND deleted_at IS NULL
ORDER BY priority DESC, created_at DESC;
```

### Çalışanın Atandığı Yüksek Öncelikli Talepler

```sql
SELECT id, uuid, customer_id, request_type, subject, status
FROM customer_support_request
WHERE assigned_to = $1
  AND priority = 'high'
  AND status != 'closed'
  AND deleted_at IS NULL
ORDER BY created_at ASC;
```

### Bir Talebin Tüm Yanıtlarını Getir

```sql
SELECT r.id, r.employee_id, r.response_content, r.is_resolution, r.response_date
FROM customer_support_response r
WHERE r.support_request_id = $1
  AND r.deleted_at IS NULL
ORDER BY r.response_date ASC;
```

### Çözüm Yanıtlarını Getir

```sql
SELECT r.id, r.employee_id, r.response_content, r.response_date
FROM customer_support_response r
WHERE r.support_request_id = $1
  AND r.is_resolution = true
  AND r.deleted_at IS NULL
ORDER BY r.response_date DESC;
```

---

## 🔮 Gelecek Geliştirmeler

### Chatbot Entegrasyonu

- Otomatik ilk yanıt
- AI destekli kategorilendirme
- Bilgi bankasından otomatik çözüm önerileri

### AI Routing

- Akıllı talep yönlendirme
- Çalışan yetenek bazlı atama
- Yük dengeleme algoritmaları

### SLA Yönetimi

- Öncelik bazlı SLA politikaları
- Yanıt süresi takibi
- Çözüm süresi takibi
- İhlal uyarıları

### İç Notlar Sistemi

- Müşteriye görünmeyen iç notlar
- Çalışanlar arası iletişim
- Not kategorileri

### Kategori Sistemi

- Hiyerarşik kategori yapısı
- Kategori bazlı atama kuralları
- Kategori bazlı SLA politikaları

### Escalation Mekanizması

- Otomatik yükseltme kuralları
- Süre bazlı escalation
- Öncelik bazlı escalation
- Yönetici bildirimleri

### Analitik ve Raporlama

- Talep istatistikleri
- Çalışan performans metrikleri
- Çözüm oranları
- Ortalama yanıt süreleri
- Müşteri memnuniyet skorları

### Çoklu Kanallar

- Email entegrasyonu
- SMS bildirimleri
- WhatsApp Business API
- Sosyal medya entegrasyonu

### Bilgi Bankası

- Makale yönetimi
- FAQ otomatik önerileri
- Çözüm şablonları

---

## ✅ Migration Kontrol Listesi

- [x] `customer_support_request` tablosu oluşturuldu
- [x] `customer_support_response` tablosu oluşturuldu
- [x] İndeksler oluşturuldu
- [x] Foreign key constraint'leri eklendi
- [x] UUID desteği eklendi
- [x] Repository katmanı implementasyonu
- [x] Service katmanı implementasyonu
- [x] Controller katmanı implementasyonu
- [x] DTO validasyonları
- [x] Transaction desteği
- [x] Soft delete implementasyonu
- [x] Durum geçiş mantığı
- [x] Öncelik ve durum enum'ları
- [x] Module entegrasyonu
- [x] Dokümantasyon

---

## 🚨 Önemli Notlar

1. **RESTRICT Delete**: Müşteri silinemez eğer açık destek talebi varsa. Bu, veri bütünlüğünü korur.

2. **CASCADE Delete**: Destek talebi silinirse yanıtlar da soft delete olur.

3. **SET NULL Delete**: Cargo veya çalışan silinirse ilişki kaldırılır ancak talep/yanıt korunur.

4. **Immutable Responses**: Yanıtlar değiştirilemez, sadece soft delete yapılabilir.

5. **UUID Public API**: UUID'ler public API erişimi için kullanılır, ID'ler internal kullanım içindir.

6. **Status Workflow**: Durum geçişleri business logic ile kontrol edilir.

7. **Resolution Tracking**: Çözüm yanıtları `is_resolution` flag'i ile işaretlenir.

8. **Transaction Safety**: Tüm write işlemleri transaction içinde, atomicity garanti edilir.

9. **Index Optimization**: Yaygın sorgular için indeksler optimize edilmiştir.

10. **Actor-Based Access**: Müşteriler sadece kendi taleplerini görebilir (RBAC ile kontrol).

---

## 📚 İlgili Dokümantasyon

- [Migration 003: Actor Tables](./003_create_actor_tables.md)
- [Migration 005: Cargo Tables](./005_create_cargo_tables.md)
- [Customer Module Documentation](../../src/actor/customer/README.md)
- [Employee Module Documentation](../../src/actor/employee/README.md)
- [RBAC Documentation](../../src/rbac/README.md)

---

**Migration 011 Tamamlandı** ✅

