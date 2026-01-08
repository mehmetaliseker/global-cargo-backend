# Migration 017: CRM (Customer Relationship Management) Tables

## 📋 Genel Bakış

Migration 017, Global Cargo Backend sistemine **CRM (Customer Relationship Management) Altyapısı** ekler. Bu migration, müşteri ilişkileri, segmentasyon, sadakat programları, kredi limitleri, değerlendirmeler ve notlar için gerekli taban yapısını oluşturur.

### Tablolar

1. **`customer_segment`** - Müşteri segmentasyonu
2. **`customer_segment_assignment`** - Müşteri-segment atamaları
3. **`loyalty_program`** - Sadakat programı konfigürasyonu
4. **`customer_loyalty_points`** - Müşteri sadakat puanları
5. **`loyalty_transaction`** - Sadakat puanı işlemleri (immutable)
6. **`customer_review`** - Müşteri değerlendirmeleri
7. **`review_rating`** - Değerlendirme alt puanları
8. **`customer_credit_limit`** - Müşteri kredi limitleri
9. **`payment_history`** - Ödeme geçmişi (immutable)
10. **`customer_note`** - Müşteri notları
11. **`customer_tag`** - Müşteri etiketleri
12. **`customer_tag_assignment`** - Müşteri-etiket atamaları

**⚠️ Not**: Bu migration CRM infrastructure'ı oluşturur, ancak marketing automation, email/SMS gönderimi ve otomasyon kuralları henüz implement edilmemiştir.

---

## 🎯 Neden CRM Core Customer Tablolarından Ayrı?

### Core Customer Tables (Migration 003)

**Amaç**: Temel müşteri kimlik bilgileri ve actor yapısı

**İçerik**:
- `actor` - Genel actor bilgileri (email, telefon, adres)
- `customer` - Müşteri spesifik bilgiler (ad, soyad, kimlik, doğrulama)

**Kapsam**: 
- ✅ Kimlik yönetimi
- ✅ İletişim bilgileri
- ✅ Doğrulama durumu
- ✅ Temel profil bilgileri

### CRM Tables (Migration 017)

**Amaç**: Müşteri ilişkileri, segmentasyon, sadakat ve etkileşim yönetimi

**İçerik**:
- Segmentasyon ve etiketleme
- Sadakat programları ve puanlar
- Kredi limitleri
- Değerlendirmeler ve yorumlar
- Ödeme geçmişi
- Notlar ve etkileşimler

**Kapsam**:
- ✅ Müşteri segmentasyonu
- ✅ Sadakat yönetimi
- ✅ Kredi limiti takibi
- ✅ Değerlendirme ve feedback
- ✅ Ödeme geçmişi
- ✅ Not ve etiket yönetimi

### Ayrım Prensipleri

1. **Separation of Concerns**: Core identity vs relationship management
2. **Scalability**: CRM verileri ayrı ölçeklendirilebilir
3. **Data Lifecycle**: Core data immutable, CRM data mutable (soft delete)
4. **Business Logic**: Core = identity, CRM = relationship & engagement

### Mimari Yerleşim

```
Core Domain (Migration 003)
├── actor (identity, contact)
└── customer (profile, verification)

CRM Domain (Migration 017)
├── customer_segment (segmentation)
├── customer_loyalty_points (loyalty)
├── customer_credit_limit (credit)
├── customer_review (feedback)
├── customer_note (interactions)
└── customer_tag (tagging)
```

---

## 🔄 Müşteri Yaşam Döngüsü Modeli

### 1. Lead → Prospect → Customer

**Lead (Gelecek Migration)**:
- Potansiyel müşteri
- Henüz kayıt olmamış
- İletişim bilgileri toplanmış

**Prospect (Gelecek Migration)**:
- Kayıt olmuş ama henüz işlem yapmamış
- Doğrulanmış müşteri
- İlk segment ataması yapılabilir

**Customer (Migration 003 + 017)**:
- Aktif müşteri
- İşlem geçmişi var
- Segment ve etiket atanmış
- Sadakat programına dahil olabilir

### 2. Customer Lifecycle Stages

**New Customer**:
- İlk kargo gönderimi
- İlk segment ataması
- Sadakat programına otomatik kayıt

**Active Customer**:
- Düzenli işlemler
- Segment güncellemeleri
- Sadakat puanı birikimi
- Kredi limiti kullanımı

