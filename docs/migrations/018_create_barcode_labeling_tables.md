# Migration 018: Barcode & Labeling Tables

## 📋 Genel Bakış

Migration 018, Global Cargo Backend sistemine **Barcode ve Labeling Altyapısı** ekler. Bu migration, fiziksel kargo kimlik tanımlama, barkod/QR kod yönetimi, etiket şablonları ve yazdırma geçmişi için gerekli taban yapısını oluşturur.

### Tablolar

1. **`packaging_type`** - Ambalaj tipleri
2. **`cargo_barcode`** - Kargo barkodları
3. **`cargo_qr_code`** - Kargo QR kodları
4. **`label_template`** - Etiket şablonları
5. **`label_configuration`** - Etiket konfigürasyonları
6. **`label_print_history`** - Etiket yazdırma geçmişi (immutable)

**⚠️ Not**: Bu migration barcode ve labeling infrastructure'ı oluşturur, ancak gerçek barkod/QR kod görüntü üretimi, yazıcı sürücüleri ve tarayıcı entegrasyonları henüz implement edilmemiştir.

---

## 🆔 Fiziksel vs Dijital Kimlik Modeli

### Dijital Kimlik (Migration 005)

**Cargo Entity**:
- `tracking_number`: Dijital takip numarası (unique)
- `uuid`: Global unique identifier
- Sistem içinde kullanılan kimlik

**Özellikler**:
- ✅ Sistem içi referans
- ✅ API endpoint'lerinde kullanım
- ✅ Veritabanı foreign key'leri
- ✅ Dijital takip ve sorgulama

### Fiziksel Kimlik (Migration 018)

**Barcode/QR Code**:
- `barcode_value`: Fiziksel barkod değeri (unique)
- `qr_code_value`: Fiziksel QR kod değeri (unique)
- `barcode_image_reference`: Barkod görüntü referansı
- `qr_code_image_reference`: QR kod görüntü referansı

**Özellikler**:
- ✅ Fiziksel etiket üzerinde görünen
- ✅ Barkod/QR kod tarayıcılar ile okunabilir
- ✅ Warehouse ve lojistik operasyonlarda kullanım
- ✅ Fiziksel kargo takibi

### İlişki Modeli

```
Cargo (Digital Identity)
  ├── tracking_number (Digital)
  ├── uuid (Digital)
  └── Physical Identity
      ├── cargo_barcode (1:1)
      └── cargo_qr_code (1:1)
```

**Önemli Prensipler**:
- Her cargo için maksimum 1 barcode
- Her cargo için maksimum 1 QR code
- Barcode ve QR code aynı anda olabilir
- Barcode assignment immutable (UNIQUE constraint)

---

## 🔄 Barkod Yaşam Döngüsü

### 1. Barkod Oluşturma

**Dijital Oluşturma** (Gelecek Migration):
```typescript
// Pseudo-code (gelecek migration)
async generateBarcode(cargoId: number, barcodeType: string) {
  // TODO: Implement barcode generation logic
  const barcodeValue = await generateBarcodeValue(cargoId);
  const barcodeImage = await generateBarcodeImage(barcodeValue);
  
  // Store in cargo_barcode
  await this.barcodeRepository.create({
    cargo_id: cargoId,
    barcode_type: barcodeType,
    barcode_value: barcodeValue,
    barcode_image_reference: barcodeImage.path
  });
}
```

**Bu Migration'da**:
- ✅ `cargo_barcode` tablosu hazır
- ✅ `barcode_value` unique constraint
- ❌ Barcode generation logic henüz yok

### 2. Barkod Atama

**Atama Kuralları**:
- Bir cargo için sadece bir aktif barcode
- Barcode atandıktan sonra değiştirilemez (UNIQUE constraint)
- QR code ayrı olarak atanabilir

**Atama Senaryosu**:
```
1. Cargo oluşturulur (Migration 005)
   ↓
2. Barcode generate edilir (gelecek migration)
   ↓
3. cargo_barcode kaydı oluşturulur
   ↓
4. Label print edilir (gelecek migration)
   ↓
5. Label fiziksel kargoya yapıştırılır
```

