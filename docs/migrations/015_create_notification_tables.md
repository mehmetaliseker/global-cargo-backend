# Migration 015: Notification Infrastructure Tables

## 📋 Genel Bakış

Migration 015, Global Cargo Backend sistemine **Bildirim Altyapısı (Notification Infrastructure)** ekler. Bu migration, event-driven, asynchronous bildirim sistemi için gerekli taban yapısını oluşturur. Bildirimler, iş mantığının side-effect'leridir ve core business logic'in parçası değildir.

### Tablolar

1. **`notification_template`** - Bildirim şablonları
2. **`notification_queue`** - Bildirim kuyruğu
3. **`notification_log`** - Teslimat logları (immutable)
4. **`customer_notification_preference`** - Müşteri bildirim tercihleri
5. **`alert_rule`** - Uyarı kuralları
6. **`alert_log`** - Uyarı logları

---

## 🎯 Neden Bildirimler Infrastructure, İş Mantığı Değil?

### Bildirimler Side-Effect'tir

Bildirimler, iş işlemlerinin **sonucu** değil, **yan etkisi**dir:

- ✅ Bir cargo oluşturulduğunda → Bildirim gönderilir (side-effect)
- ✅ Bir ödeme yapıldığında → Email gönderilir (side-effect)
- ✅ Bir durum değiştiğinde → SMS gönderilir (side-effect)

**İş Mantığı**: Cargo oluşturma, ödeme işleme, durum güncelleme
**Infrastructure**: Bildirim gönderme, kuyruğa ekleme, teslimat takibi

### Ayrım Prensipleri

1. **Asenkron İşleme**: Bildirimler ana iş akışını bloklamaz
2. **Hata Toleransı**: Bildirim hatası iş işlemini başarısız kılmaz
3. **Bağımsız Ölçeklendirme**: Bildirim sistemi ayrı ölçeklendirilebilir
4. **Event-Driven**: İş olaylarından tetiklenir, doğrudan çağrılmaz

### Mimari Yerleşim

```
Business Domain Layer (Cargo, Invoice, Payment)
         ↓ (Events)
Notification Infrastructure Layer
         ↓ (Queue)
External Providers (Email, SMS, Push)
```

---

## 🏗️ Tablo Yapısı

### `notification_template`

Bildirim şablonlarını saklar. Her şablon bir kod, tip (email/sms/push) ve içerik template'i içerir.