**VIP Customer**:
- Yüksek hacimli işlemler
- Premium segment
- Özel sadakat tier
- Genişletilmiş kredi limiti

**At-Risk Customer**:
- İşlem hacmi düşüşü
- Gecikmiş ödemeler
- Negatif notlar
- Özel segment (retention)

**Churned Customer**:
- Uzun süre işlem yok
- İnaktif segment
- Sadakat puanları expire
- Archive (soft delete)

---

## 💬 Interaction vs Support Ticket Ayrımı

### Customer Interaction (CRM - Migration 017)

**Amaç**: Genel müşteri etkileşimleri ve notlar

**İçerik**:
- `customer_note` - Genel notlar (call, meeting, email)
- `customer_review` - Değerlendirmeler ve feedback
- `loyalty_transaction` - Sadakat işlemleri
- `payment_history` - Ödeme geçmişi

**Özellikler**:
- ✅ Soft delete (notlar silinebilir)
- ✅ Tip bazlı kategorizasyon
- ✅ Public/private notlar
- ✅ Employee tracking (created_by)

**Kullanım Senaryoları**:
- Müşteri görüşmesi notları
- Genel feedback ve yorumlar
- Sadakat puanı işlemleri
- Ödeme geçmişi takibi

### Support Ticket (Support - Migration 011)

**Amaç**: Teknik destek ve sorun çözümü

**İçerik**:
- `support_ticket` - Destek talepleri
- `ticket_comment` - Ticket yorumları
- `ticket_attachment` - Ekler

**Özellikler**:
- ✅ Durum bazlı workflow (open, in_progress, resolved)
- ✅ Öncelik seviyeleri
- ✅ Kategori ve etiketler
- ✅ Çözüm takibi

**Kullanım Senaryoları**:
- Teknik sorunlar
- Kargo takip soruları
- Hasar bildirimleri
- İade talepleri

### Ayrım Önemi

```
CRM Interaction → "Relationship & Engagement"
    ↓
Support Ticket → "Problem Resolution"
```

**Örnek Senaryo**:
1. Müşteri kargo hakkında soru sorar → `support_ticket` oluşturulur
2. Destek ekibi sorunu çözer → `ticket_comment` eklenir
3. Müşteri memnuniyetini belirtir → `customer_review` oluşturulur
4. CRM ekibi not ekler → `customer_note` oluşturulur
5. Sadakat puanı verilir → `loyalty_transaction` oluşturulur

---

## 🎯 Lead vs Customer Ayrımı

### Lead (Gelecek Migration)

**Tanım**: Potansiyel müşteri, henüz kayıt olmamış

**Özellikler**:
- İletişim bilgileri toplanmış
- Henüz `customer` tablosunda kayıt yok
- Lead scoring yapılabilir
- Marketing kampanyalarına dahil

**Tablolar** (gelecek):
- `lead` - Lead bilgileri
- `lead_source` - Lead kaynağı
- `lead_score` - Lead skorlama

### Customer (Migration 003 + 017)

**Tanım**: Kayıtlı ve doğrulanmış müşteri

**Özellikler**:
- `actor` ve `customer` tablolarında kayıtlı
- İşlem geçmişi olabilir
- Segment ve etiket atanmış
- Sadakat programına dahil olabilir

**Tablolar**:
- `customer` (Migration 003)
- `customer_segment_assignment` (Migration 017)
- `customer_loyalty_points` (Migration 017)
- `customer_credit_limit` (Migration 017)

### Ayrım Stratejisi

**Lead → Customer Dönüşümü** (Gelecek Migration):
1. Lead kayıt formu doldurur
2. Email doğrulaması yapılır
3. `customer` kaydı oluşturulur
4. İlk segment ataması yapılır
5. Sadakat programına otomatik kayıt

**Customer → Lead Geri Dönüşümü** (Gelecek Migration):
1. Uzun süre işlem yok
2. Customer inaktif olarak işaretlenir
3. Lead olarak yeniden kategorize edilir
4. Re-engagement kampanyası başlatılır

---

## 📊 Segmentasyon Felsefesi

### Segmentasyon Yaklaşımı

**Rule-Based Segmentation** (Bu Migration):
- `customer_segment.criteria` (JSONB) ile kural tanımları
- Manuel segment ataması
- Priority bazlı segment önceliği
- Discount percentage ile segment bazlı indirimler

