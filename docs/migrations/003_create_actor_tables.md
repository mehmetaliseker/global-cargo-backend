# Migration 003: Actor Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sistemi için actor (aktör) tablolarını oluşturur. Actor sistemi, sistemdeki tüm kullanıcı tiplerini (müşteri, çalışan, partner) tek bir yapı altında toplar ve ortak özellikleri merkezi olarak yönetir.

### Oluşturulan Tablolar

1. **actor** - Ana actor tablosu (genel bilgiler)
2. **customer** - Müşteri tablosu
3. **employee** - Çalışan tablosu
4. **partner** - Partner/İş ortağı tablosu

## Actor Domain Açıklaması

### Actor Nedir?

Actor (Aktör), sistemde işlem yapabilen tüm varlıkları temsil eden genel bir kavramdır. Global kargo yönetim sisteminde üç temel actor tipi vardır:

1. **Customer (Müşteri)**: Kargo gönderen veya alan bireysel veya kurumsal müşteriler
2. **Employee (Çalışan)**: Şirket çalışanları, operasyon personeli, yöneticiler
3. **Partner (İş Ortağı)**: Dış lojistik firmaları, API entegrasyonlu ortaklar

### Neden Bu Tasarım?

#### 1. Ortak Özelliklerin Merkezi Yönetimi

Tüm actor tipleri ortak özelliklere sahiptir:
- **İletişim Bilgileri**: Email, telefon, adres
- **Aktif/Pasif Durumu**: `is_active` ile yönetim
- **Soft Delete**: `deleted_at` ile veri koruması
- **UUID**: Güvenli referanslar için

Bu özellikler `actor` tablosunda merkezi olarak tutulur, böylece:
- Kod tekrarı önlenir
- Ortak işlemler (email doğrulama, iletişim güncelleme) tek yerden yönetilir
- Gelecekte yeni actor tipleri eklemek kolaylaşır

#### 2. Tip-Spesifik Özellikler

Her actor tipinin kendine özgü özellikleri vardır:

**Customer (Müşteri)**:
- Ad, soyad
- Kimlik numarası (şifrelenmiş)
- Kayıt tarihi
- Doğrulama durumu (`is_verified`)

**Employee (Çalışan)**:
- Çalışan numarası (unique)
- İşe başlama tarihi
- Departman, pozisyon
- Aktif/pasif durumu

**Partner (İş Ortağı)**:
- Şirket adı
- Vergi numarası
- API entegrasyonu durumu (`api_active`)

#### 3. Foreign Key İlişkileri

- **actor_id**: Her spesifik tablo (customer, employee, partner) bir actor'a bağlıdır
- **CASCADE DELETE**: Actor silinirse spesifik kayıt da silinir
- **UNIQUE Constraint**: Her actor sadece bir tip olabilir (1:1 ilişki)

#### 4. Lokasyon Entegrasyonu

Tüm actor tipleri `country_id` ile ülke referansına sahiptir:
- Müşterilerin ülkesi
- Çalışanların çalıştığı ülke
- Partner'ların merkez ülkesi

Bu, migration 002'deki lokasyon hiyerarşisi ile entegre çalışır.

### Global Kargo Şirketi İçin Uygunluk

Bu tasarım, global bir kargo şirketi için idealdir çünkü:

1. **Çoklu Ülke Desteği**: Her actor bir ülkeye bağlı olabilir
2. **Farklı Müşteri Tipleri**: Bireysel ve kurumsal müşteriler aynı yapıda
3. **Partner Entegrasyonu**: API entegrasyonlu partner'lar için özel alanlar
4. **Güvenlik**: Kimlik numaraları şifrelenmiş olarak saklanır
5. **Ölçeklenebilirlik**: Yeni actor tipleri kolayca eklenebilir

## Backend Implementasyonu

### Oluşturulan Modüller

Her actor tablosu için ayrı bir NestJS modülü oluşturulmuştur:

1. **ActorModule** - `src/actor/actor.module.ts`
   - Genel actor yönetimi
   - Tip bazlı sorgular
   - Email bazlı arama

2. **CustomerModule** - `src/actor/customer/customer.module.ts`
   - Müşteri yönetimi
   - Doğrulama durumu filtreleme
   - Ülke bazlı sorgular

3. **EmployeeModule** - `src/actor/employee/employee.module.ts`
   - Çalışan yönetimi
   - Çalışan numarası ile arama
   - Departman/pozisyon bilgileri

4. **PartnerModule** - `src/actor/partner/partner.module.ts`
   - Partner yönetimi
   - API aktif partner'ları listeleme
   - Vergi numarası yönetimi

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

