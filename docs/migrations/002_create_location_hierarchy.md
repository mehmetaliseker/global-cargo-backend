# Migration 002: Lokasyon Hiyerarşisi

## Migration Özeti

Bu migration, global kargo yönetim sistemi için lokasyon hiyerarşisini oluşturur. Ülke, bölge, şehir, ilçe, şube ve dağıtım merkezi tabloları ile coğrafi hiyerarşi yapısı kurulur.

### Oluşturulan Tablolar

1. **country** - Ülke tablosu
2. **country_risk** - Ülke risk seviyesi tablosu
3. **region** - Bölge/Eyalet tablosu
4. **city** - Şehir tablosu
5. **district** - İlçe tablosu
6. **branch** - Şube tablosu
7. **distribution_center** - Dağıtım merkezi tablosu

## Domain Açıklaması

### Lokasyon Hiyerarşisi

Lokasyon hiyerarşisi, kargo yönetim sisteminin temel yapı taşlarından biridir. Gönderilerin nereden nereye gideceğini, şubelerin konumlarını ve dağıtım merkezlerinin yerlerini belirler.

### Hiyerarşik Yapı

```
Country (Ülke)
  └── Region (Bölge/Eyalet)
      └── City (Şehir)
          └── District (İlçe)
              └── Branch (Şube)

Country (Ülke)
  └── Distribution Center (Dağıtım Merkezi)
      └── City (Şehir) [opsiyonel]
```

### Ülke (country)

Sistemde desteklenen ülkeleri tutar. Her ülke için:
- **uuid**: Benzersiz tanımlayıcı (UUID)
- **iso_code**: ISO 3166-1 alpha-3 kodu (3 karakter, örn: USA, TUR)
- **iso_code_2**: ISO 3166-1 alpha-2 kodu (2 karakter, örn: US, TR)
- **name**: Ülke adı
- **is_active**: Aktif mi?

**Gerçek Dünya Anlamı**: Kargo operasyonlarının yapıldığı ülkeler. Her ülke için farklı gümrük kuralları, vergi yapıları ve lojistik ağları olabilir.

### Ülke Riski (country_risk)

Ülkelerin risk seviyelerini tutar. Her ülke için bir risk kaydı olabilir:
- **country_id**: Ülke referansı (UNIQUE)
- **risk_level**: Risk seviyesi (örn: LOW, MEDIUM, HIGH)
- **risk_score**: Risk skoru (0-100 arası)

**Gerçek Dünya Anlamı**: 
- Yüksek riskli ülkeler için ek sigorta gerekebilir
- Gümrük işlemleri daha uzun sürebilir
- Özel belgeler gerekebilir
- Fiyatlandırma etkilenebilir

### Bölge (region)

Ülkelerin bölgelerini/eyaletlerini tutar. Her bölge bir ülkeye aittir:
- **uuid**: Benzersiz tanımlayıcı
- **country_id**: Ülke referansı (RESTRICT - ülke silinemez)
- **name**: Bölge adı
- **code**: Bölge kodu (opsiyonel)

**Gerçek Dünya Anlamı**: 
- Türkiye için: İstanbul, Ankara, İzmir gibi bölgeler
- ABD için: California, Texas, New York gibi eyaletler
- Almanya için: Bayern, Nordrhein-Westfalen gibi eyaletler

### Şehir (city)

Bölgelerin şehirlerini tutar. Her şehir bir bölgeye aittir:
- **uuid**: Benzersiz tanımlayıcı
- **region_id**: Bölge referansı (RESTRICT)
- **name**: Şehir adı
- **code**: Şehir kodu (opsiyonel)

**Gerçek Dünya Anlamı**: 
- Gönderilerin varış/kalkış noktaları
- Şubelerin bulunduğu şehirler
- Dağıtım merkezlerinin konumları

### İlçe (district)