**Örnek Segmentler**:
- **VIP**: Yüksek hacimli müşteriler, %15 indirim
- **Regular**: Standart müşteriler, %5 indirim
- **New**: Yeni müşteriler, %10 indirim
- **At-Risk**: İşlem hacmi düşen müşteriler, %20 indirim (retention)

### Segment Criteria (JSONB)

```json
{
  "min_total_orders": 50,
  "min_total_amount": 10000,
  "min_loyalty_points": 1000,
  "countries": ["TR", "US"],
  "customer_types": ["business"]
}
```

### Segment Assignment

**Otomatik Atama** (Gelecek Migration):
- Kural bazlı otomatik segment ataması
- İşlem sonrası segment güncelleme
- Priority bazlı segment çakışma çözümü

**Manuel Atama** (Bu Migration):
- Employee tarafından manuel atama
- `assigned_by` ile audit trail
- `is_active` ile aktif/pasif yönetimi

### Tag vs Segment

**Segment**:
- Kural bazlı kategorizasyon
- Discount ve priority ile iş mantığı
- Otomatik atama potansiyeli

**Tag**:
- Esnek etiketleme
- Renk kodlu görselleştirme
- Manuel atama
- Segment'e ek olarak kullanılır

**Kullanım**:
- Segment: İş mantığı (indirim, öncelik)
- Tag: Görselleştirme ve filtreleme (VIP, Preferred, Problematic)

---

## 🔒 Veri Değişmezliği Mantığı

### Immutable Tables (Append-Only)

**`loyalty_transaction`**:
- ✅ INSERT only
- ❌ UPDATE yasak
- ❌ DELETE yasak
- **Neden**: Sadakat puanı işlemleri finansal kayıt, değiştirilemez

**`payment_history`**:
- ✅ INSERT only
- ❌ UPDATE yasak
- ❌ DELETE yasak
- **Neden**: Ödeme geçmişi audit trail, değiştirilemez

**`review_rating`**:
- ✅ INSERT only
- ❌ UPDATE yasak (comment hariç - gelecek migration)
- ❌ DELETE yasak
- **Neden**: Değerlendirmeler güvenilirlik için immutable

### Mutable Tables (Soft Delete)

**`customer_segment`**:
- ✅ INSERT, UPDATE
- ✅ Soft delete (`deleted_at`)
- **Neden**: Segment kuralları güncellenebilir

**`customer_note`**:
- ✅ INSERT, UPDATE
- ✅ Soft delete (`deleted_at`)
- **Neden**: Notlar düzenlenebilir ve silinebilir

**`customer_review`**:
- ✅ INSERT, UPDATE
- ✅ Soft delete (`deleted_at`)
- **Neden**: Değerlendirmeler düzenlenebilir (spam, uygunsuz içerik)

### Updateable Tables (No Soft Delete)

**`customer_loyalty_points`**:
- ✅ INSERT, UPDATE
- ❌ Soft delete yok
- **Neden**: Puanlar sürekli güncellenir, silinmez

**`customer_credit_limit`**:
- ✅ INSERT, UPDATE
- ❌ Soft delete yok
- **Neden**: Kredi limitleri sürekli güncellenir, silinmez

---

## 📖 CRM Read-Model Stratejisi

### Read-Optimized Queries

**Customer Profile Aggregation**:
```sql
-- Customer + Segment + Loyalty + Credit Limit
SELECT 
  c.id,
  c.first_name,
  c.last_name,
  cs.segment_name,
  clp.total_points,
  ccl.credit_limit_amount
FROM customer c
LEFT JOIN customer_segment_assignment csa ON c.id = csa.customer_id
LEFT JOIN customer_segment cs ON csa.customer_segment_id = cs.id
LEFT JOIN customer_loyalty_points clp ON c.id = clp.customer_id
LEFT JOIN customer_credit_limit ccl ON c.id = ccl.customer_id
WHERE c.deleted_at IS NULL;
```

**Customer Interaction Timeline**:
```sql
-- Notes + Reviews + Transactions + Payments
SELECT 
  'note' as interaction_type,
  cn.created_at,
  cn.note_text as content
FROM customer_note cn
WHERE cn.customer_id = $1 AND cn.deleted_at IS NULL

UNION ALL

SELECT 
  'review' as interaction_type,
  cr.review_date as created_at,
  cr.review_text as content
FROM customer_review cr
WHERE cr.customer_id = $1 AND cr.deleted_at IS NULL

ORDER BY created_at DESC;
```