**Interface**: Entity tipi ve repository metodları tanımlanır
```typescript
interface IActorRepository {
  findAll(): Promise<ActorEntity[]>;
  findById(id: number): Promise<ActorEntity | null>;
  findByUuid(uuid: string): Promise<ActorEntity | null>;
  findByEmail(email: string): Promise<ActorEntity | null>;
  findByType(actorType: ActorType): Promise<ActorEntity[]>;
  findActive(): Promise<ActorEntity[]>;
  findByTypeAndActive(actorType: ActorType): Promise<ActorEntity[]>;
}
```

**Implementation**: Raw SQL sorguları ile veritabanı işlemleri yapılır
- Soft delete desteği (`deleted_at IS NULL`)
- Actor tipi bazlı filtreleme
- Foreign key ilişkileri ile join'ler (gelecekte)

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping (snake_case -> camelCase)
- Exception handling (NotFoundException)
- Actor tipi validasyonu

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları (ParseIntPipe)
- Actor tipi bazlı endpoint'ler

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Enum validasyonları (ActorTypeEnum)
- Email, UUID validasyonları

### Tasarım Kararları

1. **Actor Type Enum**: 
   - Database'de CHECK constraint ile sınırlandırılmış
   - TypeScript enum ile tip güvenliği sağlanmış
   - Gelecekte yeni tipler eklenebilir

2. **1:1 İlişki**: 
   - Her actor sadece bir tip olabilir (customer, employee, veya partner)
   - `actor_id` UNIQUE constraint ile garanti edilmiş

3. **CASCADE DELETE**: 
   - Actor silinirse spesifik kayıt (customer/employee/partner) da silinir
   - Veri bütünlüğü korunur

4. **Soft Delete**: 
   - Tüm tablolarda `deleted_at` alanı ile soft delete
   - Veri kaybı önlenir

5. **Şifrelenmiş Veriler**: 
   - `encrypted_identity_number` BYTEA tipinde
   - Hassas veriler güvenli şekilde saklanır
   - DTO'da expose edilmez

6. **Country Referansı**: 
   - Tüm actor tipleri `country_id` ile ülke referansına sahip
   - Migration 002'deki country tablosuna RESTRICT foreign key

## API Genel Bakış

### Actor Endpoint'leri

- `GET /actors` - Tüm actor'ları listele
- `GET /actors/active` - Aktif actor'ları listele
- `GET /actors/type/:type` - Tip bazlı actor'ları listele (customer, employee, partner)
- `GET /actors/type/:type/active` - Tip bazlı aktif actor'ları listele
- `GET /actors/email/:email` - Email ile actor bul
- `GET /actors/uuid/:uuid` - UUID ile actor bul
- `GET /actors/:id` - ID ile actor bul

### Customer Endpoint'leri

- `GET /actors/customers` - Tüm müşterileri listele
- `GET /actors/customers/verified` - Doğrulanmış müşterileri listele
- `GET /actors/customers/country/:countryId` - Ülkeye göre müşterileri listele
- `GET /actors/customers/country/:countryId/verified` - Ülkeye göre doğrulanmış müşterileri listele
- `GET /actors/customers/actor/:actorId` - Actor ID'sine göre müşteri bul
- `GET /actors/customers/uuid/:uuid` - UUID ile müşteri bul
- `GET /actors/customers/:id` - ID ile müşteri bul

### Employee Endpoint'leri

- `GET /actors/employees` - Tüm çalışanları listele
- `GET /actors/employees/active` - Aktif çalışanları listele
- `GET /actors/employees/country/:countryId` - Ülkeye göre çalışanları listele
- `GET /actors/employees/country/:countryId/active` - Ülkeye göre aktif çalışanları listele
- `GET /actors/employees/employee-number/:employeeNumber` - Çalışan numarası ile çalışan bul
- `GET /actors/employees/actor/:actorId` - Actor ID'sine göre çalışan bul
- `GET /actors/employees/uuid/:uuid` - UUID ile çalışan bul
- `GET /actors/employees/:id` - ID ile çalışan bul

### Partner Endpoint'leri

- `GET /actors/partners` - Tüm partner'ları listele
- `GET /actors/partners/active` - Aktif partner'ları listele
- `GET /actors/partners/api-active` - API aktif partner'ları listele
- `GET /actors/partners/country/:countryId` - Ülkeye göre partner'ları listele
- `GET /actors/partners/country/:countryId/active` - Ülkeye göre aktif partner'ları listele
- `GET /actors/partners/actor/:actorId` - Actor ID'sine göre partner bul
- `GET /actors/partners/uuid/:uuid` - UUID ile partner bul
- `GET /actors/partners/:id` - ID ile partner bul

### Örnek Response'lar

