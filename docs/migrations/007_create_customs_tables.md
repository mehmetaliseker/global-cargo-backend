# Migration 007: Gümrük İşlemleri ve Uyumluluk Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sistemi için gümrük işlemleri, belge yönetimi, vergi düzenlemeleri ve gümrük vergi hesaplamaları tablolarını oluşturur. Uluslararası kargo gönderileri için gümrük beyannamesi, belge yönetimi, ülke bazlı vergi düzenlemeleri ve risk kontrolleri için gerekli yapı kurulur.

### Oluşturulan Tablolar

1. **customs_document_type** - Gümrük belge tipleri
2. **cargo_customs_document** - Kargo-gümrük belge ilişkisi
3. **tax_regulation_version** - Vergi düzenleme versiyonları
4. **customs_tax_calculation** - Gümrük vergi hesaplamaları

## Gümrük İşlemleri Modeli Açıklaması

### Gümrük İşlemleri Nedir?

Gümrük işlemleri, uluslararası kargo gönderilerinin ülkeler arası geçişinde gerekli olan belge ve vergi işlemleridir. Her uluslararası kargo için:

- **Belge Yönetimi**: Gümrük beyannamesi, fatura, menşe şahadetnamesi vb.
- **Vergi Hesaplamaları**: Gümrük vergisi, KDV, ek vergiler
- **Risk Kontrolleri**: Ülke risk skorlarına göre kontroller
- **Uyumluluk**: Ülke bazlı gümrük düzenlemelerine uyum

### Gerçek Dünya Eşleştirmesi

#### 1. Gümrük Belge Yönetimi

1. **Belge Tipleri**:
   - **Commercial Invoice**: Ticari fatura
   - **Certificate of Origin**: Menşe şahadetnamesi
   - **Packing List**: Paket listesi
   - **Customs Declaration**: Gümrük beyannamesi
   - **Import License**: İthalat lisansı (bazı ülkeler için)
   - **Export License**: İhracat lisansı (bazı ülkeler için)

2. **Ülke Bazlı Belge Gereksinimleri**:
   - Her ülke farklı belge tipleri talep edebilir
   - Bazı belgeler tüm ülkeler için geçerli olabilir (country_specific = false)
   - Bazı belgeler sadece belirli ülkeler için gerekli olabilir (country_specific = true)

3. **Belge Doğrulama**:
   - Belgeler oluşturulduktan sonra çalışanlar tarafından doğrulanabilir
   - Doğrulanan belgeler değiştirilemez (immutable)
   - Doğrulama tarihi ve doğrulayan çalışan kaydedilir

#### 2. Kargo-Gümrük Belge İlişkisi

- Her kargo için birden fazla gümrük belgesi olabilir
- Her belge bir belge tipine bağlıdır
- Belge numarası, dosya referansı, tarih bilgileri saklanır
- JSONB formatında esnek belge verileri saklanabilir

#### 3. Vergi Düzenleme Versiyonları

- Her ülke için yıllık vergi düzenleme versiyonları
- Her versiyon için geçerlilik tarihleri (effective_from, effective_to)
- Düzenleme verileri JSONB formatında saklanır (vergi oranları, kurallar vb.)
- Aktif/pasif durumu ile versiyon yönetimi

#### 4. Gümrük Vergi Hesaplamaları

- Her kargo için gümrük vergisi hesaplaması
- Vergi bileşenleri:
  - **Customs Duty**: Gümrük vergisi
  - **VAT**: Katma Değer Vergisi (KDV)
  - **Additional Tax**: Ek vergiler
  - **Total Tax Amount**: Toplam vergi tutarı
- Ülke risk skorlarına göre otomatik risk kontrolü
- Risk skoru 80'den yüksekse hesaplama başarısız (trigger ile kontrol)

#### 5. Risk Kontrolü

- Her gümrük vergi hesaplaması için ülke risk kontrolü
- Risk skoru 80'i geçemez (trigger ile zorunlu kontrol)
- Risk kontrolü geçtiyse hesaplama kaydedilir
- Risk kontrolü geçmediyse hata fırlatılır

## Tablo İlişkileri

### Ana İlişkiler