### Index Strategy

**Partial Indexes**:
- `customer_segment_assignment`: Active assignments only
- `customer_review`: Published reviews only
- `customer_note`: Non-deleted notes only

**Composite Indexes**:
- `(customer_id, deleted_at, is_active)` - Customer segment assignments
- `(customer_id, transaction_date)` - Loyalty transactions
- `(customer_id, payment_date)` - Payment history

### Caching Strategy (Gelecek Migration)

**Customer Profile Cache**:
- Redis cache for customer profile aggregations
- TTL: 5 minutes
- Invalidation on segment/loyalty/credit updates

**Segment List Cache**:
- Redis cache for active segments
- TTL: 1 hour
- Invalidation on segment create/update/delete

---

## 🚀 Gelecek Marketing Automation Hazırlığı

### Automation Rules (Gelecek Migration)

**Segment-Based Automation**:
- Yeni segment ataması → Welcome email
- Segment değişikliği → Notification
- VIP segment → Special offer

**Loyalty-Based Automation**:
- Puan threshold → Tier upgrade notification
- Puan expiration → Reminder email
- Puan kazanma → Confirmation SMS

**Credit Limit Automation**:
- Limit aşımı → Alert notification
- Limit güncelleme → Confirmation email
- Limit kullanımı → Usage report

### Campaign Management (Gelecek Migration)

**Campaign Types**:
- Email campaigns
- SMS campaigns
- Push notifications
- In-app messages

**Targeting**:
- Segment-based
- Tag-based
- Behavior-based (transaction history)
- Geographic-based

### Scoring & Analytics (Gelecek Migration)

**Customer Scoring**:
- Transaction frequency
- Transaction value
- Loyalty points
- Review ratings
- Payment history

**Predictive Analytics**:
- Churn prediction
- Upsell opportunity
- Cross-sell recommendation
- Lifetime value calculation

---

## 🔐 GDPR / KVKK Düşünceleri

### Veri Saklama

**Personal Data**:
- `customer_note`: Employee notes may contain personal data
- `customer_review`: Reviews may contain personal information
- `customer_segment_assignment`: Assignment history

**Retention Policy**:
- Notes: 2 years after customer deletion
- Reviews: 5 years (public content)
- Payment history: 7 years (legal requirement)
- Loyalty transactions: 3 years after expiration

### Right to be Forgotten (Gelecek Migration)

**Data Deletion**:
- Soft delete for all CRM tables
- Anonymization for immutable tables
- Archive to separate database

**Data Export**:
- Customer data export endpoint
- Includes all CRM data (segments, loyalty, reviews, notes)
- JSON/CSV format

### Consent Management (Gelecek Migration)

**Consent Types**:
- Marketing emails
- SMS notifications
- Data sharing with partners
- Analytics tracking

**Consent Tracking**:
- Consent history table
- Opt-in/opt-out dates
- Consent withdrawal

---

## 🏢 Gerçek Dünya Kargo Şirketi CRM Kullanımı

### Senaryo 1: Yeni Müşteri Onboarding

```
1. Müşteri kayıt olur (Migration 003)
   ↓
2. İlk kargo gönderimi yapılır
   ↓
3. "New Customer" segmentine atanır (Migration 017)
   ↓
4. Sadakat programına otomatik kayıt
   ↓
5. Welcome email gönderilir (Migration 015)
   ↓
6. İlk sadakat puanları verilir
```

### Senaryo 2: VIP Müşteri Yükseltme

```
1. Müşteri 50+ kargo gönderir
   ↓
2. Toplam işlem tutarı 10,000+ olur
   ↓
3. Segment criteria kontrol edilir
   ↓
4. "VIP" segmentine otomatik atanır
   ↓
5. %15 indirim uygulanır
   ↓
6. Premium sadakat tier'a yükseltilir
   ↓
7. Kredi limiti artırılır
   ↓
8. VIP notification gönderilir
```

### Senaryo 3: Müşteri Değerlendirmesi

```
1. Müşteri kargo teslim alır
   ↓
2. Değerlendirme formu gönderilir (Migration 015)
   ↓
3. Müşteri 5 yıldız verir
   ↓
4. customer_review oluşturulur
   ↓
5. review_rating (delivery, packaging, service) eklenir
   ↓
6. Sadakat puanı verilir (review bonus)
   ↓
7. Review published (is_published = true)
   ↓
8. Public review listesinde görünür
```