### 3. Barkod Kullanımı

**Warehouse Operations**:
- Giriş tarama (inbound scanning)
- Çıkış tarama (outbound scanning)
- Envanter kontrolü
- Lokasyon değişikliği tracking

**Customer Operations**:
- Kargo takibi (QR code ile)
- Teslimat doğrulama
- İade işlemleri

### 4. Barkod Değiştirme

**Geçersiz Kılma Senaryoları**:
- Barkod hasar görmüş → Yeni barkod atanır (cargo_id UNIQUE constraint nedeniyle önceki kayıt silinir)
- Barkod kaybolmuş → Yeni barkod atanır
- Sistem hatası → Yeni barkod atanır

**Immutable Principle**:
- Barkod değeri (`barcode_value`) değiştirilemez
- Yeni barkod = yeni kayıt (eski kayıt soft delete ile işaretlenir, gelecek migration)

---

## 🏷️ Etiket Yeniden Yazdırma Stratejisi

### Reprint Senaryoları

**1. İlk Yazdırma**:
```
1. label_configuration oluşturulur
   ↓
2. Label print edilir (gelecek migration)
   ↓
3. label_print_history kaydedilir (status: 'success')
   ↓
4. Label fiziksel kargoya yapıştırılır
```

**2. Yeniden Yazdırma (Reprint)**:
```
1. Label kayboldu/zarar gördü
   ↓
2. Mevcut label_configuration kullanılır
   ↓
3. Yeni print job oluşturulur
   ↓
4. label_print_history kaydedilir (status: 'success', print_count: 2)
   ↓
5. Yeni label yazdırılır
```

**3. Kısmi Başarısızlık**:
```
1. Label print edilmeye çalışılır
   ↓
2. Printer hatası oluşur
   ↓
3. label_print_history kaydedilir (status: 'partial' veya 'failed')
   ↓
4. Retry yapılır
   ↓
5. Başarılı print kaydedilir
```

### Reprint History Tracking

**`label_print_history` Tablosu**:
- Her print attempt kaydedilir (immutable)
- `print_count`: Toplam yazdırma sayısı
- `print_status`: success, failed, partial
- `error_message`: Hata detayları
- `print_duration_ms`: Yazdırma süresi

**Audit Trail**:
- Tüm print attempts kaydedilir
- Reprint reason tracking (gelecek migration)
- Print cost tracking (gelecek migration)

---

## 📱 Tarama Olayı Semantikleri

### Scan Event Types (Gelecek Migration)

**Inbound Scan**:
- Kargo warehouse'a giriş
- Barkod/QR kod okunur
- Lokasyon güncellenir
- Durum güncellenir (IN_TRANSIT → IN_WAREHOUSE)

**Outbound Scan**:
- Kargo warehouse'dan çıkış
- Barkod/QR kod okunur
- Lokasyon güncellenir
- Durum güncellenir (IN_WAREHOUSE → IN_TRANSIT)

**Delivery Scan**:
- Kargo teslim edilir
- Barkod/QR kod okunur
- Durum güncellenir (IN_TRANSIT → DELIVERED)
- Teslimat tarihi kaydedilir

**Return Scan**:
- İade kargo sisteme geri döner
- Barkod/QR kod okunur
- Durum güncellenir (DELIVERED → RETURNED)

### Scan Validation (Gelecek Migration)

**Validation Rules**:
- Barkod/QR kod sistemde kayıtlı mı?
- Cargo aktif durumda mı?
- Lokasyon geçişi geçerli mi?
- Durum geçişi geçerli mi?

**Error Handling**:
- Invalid barcode → Error log
- Duplicate scan → Warning log
- Invalid state transition → Error log

### Scan History (Gelecek Migration)

**Gelecek Tablo**:
```sql
CREATE TABLE barcode_scan_history (
  id SERIAL PRIMARY KEY,
  barcode_value VARCHAR(255) NOT NULL,
  scan_type VARCHAR(50) NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  scanned_by INTEGER REFERENCES employee(id),
  location_id INTEGER,
  device_info VARCHAR(500),
  ...
);
```

---

## 🔗 Çoklu Entity Barcode Desteği

### Current Implementation

