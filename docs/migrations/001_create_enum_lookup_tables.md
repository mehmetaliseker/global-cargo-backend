# Migration 001: Enum Lookup Tabloları ve Dil Desteği

## Migration Özeti

Bu migration, global kargo yönetim sistemi için temel enum lookup tablolarını ve dil desteği tablosunu oluşturur. Bu tablolar sistem genelinde kullanılan sabit değerleri ve çoklu dil desteğini sağlar.

### Oluşturulan Tablolar

1. **currency_enum** - Para birimi enum tablosu
2. **state_enum** - Durum enum tablosu
3. **shipment_type_enum** - Gönderi tipi enum tablosu
4. **delivery_option_enum** - Teslimat seçeneği enum tablosu
5. **cargo_type_enum** - Kargo tipi enum tablosu
6. **payment_method_enum** - Ödeme yöntemi enum tablosu
7. **payment_status_enum** - Ödeme durumu enum tablosu
8. **language** - Dil tablosu

## Domain Açıklaması

### Enum Tabloları

Enum tabloları, sistem genelinde kullanılan sabit değerleri tutar. Bu yaklaşımın avantajları:

- **Esneklik**: Yeni değerler eklemek için kod değişikliği gerekmez
- **Çoklu Dil Desteği**: İleride çeviri tabloları ile entegre edilebilir
- **Soft Delete**: `deleted_at` alanı ile veriler silinmez, sadece pasif hale getirilir
- **Aktif/Pasif Yönetimi**: `is_active` alanı ile değerler aktif/pasif yapılabilir

### Para Birimi (currency_enum)

Sistemde kullanılan para birimlerini tutar. Her para birimi için:
- **code**: 3 karakterlik ISO para birimi kodu (örn: USD, EUR, TRY)
- **name**: Para birimi adı
- **symbol**: Para birimi sembolü (örn: $, €, ₺)

### Durum (state_enum)

Gönderilerin ve diğer varlıkların durumlarını tutar. Örnek durumlar:
- PENDING (Beklemede)
- IN_TRANSIT (Yolda)
- DELIVERED (Teslim Edildi)
- CANCELLED (İptal Edildi)

### Gönderi Tipi (shipment_type_enum)

Gönderi tiplerini tutar. Örnekler:
- STANDARD (Standart)
- EXPRESS (Ekspres)
- ECONOMY (Ekonomi)

### Teslimat Seçeneği (delivery_option_enum)

Teslimat seçeneklerini tutar. Örnekler:
- DOOR_TO_DOOR (Kapıdan Kapıya)
- BRANCH_PICKUP (Şubeden Teslim)
- LOCKER (Kilitli Kutu)

### Kargo Tipi (cargo_type_enum)

Kargo tiplerini tutar. Örnekler:
- DOCUMENT (Döküman)
- PACKAGE (Paket)
- PALLET (Palet)

### Ödeme Yöntemi (payment_method_enum)

Ödeme yöntemlerini tutar. Örnekler:
- CASH (Nakit)
- CREDIT_CARD (Kredi Kartı)
- BANK_TRANSFER (Banka Havalesi)

### Ödeme Durumu (payment_status_enum)

Ödeme durumlarını tutar. Örnekler:
- PENDING (Beklemede)
- PAID (Ödendi)
- FAILED (Başarısız)
- REFUNDED (İade Edildi)

### Dil (language)

Sistemde desteklenen dilleri tutar. Her dil için:
- **language_code**: Dil kodu (örn: tr, en, de)
- **language_name**: Dil adı (İngilizce)
- **native_name**: Yerel dil adı
- **is_default**: Varsayılan dil mi?
- **is_active**: Aktif mi?

## Backend Implementasyonu

### Oluşturulan Modüller

Her enum tablosu için ayrı bir NestJS modülü oluşturulmuştur:

1. **CurrencyModule** - `src/lookup/enums/currency.module.ts`
2. **StateModule** - `src/lookup/enums/state.module.ts`
3. **ShipmentTypeModule** - `src/lookup/enums/shipment-type.module.ts`
4. **DeliveryOptionModule** - `src/lookup/enums/delivery-option.module.ts`
5. **CargoTypeModule** - `src/lookup/enums/cargo-type.module.ts`
6. **PaymentMethodModule** - `src/lookup/enums/payment-method.module.ts`
7. **PaymentStatusModule** - `src/lookup/enums/payment-status.module.ts`
8. **LanguageModule** - `src/lookup/language/language.module.ts`

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları tanımlanır
- **Implementation**: Raw SQL sorguları ile veritabanı işlemleri yapılır

```typescript
// Örnek: StateRepository
interface IStateRepository {
  findAll(): Promise<StateEntity[]>;
  findById(id: number): Promise<StateEntity | null>;
  findByCode(code: string): Promise<StateEntity | null>;
  findActive(): Promise<StateEntity[]>;
}
```

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Exception handling (NotFoundException)

#### 3. Controller Katmanı

- HTTP endpoint'leri
- Request/Response yönetimi
- Validation pipe'ları (ParseIntPipe)

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- snake_case -> camelCase dönüşümü

### Tasarım Kararları

1. **Soft Delete Desteği**: Tüm sorgular `deleted_at IS NULL` kontrolü yapar
2. **Aktif Kayıt Filtreleme**: `findActive()` metodları ile sadece aktif kayıtlar getirilir
3. **Code Bazlı Arama**: Enum değerleri genellikle code ile aranır
4. **Repository Pattern**: Veritabanı erişimi repository katmanında soyutlanmıştır
5. **Dependency Injection**: Tüm bağımlılıklar constructor injection ile sağlanır

## API Genel Bakış

### Para Birimi Endpoint'leri

- `GET /lookup/currencies` - Tüm para birimlerini listele
- `GET /lookup/currencies/active` - Aktif para birimlerini listele
- `GET /lookup/currencies/code/:code` - Code ile para birimi bul
- `GET /lookup/currencies/:id` - ID ile para birimi bul

### Durum Endpoint'leri

- `GET /lookup/states` - Tüm durumları listele
- `GET /lookup/states/active` - Aktif durumları listele
- `GET /lookup/states/code/:code` - Code ile durum bul
- `GET /lookup/states/:id` - ID ile durum bul

### Dil Endpoint'leri

- `GET /lookup/languages` - Tüm dilleri listele
- `GET /lookup/languages/active` - Aktif dilleri listele
- `GET /lookup/languages/default` - Varsayılan dili getir
- `GET /lookup/languages/:code` - Code ile dil bul

### Örnek Response

```json
{
  "id": 1,
  "code": "USD",
  "name": "US Dollar",
  "symbol": "$",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

### Validation Kuralları

- **ID**: Pozitif tam sayı olmalı (ParseIntPipe)
- **Code**: String, unique olmalı
- **Name**: String, zorunlu
- **isActive**: Boolean, varsayılan true
- **deletedAt**: Null veya timestamp

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, sistemin temel yapı taşlarını oluşturur:

1. **Sabit Değer Yönetimi**: Enum tabloları ile sistem genelinde kullanılan sabit değerler merkezi olarak yönetilir
2. **Çoklu Dil Desteği**: Language tablosu ile sistem çoklu dil desteğine hazır hale gelir
3. **Referans Bütünlüğü**: Gelecek migration'larda bu tablolara foreign key referansları yapılacaktır

### Gelecek Migration'larla İlişkisi

- **Migration 002**: Location hierarchy tabloları oluşturulacak
- **Migration 003+**: Actor, cargo, pricing gibi tablolar bu enum değerlerini referans alacak
- **Localization**: İleride dil tablosu ile enum değerlerinin çevirileri yapılacak

### Veri Bütünlüğü

- Tüm enum tablolarında `code` alanı UNIQUE constraint'e sahiptir
- Soft delete mekanizması ile veri kaybı önlenir
- Index'ler performans için optimize edilmiştir

## Notlar

- Enum tabloları sadece okuma (read-only) amaçlıdır, yazma işlemleri admin paneli üzerinden yapılmalıdır
- `deleted_at` alanı NULL olmayan kayıtlar sistem tarafından görmezden gelinir
- `is_active` alanı false olan kayıtlar yeni işlemlerde kullanılamaz
- Language tablosunda sadece bir dil `is_default = true` olabilir