### Senaryo 4: Kredi Limit Yönetimi

```
1. Kurumsal müşteri başvurusu
   ↓
2. Kredi limiti belirlenir (10,000 TRY)
   ↓
3. customer_credit_limit oluşturulur
   ↓
4. Müşteri kargo gönderir (ödeme ertelenir)
   ↓
5. used_amount güncellenir
   ↓
6. available_amount otomatik hesaplanır
   ↓
7. Limit aşımı kontrolü yapılır
   ↓
8. Aşım durumunda alert gönderilir
```

### Senaryo 5: Müşteri Notu ve Etiketleme

```
1. Müşteri görüşmesi yapılır
   ↓
2. customer_note oluşturulur (note_type: 'call')
   ↓
3. "Preferred Customer" tag'i atanır
   ↓
4. Not private olarak işaretlenir (is_private = true)
   ↓
5. Employee notu görüntüler (created_by tracking)
   ↓
6. Segment güncellemesi yapılabilir
```

### Senaryo 6: Ödeme Geçmişi Takibi

```
1. Müşteri ödeme yapar (Migration 006)
   ↓
2. payment_history oluşturulur
   ↓
3. Ödeme tarihi kontrol edilir
   ↓
4. Gecikme varsa late_payment_flag = true
   ↓
5. days_late hesaplanır
   ↓
6. Gecikme durumunda alert gönderilir
   ↓
7. Segment güncellemesi yapılabilir (At-Risk)
```

---

## 🏗️ Backend Implementasyonu

### Oluşturulan Modüller

1. **CustomerSegmentModule** - `src/crm/customer-segment/`
   - Customer segmentation
   - Segment assignments
   - Customer tags
   - Tag assignments

2. **CustomerProfileModule** - `src/crm/customer-profile/`
   - Loyalty programs
   - Customer loyalty points
   - Customer credit limits

3. **CustomerInteractionModule** - `src/crm/customer-interaction/`
   - Loyalty transactions
   - Customer reviews
   - Review ratings
   - Payment history

4. **CustomerNoteModule** - `src/crm/customer-note/`
   - Customer notes
   - Note type categorization
   - Public/private notes

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Soft delete desteği (uygun tablolarda)
- JSONB field handling

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri (parseFloat)
- JSONB parsing (criteria, tier_levels)
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri (READ-ONLY)
- RESTful API tasarımı
- Query parameter desteği
- TODO comments for future RBAC guards

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları
- Enum validasyonları
- Date string validasyonları

### API Endpoints

#### Customer Segments

- `GET /crm/segments` - Tüm segmentler
- `GET /crm/segments/active` - Aktif segmentler
- `GET /crm/segments/code/:segmentCode` - Kod bazlı
- `GET /crm/segments/uuid/:uuid` - UUID bazlı
- `GET /crm/segments/:id` - ID bazlı

#### Segment Assignments

- `GET /crm/segment-assignments` - Tüm atamalar
- `GET /crm/segment-assignments/customer/:customerId` - Müşteri bazlı
- `GET /crm/segment-assignments/customer/:customerId/active` - Müşteri aktif
- `GET /crm/segment-assignments/segment/:segmentId` - Segment bazlı
- `GET /crm/segment-assignments/:id` - ID bazlı

#### Customer Tags

- `GET /crm/tags` - Tüm etiketler
- `GET /crm/tags/active` - Aktif etiketler
- `GET /crm/tags/name/:tagName` - İsim bazlı
- `GET /crm/tags/uuid/:uuid` - UUID bazlı
- `GET /crm/tags/:id` - ID bazlı

#### Tag Assignments

- `GET /crm/tag-assignments` - Tüm atamalar
- `GET /crm/tag-assignments/customer/:customerId` - Müşteri bazlı
- `GET /crm/tag-assignments/tag/:tagId` - Etiket bazlı
- `GET /crm/tag-assignments/:id` - ID bazlı

#### Loyalty Programs

- `GET /crm/loyalty-programs` - Tüm programlar
- `GET /crm/loyalty-programs/active` - Aktif programlar
- `GET /crm/loyalty-programs/uuid/:uuid` - UUID bazlı
- `GET /crm/loyalty-programs/:id` - ID bazlı

#### Customer Loyalty Points

- `GET /crm/loyalty-points` - Tüm puanlar
- `GET /crm/loyalty-points/customer/:customerId` - Müşteri bazlı
- `GET /crm/loyalty-points/program/:loyaltyProgramId` - Program bazlı
- `GET /crm/loyalty-points/:id` - ID bazlı

