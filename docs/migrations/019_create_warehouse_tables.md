# Migration 019: Warehouse Tables

## 📋 Genel Bakış

Migration 019, Global Cargo Backend sistemine **Core Warehouse Domain Model** ekler. Bu migration, fiziksel ve yapısal lojistik katmanını oluşturur: depolar, depolama lokasyonları, konteynırlar, kapasite takibi ve konteyner-kargo atamaları.

### Tablolar

1. **`warehouse`** - Depo master verisi
2. **`warehouse_location`** - Depo içi depolama lokasyonları (zonlar/alanlar)
3. **`warehouse_capacity`** - Depo kapasite takibi (hacim/ağırlık/alan)
4. **`container`** - Fiziksel konteyner yönetimi
5. **`container_cargo_assignment`** - Konteyner-kargo atamaları

**⚠️ Not**: Bu migration SADECE fiziksel/yapısal warehouse altyapısını implement eder. Operasyonel altyapı (warehouse_stock, stock_alert, warehouse_receipt, consolidation_order) migrations 020-022'de implement edilecektir.

---

## 🏢 Fiziksel vs Dijital Warehouse Modeli

### Fiziksel Warehouse (Gerçek Dünya)

**Yapısal Bileşenler**:
- Building: Fiziksel depo binası
- Zones: Farklı alan tipleri (receiving, storage, packing, shipping)
- Aisles: Koridor dizilimleri
- Racks: Raf sistemleri
- Bins/Locations: Spesifik depolama noktaları

**Örnek Layout**:
```
Warehouse Building
├── Receiving Zone (coordinates: 0-50)
├── Storage Zone A (coordinates: 51-200)
│   ├── Aisle 1-10
│   └── Bins (X,Y,Z coordinates)
├── Storage Zone B (coordinates: 201-350)
└── Shipping Zone (coordinates: 351-400)
```

### Dijital Warehouse Modeli (Migration 019)

**Database Representation**:
- `warehouse`: Depo master kaydı (genel bilgiler, konum, toplam kapasite)
- `warehouse_location`: Depolama noktaları (3D koordinatlar, kapasite)
- `warehouse_capacity`: Kapasite metrik takibi (hacim, ağırlık, alan)

**İlişki Modeli**:
```
warehouse (master)
  ├── warehouse_location (zones, bins)
  ├── warehouse_capacity (metrics tracking)
  └── container (assigned containers)
      └── container_cargo_assignment (cargo tracking)
```

---

## 🗺️ Zone & Location Hierarchy

### Lokasyon Organizasyonu

**`warehouse_location` Tablosu**:
- **location_code**: Unique location identifier (örn: "A-01-05", "RECV-01")
- **location_type**: Zone type (optional categorization)
- **coordinates_x, coordinates_y, coordinates_z**: 3D positioning
- **capacity_volume, capacity_weight**: Location-specific capacity

### Lokasyon Kodlama Stratejisi

**Zone-Based Coding**:
```
Format: {Zone}-{Aisle}-{Bin}
Examples:
- "A-01-05" → Storage Zone A, Aisle 1, Bin 5
- "B-10-12" → Storage Zone B, Aisle 10, Bin 12
- "RECV-01" → Receiving Zone, Bay 1
- "SHIP-03" → Shipping Zone, Bay 3
```

### Koordinat Sistemi

**3D Koordinat Modeli**:
- **X**: Horizontal position (aisle position)
- **Y**: Vertical position (height/level)
- **Z**: Depth position (rack depth)

**Örnek**:
```sql
-- Ground floor, aisle 5, rack level 2, depth 3
coordinates_x = 5.0
coordinates_y = 2.0
coordinates_z = 3.0
```

### Lokasyon Tipleri

**Örnek Kategoriler**:
- `receiving`: Gelen kargo alanı
- `storage`: Uzun dönem depolama
- `packing`: Paketleme alanı
- `shipping`: Giden kargo alanı
- `quarantine`: Karantina alanı
- `damaged`: Hasarlı kargo alanı

---

## 📊 Capacity Modeling Rationale

### Kapasite Takibi Stratejisi

**`warehouse_capacity` Tablosu**:
- **capacity_type**: `'volume'`, `'weight'`, `'area'` (CHECK constraint)
- **max_capacity**: Maksimum kapasite
- **current_usage**: Şu anki kullanım
- **alert_threshold_percentage**: Uyarı eşiği (örn: %80)