Şehirlerin ilçelerini tutar. Her ilçe bir şehre aittir:
- **uuid**: Benzersiz tanımlayıcı
- **city_id**: Şehir referansı (RESTRICT)
- **name**: İlçe adı
- **code**: İlçe kodu (opsiyonel)

**Gerçek Dünya Anlamı**: 
- Şubelerin tam konumları
- Adres detaylandırması
- Bölgesel fiyatlandırma

### Şube (branch)

İlçelerde bulunan şubeleri tutar. Her şube bir ilçeye aittir:
- **uuid**: Benzersiz tanımlayıcı
- **district_id**: İlçe referansı (RESTRICT)
- **name**: Şube adı
- **code**: Şube kodu (opsiyonel)
- **address**: Şube adresi
- **phone**: Telefon numarası
- **email**: E-posta adresi
- **is_active**: Aktif mi?

**Gerçek Dünya Anlamı**: 
- Müşterilerin kargo teslim alabileceği fiziksel lokasyonlar
- Kargo toplama noktaları
- Müşteri hizmetleri noktaları

### Dağıtım Merkezi (distribution_center)

Ülke bazında dağıtım merkezlerini tutar. Şehir bazlı da olabilir:
- **uuid**: Benzersiz tanımlayıcı
- **country_id**: Ülke referansı (RESTRICT)
- **city_id**: Şehir referansı (opsiyonel, RESTRICT)
- **name**: Dağıtım merkezi adı
- **code**: Dağıtım merkezi kodu (UNIQUE)
- **address**: Adres
- **latitude**: Enlem (GPS koordinatı)
- **longitude**: Boylam (GPS koordinatı)
- **is_active**: Aktif mi?
- **is_transfer_point**: Transfer noktası mı?

**Gerçek Dünya Anlamı**: 
- Kargoların toplandığı ve dağıtıldığı ana merkezler
- Transfer noktaları: Kargoların aktarıldığı hub'lar
- Rotalama ve lojistik planlamanın merkezi

## Backend Implementasyonu

### Oluşturulan Modüller

Her lokasyon tablosu için ayrı bir NestJS modülü oluşturulmuştur:

1. **CountryModule** - `src/location/country/country.module.ts`
2. **CountryRiskModule** - `src/location/country-risk/country-risk.module.ts`
3. **RegionModule** - `src/location/region/region.module.ts`
4. **CityModule** - `src/location/city/city.module.ts`
5. **DistrictModule** - `src/location/district/district.module.ts`
6. **BranchModule** - `src/location/branch/branch.module.ts`
7. **DistributionCenterModule** - `src/location/distribution-center/distribution-center.module.ts`

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

**Interface**: Entity tipi ve repository metodları tanımlanır
```typescript
interface ICountryRepository {
  findAll(): Promise<CountryEntity[]>;
  findById(id: number): Promise<CountryEntity | null>;
  findByUuid(uuid: string): Promise<CountryEntity | null>;
  findByIsoCode(isoCode: string): Promise<CountryEntity | null>;
  findByIsoCode2(isoCode2: string): Promise<CountryEntity | null>;
  findActive(): Promise<CountryEntity[]>;
}
```

**Implementation**: Raw SQL sorguları ile veritabanı işlemleri yapılır
- Soft delete desteği (`deleted_at IS NULL`)
- Hiyerarşik sorgular (parent-child ilişkileri)
- Index'ler ile optimize edilmiş sorgular

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping (snake_case -> camelCase)
- Exception handling (NotFoundException)
- Hiyerarşik veri filtreleme

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları (ParseIntPipe)
- Hiyerarşik endpoint'ler (örn: `/country/:countryId/regions`)

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- UUID, email, koordinat validasyonları

### Tasarım Kararları

1. **Hiyerarşik Sorgular**: Parent-child ilişkileri için özel metodlar
   - `findByCountryId()` - Bir ülkenin tüm bölgelerini getir
   - `findByRegionId()` - Bir bölgenin tüm şehirlerini getir
   - `findByCityId()` - Bir şehrin tüm ilçelerini getir
   - `findByDistrictId()` - Bir ilçenin tüm şubelerini getir