```
customs_document_type
  └── country (country_id) - RESTRICT

cargo_customs_document
  ├── cargo (cargo_id) - CASCADE
  ├── customs_document_type (customs_document_type_id) - RESTRICT
  └── employee (verified_by) - SET NULL

tax_regulation_version
  └── country (country_id) - RESTRICT

customs_tax_calculation
  ├── cargo (cargo_id) - RESTRICT
  ├── country (country_id) - RESTRICT
  ├── shipment_type_enum (shipment_type_id) - RESTRICT
  ├── currency_enum (currency_id) - RESTRICT
  ├── tax_regulation_version (tax_regulation_version_id) - RESTRICT
  └── country_risk (country_risk_id) - SET NULL
```

### Foreign Key Stratejileri

- **RESTRICT**: Ana tablolar (cargo, country, customs_document_type) silinemez
- **CASCADE**: Cargo silinirse ilgili gümrük belgeleri silinir
- **SET NULL**: Employee veya country_risk silinirse referanslar NULL olur

## Backend Implementasyonu

### Oluşturulan Modüller

Her tablo için ayrı bir NestJS modülü oluşturulmuştur:

1. **CustomsDocumentTypeModule** - `src/customs/customs-document-type/customs-document-type.module.ts`
   - Gümrük belge tipi yönetimi
   - Ülke bazlı belge tipleri
   - Aktif belge tipleri sorgusu

2. **CargoCustomsDocumentModule** - `src/customs/cargo-customs-document/cargo-customs-document.module.ts`
   - Kargo-gümrük belge ilişkisi yönetimi
   - Belge doğrulama işlemleri
   - Kargo bazlı belge sorguları

3. **TaxRegulationVersionModule** - `src/customs/tax-regulation-version/tax-regulation-version.module.ts`
   - Vergi düzenleme versiyon yönetimi
   - Tarih bazlı aktif versiyon sorgusu
   - Ülke ve yıl bazlı sorgular

4. **CustomsTaxCalculationModule** - `src/customs/customs-tax-calculation/customs-tax-calculation.module.ts`
   - Gümrük vergi hesaplama yönetimi
   - Risk kontrolü ile hesaplama
   - Tarih aralığı bazlı sorgular

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Transaction desteği (write işlemleri için)
- JSONB veri yönetimi

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri
- Exception handling
- İş kuralı kontrolleri (risk kontrolü, doğrulama kontrolü vb.)

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

1. **Belge Yönetimi**: 
   - Belge tipleri ülke bazlı veya genel olabilir
   - Doğrulanan belgeler değiştirilemez (immutable)
   - Soft delete desteği ile belge geçmişi korunur

2. **Vergi Düzenlemeleri**: 
   - Her ülke için yıllık versiyonlar
   - Geçerlilik tarihleri ile versiyon yönetimi
   - JSONB formatında esnek düzenleme verileri

3. **Vergi Hesaplamaları**: 
   - Her hesaplama immutable (değiştirilemez)
   - Toplam vergi tutarı, bileşenlerin toplamına eşit olmalı
   - Risk kontrolü trigger ile zorunlu

4. **Risk Kontrolü**: 
   - Ülke risk skoru 80'i geçemez
   - Trigger ile otomatik kontrol
   - Risk kontrolü geçmediyse hesaplama kaydedilmez

5. **Transaction Güvenliği**: 
   - Tüm write işlemleri transaction içinde
   - Rollback desteği
   - Veri bütünlüğü garantisi

## API Genel Bakış

### Customs Document Type Endpoint'leri

- `GET /customs/document-types` - Tüm belge tiplerini listele
- `GET /customs/document-types/active` - Aktif belge tiplerini listele
- `GET /customs/document-types/country/:countryId` - Ülkeye göre belge tiplerini listele
- `GET /customs/document-types/country/:countryId/active` - Ülkeye göre aktif belge tiplerini listele
- `GET /customs/document-types/code/:code` - Kod ile belge tipi bul
- `GET /customs/document-types/:id` - ID ile belge tipi bul
- `POST /customs/document-types` - Yeni belge tipi oluştur
- `PUT /customs/document-types/:id` - Belge tipi güncelle
- `DELETE /customs/document-types/:id` - Belge tipi sil (soft delete)

### Cargo Customs Document Endpoint'leri

- `GET /customs/cargo-documents` - Tüm belgeleri listele
- `GET /customs/cargo-documents/cargo/:cargoId` - Kargoya göre belgeleri listele
- `GET /customs/cargo-documents/cargo/:cargoId/document-type/:documentTypeId` - Kargo ve belge tipine göre belge bul
- `GET /customs/cargo-documents/document-type/:documentTypeId` - Belge tipine göre belgeleri listele
- `GET /customs/cargo-documents/verified?verified=true` - Doğrulanmış belgeleri listele
- `GET /customs/cargo-documents/:id` - ID ile belge bul
- `POST /customs/cargo-documents` - Yeni belge oluştur
- `PUT /customs/cargo-documents/:id` - Belge güncelle (sadece doğrulanmamış belgeler)
- `PUT /customs/cargo-documents/:id/verify` - Belgeyi doğrula
- `DELETE /customs/cargo-documents/:id` - Belge sil (sadece doğrulanmamış belgeler)

