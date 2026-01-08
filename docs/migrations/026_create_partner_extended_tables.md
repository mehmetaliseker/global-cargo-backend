# Migration 026: Partner Extended Tables

## 📋 Genel Bakış

Migration 026, Global Cargo Backend sistemine **Partner Extended Infrastructure** ekler. Bu migration, partner komisyon yönetimi, partner performans takibi, SLA izleme ve partner sözleşme yönetimi için gerekli transactional operasyonel altyapıyı oluşturur.

### Tablolar

1. **`partner_commission`** - Partner komisyon tanımları ve geçerlilik tarihleri
2. **`commission_calculation`** - Kargo bazlı komisyon hesaplamaları
3. **`commission_payment`** - Komisyon ödemeleri ve durum takibi
4. **`partner_performance`** - Partner performans değerlendirmeleri (dönemsel)
5. **`partner_kpi`** - Partner KPI metrikleri (detay seviyesi)
6. **`partner_agreement`** - Partner sözleşmeleri ve şartlar
7. **`sla_tracking`** - SLA metrik takibi ve ölçümleri
8. **`sla_breach`** - SLA ihlalleri ve çözüm takibi

**🚨 ÖNEMLİ NOT**: Bu migration **OPERASYONEL TRANSACTIONAL ALTYAPI**dır. Bu tablolar günlük operasyonlarda aktif olarak kullanılır ve backend API'ları ile yönetilir.

---

## 🎯 Migration 026'nın Amacı

### Neden Partner Extended Şimdi?

**İş Bağlamı**:
- Migrations 001-025 temel operasyonel altyapıyı tamamladı
- Partner yönetimi basit partner tablosundan çıkarak genişledi
- Komisyon hesaplama ve ödeme süreçleri otomatikleştirilmeli
- Partner performans takibi ve SLA yönetimi kritik hale geldi
- Sözleşme yönetimi ve versiyonlama gerekiyor

**Problem**: Basit partner tablosu yeterli değil:
- Partner komisyon oranları dinamik ve zamana bağlı
- Her kargo için komisyon hesaplanması ve takibi gerekiyor
- Partner performansının düzenli ölçülmesi ve raporlanması lazım
- SLA takibi ve ihlallerin yönetilmesi zorunlu
- Sözleşme şartlarının versiyonlanması ve takibi gerekli

**Migration 026 Hedefi**:
- **Partner komisyon yönetimi** için transactional altyapı
- Komisyon hesaplama ve ödeme süreçleri için veri modeli
- Partner performans takibi için yapı
- SLA izleme ve ihlal yönetimi için sistem
- Partner sözleşme yönetimi ve versiyonlama desteği

### Bu Migration Neyi Sağlar?

✅ **Komisyon Yönetimi**:
- Partner bazlı komisyon tanımları
- Zaman bazlı geçerlilik (valid_from, valid_to)
- Kargo tipi ve sevkiyat tipi bazlı uygulanabilirlik
- Komisyon hesaplama ve ödeme takibi

✅ **Performans Takibi**:
- Dönemsel performans değerlendirmeleri (aylık, çeyreklik, yıllık)
- KPI bazlı detaylı metrik takibi
- Skor ve rating sistemi

✅ **SLA Yönetimi**:
- Partner sözleşmelerine bağlı SLA metrikleri
- Düzenli SLA ölçümleri ve takibi
- İhlal tespiti ve çözüm yönetimi

✅ **Sözleşme Yönetimi**:
- Partner sözleşmelerinin versiyonlanması
- Sözleşme şartlarının JSONB formatında saklanması
- Aktif/pasif sözleşme yönetimi

### Bu Migration Neyi Sağlamaz?

❌ **Komisyon Hesaplama Motoru DEĞİLDİR**:
- Backend API'ları komisyon hesaplama yapmaz
- Hesaplama mantığı external service'te olabilir
- Backend sadece hesaplanan sonuçları saklar ve servis eder