#### Customer Credit Limits

- `GET /crm/credit-limits` - Tüm limitler
- `GET /crm/credit-limits/customer/:customerId` - Müşteri bazlı
- `GET /crm/credit-limits/:id` - ID bazlı

#### Loyalty Transactions

- `GET /crm/loyalty-transactions` - Tüm işlemler
- `GET /crm/loyalty-transactions/type/:transactionType` - Tip bazlı
- `GET /crm/loyalty-transactions/loyalty-points/:customerLoyaltyPointsId` - Puan bazlı
- `GET /crm/loyalty-transactions/date-range?startDate=&endDate=` - Tarih aralığı
- `GET /crm/loyalty-transactions/:id` - ID bazlı

#### Customer Reviews

- `GET /crm/reviews` - Tüm değerlendirmeler
- `GET /crm/reviews/published` - Yayınlanmış değerlendirmeler
- `GET /crm/reviews/verified` - Doğrulanmış değerlendirmeler
- `GET /crm/reviews/rating/:rating` - Puan bazlı
- `GET /crm/reviews/customer/:customerId` - Müşteri bazlı
- `GET /crm/reviews/cargo/:cargoId` - Kargo bazlı
- `GET /crm/reviews/uuid/:uuid` - UUID bazlı
- `GET /crm/reviews/:id` - ID bazlı

#### Review Ratings

- `GET /crm/review-ratings` - Tüm alt puanlar
- `GET /crm/review-ratings/review/:customerReviewId` - Değerlendirme bazlı
- `GET /crm/review-ratings/type/:ratingType` - Tip bazlı
- `GET /crm/review-ratings/:id` - ID bazlı

#### Payment History

- `GET /crm/payment-history` - Tüm ödeme geçmişi
- `GET /crm/payment-history/late` - Gecikmiş ödemeler
- `GET /crm/payment-history/customer/:customerId` - Müşteri bazlı
- `GET /crm/payment-history/payment/:paymentId` - Ödeme bazlı
- `GET /crm/payment-history/date-range?startDate=&endDate=` - Tarih aralığı
- `GET /crm/payment-history/:id` - ID bazlı

#### Customer Notes

- `GET /crm/notes` - Tüm notlar
- `GET /crm/notes/public` - Public notlar
- `GET /crm/notes/private` - Private notlar
- `GET /crm/notes/type/:noteType` - Tip bazlı
- `GET /crm/notes/customer/:customerId` - Müşteri bazlı
- `GET /crm/notes/created-by/:createdBy` - Oluşturan bazlı
- `GET /crm/notes/:id` - ID bazlı

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. CRUD işlemleri gelecek migration'larda eklenecektir.

2. **No Automation Logic**: Segment ataması, sadakat puanı hesaplama ve otomatik işlemler henüz implement edilmemiştir. Placeholder TODO comments mevcuttur.

3. **No Marketing Features**: Email/SMS gönderimi, kampanya yönetimi ve automation kuralları henüz yoktur.

4. **JSONB Fields**: `criteria` (segment), `tier_levels` (loyalty program) JSONB olarak saklanır ve parse edilir.

5. **Decimal Handling**: Tüm DECIMAL field'lar parseFloat ile number'a dönüştürülür.

6. **Soft Delete**: `customer_segment`, `customer_note`, `customer_review`, `customer_tag` tablolarında soft delete mevcuttur.

7. **Immutable Tables**: `loyalty_transaction` ve `payment_history` immutable'dır (INSERT only).

8. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

9. **Indexes**: Performans için gerekli partial index'ler oluşturulmuştur.

10. **TODO Comments**: Service ve controller'larda gelecek RBAC guard'ları, automation logic ve marketing features için TODO yorumları eklenmiştir.

---

## 📚 İlgili Dokümantasyon

- [Migration 003: Actor Tables](./003_create_actor_tables.md) - Core customer tables
- [Migration 011: Customer Support Tables](./011_create_customer_support_tables.md) - Support tickets
- [Migration 015: Notification Tables](./015_create_notification_tables.md) - Notification infrastructure
- [GDPR Compliance Guide](https://gdpr.eu/)
- [KVKK (Turkish Data Protection Law)](https://kvkk.gov.tr/)

---

**Migration 017 Tamamlandı** ✅