**Cargo-Only Barcodes**:
- `cargo_barcode`: Sadece cargo için
- `cargo_qr_code`: Sadece cargo için
- 1:1 ilişki (UNIQUE constraint)

### Future Expansion (Gelecek Migration)

**Multi-Entity Support**:
```sql
-- Generic barcode table (future migration)
CREATE TABLE entity_barcode (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- 'cargo', 'pallet', 'container'
  entity_id INTEGER NOT NULL,
  barcode_value VARCHAR(255) NOT NULL UNIQUE,
  ...
);
```

**Entity Types**:
- **Cargo**: Tek paket barkodu
- **Pallet**: Palet barkodu (birden fazla cargo içerebilir)
- **Container**: Konteyner barkodu (birden fazla palet içerebilir)

**Hierarchical Barcode Structure**:
```
Container (Barcode: C12345)
  └── Pallet 1 (Barcode: P67890)
      ├── Cargo 1 (Barcode: CRG001)
      ├── Cargo 2 (Barcode: CRG002)
      └── Cargo 3 (Barcode: CRG003)
  └── Pallet 2 (Barcode: P67891)
      ├── Cargo 4 (Barcode: CRG004)
      └── Cargo 5 (Barcode: CRG005)
```

### Current Limitation

**Single Level Only**:
- Sadece cargo seviyesinde barkod
- Palet ve container desteği yok
- Gelecek migration'larda genişletilebilir

---

## 🏭 Warehouse Entegrasyonu

### Warehouse Operations

**Inbound Process**:
```
1. Kargo warehouse'a gelir
   ↓
2. Barkod/QR kod tarayıcı ile okunur
   ↓
3. cargo_barcode tablosundan cargo_id bulunur
   ↓
4. cargo_movement_history kaydedilir (Migration 005)
   ↓
5. Lokasyon güncellenir
   ↓
6. Durum güncellenir (IN_TRANSIT → IN_WAREHOUSE)
```

**Outbound Process**:
```
1. Kargo sevkiyata hazırlanır
   ↓
2. Barkod/QR kod tarayıcı ile okunur
   ↓
3. cargo_barcode tablosundan cargo_id bulunur
   ↓
4. cargo_movement_history kaydedilir
   ↓
5. Lokasyon güncellenir
   ↓
6. Durum güncellenir (IN_WAREHOUSE → IN_TRANSIT)
```

**Inventory Check**:
```
1. Warehouse envanter kontrolü yapılır
   ↓
2. Tüm barkodlar taranır
   ↓
3. cargo_barcode tablosu ile eşleştirme yapılır
   ↓
4. Eksik/fazla kargo tespit edilir
   ↓
5. Rapor oluşturulur
```

### Integration Points

**Cargo Module** (Migration 005):
- `cargo` tablosu → barcode ile eşleştirme
- `cargo_state_history` → durum güncellemeleri
- `cargo_movement_history` → lokasyon güncellemeleri

**Warehouse Module** (Future Migration):
- Warehouse locations
- Storage zones
- Inventory tracking

**Routing Module** (Migration 010):
- Route assignments
- Delivery scheduling

---

## ❌ Hata ve Duplikasyon Önleme

### Barcode Uniqueness

**UNIQUE Constraint**:
```sql
barcode_value VARCHAR(255) NOT NULL UNIQUE
```

**Garantiler**:
- ✅ Aynı barcode değeri iki kez atanamaz
- ✅ Database level validation
- ✅ Application level validation (gelecek migration)

**Duplicate Prevention**:
- Generation algorithm uniqueness garantisi (gelecek migration)
- Pre-insert validation (gelecek migration)
- Collision detection (gelecek migration)

### QR Code Uniqueness

**UNIQUE Constraint**:
```sql
qr_code_value TEXT NOT NULL UNIQUE
```

**Garantiler**:
- ✅ Aynı QR kod değeri iki kez atanamaz
- ✅ Database level validation
- ✅ Application level validation (gelecek migration)

### Cargo-Barcode 1:1 Relationship

**UNIQUE Constraint**:
```sql
cargo_id INTEGER NOT NULL UNIQUE
```