2. **Foreign Key Constraints**: 
   - RESTRICT: Parent silinemez (veri bütünlüğü)
   - CASCADE: Parent silinirse child'lar da silinir (country_risk)

3. **UUID Desteği**: Tüm lokasyon tablolarında UUID alanı mevcuttur
   - Güvenli referanslar (ID yerine UUID kullanımı)
   - Dağıtık sistem desteği

4. **Soft Delete**: Tüm tablolarda `deleted_at` alanı ile soft delete
5. **Aktif/Pasif Yönetimi**: `is_active` alanı ile kayıtlar aktif/pasif yapılabilir
6. **Index Optimizasyonu**: Sık kullanılan sorgular için index'ler oluşturulmuştur

## API Genel Bakış

### Ülke Endpoint'leri

- `GET /location/countries` - Tüm ülkeleri listele
- `GET /location/countries/active` - Aktif ülkeleri listele
- `GET /location/countries/iso-code/:isoCode` - ISO code ile ülke bul
- `GET /location/countries/iso-code-2/:isoCode2` - ISO code 2 ile ülke bul
- `GET /location/countries/uuid/:uuid` - UUID ile ülke bul
- `GET /location/countries/:id` - ID ile ülke bul

### Ülke Riski Endpoint'leri

- `GET /location/country-risks` - Tüm ülke risklerini listele
- `GET /location/country-risks/country/:countryId` - Ülke ID'sine göre risk bul
- `GET /location/country-risks/:id` - ID ile risk bul

### Bölge Endpoint'leri

- `GET /location/regions` - Tüm bölgeleri listele
- `GET /location/regions/active` - Aktif bölgeleri listele
- `GET /location/regions/country/:countryId` - Ülkeye göre bölgeleri listele
- `GET /location/regions/country/:countryId/active` - Ülkeye göre aktif bölgeleri listele
- `GET /location/regions/uuid/:uuid` - UUID ile bölge bul
- `GET /location/regions/:id` - ID ile bölge bul

### Şehir Endpoint'leri

- `GET /location/cities` - Tüm şehirleri listele
- `GET /location/cities/active` - Aktif şehirleri listele
- `GET /location/cities/region/:regionId` - Bölgeye göre şehirleri listele
- `GET /location/cities/region/:regionId/active` - Bölgeye göre aktif şehirleri listele
- `GET /location/cities/uuid/:uuid` - UUID ile şehir bul
- `GET /location/cities/:id` - ID ile şehir bul

### İlçe Endpoint'leri

- `GET /location/districts` - Tüm ilçeleri listele
- `GET /location/districts/active` - Aktif ilçeleri listele
- `GET /location/districts/city/:cityId` - Şehre göre ilçeleri listele
- `GET /location/districts/city/:cityId/active` - Şehre göre aktif ilçeleri listele
- `GET /location/districts/uuid/:uuid` - UUID ile ilçe bul
- `GET /location/districts/:id` - ID ile ilçe bul

### Şube Endpoint'leri

- `GET /location/branches` - Tüm şubeleri listele
- `GET /location/branches/active` - Aktif şubeleri listele
- `GET /location/branches/district/:districtId` - İlçeye göre şubeleri listele
- `GET /location/branches/district/:districtId/active` - İlçeye göre aktif şubeleri listele
- `GET /location/branches/uuid/:uuid` - UUID ile şube bul
- `GET /location/branches/:id` - ID ile şube bul

### Dağıtım Merkezi Endpoint'leri