```sql
CREATE TABLE IF NOT EXISTS notification_template (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(200) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    subject_template TEXT,
    body_template TEXT NOT NULL,
    language_code VARCHAR(10) REFERENCES language(language_code),
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (notification_type IN ('sms', 'email', 'push'))
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`uuid`**: Global unique identifier
- **`template_code`**: Şablon kodu (örn: "CARGO_CREATED", "PAYMENT_RECEIVED")
- **`template_name`**: Şablon adı
- **`notification_type`**: Bildirim tipi (sms, email, push)
- **`subject_template`**: Konu şablonu (email için)
- **`body_template`**: İçerik şablonu (zorunlu)
- **`language_code`**: Dil kodu (multi-language support)
- **`variables`**: JSONB değişken tanımları
- **`is_active`**: Aktif/pasif durumu
- **Soft Delete**: Fiziksel silme yapılmaz

#### Özellikler

- **UNIQUE Constraint**: `template_code` tekil olmalı
- **CHECK Constraint**: `notification_type` sadece sms, email, push olabilir
- **Foreign Key**: `language_code` → `language` tablosu (RESTRICT DELETE)
- **Partial Index**: Aktif şablonlar için hızlı sorgu

#### Şablon Örneği

```json
{
  "template_code": "CARGO_CREATED",
  "template_name": "Kargo Oluşturuldu",
  "notification_type": "email",
  "subject_template": "Kargo Numaranız: {{tracking_number}}",
  "body_template": "Sayın {{customer_name}}, {{tracking_number}} numaralı kargonuz oluşturuldu.",
  "variables": {
    "tracking_number": "string",
    "customer_name": "string"
  }
}
```

---

### `notification_queue`

Gönderilecek bildirimleri kuyruğa alır. Asenkron işleme için tasarlanmıştır.

```sql
CREATE TABLE IF NOT EXISTS notification_queue (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    notification_template_id INTEGER REFERENCES notification_template(id),
    recipient_type VARCHAR(50) NOT NULL,
    recipient_id INTEGER NOT NULL,
    notification_data JSONB NOT NULL,
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    scheduled_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (retry_count <= max_retries)
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`uuid`**: Global unique identifier
- **`notification_template_id`**: Şablon referansı (optional)
- **`recipient_type`**: Alıcı tipi (örn: "customer", "employee", "partner")
- **`recipient_id`**: Alıcı ID
- **`notification_data`**: JSONB bildirim verisi (template değişkenleri)
- **`priority`**: Öncelik (1-10, varsayılan 5)
- **`scheduled_time`**: Zamanlanmış gönderim zamanı
- **`status`**: Durum (pending, processing, sent, delivered, failed)
- **`retry_count`**: Yeniden deneme sayısı
- **`max_retries`**: Maksimum yeniden deneme (varsayılan 3)
- **`sent_at`**: Gönderim zamanı
- **`delivered_at`**: Teslimat zamanı
- **`error_message`**: Hata mesajı (varsa)

#### Özellikler

- **Status-Driven Workflow**: Pending → Processing → Sent → Delivered
- **Retry Mechanism**: Başarısız bildirimler otomatik yeniden denenir
- **Priority Support**: Yüksek öncelikli bildirimler önce işlenir
- **Scheduled Delivery**: Gelecekte gönderim için zamanlama
- **CHECK Constraint**: `retry_count <= max_retries`

#### İndeksler

```sql
-- Pending ve processing durumundaki bildirimler için
CREATE INDEX idx_notification_queue_status 
    ON notification_queue(status) 
    WHERE status IN ('pending', 'processing');

-- Zamanlanmış bildirimler için
CREATE INDEX idx_notification_queue_scheduled_time 
    ON notification_queue(scheduled_time) 
    WHERE status = 'pending';

-- Alıcı bazlı sorgular için
CREATE INDEX idx_notification_queue_recipient 
    ON notification_queue(recipient_type, recipient_id);
```

---

### `notification_log`

Bildirim teslimat loglarını saklar. **IMMUTABLE** tablodur (UPDATE/DELETE yasaktır).

```sql
CREATE TABLE IF NOT EXISTS notification_log (
    id SERIAL PRIMARY KEY,
    notification_queue_id INTEGER NOT NULL REFERENCES notification_queue(id),
    delivery_status VARCHAR(50) NOT NULL,
    error_message TEXT,
    provider_response JSONB,
    provider_name VARCHAR(100),
    delivery_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`notification_queue_id`**: Kuyruk kaydı referansı (RESTRICT DELETE)
- **`delivery_status`**: Teslimat durumu (sent, delivered, failed, bounced)
- **`error_message`**: Hata mesajı (varsa)
- **`provider_response`**: JSONB provider yanıtı
- **`provider_name`**: Provider adı (örn: "SendGrid", "Twilio")
- **`delivery_timestamp`**: Teslimat zamanı
- **`created_at`**: Oluşturulma zamanı

#### Özellikler

- **Immutable**: UPDATE ve DELETE işlemleri yasaktır (Migration 014 trigger'ları ile)
- **Audit Trail**: Her teslimat denemesi kaydedilir
- **Provider Tracking**: Hangi provider kullanıldığı takip edilir
- **Error Logging**: Başarısız teslimatlar için detaylı hata bilgisi

---

### `customer_notification_preference`

Müşterilerin bildirim tercihlerini saklar. Her müşteri için farklı bildirim tiplerinde tercihler tanımlanabilir.

```sql
CREATE TABLE IF NOT EXISTS customer_notification_preference (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    preference_level VARCHAR(50) DEFAULT 'all',
    sms_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (preference_level IN ('none', 'important_only', 'all'))
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`customer_id`**: Müşteri referansı (CASCADE DELETE)
- **`notification_type`**: Bildirim tipi (örn: "cargo_update", "payment")
- **`preference_level`**: Tercih seviyesi (none, important_only, all)
- **`sms_enabled`**: SMS aktif mi?
- **`email_enabled`**: Email aktif mi?
- **`push_enabled`**: Push bildirimi aktif mi?
- **`is_active`**: Aktif/pasif durumu
- **Soft Delete**: Fiziksel silme yapılmaz

#### Özellikler

- **UNIQUE Constraint**: `(customer_id, notification_type)` kombinasyonu tekil (deleted_at IS NULL)
- **CHECK Constraint**: `preference_level` sadece none, important_only, all olabilir
- **CASCADE DELETE**: Müşteri silinirse tercihleri de silinir
- **Channel Granularity**: Her kanal (SMS, Email, Push) ayrı ayrı kontrol edilir

#### Tercih Seviyeleri

- **`none`**: Bu bildirim tipi için hiçbir bildirim gönderilmez
- **`important_only`**: Sadece önemli bildirimler gönderilir
- **`all`**: Tüm bildirimler gönderilir

---

### `alert_rule`

Uyarı kurallarını tanımlar. Belirli koşullar sağlandığında otomatik uyarı tetiklenir.

```sql
CREATE TABLE IF NOT EXISTS alert_rule (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    alert_name VARCHAR(200) NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    severity_level VARCHAR(50) DEFAULT 'medium',
    notification_template_id INTEGER REFERENCES notification_template(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    CHECK (severity_level IN ('low', 'medium', 'high', 'critical'))
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`uuid`**: Global unique identifier
- **`alert_name`**: Uyarı adı
- **`description`**: Açıklama
- **`trigger_conditions`**: JSONB tetikleme koşulları
- **`severity_level`**: Önem seviyesi (low, medium, high, critical)
- **`notification_template_id`**: Kullanılacak bildirim şablonu
- **`is_active`**: Aktif/pasif durumu
- **Soft Delete**: Fiziksel silme yapılmaz

#### Özellikler

- **CHECK Constraint**: `severity_level` sadece low, medium, high, critical olabilir
- **JSONB Conditions**: Esnek tetikleme koşulları (örn: `{"cargo_status": "delayed", "days": 3}`)
- **Template Integration**: Uyarı bildirimi için şablon kullanılabilir

#### Tetikleme Koşulu Örneği

```json
{
  "entity_type": "cargo",
  "condition": {
    "status": "in_transit",
    "days_since_update": "> 7"
  }
}
```

---

### `alert_log`

Tetiklenen uyarıları loglar. Her uyarı kuralı için tetiklenme kayıtları tutulur.

```sql
CREATE TABLE IF NOT EXISTS alert_log (
    id SERIAL PRIMARY KEY,
    alert_rule_id INTEGER NOT NULL REFERENCES alert_rule(id),
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    alert_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER REFERENCES employee(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Alanlar

- **`id`**: Birincil anahtar
- **`alert_rule_id`**: Uyarı kuralı referansı (RESTRICT DELETE)
- **`entity_type`**: Varlık tipi (örn: "cargo", "invoice")
- **`entity_id`**: Varlık ID
- **`alert_data`**: JSONB uyarı verisi
- **`status`**: Durum (pending, resolved, dismissed)
- **`resolved_at`**: Çözülme zamanı
- **`resolved_by`**: Çözen employee ID (SET NULL DELETE)

#### Özellikler

- **Entity Tracking**: Hangi entity için uyarı tetiklendiği kaydedilir
- **Status Management**: Uyarılar pending → resolved/dismissed olabilir
- **Resolution Tracking**: Kim, ne zaman çözdüğü takip edilir

---

## 🔄 Bildirim Yaşam Döngüsü

### 1. Oluşturma (Creation)

Bir iş olayı gerçekleştiğinde (örn: cargo oluşturuldu):

```typescript
// Business logic (CargoService)
const cargo = await this.cargoRepository.create(...);

// Side-effect: Notification enqueue (non-blocking)
await this.notificationService.enqueue({
  templateCode: 'CARGO_CREATED',
  recipientType: 'customer',
  recipientId: cargo.customerId,
  data: { trackingNumber: cargo.trackingNumber }
});
```

**NOT**: Bu migration'da `enqueue` metodu henüz implement edilmemiştir. Gelecek migration'larda eklenecektir.

### 2. Kuyruğa Ekleme (Queue)

Bildirim `notification_queue` tablosuna `status='pending'` ile eklenir:

```
notification_queue
├── status: 'pending'
├── scheduled_time: NOW()
├── priority: 5
└── retry_count: 0
```

### 3. İşleme (Processing)

Background worker (gelecek migration'da eklenecek) kuyruktan alır:

```
notification_queue
├── status: 'processing'
└── (worker picks up)
```

### 4. Şablon Rendering

Template'den içerik oluşturulur (bu migration'da implement edilmemiş):

```
template.body_template: "Kargo Numaranız: {{tracking_number}}"
notification_data: { "tracking_number": "TR123456" }
→ Rendered: "Kargo Numaranız: TR123456"
```

### 5. Provider'a Gönderim

External provider'a gönderilir (bu migration'da implement edilmemiş):

```
→ SendGrid (email)
→ Twilio (SMS)
→ FCM (Push)
```

### 6. Loglama

Teslimat logu `notification_log` tablosuna yazılır:

```sql
INSERT INTO notification_log (
  notification_queue_id,
  delivery_status,
  provider_name,
  provider_response
) VALUES (...);
```

### 7. Durum Güncelleme

Kuyruk kaydı güncellenir:

```
notification_queue
├── status: 'sent' or 'delivered' or 'failed'
├── sent_at: TIMESTAMP
└── delivered_at: TIMESTAMP (if delivered)
```

### 8. Retry Mekanizması

Başarısız bildirimler otomatik yeniden denenir:

```
notification_queue
├── status: 'pending'
├── retry_count: 1
└── scheduled_time: NOW() + 5 minutes
```

---

## 📊 Teslimat Durum Modeli

### Durum Geçişleri

```
pending → processing → sent → delivered
   ↓                      ↓
   └─────── failed ←──────┘
   ↓
   └─────── retry (pending)
```

### Durum Açıklamaları

| Durum | Açıklama | Next State |
|-------|----------|------------|
| `pending` | Kuyrukta bekliyor | `processing` |
| `processing` | İşleniyor | `sent`, `failed` |
| `sent` | Provider'a gönderildi | `delivered`, `failed` |
| `delivered` | Teslim edildi | - (final) |
| `failed` | Başarısız | `pending` (retry) |

### Retry Stratejisi

```typescript
// State-based retry (bu migration'da implement edilmiştir)
if (retry_count < max_retries) {
  retry_count += 1;
  scheduled_time = NOW() + (retry_count * 5 minutes);
  status = 'pending';
} else {
  status = 'failed';
  error_message = 'Max retries exceeded';
}
```

---

## 🚨 Hata Yönetimi ve Retry Stratejisi

### Hata Türleri

1. **Transient Errors**: Geçici hatalar (network timeout, provider down)
   - **Retry**: Evet
   - **Strategy**: Exponential backoff
   - **Max Retries**: 3

2. **Permanent Errors**: Kalıcı hatalar (invalid recipient, banned)
   - **Retry**: Hayır
   - **Strategy**: Immediate failure
   - **Max Retries**: 0

### Retry Mekanizması

**Bu migration'da** retry mekanizması sadece **state-based**'dir:

- `retry_count` ve `max_retries` kolonları mevcuttur
- Background worker (gelecek migration) retry logic'i implement edecek
- State kontrolü: `retry_count <= max_retries`

**Gelecek Migration'larda**:
- Exponential backoff implementasyonu
- Dead letter queue
- Alert mekanizması (çok fazla retry)

---

## 🔐 Şablon vs Teslimat Ayrımı

### Şablon Yönetimi (`notification_template`)

**Sorular**:
- ✅ Ne gönderilecek?
- ✅ Nasıl formatlanacak?
- ✅ Hangi dilde?

**Responsibility**: Content management, template versioning

### Teslimat Yönetimi (`notification_queue`, `notification_log`)

**Sorular**:
- ✅ Kime gönderilecek?
- ✅ Ne zaman gönderilecek?
- ✅ Gönderildi mi?
- ✅ Başarısız oldu mu?

**Responsibility**: Delivery tracking, retry management, error handling

### Ayrım Avantajları

1. **Separation of Concerns**: İçerik ve teslimat ayrı yönetilir
2. **Reusability**: Bir şablon birden fazla bildirimde kullanılabilir
3. **Versioning**: Şablonlar güncellenebilir, eski bildirimler etkilenmez
4. **Testing**: Şablon ve teslimat ayrı test edilebilir

---

## 🛡️ Güvenlik Düşünceleri

### Veri Koruma

1. **PII Masking**: `notification_data` içinde PII (Personally Identifiable Information) varsa maskelenmeli
2. **Encryption**: Hassas veriler şifrelenmeli (future migration)
3. **Access Control**: Bildirim loglarına sadece authorized kullanıcılar erişebilmeli

### Rate Limiting

1. **Per Recipient**: Bir alıcıya dakikada maksimum X bildirim
2. **Per Template**: Bir şablon için maksimum Y bildirim/saniye
3. **Global**: Sistem genelinde maksimum Z bildirim/saniye

**NOT**: Bu migration'da rate limiting implement edilmemiştir. Gelecek migration'larda eklenecektir.

### Provider Credentials

1. **Environment Variables**: Provider API key'leri environment variable'larda saklanmalı
2. **Secret Management**: Hassas bilgiler secret management service'te saklanmalı
3. **Rotation**: API key'ler düzenli olarak rotate edilmeli

---

## 📈 Observability & Debugging

### Logging

**notification_log** tablosu observability için kritiktir:

- ✅ Hangi bildirimler gönderildi?
- ✅ Hangi provider kullanıldı?
- ✅ Başarı oranı nedir?
- ✅ Hangi hatalar oluştu?

### Metrics (Future)

1. **Delivery Rate**: `sent / total * 100`
2. **Success Rate**: `delivered / sent * 100`
3. **Average Delivery Time**: `AVG(delivered_at - sent_at)`
4. **Retry Rate**: `retries / total * 100`

### Debugging Queries

```sql
-- Failed notifications in last 24 hours
SELECT * FROM notification_queue
WHERE status = 'failed'
  AND created_at >= NOW() - INTERVAL '24 hours';

-- Delivery logs for a specific notification
SELECT * FROM notification_log
WHERE notification_queue_id = 123
ORDER BY delivery_timestamp DESC;

-- Most failed templates
SELECT nt.template_code, COUNT(*) as failure_count
FROM notification_queue nq
JOIN notification_template nt ON nq.notification_template_id = nt.id
WHERE nq.status = 'failed'
GROUP BY nt.template_code
ORDER BY failure_count DESC;
```

---

## 🔮 Gelecek Async Worker Entegrasyonu

### Background Worker (Migration 016+)

```typescript
// Pseudo-code (gelecek migration)
@Cron('*/30 * * * * *') // Her 30 saniyede bir
async processNotificationQueue() {
  const pending = await this.notificationQueueRepository.findPending();
  
  for (const notification of pending) {
    try {
      await this.processNotification(notification);
    } catch (error) {
      await this.handleRetry(notification, error);
    }
  }
}
```

### Event Outbox Pattern (Migration 016+)

```typescript
// Business event → Outbox table
INSERT INTO event_outbox (event_type, payload) VALUES (...);

// Background worker processes outbox
// Creates notification_queue entries
```

### Message Queue Integration

- **RabbitMQ / Kafka**: High-volume için message queue
- **Redis Queue**: Lightweight queue için
- **Database Queue**: Bu migration'da mevcut (basit use case'ler için)

---

## 📝 Örnek Bildirim Akışları

### Senaryo 1: Kargo Oluşturuldu

```
1. Business Event: Cargo created
   ↓
2. NotificationService.enqueue({
     templateCode: 'CARGO_CREATED',
     recipientType: 'customer',
     recipientId: 123,
     data: { trackingNumber: 'TR123456' }
   })
   ↓
3. notification_queue INSERT (status: 'pending')
   ↓
4. Background Worker picks up
   ↓
5. Template rendering: "Kargo Numaranız: TR123456"
   ↓
6. SendGrid API call
   ↓
7. notification_log INSERT (delivery_status: 'sent')
   ↓
8. notification_queue UPDATE (status: 'sent', sent_at: NOW())
   ↓
9. Webhook from SendGrid (delivered)
   ↓
10. notification_log INSERT (delivery_status: 'delivered')
    ↓
11. notification_queue UPDATE (status: 'delivered', delivered_at: NOW())
```

### Senaryo 2: Ödeme Başarısız (Retry)

```
1. Business Event: Payment failed
   ↓
2. notification_queue INSERT (status: 'pending', priority: 8)
   ↓
3. Background Worker picks up
   ↓
4. Twilio API call → ERROR (network timeout)
   ↓
5. notification_log INSERT (delivery_status: 'failed', error_message: '...')
   ↓
6. notification_queue UPDATE (
     status: 'pending',
     retry_count: 1,
     scheduled_time: NOW() + 5 minutes
   )
   ↓
7. Background Worker picks up (after 5 minutes)
   ↓
8. Retry attempt → SUCCESS
   ↓
9. notification_log INSERT (delivery_status: 'sent')
   ↓
10. notification_queue UPDATE (status: 'sent')
```

### Senaryo 3: Uyarı Tetikleme

```
1. Business Event: Cargo delayed > 7 days
   ↓
2. AlertService.checkRules(entityType: 'cargo', entityId: 123)
   ↓
3. alert_rule matched: { entity_type: 'cargo', days_since_update: '> 7' }
   ↓
4. alert_log INSERT (status: 'pending')
   ↓
5. notification_queue INSERT (
     notification_template_id: alert_rule.notification_template_id,
     recipientType: 'employee',
     recipientId: assignedEmployeeId
   )
   ↓
6. Normal notification flow continues...
```

---

## 🏗️ Backend Implementasyonu

### Oluşturulan Modüller

1. **NotificationTemplateModule** - `src/notification/notification-template/`
   - Şablon yönetimi
   - Template code bazlı arama
   - Notification type bazlı filtreleme

2. **NotificationQueueModule** - `src/notification/notification/`
   - Kuyruk yönetimi
   - Status bazlı sorgular
   - Retry management (state-based)

3. **NotificationDeliveryModule** - `src/notification/notification-delivery/`
   - Teslimat logları
   - Provider tracking
   - Error logging

4. **NotificationChannelModule** - `src/notification/notification-channel/`
   - Müşteri tercihleri
   - Channel granularity (SMS, Email, Push)
   - Preference level management

5. **AlertRuleModule** - `src/notification/notification/` (NotificationQueueModule içinde)
   - Uyarı kuralları
   - Trigger condition management

6. **AlertLogModule** - `src/notification/notification/` (NotificationQueueModule içinde)
   - Uyarı logları
   - Resolution tracking

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- JSONB veri handling

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- JSONB parsing (string → object)
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri (READ-ONLY)
- RESTful API tasarımı
- Query parameter desteği

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Enum validasyonları

### API Endpoints

#### Notification Templates

- `GET /notification/templates` - Tüm şablonlar
- `GET /notification/templates/active` - Aktif şablonlar
- `GET /notification/templates/type/:notificationType` - Tip bazlı
- `GET /notification/templates/language/:languageCode` - Dil bazlı
- `GET /notification/templates/code/:templateCode` - Kod bazlı
- `GET /notification/templates/:id` - ID bazlı

#### Notification Queue

- `GET /notification/queue` - Tüm kuyruk kayıtları
- `GET /notification/queue/status/:status` - Durum bazlı
- `GET /notification/queue/pending` - Bekleyen bildirimler
- `GET /notification/queue/failed` - Başarısız bildirimler
- `GET /notification/queue/recipient/:recipientType/:recipientId` - Alıcı bazlı
- `GET /notification/queue/scheduled-range?startDate=&endDate=` - Tarih aralığı
- `GET /notification/queue/:id` - ID bazlı

#### Notification Deliveries

- `GET /notification/deliveries` - Tüm teslimat logları
- `GET /notification/deliveries/failed` - Başarısız teslimatlar
- `GET /notification/deliveries/status/:deliveryStatus` - Durum bazlı
- `GET /notification/deliveries/provider/:providerName` - Provider bazlı
- `GET /notification/deliveries/queue/:notificationQueueId` - Kuyruk bazlı
- `GET /notification/deliveries/:id` - ID bazlı

#### Notification Channels (Preferences)

- `GET /notification/channels` - Tüm tercihler
- `GET /notification/channels/active` - Aktif tercihler
- `GET /notification/channels/type/:notificationType` - Tip bazlı
- `GET /notification/channels/customer/:customerId` - Müşteri bazlı
- `GET /notification/channels/customer/:customerId/type/:notificationType` - Müşteri + Tip
- `GET /notification/channels/:id` - ID bazlı

#### Alert Rules

- `GET /notification/alerts/rules` - Tüm kurallar
- `GET /notification/alerts/rules/active` - Aktif kurallar
- `GET /notification/alerts/rules/severity/:severityLevel` - Önem seviyesi bazlı
- `GET /notification/alerts/rules/:id` - ID bazlı

#### Alert Logs

- `GET /notification/alerts/logs` - Tüm uyarı logları
- `GET /notification/alerts/logs/pending` - Bekleyen uyarılar
- `GET /notification/alerts/logs/status/:status` - Durum bazlı
- `GET /notification/alerts/logs/alert-rule/:alertRuleId` - Kural bazlı
- `GET /notification/alerts/logs/entity/:entityType/:entityId` - Varlık bazlı
- `GET /notification/alerts/logs/:id` - ID bazlı

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. Enqueue işlemi gelecek migration'larda eklenecektir.

2. **No Real Sending**: External provider entegrasyonu ve gerçek gönderim mantığı henüz implement edilmemiştir.

3. **No Background Workers**: Kuyruk işleme için background worker henüz yoktur. State-based retry mekanizması mevcuttur.

4. **No Template Rendering**: Template rendering logic henüz implement edilmemiştir.

5. **Immutable Logs**: `notification_log` tablosu immutable'dır (Migration 014 trigger'ları ile korunur).

6. **Soft Delete**: `notification_template`, `customer_notification_preference`, `alert_rule` tablolarında soft delete mevcuttur.

7. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

8. **Indexes**: Performans için gerekli partial index'ler oluşturulmuştur.

9. **JSONB Support**: Esnek veri saklama için JSONB kullanılmıştır.

10. **TODO Comments**: Service ve controller'larda gelecek RBAC guard'ları için TODO yorumları eklenmiştir.

---

## 📚 İlgili Dokümantasyon

- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)
- [Notification Best Practices](https://www.twilio.com/blog/best-practices-notification-system)
- [Retry Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/retry)

---

**Migration 015 Tamamlandı** ✅