**Garantiler**:
- ✅ Bir cargo için sadece bir barcode
- ✅ Bir cargo için sadece bir QR code
- ✅ Database level validation

**Reassignment Strategy**:
- Eski barcode kaydı soft delete (gelecek migration)
- Yeni barcode kaydı oluşturulur
- History korunur (audit trail)

### Print Failure Handling

**Status Tracking**:
- `print_status`: success, failed, partial
- `error_message`: Hata detayları
- `print_duration_ms`: Yazdırma süresi

**Retry Logic** (Gelecek Migration):
- Automatic retry on failure
- Maximum retry count
- Exponential backoff
- Alert on persistent failure

---

## 📋 Denetlenebilirlik Garantileri

### Immutable Print History

**`label_print_history` Tablosu**:
- ✅ INSERT only (UPDATE/DELETE yasak)
- ✅ Her print attempt kaydedilir
- ✅ Print metadata korunur
- ✅ Error details korunur

**Audit Trail**:
- Tüm print attempts kaydedilir
- Print timestamps
- Printer information
- Print duration
- Error messages

### Barcode Assignment History (Gelecek Migration)

**Gelecek Tablo**:
```sql
CREATE TABLE barcode_assignment_history (
  id SERIAL PRIMARY KEY,
  cargo_id INTEGER NOT NULL,
  barcode_value VARCHAR(255) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES employee(id),
  assignment_reason TEXT,
  ...
);
```

**History Tracking**:
- Barcode assignment/reassignment
- Assignment reason
- Assigned by employee
- Assignment timestamp

### Configuration Change Tracking

**`label_configuration` Tablosu**:
- ✅ `updated_at` timestamp
- ✅ Soft delete (`deleted_at`)
- ❌ Change history henüz yok (gelecek migration)

**Gelecek Enhancement**:
- Configuration change history
- Version tracking
- Rollback capability

---

## 🚚 Gerçek Dünya Lojistik Akış Örnekleri

### Senaryo 1: Kargo Oluşturma ve Etiketleme

```
1. Müşteri kargo oluşturur (Migration 005)
   ↓
2. Sistem tracking_number oluşturur
   ↓
3. Barcode generate edilir (gelecek migration)
   - barcode_value: "1234567890123"
   - barcode_type: "CODE128"
   ↓
4. QR code generate edilir (gelecek migration)
   - qr_code_value: "https://tracking.example.com/TRACK123"
   ↓
5. cargo_barcode ve cargo_qr_code kayıtları oluşturulur
   ↓
6. label_template seçilir (örn: "STANDARD_SHIPPING_LABEL")
   ↓
7. label_configuration oluşturulur
   - template_id: 1
   - cargo_id: 123
   - configuration_data: { barcode_position: "top", qr_code_position: "bottom" }
   ↓
8. Label print edilir (gelecek migration)
   ↓
9. label_print_history kaydedilir (status: 'success')
   ↓
10. Label fiziksel kargoya yapıştırılır
```

### Senaryo 2: Warehouse Giriş Taraması

```
1. Kargo warehouse'a gelir
   ↓
2. Warehouse çalışanı barkod tarayıcı ile okur
   ↓
3. Sistem barcode_value ile cargo_barcode tablosunu sorgular
   ↓
4. cargo_id bulunur (örn: 123)
   ↓
5. cargo_movement_history kaydedilir (Migration 005)
   - branch_id: 5 (warehouse branch)
   - movement_type: 'inbound'
   ↓
6. cargo_state_history kaydedilir
   - state_id: 'IN_WAREHOUSE'
   ↓
7. Lokasyon güncellenir
   ↓
8. Müşteriye bildirim gönderilir (Migration 015)
   - "Kargonuz warehouse'a ulaştı"
```

### Senaryo 3: Etiket Yeniden Yazdırma

```
1. Fiziksel label hasar görmüş/okunmuyor
   ↓
2. Warehouse çalışanı yeniden yazdırma talebi oluşturur
   ↓
3. Mevcut label_configuration bulunur
   - cargo_id: 123
   - template_id: 1
   ↓
4. Yeni print job başlatılır (gelecek migration)
   ↓
5. Label print edilir
   ↓
6. label_print_history kaydedilir
   - label_configuration_id: 5
   - print_status: 'success'
   - print_count: 2 (ikinci yazdırma)
   ↓
7. Yeni label yazdırılır ve yapıştırılır
```