### Çoklu Metric Tracking

**Neden 3 Farklı Metric?**

1. **Volume Capacity (m³)**:
   - Kargo hacmi takibi
   - Spatial optimization için kritik
   - Örnek: 10,000 m³ total warehouse capacity

2. **Weight Capacity (kg)**:
   - Yapısal yük limitleri
   - Floor loading capacity
   - Safety compliance için gerekli
   - Örnek: 500,000 kg total weight capacity

3. **Area Capacity (m²)**:
   - Floor space utilization
   - Pallet/container footprint tracking
   - Layout planning için kullanılır
   - Örnek: 5,000 m² floor area

### Alert Threshold Kullanımı

**Capacity Alert Query** (Repository):
```sql
SELECT * FROM warehouse_capacity
WHERE (current_usage / max_capacity * 100) >= alert_threshold_percentage
```

**Kullanım Senaryoları**:
- Kapasite %80'e ulaşınca uyarı
- Yeni depo planlaması tetikleyici
- Kargo redistribution kararları

---

## ⚙️ Operational State Management

### Warehouse Aktif/Pasif Durumu

**`is_active` Field**:
- `true`: Warehouse operasyonel, kargo kabul ediyor
- `false`: Warehouse kapalı, bakımda, veya devre dışı

**Kullanım**:
```sql
-- Sadece aktif warehouse'ları listele
SELECT * FROM warehouse WHERE is_active = true AND deleted_at IS NULL
```

### Location Aktif/Pasif Durumu

**`warehouse_location.is_active`**:
- `true`: Location kullanılabilir, kargo yerleştirilebilir
- `false`: Location bakımda, hasar görmüş, veya geçici kapatılmış

**Senaryo**: Rack repair sırasında ilgili bin'ler pasif yapılır.

### Container Durumları

**`container.is_active`**:
- Container kullanılabilir mi?

**`container.is_in_use`**:
- Container şu anda kargo taşıyor mu?

**State Machine**:
```
Active=True, InUse=False  → Available for assignment
Active=True, InUse=True   → Currently assigned
Active=False, InUse=False → Out of service
Active=False, InUse=True  → Invalid state (data integrity issue)
```

### Soft Delete Stratejisi

**Tabular Soft Delete**:
- `warehouse`: ✅ `deleted_at` (depo tamamen kapatılırsa)
- `warehouse_location`: ✅ `deleted_at` (lokasyon kalıcı olarak kaldırılırsa)
- `warehouse_capacity`: ❌ No soft delete (metrics always retained)
- `container`: ✅ `deleted_at` (container hurdaya çıkarsa)
- `container_cargo_assignment`: ❌ No soft delete (immutable history)

---

## 🌍 Multi-Country Warehouse Support

### Country & City Relationship

**`warehouse.country_id`**: Required foreign key
**`warehouse.city_id`**: Optional foreign key

**Kullanım Senaryoları**:

1. **Ülke Bazlı Warehouse Network**:
```sql
-- Türkiye'deki tüm warehouse'lar
SELECT * FROM warehouse WHERE country_id = 1 AND deleted_at IS NULL
```

2. **Şehir Bazlı Warehouse**:
```sql
-- İstanbul'daki warehouse'lar
SELECT * FROM warehouse WHERE city_id = 34 AND deleted_at IS NULL
```

3. **Cross-Border Logistics**:
- Origin country warehouse → Destination country warehouse
- International route planning
- Customs clearance warehouse tracking

### Geographic Coordinates

**`latitude`, `longitude`**: GPS coordinates

**Kullanım**:
- Warehouse location mapping
- Distance calculation
- Route optimization
- Mobile app integration

**Örnek**:
```typescript
// İstanbul Warehouse
latitude: 41.0082
longitude: 28.9784
```

---

## 📦 Container Management Strategy

### Physical Container Tracking

**`container` Tablosu**:
- Fiziksel konteynırları temsil eder (palet, koli, konteyner)
- Her container bir warehouse'a atanabilir
- Dimensions ve capacity tracking

### Container Dimensions