### Tax Regulation Version Endpoint'leri

- `GET /customs/tax-regulations` - Tüm düzenlemeleri listele
- `GET /customs/tax-regulations/country/:countryId` - Ülkeye göre düzenlemeleri listele
- `GET /customs/tax-regulations/country/:countryId/active` - Ülkeye göre aktif düzenlemeleri listele
- `GET /customs/tax-regulations/country/:countryId/active/date?date=2024-01-01` - Tarih bazlı aktif düzenleme bul
- `GET /customs/tax-regulations/country/:countryId/year/:year` - Ülke ve yıla göre düzenleme bul
- `GET /customs/tax-regulations/:id` - ID ile düzenleme bul
- `POST /customs/tax-regulations` - Yeni düzenleme versiyonu oluştur
- `PUT /customs/tax-regulations/:id` - Düzenleme versiyonu güncelle
- `DELETE /customs/tax-regulations/:id` - Düzenleme versiyonu sil (soft delete)

### Customs Tax Calculation Endpoint'leri

- `GET /customs/tax-calculations` - Tüm hesaplamaları listele
- `GET /customs/tax-calculations/cargo/:cargoId` - Kargoya göre hesaplamaları listele
- `GET /customs/tax-calculations/cargo/:cargoId/latest` - Kargoya göre en son hesaplamayı getir
- `GET /customs/tax-calculations/country/:countryId` - Ülkeye göre hesaplamaları listele
- `GET /customs/tax-calculations/country/:countryId/date-range?startDate=2024-01-01&endDate=2024-12-31` - Ülke ve tarih aralığına göre hesaplamaları listele
- `GET /customs/tax-calculations/date-range?startDate=2024-01-01&endDate=2024-12-31` - Tarih aralığına göre hesaplamaları listele
- `GET /customs/tax-calculations/risk-check?passed=true` - Risk kontrolü geçmiş/geçmemiş hesaplamaları listele
- `GET /customs/tax-calculations/:id` - ID ile hesaplama bul
- `POST /customs/tax-calculations` - Yeni vergi hesaplaması oluştur (risk kontrolü otomatik)

### Örnek Response'lar