### Senaryo 4: Teslimat Taraması

```
1. Kurye kargoyu teslim eder
   ↓
2. QR kod mobil uygulama ile okunur
   ↓
3. Sistem qr_code_value ile cargo_qr_code tablosunu sorgular
   ↓
4. cargo_id bulunur
   ↓
5. Teslimat doğrulama yapılır
   - Alıcı bilgileri kontrol edilir
   - İmza alınır (gelecek migration)
   ↓
6. cargo_state_history kaydedilir
   - state_id: 'DELIVERED'
   - changed_at: CURRENT_TIMESTAMP
   ↓
7. actual_delivery_date güncellenir (Migration 005)
   ↓
8. Müşteriye bildirim gönderilir
   - "Kargonuz teslim edildi"
```

### Senaryo 5: İade İşlemi

```
1. Müşteri iade talebinde bulunur (Migration 005)
   ↓
2. İade kargo hazırlanır
   ↓
3. Mevcut barcode kullanılır (yeni barcode atanmaz)
   ↓
4. cargo_state_history kaydedilir
   - state_id: 'RETURN_INITIATED'
   ↓
5. İade label print edilir
   - Farklı label_template kullanılabilir (örn: "RETURN_LABEL")
   ↓
6. label_configuration oluşturulur
   - template_id: 2 (return label)
   - cargo_id: 123
   ↓
7. Label print edilir
   ↓
8. İade kargo warehouse'a geri döner
   ↓
9. Barkod tarayıcı ile okunur
   ↓
10. İade işlemi tamamlanır
```

---

## 🔌 Gelecek Donanım Entegrasyonu Hazırlığı

### Barcode Scanner Integration (Gelecek Migration)

**Scanner Types**:
- Handheld scanners
- Fixed scanners (conveyor belt)
- Mobile app scanners (QR code)

**Integration Points**:
- REST API endpoints for scan events
- WebSocket for real-time scan updates
- Batch scan processing

### Printer Integration (Gelecek Migration)

**Printer Types**:
- Thermal label printers (Zebra, Dymo)
- Laser printers (standard labels)
- Mobile printers (portable)

**Integration Points**:
- Printer driver abstraction
- Print queue management
- Printer status monitoring
- Print job scheduling

### Mobile App Integration (Gelecek Migration)

**Features**:
- QR code scanning
- Delivery confirmation
- Signature capture
- Photo capture (proof of delivery)

**API Endpoints** (Gelecek Migration):
```
POST /barcode/scan
  {
    "barcode_value": "1234567890123",
    "scan_type": "delivery",
    "location": { "lat": 41.0082, "lng": 28.9784 }
  }
```

---

## 🏗️ Backend Implementasyonu

### Oluşturulan Modüller

1. **BarcodeModule** - `src/barcode/barcode/`
   - Cargo barcode management
   - Cargo QR code management
   - Barcode/QR code lookup

2. **PackagingTypeModule** - `src/barcode/packaging-type/`
   - Packaging type management
   - Special requirements tracking
   - Cost additional tracking

3. **LabelTemplateModule** - `src/barcode/label-template/`
   - Label template management
   - Template layout configuration
   - Multi-language support

4. **LabelPrintModule** - `src/barcode/label-print/`
   - Label configuration management
   - Print history tracking
   - Print status monitoring

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
- JSONB parsing (template_layout, configuration_data, printer_settings)
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri (READ-ONLY)
- RESTful API tasarımı
- Query parameter desteği
- TODO comments for future RBAC guards

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Enum validasyonları
- Date string validasyonları

### API Endpoints

#### Cargo Barcodes

- `GET /barcode/cargo-barcodes` - Tüm barkodlar
- `GET /barcode/cargo-barcodes/type/:barcodeType` - Tip bazlı
- `GET /barcode/cargo-barcodes/value/:barcodeValue` - Değer bazlı
- `GET /barcode/cargo-barcodes/cargo/:cargoId` - Kargo bazlı
- `GET /barcode/cargo-barcodes/:id` - ID bazlı