**3D Dimensions**:
- `dimensions_length_cm`: Uzunluk (cm)
- `dimensions_width_cm`: Genişlik (cm)
- `dimensions_height_cm`: Yükseklik (cm)

**Capacity**:
- `weight_capacity_kg`: Maksimum ağırlık kapasitesi
- `volume_capacity_cubic_meter`: Hacim kapasitesi

### Container Tipleri

**`container_type` Örnekleri**:
- `pallet`: Standard pallet (120x80x150cm)
- `euro_pallet`: Euro pallet (120x100x150cm)
- `box_large`: Large box container
- `box_small`: Small box container
- `container_20ft`: 20-foot shipping container
- `container_40ft`: 40-foot shipping container

### Container Lifecycle

```
1. Container creation → is_active=true, is_in_use=false
   ↓
2. Cargo assignment → is_in_use=true
   ↓
3. Cargo loaded → loaded_date recorded
   ↓
4. Cargo unloaded → unloaded_date recorded, is_in_use=false
   ↓
5. Container available for reuse
```

---

## 🔗 Container-Cargo Assignment Workflow

### Assignment Tracking

**`container_cargo_assignment` Tablosu**:
- **assigned_date**: Container kargoয়a atandı
- **loaded_date**: Kargo container'a fiziksel olarak yüklendi
- **unloaded_date**: Kargo container'dan boşaltıldı
- **position_in_container**: Container içindeki pozisyon (optional)

### CHECK Constraints

**Date Logic**:
```sql
CHECK (loaded_date IS NULL OR loaded_date >= assigned_date)
CHECK (unloaded_date IS NULL OR unloaded_date >= loaded_date)
```

**Garantiler**:
- Yükleme, atamadan önce olamaz
- Boşaltma, yüklemeden önce olamaz

### Assignment States

**State Tracking**:
```
assigned_date = X, loaded_date = NULL, unloaded_date = NULL
  → Assigned but not yet loaded

assigned_date = X, loaded_date = Y, unloaded_date = NULL
  → Currently loaded

assigned_date = X, loaded_date = Y, unloaded_date = Z
  → Completed (unloaded)
```

### Position in Container

**`position_in_container` Kullanımı**:
- Free-text field (örn: "TOP-LEFT", "BOTTOM-RIGHT", "LAYER-2-SLOT-5")
- Container içinde kargo yerleşim tracking
- Unloading optimization için kullanılır

**Örnek**:
```json
{
  "layer": 2,
  "position": "center",
  "slot": 5
}
```

---

## 🔌 Integration with Barcode Module

### Physical Location Scanning

**Barcode Scanning @ Warehouse**:

1. **Inbound Scan** (Migration 018 barcode ile entegre):
```
Kargo warehouse'a girer
  ↓
Barcode/QR kod taranır (cargo_barcode tablosu)
  ↓
cargo_id bulunur
  ↓
Warehouse location atanır (warehouse_location)
  ↓
Container assignment oluşturulur (container_cargo_assignment)
```

2. **Location Change Scan**:
```
Kargo bir lokasyondan diğerine taşınır
  ↓
Barcode taranır
  ↓
Yeni warehouse_location_id güncellenir
  ↓
Movement history kaydedilir (cargo_movement_history - Migration 005)
```

3. **Outbound Scan**:
```
Kargo warehouse'dan çıkar
  ↓
Barcode taranır
  ↓
Container'dan unload edilir (unloaded_date set)
  ↓
Warehouse location temizlenir
  ↓
Route assignment yapılır (routing module - Migration 010)
```

### Location-Based Queries

**Find Cargo in Warehouse**:
```sql
-- Belirli warehouse'daki tüm kargolar
SELECT c.* FROM cargo c
JOIN cargo_movement_history cmh ON c.id = cmh.cargo_id
JOIN branch b ON cmh.branch_id = b.id
JOIN warehouse w ON b.warehouse_id = w.id
WHERE w.id = $1 AND cmh.is_current_location = true
```

---

## 🚚 Integration with Route & Cargo

### Distribution Planning

**Warehouse → Route Connection**:

1. **Cargo at Warehouse**:
   - Kargo warehouse'a ulaşır
   - `cargo_movement_history` kaydedilir (Migration 005)
   - Warehouse location atanır

2. **Route Planning**:
   - Destination warehouse belirlenir
   - Route oluşturulur (routing module - Migration 010)
   - Container assignment yapılır

