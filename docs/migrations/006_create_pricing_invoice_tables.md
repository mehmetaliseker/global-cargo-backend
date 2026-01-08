# Migration 006: Fiyatlandırma ve Fatura Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sistemi için fiyatlandırma, fatura ve ödeme yönetimi tablolarını oluşturur. Kargo gönderileri için fiyat hesaplama, fatura oluşturma, ödeme takibi ve iade yönetimi için gerekli yapı kurulur.

### Oluşturulan Tablolar

1. **pricing_calculation** - Fiyat hesaplama tablosu
2. **pricing_calculation_detail** - Fiyat hesaplama detayları
3. **institution_agreement** - Kurum anlaşmaları
4. **invoice** - Fatura tablosu
5. **payment** - Ödeme tablosu
6. **payment_refund** - Ödeme iadesi tablosu

## Fiyatlandırma Modeli Açıklaması

### Fiyatlandırma Nedir?

Fiyatlandırma, kargo gönderilerinin maliyetini hesaplama sürecidir. Her kargo için:
- **Base Price**: Temel fiyat
- **Shipping Cost**: Kargo taşıma maliyeti
- **Insurance Cost**: Sigorta maliyeti
- **Tax Cost**: Vergi maliyeti
- **Customs Cost**: Gümrük maliyeti
- **Total Amount**: Toplam tutar

### Gerçek Dünya Eşleştirmesi

#### 1. Fiyat Hesaplama Süreci

1. **Kargo Bilgileri**: 
   - Ağırlık, boyutlar
   - Başlangıç ve varış ülkeleri
   - Kargo tipi ve gönderi tipi
   - Beyan edilen değer

2. **Fiyat Bileşenleri**:
   - **Base Price**: Mesafe ve ağırlığa göre temel fiyat
   - **Shipping Cost**: Taşıma maliyeti (hava, kara, deniz)
   - **Insurance Cost**: Değer beyanına göre sigorta
   - **Tax Cost**: Ülke bazlı vergiler
   - **Customs Cost**: Gümrük işlemleri (uluslararası gönderiler için)

3. **Hesaplama Detayları**:
   - Her maliyet bileşeni `pricing_calculation_detail` tablosuna kaydedilir
   - Hesaplama faktörleri JSONB formatında saklanır
   - Gelecekte farklı fiyatlandırma kuralları eklenebilir

#### 2. Kurum Anlaşmaları

- Büyük müşteriler (kurumlar) için özel indirim anlaşmaları
- Anlaşma özellikleri:
  - İndirim yüzdesi (0-100%)
  - Geçerlilik tarihleri
  - Otomatik uygulama seçeneği
  - Aktif/pasif durumu

#### 3. Fatura Oluşturma

- Her kargo için fatura oluşturulabilir
- Fatura türleri:
  - **Main Invoice**: Ana fatura
  - **Additional Invoice**: Ek fatura (ek hizmetler için)
- Fatura içeriği:
  - Subtotal (ara toplam)
  - Tax Amount (vergi)
  - Discount Amount (indirim)
  - Total Amount (toplam)

#### 4. Ödeme Yönetimi