#### Cargo QR Codes

- `GET /barcode/cargo-qr-codes` - Tüm QR kodlar
- `GET /barcode/cargo-qr-codes/value/:qrCodeValue` - Değer bazlı
- `GET /barcode/cargo-qr-codes/cargo/:cargoId` - Kargo bazlı
- `GET /barcode/cargo-qr-codes/:id` - ID bazlı

#### Packaging Types

- `GET /barcode/packaging-types` - Tüm ambalaj tipleri
- `GET /barcode/packaging-types/active` - Aktif ambalaj tipleri
- `GET /barcode/packaging-types/code/:typeCode` - Kod bazlı
- `GET /barcode/packaging-types/uuid/:uuid` - UUID bazlı
- `GET /barcode/packaging-types/:id` - ID bazlı

#### Label Templates

- `GET /barcode/label-templates` - Tüm şablonlar
- `GET /barcode/label-templates/active` - Aktif şablonlar
- `GET /barcode/label-templates/type/:templateType` - Tip bazlı
- `GET /barcode/label-templates/code/:templateCode` - Kod bazlı
- `GET /barcode/label-templates/uuid/:uuid` - UUID bazlı
- `GET /barcode/label-templates/:id` - ID bazlı

#### Label Configurations

- `GET /barcode/label-configurations` - Tüm konfigürasyonlar
- `GET /barcode/label-configurations/template/:labelTemplateId` - Şablon bazlı
- `GET /barcode/label-configurations/cargo/:cargoId` - Kargo bazlı
- `GET /barcode/label-configurations/uuid/:uuid` - UUID bazlı
- `GET /barcode/label-configurations/:id` - ID bazlı

#### Label Print History

- `GET /barcode/label-print-history` - Tüm yazdırma geçmişi
- `GET /barcode/label-print-history/failed` - Başarısız yazdırmalar
- `GET /barcode/label-print-history/successful` - Başarılı yazdırmalar
- `GET /barcode/label-print-history/status/:printStatus` - Durum bazlı
- `GET /barcode/label-print-history/configuration/:labelConfigurationId` - Konfigürasyon bazlı
- `GET /barcode/label-print-history/date-range?startDate=&endDate=` - Tarih aralığı
- `GET /barcode/label-print-history/:id` - ID bazlı

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. Barcode generation, print job creation ve scan event logging gelecek migration'larda eklenecektir.

2. **No Barcode Generation**: Barcode/QR kod generation logic henüz implement edilmemiştir. Placeholder TODO comments mevcuttur.

3. **No Printer Integration**: Printer driver'ları ve print job management henüz yoktur. Placeholder TODO comments mevcuttur.

4. **No Scanner Integration**: Barcode/QR kod scanner entegrasyonu henüz yoktur. Placeholder TODO comments mevcuttur.

5. **JSONB Fields**: `template_layout`, `configuration_data`, `printer_settings` JSONB olarak saklanır ve parse edilir.

6. **Soft Delete**: `packaging_type`, `label_template`, `label_configuration` tablolarında soft delete mevcuttur.

7. **Immutable Tables**: `label_print_history` immutable'dır (INSERT only).

8. **UNIQUE Constraints**: `barcode_value`, `qr_code_value`, `cargo_id` (barcode ve QR code için) UNIQUE constraint'leri mevcuttur.

9. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

10. **TODO Comments**: Service ve controller'larda gelecek RBAC guard'ları, barcode generation logic, printer integration ve scanner integration için TODO yorumları eklenmiştir.

---

## 📚 İlgili Dokümantasyon

- [Migration 005: Cargo Tables](./005_create_cargo_tables.md) - Core cargo tables
- [Migration 010: Routing Tables](./010_create_routing_tables.md) - Routing and delivery
- [Migration 015: Notification Tables](./015_create_notification_tables.md) - Notification infrastructure
- [GS1 Barcode Standards](https://www.gs1.org/standards/barcodes)
- [QR Code Standards](https://www.iso.org/standard/44230.html)

---

**Migration 018 Tamamlandı** ✅