3. **Cargo Departure**:
   - Container loaded
   - Route başlatılır
   - Warehouse location boşaltılır

### Depot Function

**Warehouse as Hub**:
- **Collection Point**: Kargolar toplanır
- **Sorting Center**: Destination bazında sıralanır
- **Distribution Hub**: Hedef warehouse'lara yönlendirilir

---

## 📈 Scalability Considerations

### Index Strategy

**Performance Indexes** (migration SQL'den):
```sql
-- Warehouse lookups
CREATE INDEX idx_warehouse_code ON warehouse(warehouse_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_warehouse_country_id ON warehouse(country_id) WHERE deleted_at IS NULL;

-- Location lookups
CREATE INDEX idx_warehouse_location_warehouse_id ON warehouse_location(warehouse_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_warehouse_location_unique ON warehouse_location(warehouse_id, location_code) WHERE deleted_at IS NULL;

-- Capacity tracking
CREATE INDEX idx_warehouse_capacity_warehouse_id ON warehouse_capacity(warehouse_id);

-- Container tracking
CREATE INDEX idx_container_code ON container(container_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_container_warehouse_id ON container(warehouse_id) WHERE deleted_at IS NULL AND is_in_use = true;

-- Assignment tracking
CREATE INDEX idx_container_cargo_assignment_container_id ON container_cargo_assignment(container_id);
CREATE INDEX idx_container_cargo_assignment_cargo_id ON container_cargo_assignment(cargo_id);
```

### Query Optimization

**Partial Indexes**:
- WHERE deleted_at IS NULL → Soft delete filtering at DB level
- WHERE is_in_use = true → Active container tracking

**Unique Constraints**:
- `warehouse_code UNIQUE` → Fast warehouse lookup
- `container_code UNIQUE` → Fast container lookup
- `(warehouse_id, location_code) UNIQUE` → Prevent duplicate locations

### Scalability Patterns

**Horizontal Scaling**:
- Warehouse data partitionable by country_id
- Read replicas for warehouse queries
- Cache layer for frequently accessed warehouses

**Vertical Scaling**:
- Warehouse location count can grow to thousands
- Container assignments can accumulate (millions over time)
- Archival strategy for old assignments (gelecek migration)

---

## 🏗️ Backend Implementation

### Oluşturulan Modüller

1. **WarehouseModule** - `src/warehouse/warehouse/`
   - Warehouse master data management
   - Country/city based queries
   - Active warehouse filtering

2. **WarehouseLocationModule** - `src/warehouse/warehouse-location/`
   - Storage location tracking
   - 3D coordinate management
   - Location capacity tracking

3. **WarehouseCapacityModule** - `src/warehouse/warehouse-capacity/`
   - Multi-metric capacity tracking (volume, weight, area)
   - Alert threshold monitoring
   - Capacity type validation

4. **ContainerModule** - `src/warehouse/container/`
   - Physical container management
   - Dimension and capacity tracking
   - Active/in-use state management

5. **ContainerCargoAssignmentModule** - `src/warehouse/container-cargo-assignment/`
   - Container-cargo assignment tracking
   - Loading/unloading date management
   - Position tracking

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Soft delete desteği (uygun tablolarda)
- No ORM, no query builders

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping (`mapToDto()`)
- Decimal dönüşümleri (`parseFloat()`)
- Date string conversions (`toISOString()`)
- Exception handling (`NotFoundException`)

#### 3. Controller Katmanı

- HTTP endpoint'leri (READ-ONLY, GET methods only)
- RESTful API tasarımı
- Query parameter desteği
- ParseIntPipe validation

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları
- Enum validasyonları (`@IsIn`)
- Optional field handling

### API Endpoints

#### Warehouses

- `GET /warehouse` - Tüm warehouse'lar
- `GET /warehouse/active` - Aktif warehouse'lar
- `GET /warehouse/country/:countryId` - Ülke bazlı
- `GET /warehouse/code/:warehouseCode` - Kod bazlı
- `GET /warehouse/uuid/:uuid` - UUID bazlı
- `GET /warehouse/:id` - ID bazlı

#### Warehouse Locations

- `GET /warehouse/locations` - Tüm lokasyonlar
- `GET /warehouse/locations/active` - Aktif lokasyonlar
- `GET /warehouse/locations/warehouse/:warehouseId` - Warehouse bazlı
- `GET /warehouse/locations/warehouse/:warehouseId/code/:locationCode` - Location kod bazlı
- `GET /warehouse/locations/:id` - ID bazlı

#### Warehouse Capacities

- `GET /warehouse/capacities` - Tüm kapasite kayıtları
- `GET /warehouse/capacities/alerts` - Alert threshold exceeded
- `GET /warehouse/capacities/warehouse/:warehouseId` - Warehouse bazlı
- `GET /warehouse/capacities/type/:capacityType` - Tip bazlı (volume/weight/area)
- `GET /warehouse/capacities/:id` - ID bazlı

#### Containers

- `GET /warehouse/containers` - Tüm container'lar
- `GET /warehouse/containers/active` - Aktif container'lar
- `GET /warehouse/containers/in-use` - Kullanımda olanlar
- `GET /warehouse/containers/warehouse/:warehouseId` - Warehouse bazlı
- `GET /warehouse/containers/code/:containerCode` - Kod bazlı
- `GET /warehouse/containers/uuid/:uuid` - UUID bazlı
- `GET /warehouse/containers/:id` - ID bazlı

#### Container Cargo Assignments

- `GET /warehouse/container-cargo-assignments` - Tüm atamalar
- `GET /warehouse/container-cargo-assignments/container/:containerId` - Container bazlı
- `GET /warehouse/container-cargo-assignments/cargo/:cargoId` - Kargo bazlı
- `GET /warehouse/container-cargo-assignments/:id` - ID bazlı

---

## 🚀 Real-World Logistics Scenarios

### Senaryo 1: Warehouse Açılışı

```
1. Yeni warehouse oluşturulur (future write endpoint)
   ↓
2. warehouse kaydı:
   - warehouse_code: "IST-001"
   - warehouse_name: "İstanbul Ana Depo"
   - country_id: 1 (Turkey)
   - city_id: 34 (İstanbul)
   - capacity_volume_cubic_meter: 10000
   - is_active: true
   ↓
3. warehouse_location kayıtları oluşturulur:
   - "A-01-01", "A-01-02", ..., "A-10-50" (500 locations)
   - coordinates_x, coordinates_y, coordinates_z set
   ↓
4. warehouse_capacity tracking başlatılır:
   - Type: volume, max: 10000 m³, current: 0
   - Type: weight, max: 500000 kg, current: 0
   - Type: area, max: 5000 m², current: 0
```

### Senaryo 2: Kargo Warehouse'a Giriş

```
1. Kargo warehouse'a gelir (truck/plane)
   ↓
2. Receiving zone'da barcode taranır (Migration 018)
   ↓
3. cargo_barcode → cargo_id bulunur
   ↓
4. Available warehouse_location bulunur:
   - GET /warehouse/locations/warehouse/1?active=true
   - Capacity uygun location seçilir
   ↓
5. Kargo location'a yerleştirilir
   - cargo_movement_history update (Migration 005)
   - warehouse_capacity.current_usage update
   ↓
6. Container assignment oluşturulur (optional):
   - container_cargo_assignment kaydı
   - assigned_date: NOW()
   - loaded_date: NULL (henüz yüklenmedi)
```

### Senaryo 3: Container Yükleme

```
1. Kargo container'a yüklenecek
   ↓
2. Available container bulunur:
   - GET /warehouse/containers/warehouse/1?active=true&in-use=false
   ↓
3. Container seçilir (capacity check)
   ↓
4. container_cargo_assignment oluşturulur:
   - container_id: 5
   - cargo_id: 123
   - assigned_date: NOW()
   ↓
5. Fiziksel yükleme yapılır
   ↓
6. Assignment güncellenir (future update endpoint):
   - loaded_date: NOW()
   - position_in_container: "LAYER-1-SLOT-3"
   ↓
7. Container state güncellenir:
   - is_in_use: true
```

### Senaryo 4: Kapasite Uyarısı

```
1. Kargo warehouse'a sürekli geliyor
   ↓
2. warehouse_capacity.current_usage artıyor
   ↓
3. Alert threshold check:
   - current: 8500 m³
   - max: 10000 m³
   - usage: 85%
   - threshold: 80%
   ↓
4. GET /warehouse/capacities/alerts çağrılır
   ↓
5. Alert notification gönderilir (future integration):
   - "İstanbul Ana Depo kapasite %85'e ulaştı"
   - Action: Yeni depo planlaması veya cargo redistribution
```

### Senaryo 5: Warehouse Location Reorganization

```
1. Warehouse layout değişikliği gerekiyor
   ↓
2. Bazı location'lar pasif yapılır (future update endpoint):
   - warehouse_location.is_active = false
   - Mevcut kargolar başka location'lara taşınır
   ↓
3. Fiziksel raf değişikliği yapılır
   ↓
4. Yeni location'lar oluşturulur:
   - Yeni coordinates
   - Yeni capacity değerleri
   ↓
5. Location'lar aktif yapılır:
   - is_active = true
   ↓
6. Kargolar yeni layouta göre yerleştirilir
```

---

## 🚫 Explicitly Deferred Components

### Intentionally Postponed to Migrations 020-022

Bu migration **SADECE** fiziksel ve yapısal warehouse altyapısını kapsar. Aşağıdaki operasyonel ve workflow bileşenleri **gelecek migrations'larda** implement edilecektir:

#### 1. **Warehouse Stock Management** (Migration 020)

**`warehouse_stock` Tablosu**:
- Ürün kategorisi bazında stok miktarı takibi
- Min/max threshold management
- Gerçek zamanlı stok sayımı

**Neden Ertelendi**:
- Stock management ayrı bir business domain
- Inventory tracking workflows gerektirir
- Bu migration sadece fiziksel yapı ile sınırlı

#### 2. **Stock Alert System** (Migration 020)

**`stock_alert` Tablosu**:
- Low stock, overstock, expiring soon alerts
- Alert resolution tracking
- Employee assignment

**Neden Ertelendi**:
- Alert orchestration logic gerektirir
- Notification system integration needed
- Operasyonel workflow, yapısal değil

#### 3. **Warehouse Receipt Processing** (Migration 021)

**`warehouse_receipt` Tablosu**:
- Inbound cargo receipt management
- Verification workflows
- JSONB cargo list handling

**Neden Ertelendi**:
- Inbound processing workflows karmaşık
- Verification ve approval logic gerektirir
- Employee role integration needed

#### 4. **Consolidation Order Management** (Migration 022)

**`consolidation_order` Tablosu**:
- Multi-cargo consolidation
- Destination country grouping
- Consolidation workflows

**Neden Ertelendi**:
- Consolidation business logic gerektirir
- Multi-cargo orchestration complex
- Route planning integration needed

### Incremental Layering Philosophy

**Cursor's Architectural Approach**:
1. **Migration 019**: Physical infrastructure (warehouses, locations, containers)
2. **Migration 020**: Inventory tracking (stock, alerts)
3. **Migration 021**: Inbound workflows (receipts, verification)
4. **Migration 022**: Consolidation workflows (multi-cargo batching)

**Fayda**:
- Her migration odaklanmış ve test edilebilir
- Dependency management basitleşir
- Incremental deployment mümkün olur
- Code review ve validation kolaylaşır

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. Write operations (create, update, delete) gelecek business logic migrations'ında eklenecektir.

2. **No ORM**: Tüm database queries raw SQL ile yazılmıştır. No TypeORM, no Prisma, no query builders.

3. **Soft Delete**: `warehouse`, `warehouse_location`, `container` tablolarında soft delete mevcuttur (`deleted_at` field).

4. **No Soft Delete**: `warehouse_capacity`, `container_cargo_assignment` tablolarında soft delete yoktur (metrics ve history korunur).

5. **Decimal Handling**: Tüm decimal field'ler (`parseFloat()`) ile number'a convert edilir DTO'da.

6. **Date Handling**: Tüm date field'ler (`toISOString()`) ile ISO 8601 string'e convert edilir.

7. **Enum Validation**: `capacity_type` field'i CHECK constraint + `@IsIn` decorator ile validate edilir.

8. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

9. **Indexes**: Performance için partial ve composite index'ler eklenmiştir (soft delete aware).

10. **UNIQUE Constraints**: `warehouse_code`, `container_code`, `(warehouse_id, location_code)` unique constraint'leri mevcuttur.

---