**Customs Document Type Response:**
```json
{
  "id": 1,
  "code": "COMMERCIAL_INVOICE",
  "name": "Ticari Fatura",
  "description": "Uluslararası ticari fatura belgesi",
  "requiredFields": {
    "seller_name": "string",
    "buyer_name": "string",
    "item_list": "array"
  },
  "countrySpecific": false,
  "countryId": null,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Cargo Customs Document Response:**
```json
{
  "id": 1,
  "cargoId": 10,
  "customsDocumentTypeId": 1,
  "documentNumber": "INV-2024-001",
  "documentData": {
    "seller_name": "ABC Company",
    "buyer_name": "XYZ Corp",
    "item_list": [
      {"name": "Product A", "quantity": 10, "value": 1000}
    ]
  },
  "fileReference": "files/customs/inv-2024-001.pdf",
  "issueDate": "2024-01-01T00:00:00.000Z",
  "expiryDate": null,
  "isVerified": true,
  "verifiedBy": 5,
  "verifiedAt": "2024-01-02T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "deletedAt": null
}
```

**Tax Regulation Version Response:**
```json
{
  "id": 1,
  "countryId": 1,
  "year": 2024,
  "regulationData": {
    "customs_duty_rate": 5.0,
    "vat_rate": 20.0,
    "additional_tax_rate": 0.0,
    "exempt_categories": ["books", "medicine"]
  },
  "effectiveFrom": "2024-01-01T00:00:00.000Z",
  "effectiveTo": "2024-12-31T23:59:59.000Z",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Customs Tax Calculation Response:**
```json
{
  "id": 1,
  "cargoId": 10,
  "countryId": 1,
  "shipmentTypeId": 2,
  "customsDutyAmount": 50.00,
  "vatAmount": 200.00,
  "additionalTaxAmount": 0.00,
  "totalTaxAmount": 250.00,
  "currencyId": 1,
  "taxRegulationVersionId": 1,
  "calculationDate": "2024-01-01T00:00:00.000Z",
  "countryRiskId": 5,
  "riskCheckPassed": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## İşlem Akışı

### Gümrük Belge Yönetimi Akışı

1. **Belge Tipi Tanımlama**:
   - Yeni belge tipi oluşturulur
   - Ülke bazlı veya genel olarak işaretlenir
   - Gerekli alanlar JSONB formatında tanımlanır

2. **Belge Oluşturma**:
   - Kargo için gerekli belge tipleri belirlenir
   - Her belge tipi için belge oluşturulur
   - Belge numarası, dosya referansı, tarih bilgileri girilir

3. **Belge Doğrulama**:
   - Çalışan tarafından belge doğrulanır
   - Doğrulama tarihi ve doğrulayan çalışan kaydedilir
   - Doğrulanan belgeler değiştirilemez

### Vergi Hesaplama Akışı

1. **Vergi Düzenlemesi Yükleme**:
   - Ülke için aktif vergi düzenleme versiyonu bulunur
   - Tarih bazlı aktif versiyon sorgulanır
   - Düzenleme verileri (vergi oranları) alınır

2. **Vergi Hesaplama**:
   - Kargo bilgileri (değer, ağırlık, kategori) alınır
   - Vergi oranları uygulanır
   - Gümrük vergisi, KDV, ek vergiler hesaplanır
   - Toplam vergi tutarı hesaplanır

3. **Risk Kontrolü**:
   - Ülke risk skoru kontrol edilir
   - Risk skoru 80'i geçemez (trigger ile kontrol)
   - Risk kontrolü geçtiyse hesaplama kaydedilir
   - Risk kontrolü geçmediyse hata fırlatılır

## İş Kuralları ve Validasyonlar

### Belge Yönetimi Kuralları

1. **Doğrulanmış Belge Kuralı**:
   - Doğrulanmış belgeler değiştirilemez
   - Doğrulanmış belgeler silinemez
   - Sadece doğrulanmamış belgeler güncellenebilir/silinebilir

2. **Belge Tipi Kuralı**:
   - Ülke bazlı belge tipleri için country_id zorunlu
   - Genel belge tipleri için country_id null olmalı
   - Belge tipi kodu unique olmalı

3. **Belge Tarih Kuralı**:
   - Son kullanma tarihi, düzenleme tarihinden önce olamaz

### Vergi Düzenleme Kuralları

1. **Versiyon Kuralı**:
   - Her ülke için aynı yıl için sadece bir versiyon olabilir (UNIQUE constraint)
   - Yıl 2000-2100 arası olmalı (CHECK constraint)
   - Son geçerlilik tarihi, başlangıç tarihinden önce olamaz

2. **Geçerlilik Tarihi Kuralı**:
   - Tarih bazlı sorgularda aktif ve geçerli versiyon bulunur
   - Geçerlilik tarihi aralığına göre versiyon seçilir

### Vergi Hesaplama Kuralları

1. **Toplam Tutar Kuralı**:
   - Toplam vergi tutarı = Gümrük vergisi + KDV + Ek vergiler
   - Toplam tutar, bileşenlerin toplamına eşit olmalı (tolerance: 0.01)

2. **Risk Kontrolü Kuralı**:
   - Ülke risk skoru 80'i geçemez (trigger ile kontrol)
   - Risk kontrolü geçmediyse hesaplama kaydedilmez
   - Risk kontrolü geçtiyse `risk_check_passed = true` olarak kaydedilir

3. **Immutable Kuralı**:
   - Hesaplamalar oluşturulduktan sonra değiştirilemez
   - Sadece yeni hesaplama oluşturulabilir
   - En son hesaplama sorgusu ile güncel hesaplama bulunur

## SQL Kullanım Örnekleri

### Transaction İle Belge Oluşturma

```typescript
// Service katmanında
await this.cargoCustomsDocumentRepository.create(
  cargoId,
  documentTypeId,
  documentNumber,
  documentData,
  fileReference,
  issueDate,
  expiryDate
);
```

### Risk Kontrolü ile Vergi Hesaplama

```typescript
// Service katmanında
await this.customsTaxCalculationRepository.create(
  cargoId,
  countryId,
  shipmentTypeId,
  customsDutyAmount,
  vatAmount,
  additionalTaxAmount,
  totalTaxAmount,
  currencyId,
  taxRegulationVersionId,
  countryRiskId,
  riskCheckPassed
);
// Trigger otomatik olarak risk kontrolü yapar
```

### Tarih Bazlı Aktif Vergi Düzenlemesi Bulma

```typescript
// Service katmanında
const regulation = await this.taxRegulationVersionRepository
  .findActiveByCountryIdAndDate(countryId, new Date());
```

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, uluslararası kargo yönetiminin gümrük işlemlerini destekler:

1. **Belge Yönetimi**: Gümrük belgeleri ve doğrulama
2. **Vergi Hesaplamaları**: Ülke bazlı vergi hesaplamaları
3. **Risk Kontrolü**: Ülke risk skorlarına göre otomatik kontrol
4. **Uyumluluk**: Ülke bazlı gümrük düzenlemelerine uyum

### Migration 001-006 ile İlişkisi

- **Migration 001**: Enum tabloları (currency, shipment_type)
- **Migration 002**: Lokasyon hiyerarşisi (country tablosu)
- **Migration 003**: Actor sistemi (employee - belge doğrulama için)
- **Migration 005**: Cargo tablosu (gümrük belgeleri ve hesaplamalar için)
- **Migration 006**: Pricing calculation (gümrük maliyeti ile entegre)

### Gelecek Migration'larla İlişkisi

- **Migration 008**: Sigorta ve rota tabloları (gümrük ile entegre)
- **Migration 016**: Authentication tabloları (belge doğrulama için)
- **Migration 028**: Kalite ve uyumluluk tabloları (gümrük uyumluluğu ile)

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Ana tablolar (cargo, country, customs_document_type) silinemez
  - CASCADE: Cargo silinirse gümrük belgeleri silinir
  - SET NULL: Employee veya country_risk silinirse referanslar NULL olur
- **Unique Constraints**: 
  - customs_document_type: code
  - tax_regulation_version: country_id, year
- **Check Constraints**: 
  - tax_regulation_version: year >= 2000 AND year <= 2100
  - tax_regulation_version: effective_to IS NULL OR effective_to >= effective_from
- **Triggers**: 
  - `check_country_risk_threshold`: Risk skoru 80'i geçemez kontrolü
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Time-based Index'ler**: Calculation date, issue date, expiry date için index'ler
- **Composite Index'ler**: Country ID, year, cargo ID, document type ID için index'ler

## Gelecek Gümrük API Entegrasyonu

### Hazırlık

1. **Belge Yönetimi**: Belge tipleri ve yapıları tanımlı
2. **Vergi Hesaplamaları**: Vergi hesaplama yapısı hazır
3. **Risk Kontrolü**: Otomatik risk kontrolü mevcut
4. **Versiyon Yönetimi**: Vergi düzenleme versiyonları yönetilebilir

### Entegrasyon Noktaları

1. **Gümrük API'leri**: 
   - Ülke bazlı gümrük API'leri entegre edilebilir
   - Belge gönderimi ve doğrulama
   - Otomatik vergi hesaplama

2. **Belge Yönetimi**: 
   - Belge upload ve download
   - Belge doğrulama akışları
   - Belge şablonları

3. **Vergi Hesaplama**: 
   - Gerçek zamanlı vergi hesaplama
   - Vergi düzenleme versiyonları güncelleme
   - Vergi raporlama

4. **Risk Yönetimi**: 
   - Gerçek zamanlı risk skoru güncelleme
   - Risk bazlı uyarılar
   - Risk raporlama

## Cargo ve Billing Entegrasyonu

### Cargo Entegrasyonu

- Her uluslararası kargo için gümrük belgeleri oluşturulabilir
- Kargo silinirse gümrük belgeleri otomatik silinir (CASCADE)
- Gümrük vergi hesaplamaları kargo bazlı sorgulanabilir

### Billing Entegrasyonu

- Gümrük vergi hesaplamaları `pricing_calculation` tablosundaki `customs_cost` ile ilişkilendirilebilir
- Gümrük maliyetleri fiyatlandırma hesaplamalarına dahil edilir
- Faturalarda gümrük maliyetleri gösterilebilir

## Notlar

- Tüm para tutarları DECIMAL tipinde, float kullanılmaz
- Doğrulanmış belgeler değiştirilemez (immutable)
- Vergi hesaplamaları oluşturulduktan sonra değiştirilemez (immutable)
- Risk kontrolü trigger ile otomatik yapılır
- Vergi düzenleme verileri JSONB formatında (esnek yapı)
- Belge verileri JSONB formatında (esnek yapı)
- Soft delete ile geçmiş veriler korunur