**Actor Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "actorType": "customer",
  "email": "customer@example.com",
  "phone": "+90 555 123 45 67",
  "address": "İstanbul, Türkiye",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Customer Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "actorId": 1,
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "identityNumber": null,
  "countryId": 1,
  "registrationDate": "2024-01-01T00:00:00.000Z",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Employee Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440002",
  "actorId": 2,
  "employeeNumber": "EMP-001",
  "firstName": "Mehmet",
  "lastName": "Demir",
  "hireDate": "2023-06-01",
  "department": "Operations",
  "position": "Warehouse Manager",
  "countryId": 1,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Partner Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440003",
  "actorId": 3,
  "companyName": "Global Logistics Partner Inc.",
  "taxNumber": "1234567890",
  "countryId": 1,
  "apiActive": true,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

### Validation Kuralları

- **ID**: Pozitif tam sayı olmalı (ParseIntPipe)
- **UUID**: Geçerli UUID formatında olmalı
- **Email**: Geçerli e-posta formatında olmalı (actor için)
- **Actor Type**: Sadece 'customer', 'employee', 'partner' değerleri kabul edilir
- **Employee Number**: Unique olmalı
- **Country ID**: Geçerli bir ülke ID'si olmalı (foreign key)

## Güvenlik Temelleri

### RBAC (Role-Based Access Control) Hazırlığı

Bu migration, gelecekteki RBAC sisteminin temelini oluşturur:

1. **Actor Yapısı**: 
   - Tüm kullanıcılar actor olarak temsil edilir
   - Gelecekteki role/permission tabloları actor'a bağlanacak

2. **Tip Bazlı Erişim**: 
   - Customer, Employee, Partner farklı yetkilere sahip olacak
   - Actor type ile temel erişim kontrolü yapılabilir

3. **Doğrulama Durumu**: 
   - Customer'ların `is_verified` durumu ile erişim kontrolü
   - Doğrulanmamış müşteriler sınırlı erişime sahip olabilir

### JWT / Authentication Entegrasyonu

Gelecekteki authentication sistemi şu şekilde entegre edilebilir:

1. **Actor Email**: 
   - Login işlemi için email kullanılabilir
   - `actor.email` unique constraint ile güvenli

2. **Actor UUID**: 
   - JWT token'da actor UUID kullanılabilir
   - ID yerine UUID kullanımı güvenlik açısından daha iyi

3. **Actor Type**: 
   - Token'da actor type bilgisi ile yetkilendirme
   - Farklı actor tipleri farklı token sürelerine sahip olabilir

### Ölçeklenebilirlik

Bu yapı, büyük ölçekli lojistik şirketleri için hazırdır:

1. **Multi-Tenant Hazırlığı**: 
   - Country bazlı filtreleme ile multi-tenant yapı kurulabilir
   - Her ülke ayrı bir tenant olarak yönetilebilir

2. **API Partner Entegrasyonu**: 
   - `api_active` flag ile API erişimi kontrol edilir
   - Partner'lar için özel authentication mekanizmaları kurulabilir

3. **Şifrelenmiş Veriler**: 
   - `encrypted_identity_number` ile hassas veriler güvende
   - GDPR/KVKK uyumluluğu için hazır

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, kullanıcı yönetiminin temelini oluşturur:

1. **Actor Sistemi**: Tüm kullanıcı tipleri tek bir yapı altında
2. **Lokasyon Entegrasyonu**: Migration 002'deki country tablosuna bağlantı
3. **Gelecek Migration'lar**: Role, permission, authentication tabloları bu yapıya bağlanacak

### Migration 001 & 002 ile İlişkisi

- **Migration 001**: Enum tabloları (state, payment_method, vb.) gelecekte actor işlemlerinde kullanılacak
- **Migration 002**: Country tablosu actor'ların ülke bilgilerini sağlar
- **Migration 003**: Actor tabloları kullanıcı yönetiminin temelini oluşturur

### Gelecek Migration'larla İlişkisi

- **Migration 004**: Role ve permission tabloları actor'a bağlanacak
- **Migration 005**: Cargo tabloları customer ve partner'ları referans alacak
- **Migration 016**: Authentication tabloları actor ile entegre olacak
- **Migration 017**: CRM tabloları customer bilgilerini genişletecek

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - `actor_id`: CASCADE DELETE (actor silinirse spesifik kayıt da silinir)
  - `country_id`: RESTRICT (ülke silinemez)
- **Unique Constraints**: 
  - actor: email, uuid
  - customer: actor_id
  - employee: actor_id, employee_number
  - partner: actor_id
- **CHECK Constraints**: 
  - actor: actor_type IN ('customer', 'employee', 'partner')
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler
- **Soft Delete**: Tüm tablolarda `deleted_at` ile soft delete

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Composite Index'ler**: Actor type ve email için index'ler

## Notlar

- Actor sistemi gelecekteki authentication/authorization için hazırdır
- Şifrelenmiş kimlik numaraları DTO'da expose edilmez
- Her actor sadece bir tip olabilir (1:1 ilişki)
- CASCADE DELETE ile veri bütünlüğü korunur
- Country referansı ile multi-tenant yapı kurulabilir
- API aktif partner'lar için özel endpoint'ler mevcuttur