- `GET /location/distribution-centers` - Tüm dağıtım merkezlerini listele
- `GET /location/distribution-centers/active` - Aktif dağıtım merkezlerini listele
- `GET /location/distribution-centers/transfer-points` - Transfer noktalarını listele
- `GET /location/distribution-centers/country/:countryId` - Ülkeye göre dağıtım merkezlerini listele
- `GET /location/distribution-centers/country/:countryId/active` - Ülkeye göre aktif dağıtım merkezlerini listele
- `GET /location/distribution-centers/city/:cityId` - Şehre göre dağıtım merkezlerini listele
- `GET /location/distribution-centers/uuid/:uuid` - UUID ile dağıtım merkezi bul
- `GET /location/distribution-centers/:id` - ID ile dağıtım merkezi bul

### Örnek Response

**Ülke Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "isoCode": "TUR",
  "isoCode2": "TR",
  "name": "Türkiye",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Şube Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "districtId": 5,
  "name": "Kadıköy Şubesi",
  "code": "IST-KAD",
  "address": "Bağdat Caddesi No:123, Kadıköy/İstanbul",
  "phone": "+90 216 123 45 67",
  "email": "kadikoy@globalcargo.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Dağıtım Merkezi Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440002",
  "countryId": 1,
  "cityId": 10,
  "name": "İstanbul Ana Dağıtım Merkezi",
  "code": "IST-HUB-01",
  "address": "İstanbul Lojistik Merkezi",
  "latitude": 41.0082,
  "longitude": 28.9784,
  "isActive": true,
  "isTransferPoint": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

### Validation Kuralları

- **ID**: Pozitif tam sayı olmalı (ParseIntPipe)
- **UUID**: Geçerli UUID formatında olmalı
- **ISO Code**: 3 karakter (ISO 3166-1 alpha-3)
- **ISO Code 2**: 2 karakter (ISO 3166-1 alpha-2)
- **Email**: Geçerli e-posta formatında olmalı (şube için)
- **Latitude**: -90 ile 90 arasında olmalı
- **Longitude**: -180 ile 180 arasında olmalı
- **Risk Score**: 0 ile 100 arasında olmalı

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, lokasyon yönetiminin temelini oluşturur:

1. **Coğrafi Hiyerarşi**: Ülke -> Bölge -> Şehir -> İlçe -> Şube hiyerarşisi
2. **Şube Yönetimi**: Fiziksel şubelerin konumları ve iletişim bilgileri
3. **Dağıtım Merkezleri**: Ana hub'lar ve transfer noktaları
4. **Risk Yönetimi**: Ülke bazlı risk seviyeleri

### Gelecek Migration'larla İlişkisi

- **Migration 003**: Actor tabloları bu lokasyonları referans alacak (müşteri adresleri, çalışan lokasyonları)
- **Migration 005**: Cargo tabloları gönderi başlangıç/varış lokasyonlarını referans alacak
- **Migration 008**: Route tabloları lokasyonlar arası rotaları tanımlayacak
- **Migration 019**: Warehouse tabloları depo lokasyonlarını referans alacak

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Parent silinemez (veri bütünlüğü korunur)
  - CASCADE: country_risk ülke silinince silinir
- **Unique Constraints**: 
  - country: iso_code, iso_code_2, uuid
  - region: (country_id, name) kombinasyonu unique
  - city: (region_id, name) kombinasyonu unique
  - district: (city_id, name) kombinasyonu unique
  - branch: (district_id, name) kombinasyonu unique
  - distribution_center: code unique
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler
- **Soft Delete**: Tüm tablolarda `deleted_at` ile soft delete

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Composite Index'ler**: Hiyerarşik sorgular için (parent_id, name) kombinasyonları index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir

## Notlar

- Lokasyon hiyerarşisi sık değişmeyen verilerdir, cache'lenebilir
- UUID kullanımı ile dağıtık sistemlerde güvenli referanslar sağlanır
- GPS koordinatları (latitude, longitude) ile harita entegrasyonu yapılabilir
- Transfer noktaları (`is_transfer_point`) ile hub-and-spoke lojistik modeli desteklenir
- Ülke risk seviyeleri sigorta ve fiyatlandırma hesaplamalarında kullanılabilir