- Faturalar için ödeme kayıtları
- Ödeme yöntemleri: Nakit, kredi kartı, banka havalesi (enum'dan)
- Ödeme durumları: Beklemede, ödendi, başarısız (enum'dan)
- Güvenlik:
  - Kart bilgileri maskelenmiş veya şifrelenmiş
  - Transaction ID ile ödeme takibi

#### 5. İade Yönetimi

- Ödemeler için iade talepleri
- İade süreci:
  - İade nedeni
  - İade tutarı
  - İade durumu (pending, approved, rejected)
  - İşlem tarihi ve onaylayan çalışan

## Tablo İlişkileri

### Ana İlişkiler

```
pricing_calculation
  ├── cargo (cargo_id) - RESTRICT
  ├── currency_enum (currency_id) - RESTRICT
  ├── shipment_type_enum (shipment_type_id) - RESTRICT
  └── employee (calculated_by) - SET NULL

pricing_calculation_detail
  └── pricing_calculation (pricing_calculation_id) - CASCADE

invoice
  ├── cargo (cargo_id) - RESTRICT
  ├── currency_enum (currency_id) - RESTRICT
  └── institution_agreement (institution_agreement_id) - SET NULL

payment
  ├── invoice (invoice_id) - RESTRICT
  ├── cargo (cargo_id) - RESTRICT
  ├── payment_method_enum (payment_method_id) - RESTRICT
  ├── payment_status_enum (payment_status_id) - RESTRICT
  ├── currency_enum (currency_id) - RESTRICT
  └── employee (approved_by) - SET NULL

payment_refund
  ├── payment (payment_id) - RESTRICT
  └── employee (processed_by) - SET NULL
```

### Foreign Key Stratejileri

- **RESTRICT**: Ana tablolar (cargo, invoice, payment) silinemez
- **CASCADE**: Pricing calculation silinirse detaylar silinir
- **SET NULL**: Employee veya institution agreement silinirse referanslar NULL olur

## Backend Implementasyonu

### Oluşturulan Modüller

Her tablo için ayrı bir NestJS modülü oluşturulmuştur:

1. **PricingCalculationModule** - `src/billing/pricing-calculation/pricing-calculation.module.ts`
   - Fiyat hesaplama yönetimi
   - Kargo bazlı fiyat hesaplamaları
   - En son hesaplama sorgusu

2. **PricingCalculationDetailModule** - `src/billing/pricing-calculation-detail/pricing-calculation-detail.module.ts`
   - Fiyat hesaplama detayları
   - Maliyet tipi bazlı filtreleme
   - JSONB calculation_factor desteği

3. **InstitutionAgreementModule** - `src/billing/institution-agreement/institution-agreement.module.ts`
   - Kurum anlaşması yönetimi
   - Aktif ve geçerli anlaşmalar
   - Otomatik uygulama desteği

4. **InvoiceModule** - `src/billing/invoice/invoice.module.ts`
   - Fatura yönetimi
   - Fatura numarası ile arama
   - Ana fatura sorgusu

5. **PaymentModule** - `src/billing/payment/payment.module.ts`
   - Ödeme yönetimi
   - Transaction ID ile arama
   - Ödeme durumu bazlı filtreleme

6. **PaymentRefundModule** - `src/billing/payment-refund/payment-refund.module.ts`
   - İade yönetimi
   - İade durumu bazlı filtreleme

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Decimal handling (DECIMAL -> number dönüşümü)

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri (parseFloat)
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları
- Read-only endpoint'ler (şimdilik)

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları (@Min)
- Date string validasyonları

### Tasarım Kararları

1. **Decimal Precision**: 
   - Tüm para tutarları DECIMAL(15, 2) tipinde
   - DTO'da parseFloat ile number'a dönüştürülür
   - Float kullanılmaz (hassas para hesaplamaları için)

2. **Fiyat Hesaplama**: 
   - Her hesaplama immutable (değiştirilemez)
   - Detaylar JSONB formatında saklanır
   - Gelecekte farklı fiyatlandırma kuralları eklenebilir

3. **Fatura Yönetimi**: 
   - Fatura numarası unique
   - Ana fatura ve ek fatura ayrımı
   - Kurum anlaşması ile otomatik indirim

4. **Ödeme Güvenliği**: 
   - Kart bilgileri maskelenmiş veya şifrelenmiş
   - BYTEA tipinde şifrelenmiş veriler
   - Transaction ID ile takip

5. **İade Yönetimi**: 
   - Her ödeme için birden fazla iade talebi olabilir
   - İade durumu takibi
   - Onay süreci (employee tarafından)

## API Genel Bakış

### Pricing Calculation Endpoint'leri

- `GET /billing/pricing-calculations` - Tüm fiyat hesaplamalarını listele
- `GET /billing/pricing-calculations/cargo/:cargoId` - Kargoya göre fiyat hesaplamalarını listele
- `GET /billing/pricing-calculations/cargo/:cargoId/latest` - Kargoya göre en son fiyat hesaplamasını getir
- `GET /billing/pricing-calculations/uuid/:uuid` - UUID ile fiyat hesaplaması bul
- `GET /billing/pricing-calculations/:id` - ID ile fiyat hesaplaması bul

### Pricing Calculation Detail Endpoint'leri

- `GET /billing/pricing-calculation-details` - Tüm detayları listele
- `GET /billing/pricing-calculation-details/pricing-calculation/:pricingCalculationId` - Fiyat hesaplamasına göre detayları listele
- `GET /billing/pricing-calculation-details/cost-type/:costType` - Maliyet tipine göre detayları listele
- `GET /billing/pricing-calculation-details/:id` - ID ile detay bul

### Institution Agreement Endpoint'leri

- `GET /billing/institution-agreements` - Tüm kurum anlaşmalarını listele
- `GET /billing/institution-agreements/active` - Aktif kurum anlaşmalarını listele
- `GET /billing/institution-agreements/active-valid` - Aktif ve geçerli kurum anlaşmalarını listele
- `GET /billing/institution-agreements/institution-code/:institutionCode` - Kurum koduna göre anlaşma bul
- `GET /billing/institution-agreements/uuid/:uuid` - UUID ile anlaşma bul
- `GET /billing/institution-agreements/:id` - ID ile anlaşma bul

### Invoice Endpoint'leri

- `GET /billing/invoices` - Tüm faturaları listele
- `GET /billing/invoices/invoice-number/:invoiceNumber` - Fatura numarası ile fatura bul
- `GET /billing/invoices/cargo/:cargoId` - Kargoya göre faturaları listele
- `GET /billing/invoices/cargo/:cargoId/main` - Kargoya göre ana faturayı getir
- `GET /billing/invoices/institution-agreement/:institutionAgreementId` - Kurum anlaşmasına göre faturaları listele
- `GET /billing/invoices/uuid/:uuid` - UUID ile fatura bul
- `GET /billing/invoices/:id` - ID ile fatura bul

### Payment Endpoint'leri

- `GET /billing/payments` - Tüm ödemeleri listele
- `GET /billing/payments/invoice/:invoiceId` - Faturaya göre ödemeleri listele
- `GET /billing/payments/cargo/:cargoId` - Kargoya göre ödemeleri listele
- `GET /billing/payments/payment-status/:paymentStatusId` - Ödeme durumuna göre ödemeleri listele
- `GET /billing/payments/transaction/:transactionId` - Transaction ID ile ödeme bul
- `GET /billing/payments/uuid/:uuid` - UUID ile ödeme bul
- `GET /billing/payments/:id` - ID ile ödeme bul

### Payment Refund Endpoint'leri

- `GET /billing/payment-refunds` - Tüm iade taleplerini listele
- `GET /billing/payment-refunds/payment/:paymentId` - Ödemeye göre iade taleplerini listele
- `GET /billing/payment-refunds/refund-status/:refundStatus` - İade durumuna göre iade taleplerini listele
- `GET /billing/payment-refunds/:id` - ID ile iade talebi bul

### Örnek Response'lar

**Pricing Calculation Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "cargoId": 10,
  "basePrice": 100.00,
  "shippingCost": 50.00,
  "insuranceCost": 10.00,
  "taxCost": 20.00,
  "customsCost": 5.00,
  "totalAmount": 185.00,
  "currencyId": 1,
  "shipmentTypeId": 2,
  "calculationTimestamp": "2024-01-01T00:00:00.000Z",
  "calculatedBy": 5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Invoice Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "cargoId": 10,
  "invoiceNumber": "INV-2024-001",
  "invoiceDate": "2024-01-01T00:00:00.000Z",
  "isMainInvoice": true,
  "isAdditionalInvoice": false,
  "invoiceType": "STANDARD",
  "subtotal": 185.00,
  "taxAmount": 20.00,
  "discountAmount": 10.00,
  "totalAmount": 195.00,
  "currencyId": 1,
  "institutionAgreementId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Payment Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440002",
  "invoiceId": 1,
  "cargoId": 10,
  "paymentMethodId": 2,
  "paymentStatusId": 2,
  "amount": 195.00,
  "currencyId": 1,
  "maskedCardNumber": "**** **** **** 1234",
  "cardLastFour": "1234",
  "cardToken": null,
  "transactionId": "TXN-2024-001",
  "transactionDate": "2024-01-01T00:00:00.000Z",
  "approvalStatus": "approved",
  "approvedAt": "2024-01-01T00:00:00.000Z",
  "approvedBy": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

## İşlem Akışı

### Fiyatlandırma Akışı

1. **Kargo Oluşturulduktan Sonra**:
   - Kargo bilgileri (ağırlık, boyutlar, mesafe) alınır
   - Fiyatlandırma kuralları uygulanır
   - `pricing_calculation` tablosuna kayıt eklenir
   - Her maliyet bileşeni `pricing_calculation_detail` tablosuna kaydedilir

2. **Kurum Anlaşması Kontrolü**:
   - Müşteri kurum anlaşmasına sahip mi?
   - Anlaşma aktif ve geçerli mi?
   - Otomatik uygulama var mı?
   - İndirim yüzdesi uygulanır

3. **Fatura Oluşturma**:
   - Fiyat hesaplamasından fatura oluşturulur
   - Fatura numarası otomatik oluşturulur
   - Kurum anlaşması varsa indirim uygulanır
   - Toplam tutar hesaplanır

### Ödeme Akışı

1. **Ödeme Kaydı Oluşturma**:
   - Fatura için ödeme kaydı oluşturulur
   - Ödeme yöntemi seçilir
   - Ödeme durumu "pending" olarak başlar

2. **Ödeme İşlemi**:
   - Ödeme sağlayıcıya gönderilir (gelecekte)
   - Transaction ID alınır
   - Ödeme durumu güncellenir

3. **Onay Süreci**:
   - Ödeme onaylandığında `approved_at` ve `approved_by` doldurulur
   - Approval status güncellenir

### İade Akışı

1. **İade Talebi**:
   - Ödeme için iade talebi oluşturulur
   - İade nedeni belirtilir
   - İade durumu "pending" olarak başlar

2. **İade İşlemi**:
   - Çalışan tarafından iade onaylanır veya reddedilir
   - İşlem tarihi kaydedilir
   - İade durumu güncellenir

## Finansal Veri Bütünlüğü Kuralları

### Para Tutarları

- **DECIMAL Kullanımı**: Tüm para tutarları DECIMAL(15, 2) tipinde
- **Float Kullanılmaz**: Hassas hesaplamalar için float kullanılmaz
- **ParseFloat Dönüşümü**: DTO'da parseFloat ile number'a dönüştürülür
- **Min Validation**: Tutarlar 0'dan büyük olmalı (@Min(0.01))

### Fatura Bütünlüğü

- **Immutable Faturalar**: Ödeme yapıldıktan sonra fatura değiştirilemez
- **Unique Invoice Number**: Her fatura numarası benzersiz
- **Main Invoice**: Her kargo için bir ana fatura olabilir
- **Additional Invoice**: Ek faturalar ana faturaya eklenebilir

### Ödeme Güvenliği

- **Kart Bilgileri**: Maskelenmiş veya şifrelenmiş saklanır
- **BYTEA**: Hassas veriler BYTEA tipinde şifrelenmiş
- **Transaction ID**: Ödeme takibi için transaction ID zorunlu
- **Approval Process**: Ödeme onay süreci zorunlu

### İade Yönetimi

- **İade Tutarı**: Ödeme tutarından fazla olamaz
- **İade Durumu**: pending → approved/rejected
- **Onay Zorunluluğu**: İade işlemi çalışan onayı gerektirir

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, finansal yönetimin temelini oluşturur:

1. **Fiyatlandırma**: Kargo gönderileri için fiyat hesaplama
2. **Fatura Yönetimi**: Fatura oluşturma ve takibi
3. **Ödeme Yönetimi**: Ödeme kayıtları ve takibi
4. **İade Yönetimi**: Ödeme iadeleri

### Migration 001-005 ile İlişkisi

- **Migration 001**: Enum tabloları (currency, payment_method, payment_status, shipment_type)
- **Migration 002**: Lokasyon hiyerarşisi (mesafe hesaplama için)
- **Migration 003**: Actor sistemi (customer, employee)
- **Migration 005**: Cargo tablosu (fiyatlandırma ve fatura için)

### Gelecek Migration'larla İlişkisi

- **Migration 008**: Sigorta ve rota tabloları (fiyatlandırma ile entegre)
- **Migration 016**: Authentication tabloları (ödeme işlemleri için)
- **Migration 027**: Bütçe ve finans tabloları (raporlama için)

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Ana tablolar (cargo, invoice, payment) silinemez
  - CASCADE: Pricing calculation silinirse detaylar silinir
  - SET NULL: Employee veya institution agreement silinirse referanslar NULL olur
- **Unique Constraints**: 
  - invoice: invoice_number
  - institution_agreement: institution_code
- **Check Constraints**: 
  - institution_agreement: discount_percentage (0-100), valid_to >= valid_from
  - invoice: is_main_invoice != is_additional_invoice
  - payment: amount > 0
  - payment_refund: refund_amount > 0
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Time-based Index'ler**: Transaction date, invoice date için index'ler
- **Composite Index'ler**: Cargo ID, invoice ID için index'ler

## Gelecek Ödeme Sağlayıcı Entegrasyonu

### Hazırlık

1. **Transaction ID**: Her ödeme için transaction ID saklanır
2. **Card Token**: Kart token'ları saklanabilir (tekrar ödeme için)
3. **Approval Status**: Ödeme onay durumu takip edilir
4. **Payment Status**: Ödeme durumu enum'dan seçilir

### Entegrasyon Noktaları

1. **Payment Gateway**: 
   - Ödeme sağlayıcı API'leri entegre edilebilir
   - Transaction ID ile ödeme takibi
   - Webhook desteği (gelecekte)

2. **Card Processing**: 
   - PCI-DSS uyumluluğu için hazır
   - Kart bilgileri şifrelenmiş saklanır
   - Tokenization desteği

3. **Refund Processing**: 
   - İade işlemleri ödeme sağlayıcıya entegre edilebilir
   - İade durumu takibi
   - Onay süreci

## Notlar

- Tüm para tutarları DECIMAL tipinde, float kullanılmaz
- Faturalar ödeme yapıldıktan sonra değiştirilemez (immutable)
- Kart bilgileri güvenli şekilde saklanır (maskelenmiş veya şifrelenmiş)
- Fiyatlandırma detayları JSONB formatında (esnek yapı)
- Kurum anlaşmaları otomatik uygulanabilir
- İade işlemleri onay süreci gerektirir