❌ **Otomatik Ödeme Sistemi DEĞİLDİR**:
- Ödeme işlemlerini otomatik gerçekleştirmez
- Sadece ödeme kayıtlarını takip eder
- Harici ödeme sistemleri ile entegrasyon gerekir

❌ **Performans Analiz Motoru DEĞİLDİR**:
- Performans skorlarını otomatik hesaplamaz
- KPI değerlerini external process hesaplar
- Backend sadece sonuçları saklar ve sorgular

---

## 📊 Partner Commission Tablosu

### Amaç

Partner komisyon oranlarını tanımlamak ve zamana bağlı geçerlilik yönetmek.

### Yapı

```sql
partner_commission (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    commission_type VARCHAR(50) NOT NULL,  -- 'percentage' veya 'fixed_amount'
    commission_rate DECIMAL(10, 4) NOT NULL,
    applicable_to_cargo_types JSONB,       -- Hangi kargo tipleri için geçerli
    applicable_to_shipment_types JSONB,    -- Hangi sevkiyat tipleri için geçerli
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE,     -- NULL = süresiz geçerli
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Kargo şirketi yeni bir partner ile anlaşma yapıyor. Partner, belirli kargo tipleri için %5 komisyon alacak. Anlaşma 1 Ocak 2024'te başlıyor ve 31 Aralık 2024'te bitiyor.

```typescript
// Backend API ile partner commission oluşturulur
POST /partners/commissions
{
    "partnerId": 123,
    "commissionType": "percentage",
    "commissionRate": 5.0,
    "applicableToCargoTypes": ["electronics", "clothing"],
    "applicableToShipmentTypes": ["standard", "express"],
    "validFrom": "2024-01-01T00:00:00Z",
    "validTo": "2024-12-31T23:59:59Z",
    "isActive": true
}
```

**Neden Bu Şekilde Tasarlandı?**

1. **Zaman Bazlı Geçerlilik**: Partner komisyonları değişebilir. Geçmiş, şimdiki ve gelecekteki komisyon oranlarını ayrı kayıtlar olarak saklamak audit trail sağlar.

2. **Esneklik**: JSONB alanlar sayesinde farklı kargo ve sevkiyat tipleri için farklı kurallar tanımlanabilir.

3. **Soft Delete**: `deleted_at` ile kayıtlar kalıcı olarak silinmez, sadece işaretlenir. Geçmiş raporlar için veri bütünlüğü korunur.

### Backend Implementasyonu

**Module**: `partner-commission`

**Endpoints**:
- `GET /partners/commissions` - Tüm komisyon tanımları
- `GET /partners/commissions/active` - Aktif komisyonlar
- `GET /partners/commissions/partner/:partnerId` - Belirli partner için komisyonlar
- `GET /partners/commissions/partner/:partnerId/active` - Belirli partner için aktif komisyonlar
- `GET /partners/commissions/date-range?startDate=&endDate=` - Tarih aralığına göre aktif komisyonlar
- `GET /partners/commissions/:id` - ID ile komisyon detayı

**Repository Pattern**:
- Raw SQL sorguları kullanır
- `deleted_at IS NULL` kontrolü ile soft delete destekler
- Tarih bazlı sorgular için `CURRENT_TIMESTAMP` kullanır

---

## 💰 Commission Calculation Tablosu

### Amaç

Her kargo için hesaplanan komisyon tutarını saklamak. Bu tablo, partner komisyonu ve cargo tabloları arasında köprü görevi görür.

### Yapı

```sql
commission_calculation (
    id SERIAL PRIMARY KEY,
    partner_commission_id INTEGER NOT NULL,  -- Hangi komisyon tanımı kullanıldı
    cargo_id INTEGER NOT NULL,               -- Hangi kargo için hesaplandı
    base_amount DECIMAL(15, 2) NOT NULL,     -- Komisyon hesabının yapıldığı base tutar
    commission_amount DECIMAL(15, 2) NOT NULL, -- Hesaplanan komisyon tutarı
    currency_id INTEGER NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE,
    payment_status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'paid', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Bir kargo teslim edildi ve invoice oluşturuldu. Kargo tutarı 1000 TL. Partner için aktif komisyon %5. Sistem otomatik olarak komisyon hesaplar:

```
Base Amount: 1000.00 TL
Commission Rate: 5%
Commission Amount: 50.00 TL
```

Bu hesaplama `commission_calculation` tablosuna kaydedilir. Ödeme durumu başlangıçta 'pending' olarak işaretlenir.

**Neden Bu Şekilde Tasarlandı?**

1. **Audit Trail**: Her kargo için komisyon hesaplaması kaydedilir. Geçmiş hesaplamalara referans verilebilir.

2. **Ödeme Takibi**: `payment_status` alanı ile hangi komisyonların ödendiği, hangilerinin beklemede olduğu takip edilir.

3. **Referans Tutma**: `partner_commission_id` ile hangi komisyon tanımının kullanıldığı saklanır. Gelecekte komisyon oranları değişse bile, geçmiş hesaplamalar doğru tanımı referans gösterir.

### Backend Implementasyonu

**Not**: Bu modül Migration 026 kapsamında olacak. Şu anda sadece `partner-commission` modülü implement edildi. `commission-calculation` modülü sonraki adımda implement edilecek.

---

## 💳 Commission Payment Tablosu

### Amaç

Komisyon ödemelerini kaydetmek ve takip etmek. Bir komisyon hesaplaması birden fazla ödeme ile kapatılabilir (taksitli ödeme durumunda).

### Yapı

```sql
commission_payment (
    id SERIAL PRIMARY KEY,
    commission_calculation_id INTEGER NOT NULL,
    payment_amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),              -- 'bank_transfer', 'check', 'cash', vb.
    transaction_reference VARCHAR(255),      -- Banka işlem referansı
    status VARCHAR(50) DEFAULT 'pending',    -- 'pending', 'completed', 'failed'
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: 50 TL komisyon hesaplandı. Finans departmanı bu komisyonu banka transferi ile ödedi. İşlem referansı: "TRX-2024-001234". Ödeme 15 Ocak 2024'te gerçekleşti.

```typescript
POST /partners/commission-payments
{
    "commissionCalculationId": 456,
    "paymentAmount": 50.00,
    "currencyId": 1,  // TL
    "paymentDate": "2024-01-15",
    "paymentMethod": "bank_transfer",
    "transactionReference": "TRX-2024-001234",
    "status": "completed"
}
```

**Neden Bu Şekilde Tasarlandı?**

1. **Ödeme Esnekliği**: Bir komisyon hesaplaması birden fazla ödeme ile kapatılabilir. Bu, taksitli ödeme senaryolarını destekler.

2. **İşlem Referansı**: Harici ödeme sistemleri ile entegrasyon için transaction reference saklanır.

3. **Durum Takibi**: Ödeme durumu ('pending', 'completed', 'failed') takip edilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## 📈 Partner Performance Tablosu

### Amaç

Partner performansının dönemsel olarak değerlendirilmesi ve ölçülmesi. Aylık, çeyreklik veya yıllık performans raporları için veri saklar.

### Yapı

```sql
partner_performance (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL,
    performance_period VARCHAR(50) NOT NULL,  -- 'month', 'quarter', 'year'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    kpi_data JSONB NOT NULL,                  -- KPI değerlerinin JSON formatında saklanması
    score DECIMAL(5, 2),                      -- 0-100 arası genel skor
    rating VARCHAR(50),                       -- 'excellent', 'good', 'fair', 'poor'
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Ocak 2024 ayı için Partner #123'ün performansı değerlendirildi:

- Teslimat Süresi Ortalaması: 2.5 gün (hedef: 3 gün)
- Hasarlı Kargo Oranı: %0.5 (hedef: %1)
- Müşteri Memnuniyeti: 4.5/5 (hedef: 4/5)
- Toplam Skor: 85/100
- Rating: "good"

```typescript
POST /partners/performances
{
    "partnerId": 123,
    "performancePeriod": "month",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "kpiData": {
        "averageDeliveryTime": 2.5,
        "damageRate": 0.5,
        "customerSatisfaction": 4.5
    },
    "score": 85.0,
    "rating": "good"
}
```

**Neden Bu Şekilde Tasarlandı?**

1. **JSONB Esnekliği**: Farklı partnerler için farklı KPI metrikleri tanımlanabilir. JSONB formatı sayesinde schema değişikliği yapmadan yeni metrikler eklenebilir.

2. **Dönemsel Takip**: Performans dönemsel olarak ölçülür. Geçmiş dönemlerin performans verileri saklanır, trend analizi yapılabilir.

3. **Skor ve Rating**: Hem sayısal skor hem de kategorik rating saklanır. Hem detaylı analiz hem de hızlı özet bilgi sağlanır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## 📊 Partner KPI Tablosu

### Amaç

Partner performansının detaylı KPI bazında takibi. `partner_performance` tablosundaki JSONB verilerin detaylı ve sorgulanabilir formatı.

### Yapı

```sql
partner_kpi (
    id SERIAL PRIMARY KEY,
    partner_performance_id INTEGER NOT NULL,  -- Hangi performans değerlendirmesine ait
    kpi_name VARCHAR(100) NOT NULL,           -- 'average_delivery_time', 'damage_rate', vb.
    kpi_value DECIMAL(15, 4) NOT NULL,
    target_value DECIMAL(15, 4),              -- Hedef değer
    achievement_percentage DECIMAL(5, 2),     -- Hedef başarım yüzdesi
    calculation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Partner #123'ün Ocak 2024 performansı için detaylı KPI'lar:

```
Partner Performance ID: 789

KPI 1:
- KPI Name: average_delivery_time
- KPI Value: 2.5
- Target Value: 3.0
- Achievement Percentage: 120% (hedefin üzerinde)

KPI 2:
- KPI Name: damage_rate
- KPI Value: 0.5
- Target Value: 1.0
- Achievement Percentage: 200% (hedefin 2 katı iyi)
```

**Neden Bu Şekilde Tasarlandı?**

1. **Sorgulanabilirlik**: JSONB formatında saklanan veriler sorgulanabilir değildir. Ayrı tablo ile KPI bazlı sorgular ve filtreleme yapılabilir.

2. **Detaylı Analiz**: Her KPI için hedef değer ve başarım yüzdesi saklanır. Partner'lerin hangi KPI'larda iyi/kötü performans gösterdiği analiz edilebilir.

3. **Raporlama**: KPI bazlı raporlar ve karşılaştırmalar kolayca yapılabilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## 📝 Partner Agreement Tablosu

### Amaç

Partner sözleşmelerini yönetmek, versiyonlamak ve takip etmek. Sözleşme şartları JSONB formatında saklanır.

### Yapı

```sql
partner_agreement (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    partner_id INTEGER NOT NULL,
    agreement_type VARCHAR(100) NOT NULL,    -- 'service', 'commission', 'exclusive', vb.
    agreement_number VARCHAR(100) NOT NULL UNIQUE,  -- 'AGR-2024-001'
    start_date DATE NOT NULL,
    end_date DATE,                           -- NULL = süresiz
    terms JSONB NOT NULL,                    -- Sözleşme şartları
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Partner #123 ile yeni bir hizmet sözleşmesi imzalandı:

- Sözleşme Numarası: AGR-2024-001
- Sözleşme Tipi: service
- Başlangıç: 1 Ocak 2024
- Bitiş: 31 Aralık 2024
- Şartlar:
  - Minimum aylık sevkiyat hacmi: 1000 adet
  - Maksimum teslimat süresi: 3 gün
  - Ödeme koşulları: 30 gün vade

```typescript
POST /partners/agreements
{
    "partnerId": 123,
    "agreementType": "service",
    "agreementNumber": "AGR-2024-001",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "terms": {
        "minimumMonthlyVolume": 1000,
        "maximumDeliveryTime": 3,
        "paymentTerms": "30_days"
    },
    "isActive": true
}
```

**Neden Bu Şekilde Tasarlandı?**

1. **UUID**: Harici sistemler ile entegrasyon için UUID kullanılır. ID'ler sequential olduğu için harici referanslarda UUID tercih edilir.

2. **JSONB Şartlar**: Sözleşme şartları farklı partnerler ve sözleşme tipleri için farklı olabilir. JSONB formatı esneklik sağlar.

3. **Sözleşme Numarası**: İnsan tarafından okunabilir unique sözleşme numarası. Raporlarda ve dokümantasyonda kullanılır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## 🎯 SLA Tracking Tablosu

### Amaç

Partner sözleşmelerinde tanımlı SLA metriklerinin düzenli olarak ölçülmesi ve takip edilmesi.

### Yapı

```sql
sla_tracking (
    id SERIAL PRIMARY KEY,
    partner_agreement_id INTEGER NOT NULL,   -- Hangi sözleşmeye ait SLA
    sla_metric_name VARCHAR(100) NOT NULL,   -- 'delivery_time', 'damage_rate', vb.
    target_value DECIMAL(15, 4) NOT NULL,    -- SLA hedef değeri
    actual_value DECIMAL(15, 4),             -- Gerçekleşen değer
    measurement_date DATE NOT NULL,          -- Ölçüm tarihi
    status VARCHAR(50) DEFAULT 'compliant',  -- 'compliant', 'breached', 'at_risk'
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Partner #123'ün SLA'sı aylık olarak ölçülüyor. Ocak 2024 ölçümü:

```
SLA 1: Delivery Time
- Target: 3.0 gün
- Actual: 2.5 gün
- Status: compliant (hedefin altında, başarılı)

SLA 2: Damage Rate
- Target: 1.0%
- Actual: 0.5%
- Status: compliant (hedefin altında, başarılı)
```

**Neden Bu Şekilde Tasarlandı?**

1. **Düzenli Ölçüm**: SLA'lar belirli aralıklarla ölçülür. Her ölçüm ayrı kayıt olarak saklanır, trend analizi yapılabilir.

2. **Durum Takibi**: 'compliant', 'breached', 'at_risk' gibi durumlar otomatik hesaplanabilir ve saklanır.

3. **Sözleşme Bağlantısı**: Her SLA ölçümü bir sözleşmeye bağlıdır. Sözleşme değişse bile geçmiş ölçümler korunur.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## ⚠️ SLA Breach Tablosu

### Amaç

SLA ihlallerini kaydetmek, şiddet seviyesini belirlemek ve çözüm sürecini takip etmek.

### Yapı

```sql
sla_breach (
    id SERIAL PRIMARY KEY,
    sla_tracking_id INTEGER NOT NULL,        -- Hangi SLA ölçümünde ihlal oldu
    breach_date TIMESTAMP WITH TIME ZONE,    -- İhlal tarihi
    breach_severity VARCHAR(50) DEFAULT 'minor',  -- 'minor', 'major', 'critical'
    breach_description TEXT NOT NULL,        -- İhlal açıklaması
    resolution_action TEXT,                  -- Çözüm aksiyonu
    resolved_date TIMESTAMP WITH TIME ZONE,  -- Çözüldüğü tarih
    resolved_by INTEGER,                     -- Çözen employee ID
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Partner #123'ün Şubat 2024 ölçümünde delivery time SLA'sı ihlal edildi:

```
SLA Tracking ID: 456
Breach Date: 2024-02-15
Severity: major
Description: Ortalama teslimat süresi 3.5 gün oldu, hedef 3.0 gün idi.
Resolution Action: Partner ile toplantı yapıldı, lojistik süreçleri iyileştirildi.
Resolved Date: 2024-02-20
Resolved By: Employee #789 (Partner Relations Manager)
```

**Neden Bu Şekilde Tasarlandı?**

1. **İhlal Takibi**: SLA ihlalleri kritik olaylardır. Her ihlal kaydedilmeli ve takip edilmelidir.

2. **Şiddet Seviyesi**: İhlallerin şiddeti ('minor', 'major', 'critical') işaretlenir. Kritik ihlaller için otomatik uyarılar gönderilebilir.

3. **Çözüm Süreci**: İhlalin çözülme süreci takip edilir. Geçmiş ihlaller ve çözümleri analiz edilebilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 026 kapsamında sonraki adımlarda implement edilecek.

---

## 🏗️ Backend Implementasyonu (Migration 026)

### Implement Edilen Modüller

#### 1. PartnerCommissionModule

**Konum**: `src/partner/partner-commission/`

**Amaç**: Partner komisyon tanımlarını yönetmek ve sorgulamak.

**Dosya Yapısı**:
- `partner-commission.module.ts` - NestJS modül tanımı
- `controllers/partner-commission.controller.ts` - REST endpoint'leri
- `services/partner-commission.service.ts` - İş mantığı
- `repositories/partner-commission.repository.ts` - Raw SQL sorguları
- `repositories/partner-commission.repository.interface.ts` - Repository interface ve entity tanımları
- `dto/partner-commission.dto.ts` - Response DTO

**Endpoints**:
- `GET /partners/commissions` - Tüm komisyon tanımları (soft delete edilmemiş)
- `GET /partners/commissions/active` - Aktif ve geçerli tarihte geçerli komisyonlar
- `GET /partners/commissions/partner/:partnerId` - Belirli partner için tüm komisyonlar
- `GET /partners/commissions/partner/:partnerId/active` - Belirli partner için aktif komisyonlar
- `GET /partners/commissions/date-range?startDate=&endDate=` - Tarih aralığına göre aktif komisyonlar
- `GET /partners/commissions/:id` - ID ile komisyon detayı

**Repository Metodları**:
- `findAll()`: Soft delete edilmemiş tüm kayıtlar
- `findById(id)`: ID ile kayıt bulma (soft delete kontrolü ile)
- `findByPartnerId(partnerId)`: Partner ID'ye göre tüm komisyonlar
- `findByPartnerIdActive(partnerId)`: Partner için aktif ve geçerli tarihte geçerli komisyonlar
- `findActiveByDateRange(startDate, endDate)`: Belirli tarih aralığında geçerli aktif komisyonlar
- `findActive()`: Genel aktif ve geçerli komisyonlar

**SQL Pattern**:
- Soft delete kontrolü: `WHERE deleted_at IS NULL`
- Aktif kayıt kontrolü: `WHERE is_active = true`
- Tarih geçerliliği kontrolü: `valid_from <= CURRENT_TIMESTAMP AND (valid_to IS NULL OR valid_to >= CURRENT_TIMESTAMP)`
- Sıralama: `ORDER BY partner_id ASC, valid_from DESC`

**DTO Mapping**:
- Snake_case database kolonları → camelCase DTO property'leri
- Decimal tipler `parseFloat()` ile number'a çevrilir
- Date tipler `toISOString()` ile string'e çevrilir
- JSONB alanlar olduğu gibi korunur (optional handling ile)

### Implement Edilmeyen Modüller (Sonraki Adımlar)

Migration 026 kapsamında aşağıdaki modüller henüz implement edilmedi:

1. **CommissionCalculationModule** - Komisyon hesaplamaları için
2. **CommissionPaymentModule** - Komisyon ödemeleri için
3. **PartnerPerformanceModule** - Partner performans değerlendirmeleri için
4. **PartnerKpiModule** - Partner KPI metrikleri için
5. **PartnerAgreementModule** - Partner sözleşmeleri için
6. **SlaTrackingModule** - SLA metrik takibi için
7. **SlaBreachModule** - SLA ihlalleri için

Bu modüller aynı pattern ile implement edilecektir.

---

## 📐 Mimari Kararlar ve Gerekçeleri

### Neden Backend API Gerekli?

**Operasyonel Kullanım**:
- Partner yönetimi departmanı komisyon tanımlarını admin panel üzerinden yönetmeli
- Finans departmanı komisyon hesaplamalarını ve ödemelerini takip etmeli
- Operasyon departmanı partner performansını ve SLA durumunu görmeli
- Yönetim dashboard'larında partner metrikleri görüntülenmeli

**Transactional İşlemler**:
- Komisyon hesaplamaları gerçek zamanlı yapılmalı
- Ödeme durumları güncellenmeli
- SLA ölçümleri otomatik veya manuel kaydedilmeli
- Performans değerlendirmeleri düzenli olarak girilmeli

### Neden RAW SQL?

**Mevcut Altyapı**:
- Proje zaten RAW SQL kullanıyor
- ORM kullanılmıyor
- DatabaseService üzerinden pg pool kullanılıyor
- Repository pattern mevcut, ancak ORM yerine RAW SQL ile

**Performans**:
- Partner komisyon sorguları sık kullanılacak
- Tarih bazlı filtreleme ve JOIN'ler performanslı olmalı
- RAW SQL ile query optimizasyonu tam kontrol altında

**Basitlik**:
- Kompleks ORM yapılandırmasına gerek yok
- SQL sorguları direkt ve anlaşılır
- Debug ve profiling kolay

### Neden Repository Pattern?

**Separation of Concerns**:
- Controller: HTTP request/response handling
- Service: İş mantığı ve DTO mapping
- Repository: Veritabanı erişimi ve SQL sorguları

**Testability**:
- Repository mock'lanabilir
- Service logic unit test edilebilir
- Controller integration test edilebilir

**Consistency**:
- Projede mevcut pattern ile uyumlu
- Aynı yaklaşım tüm modüllerde kullanılıyor
- Yeni geliştiriciler için öğrenme eğrisi düşük

### Neden Soft Delete?

**Audit Trail**:
- Partner komisyonları değişebilir, ancak geçmiş kayıtlar saklanmalı
- Raporlarda geçmiş komisyon oranları görüntülenebilmeli
- Compliance için veri silme izni yok

**Data Integrity**:
- `commission_calculation` tablosu `partner_commission_id` referans eder
- Komisyon silinirse hesaplamalar broken reference olur
- Soft delete ile referanslar korunur

**Recovery**:
- Yanlışlıkla silinen kayıtlar geri yüklenebilir
- `deleted_at IS NULL` kontrolü kaldırılarak kayıt geri getirilebilir

---

## 🔒 Veri Bütünlüğü ve Kısıtlamalar

### Database Constraints

**partner_commission Tablosu**:
```sql
CHECK (commission_type IN ('percentage', 'fixed_amount'))
CHECK (valid_to IS NULL OR valid_to >= valid_from)
```

Bu kısıtlamalar:
- Geçersiz komisyon tiplerini engeller
- Geçerlilik tarihlerinin mantıklı olmasını garanti eder

**Index'ler**:
```sql
CREATE INDEX idx_partner_commission_partner_id ON partner_commission(partner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_partner_commission_valid_dates ON partner_commission(valid_from, valid_to) WHERE deleted_at IS NULL;
```

Bu index'ler:
- Partner ID bazlı sorguları hızlandırır
- Tarih bazlı sorguları optimize eder
- Partial index ile sadece aktif kayıtlar indexlenir (disk tasarrufu)

### Foreign Key Constraints

**partner_commission.partner_id → partner.id**:
- `ON DELETE CASCADE`: Partner silinirse komisyonları da silinir (soft delete mantığı ile uyumlu değil, dikkat gerekli)
- `ON UPDATE CASCADE`: Partner ID değişirse komisyon referansları güncellenir

**Not**: Soft delete kullanıldığı için CASCADE delete dikkatli kullanılmalı. Partner silindiğinde soft delete yapılmalı, hard delete yapılmamalı.

---

## 🚨 Önemli Notlar ve Riskler

### 1. Tarih Geçerliliği Kontrolü

**Sorun**: Aktif komisyon sorguları `CURRENT_TIMESTAMP` kullanır. Bu, timezone farklarından etkilenebilir.

**Çözüm**: PostgreSQL `TIMESTAMP WITH TIME ZONE` kullanılır. Backend'den gönderilen tarihler UTC formatında olmalı.

### 2. Çakışan Komisyon Tanımları

**Sorun**: Aynı partner için aynı tarih aralığında birden fazla aktif komisyon tanımı olabilir.

**Çözüm**: Application layer'da kontrol yapılmalı. Database constraint'i yok, çünkü bazen overlap kabul edilebilir (kargo tipi bazlı ayrım yapılıyorsa).

### 3. JSONB Performansı

**Sorun**: `applicable_to_cargo_types` ve `applicable_to_shipment_types` JSONB formatında. Büyük JSONB alanlar sorgu performansını etkileyebilir.

**Çözüm**: Gerekirse GIN index eklenebilir. Şimdilik sorgu pattern'i JSONB içeriğine göre değil, partner_id ve tarihlere göre, bu yüzden sorun yok.

### 4. Decimal Precision

**Sorun**: `commission_rate DECIMAL(10, 4)` formatında. JavaScript'te number olarak parse edilirken precision kaybı olabilir.

**Çözüm**: `parseFloat()` kullanılır. Daha hassas işlemler için Decimal.js gibi kütüphane kullanılabilir, ancak şimdilik yeterli.

---

## 🔄 İleride Yapılacaklar

### Phase 1: Kalan Modüller (Migration 026 Tamamlama)

1. **CommissionCalculationModule** - Komisyon hesaplama kayıtları
2. **CommissionPaymentModule** - Komisyon ödeme kayıtları
3. **PartnerPerformanceModule** - Performans değerlendirmeleri
4. **PartnerKpiModule** - KPI detayları
5. **PartnerAgreementModule** - Sözleşme yönetimi
6. **SlaTrackingModule** - SLA takibi
7. **SlaBreachModule** - SLA ihlalleri

### Phase 2: İş Mantığı Genişletmeleri

1. **Komisyon Hesaplama Service**: `commission_calculation` tablosuna otomatik kayıt yapan service
2. **SLA Ölçüm Service**: Düzenli SLA ölçümleri yapan scheduled job
3. **Performans Değerlendirme Service**: Dönemsel performans değerlendirmeleri oluşturan service

### Phase 3: Raporlama ve Analitik

1. Partner komisyon raporları
2. Partner performans trend analizleri
3. SLA compliance raporları
4. Komisyon ödeme durum raporları

---

## ✅ Özet

Migration 026, Global Cargo Backend sistemine partner yönetiminin genişletilmiş altyapısını ekler. Bu migration ile:

- Partner komisyon yönetimi transactional olarak yapılabilir
- Komisyon hesaplamaları ve ödemeleri takip edilebilir
- Partner performansı düzenli olarak ölçülebilir
- SLA takibi ve ihlal yönetimi yapılabilir
- Partner sözleşmeleri versiyonlanabilir ve yönetilebilir

**Şu anda implement edilen**: `PartnerCommissionModule`

**Sonraki adım**: Kalan 7 modülün aynı pattern ile implement edilmesi
