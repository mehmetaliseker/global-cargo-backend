# Migration 020: Fleet & Vehicle Tables

## 📋 Genel Bakış

Migration 020, Global Cargo Backend sistemine **Fleet & Vehicle Infrastructure** ekler. Bu migration, fiziksel taşıma varlıkları (araçlar), araç tipleri, bakım geçmişi ve araç-kargo atamaları için gerekli taban yapısını oluşturur.

### Tablolar

1. **`vehicle_type`** - Araç tip tanımları (truck, van, motorcycle)
2. **`vehicle`** - Fiziksel araç master kaydı
3. **`vehicle_maintenance`** - Araç bakım geçmişi
4. **`vehicle_cargo_assignment`** - Araç-kargo atama geçmişi

**⚠️ Not**: Bu migration SADECE fiziksel vehicle infrastructure'ı kapsar. Operasyonel bileşenler (vehicle_route, vehicle_location_history, vehicle_fuel_log, vehicle_cost) gelecek migrations'larda implement edilecektir.

---

## 🚛 Fleet vs Vehicle Distinction

### Fleet Kavramı

**Fleet Tanımı**:
- Belli bir branch/organizasyona ait araç filosu
- Araç gruplarının idari organizasyonu
- Maliyet merkezi ve yönetim birimi

**Özellikler**:
- Fleet Master Record (gelecek migration)
- Branch bazlı fleet ownership
- Fleet-level analytics ve reporting

### Vehicle Kavramı

**Vehicle Tanımı**:
- Fiziksel taşıma varlığı (truck, van, motorcycle)
- License plate ile unique identification
- Capacity ve teknik özellikler

**Özellikler**:
- Physical asset tracking
- Maintenance lifecycle
- Cargo assignment history

### İlişki Modeli

```
Branch
  └── Fleet (organization unit)
      └── Vehicles (physical assets)
          ├── Vehicle Type (truck, van, motorcycle)
          ├── Maintenance History
          └── Cargo Assignments
```

**Architecture Note**: Bu migration'da fleet tablosu placeholder olarak implement edilmiştir. Gelecek migrations'da fleet ownership ve management özellikleri eklenecektir.

---

## 🚗 Vehicle Type Modeling

### Araç Tip Sistemi

**`vehicle_type` Tablosu**:
- **type_code**: Unique type identifier (örn: "TRUCK-40T", "VAN-3.5T")
- **type_name**: Human-readable name
- **default_capacity_weight_kg**: Standart ağırlık kapasitesi
- **default_capacity_volume_cubic_meter**: Standart hacim kapasitesi

### Standart Araç Tipleri

**Truck Types**:
```
TRUCK-40T: 40 ton kamyon (90 m³)
TRUCK-20T: 20 ton kamyon (50 m³)
TRUCK-10T: 10 ton kamyon (30 m³)
```

**Van Types**:
```
VAN-3.5T: 3.5 ton panelvan (15 m³)
VAN-1.5T: 1.5 ton hafif van (8 m³)
```

**Motorcycle/Small**:
```
MOTORCYCLE: Motorsiklet (0.1 m³)
PICKUP: Pickup truck (2 m³)
```

### Vehicle Type Override

**`vehicle.vehicle_type_override`**:
- Optional field
- Allows custom type specification
- Overrides default vehicle_type relationship

**Kullanım Senaryosu**:
```typescript
// Standard vehicle type
vehicle_type_id: 5 (TRUCK-40T)
vehicle_type_override: null

// Custom override
vehicle_type_id: null
vehicle_type_override: "REFRIGERATED-TRUCK-35T"
```

---

## 📊 Capacity Modeling

### Vehicle Capacity Tracking

**Capacity Fields on `vehicle`**:
- `capacity_weight_kg`: Maksimum ağırlık kapasitesi
- `capacity_volume_cubic_meter`: Maksimum hacim kapasitesi

### Capacity Inheritance

**Cascade Logic**:
```
1. vehicle.capacity_weight_kg (vehicle-specific)
   ↓ (if null)
2. vehicle_type.default_capacity_weight_kg (type default)
```

**Örnek**:
```sql
-- Vehicle with custom capacity
vehicle_id: 1
capacity_weight_kg: 38000  -- Custom (different from type default)
capacity_volume_cubic_meter: 85
vehicle_type_id: TRUCK-40T -- Type default: 40000 kg, 90 m³

-- Vehicle using type defaults
vehicle_id: 2
capacity_weight_kg: NULL  -- Will use type default
vehicle_type_id: VAN-3.5T -- Type default: 3500 kg, 15 m³
```

### Real-World Variations

**Why Override Capacity?**:
- Vehicle modifications (custom trailer)
- Age-related capacity reduction
- Special equipment installation
- Regulatory compliance adjustments

---

## 🔧 Maintenance Lifecycle

### Maintenance Types

**`vehicle_maintenance.maintenance_type` Örnekleri**:
- `routine`: Rutin bakım (oil change, filter replacement)
- `repair`: Onarım (engine repair, brake replacement)
- `inspection`: Muayene (annual inspection, safety check)
- `tire_change`: Lastik değişimi
- `bodywork`: Kaporta işleri
- `electrical`: Elektrik sistemi

### Maintenance Scheduling

**Tarih Mantığı**:
```sql
-- Bakım yapıldı
maintenance_date: 2024-01-15

-- Sonraki bakım tarihi
next_maintenance_date: 2024-04-15 (3 ay sonra)

-- CHECK constraint
CHECK (next_maintenance_date IS NULL OR next_maintenance_date >= maintenance_date)
```

### Upcoming Maintenance Query

**Repository Method**:
```typescript
async findUpcomingMaintenance(): Promise<VehicleMaintenanceEntity[]> {
  const query = `
    SELECT * FROM vehicle_maintenance
    WHERE next_maintenance_date IS NOT NULL
      AND next_maintenance_date >= CURRENT_DATE
    ORDER BY next_maintenance_date ASC
  `;
  return await this.databaseService.query(query);
}
```

**Kullanım**:
- Fleet management dashboard
- Preventive maintenance alerts
- Cost planning

### Maintenance Cost Tracking

**`vehicle_maintenance.cost`**:
- Bakım maliyeti (decimal)
- Currency handling (future integration with billing)
- Cost analytics için kullanılır

---

## 🔗 Vehicle-Cargo Assignment

### Assignment Lifecycle

**`vehicle_cargo_assignment` States**:

```
1. Assignment Created
   assigned_date: 2024-01-15T10:00:00Z
   loaded_date: NULL
   unloaded_date: NULL
   → Vehicle atandı, henüz yüklenmedi

2. Cargo Loaded
   assigned_date: 2024-01-15T10:00:00Z
   loaded_date: 2024-01-15T14:30:00Z
   unloaded_date: NULL
   → Kargo vehicle'a yüklendi

3. Cargo Unloaded
   assigned_date: 2024-01-15T10:00:00Z
   loaded_date: 2024-01-15T14:30:00Z
   unloaded_date: 2024-01-16T09:00:00Z
   → Workflow tamamlandı
```

### CHECK Constraints

**Date Logic**:
```sql
CHECK (loaded_date IS NULL OR loaded_date >= assigned_date)
CHECK (unloaded_date IS NULL OR unloaded_date >= loaded_date)
```

**Garantiler**:
- Yükleme, atamadan önce olamaz
- Boşaltma, yüklemeden önce olamaz
- Data integrity korunur

### Route Integration

**`vehicle_cargo_assignment.route_id`**:
- Optional foreign key to route table
- Links cargo assignment to specific route
- ON DELETE SET NULL (route silinirse assignment korunur)

**Kullanım**:
```sql
-- Route-specific cargo assignments
SELECT * FROM vehicle_cargo_assignment
WHERE route_id = 123
ORDER BY assigned_date
```

---

## 🚦 Vehicle State Management

### Active/Inactive State

**`vehicle.is_active`**:
- `true`: Vehicle operasyonel, kullanıma hazır
- `false`: Vehicle devre dışı, bakımda, veya hurdaya çıkarılmış

**Kullanım**:
```sql
-- Sadece aktif vehicle'lar
SELECT * FROM vehicle
WHERE is_active = true AND deleted_at IS NULL
```

### In-Use State

**`vehicle.is_in_use`**:
- `true`: Vehicle şu anda route'ta, cargo taşıyor
- `false`: Vehicle boş, yeni assignment bekliyor

**State Machine**:
```
is_active=true, is_in_use=false  → Available for assignment
is_active=true, is_in_use=true   → Currently on route
is_active=false, is_in_use=false → Out of service
is_active=false, is_in_use=true  → Invalid state (data integrity issue)
```

### Soft Delete Strategy

**Tables with Soft Delete**:
- ✅ `vehicle_type`: deleted_at (type retired)
- ✅ `vehicle`: deleted_at (vehicle scrapped)

**Tables WITHOUT Soft Delete**:
- ❌ `vehicle_maintenance`: Immutable history
- ❌ `vehicle_cargo_assignment`: Immutable history

**Rationale**: Maintenance ve assignment records audit trail olarak korunur, asla silinmez.

---

## 🔗 Integration with Warehouse Module

### Warehouse-Vehicle Connection

**Vehicle → Warehouse Assignment** (Gelecek Migration):
```
vehicle.current_warehouse_id (future field)
  → Links vehicle to current warehouse location
```

**Kullanım Senaryosu**:
1. Vehicle warehouse'a gelir
2. Cargo loaded from warehouse (container_cargo_assignment)
3. Vehicle departure
4. Vehicle cargo assignment created
5. Route execution başlar

### Container-Vehicle Workflow

**Combined Assignment**:
```
warehouse: container_cargo_assignment (Migration 019)
  ↓
fleet: vehicle_cargo_assignment (Migration 020)
  ↓
routing: route execution (Future Migration)
```

**Flow**:
```
1. Cargo container'a atanır (warehouse)
2. Container vehicle'a yüklenir
3. Vehicle cargo assignment oluşturulur
4. Route başlatılır
5. Tracking başlar (future)
```

---

## 🚚 Integration with Route Module

### Route-Vehicle Assignment

**`vehicle_cargo_assignment.route_id`**:
- Optional link to route
- Enables route-specific cargo tracking
- Future route execution planning

### Route Planning Context

**Future Route Module** (Migration 021+):
```
route
  ├── vehicle_route (vehicle assignment)
  └── vehicle_cargo_assignment (cargo tracking)
```

**Route Execution** (Future):
- Vehicle assigned to route
- Cargo loaded per route plan
- Location tracking enabled
- ETAs calculated
- Delivery confirmations

---

## 🎯 Scalability & Performance

### Index Strategy

**Performance Indexes** (from migration SQL):
```sql
-- Vehicle lookups
CREATE INDEX idx_vehicle_code ON vehicle(vehicle_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_vehicle_license_plate ON vehicle(license_plate) WHERE deleted_at IS NULL;
CREATE INDEX idx_vehicle_is_in_use ON vehicle(is_in_use) WHERE deleted_at IS NULL AND is_in_use = true;

-- Vehicle type lookups
CREATE INDEX idx_vehicle_type_code ON vehicle_type(type_code) WHERE deleted_at IS NULL;

-- Maintenance tracking
CREATE INDEX idx_vehicle_maintenance_vehicle_id ON vehicle_maintenance(vehicle_id);
CREATE INDEX idx_vehicle_maintenance_next_date ON vehicle_maintenance(next_maintenance_date) WHERE next_maintenance_date IS NOT NULL;

-- Assignment tracking
CREATE INDEX idx_vehicle_cargo_assignment_vehicle_id ON vehicle_cargo_assignment(vehicle_id);
CREATE INDEX idx_vehicle_cargo_assignment_cargo_id ON vehicle_cargo_assignment(cargo_id);
```

### Partial Indexes

**Soft Delete Aware**:
- `WHERE deleted_at IS NULL` → Filters out soft-deleted records at DB level
- `WHERE is_in_use = true` → Optimizes active vehicle queries
- `WHERE next_maintenance_date IS NOT NULL` → Maintenance planning queries

### Unique Constraints

**Data Integrity**:
- `vehicle_code UNIQUE` → Fast vehicle lookup
- `license_plate UNIQUE` → Prevents duplicate registration
- `type_code UNIQUE` → Type identification

### Scalability Patterns

**Horizontal Scaling**:
- Vehicle data partitionable by branch_id (future)
- Read replicas for fleet analytics
- Cache layer for frequently accessed vehicles

**Archival Strategy** (Future):
- Old maintenance records → archive table
- Completed assignments → historical partition
- Soft-deleted vehicles → cold storage

---

## 🏗️ Backend Implementation

### Oluşturulan Modüller

1. **FleetModule** - `src/fleet/fleet/`
   - Fleet master data (placeholder for future expansion)
   - Branch-based fleet organization

2. **VehicleTypeModule** - `src/fleet/vehicle-type/`
   - Vehicle type definitions
   - Default capacity management

3. **VehicleModule** - `src/fleet/vehicle/`
   - Physical vehicle tracking
   - License plate management
   - Active/in-use state management

4. **VehicleMaintenanceModule** - `src/fleet/vehicle-maintenance/`
   - Maintenance history tracking
   - Upcoming maintenance queries
   - Cost tracking

5. **VehicleCargoAssignmentModule** - `src/fleet/vehicle-cargo-assignment/`
   - Vehicle-cargo assignment history
   - Loading/unloading date tracking
   - Route integration

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
- Optional field handling

### API Endpoints

#### Fleet

- `GET /fleet` - Tüm fleet'ler
- `GET /fleet/active` - Aktif fleet'ler
- `GET /fleet/code/:fleetCode` - Kod bazlı
- `GET /fleet/:id` - ID bazlı

#### Vehicle Types

- `GET /fleet/vehicle-types` - Tüm araç tipleri
- `GET /fleet/vehicle-types/active` - Aktif tipler
- `GET /fleet/vehicle-types/code/:typeCode` - Kod bazlı
- `GET /fleet/vehicle-types/:id` - ID bazlı

#### Vehicles

- `GET /fleet/vehicles` - Tüm araçlar
- `GET /fleet/vehicles/active` - Aktif araçlar
- `GET /fleet/vehicles/in-use` - Kullanımda olanlar
- `GET /fleet/vehicles/code/:vehicleCode` - Kod bazlı
- `GET /fleet/vehicles/plate/:licensePlate` - Plaka bazlı
- `GET /fleet/vehicles/uuid/:uuid` - UUID bazlı
- `GET /fleet/vehicles/:id` - ID bazlı

#### Vehicle Maintenance

- `GET /fleet/vehicle-maintenance` - Tüm bakım kayıtları
- `GET /fleet/vehicle-maintenance/upcoming` - Gelecek bakımlar
- `GET /fleet/vehicle-maintenance/vehicle/:vehicleId` - Araç bazlı
- `GET /fleet/vehicle-maintenance/:id` - ID bazlı

#### Vehicle Cargo Assignments

- `GET /fleet/vehicle-cargo-assignments` - Tüm atamalar
- `GET /fleet/vehicle-cargo-assignments/vehicle/:vehicleId` - Araç bazlı
- `GET /fleet/vehicle-cargo-assignments/cargo/:cargoId` - Kargo bazlı
- `GET /fleet/vehicle-cargo-assignments/route/:routeId` - Route bazlı
- `GET /fleet/vehicle-cargo-assignments/:id` - ID bazlı

---

## 🚀 Real-World Logistics Scenarios

### Senaryo 1: Yeni Araç Filosu Oluşturma

```
1. Vehicle types tanımlanır
   ↓
2. Fleet oluşturulur:
   - fleet_code: "IST-FLEET-001"
   - fleet_name: "İstanbul Merkez Filosu"
   - branch_id: 1 (İstanbul Branch)
   ↓
3. Vehicles eklenir:
   - Vehicle 1: TRUCK-40T, 34ABC123
   - Vehicle 2: VAN-3.5T, 34DEF456
   - Vehicle 3: MOTORCYCLE, 34GHI789
   ↓
4. Initial maintenance records oluşturulur:
   - Muayene tarihleri
   - Sonraki bakım planları
```

### Senaryo 2: Kargo Atama ve Taşıma

```
1. Kargo warehouse'da hazır
   ↓
2. Available vehicle bulunur:
   - GET /fleet/vehicles/active?in-use=false
   - Vehicle 34ABC123 (TRUCK-40T) seçilir
   ↓
3. Vehicle cargo assignment oluşturulur:
   - vehicle_id: 5
   - cargo_id: 123
   - assigned_date: NOW()
   - loaded_date: NULL
   ↓
4. Kargo yüklenir:
   - loaded_date: NOW()
   - vehicle.is_in_use = true
   ↓
5. Route başlatılır (future):
   - route_id: 50
   - Tracking enabled
   - ETA calculated
   ↓
6. Teslimat yapılır:
   - unloaded_date: NOW()
   - vehicle.is_in_use = false
```

### Senaryo 3: Preventive Maintenance

```
1. Upcoming maintenance query çalışır:
   - GET /fleet/vehicle-maintenance/upcoming
   ↓
2. Sonuç:
   - Vehicle 34ABC123: Next maintenance 2024-02-01 (5 gün sonra)
   - Vehicle 34DEF456: Next maintenance 2024-02-15 (19 gün sonra)
   ↓
3. Maintenance planlanır:
   - Vehicle 34ABC123 route'lardan alınır
   - is_active: false (temporarily)
   ↓
4. Bakım yapılır:
   - New maintenance record created
   - maintenance_type: 'routine'
   - cost: 5000.00 TL
   - next_maintenance_date: 2024-05-01
   ↓
5. Vehicle operasyona geri döner:
   - is_active: true
   - Available for new assignments
```

### Senaryo 4: Fleet Capacity Analysis

```
1. Fleet total capacity hesaplanır:
   - Query tüm aktif vehicles
   - Sum capacity_weight_kg
   - Sum capacity_volume_cubic_meter
   ↓
2. Sonuç:
   - Total weight capacity: 150,000 kg
   - Total volume capacity: 300 m³
   ↓
3. Current utilization:
   - Active assignments query
   - Calculate loaded cargo weight/volume
   - Utilization percentage: 65%
   ↓
4. Decision:
   - Capacity sufficient ✅
   - No new vehicle acquisition needed
```

### Senaryo 5: Vehicle License Plate Lookup

```
1. Physical checkpoint'te plaka taranır:
   - License plate: 34ABC123
   ↓
2. Vehicle bulunur:
   - GET /fleet/vehicles/plate/34ABC123
   ↓
3. Vehicle details:
   - vehicle_code: "TRK-001"
   - vehicle_type: TRUCK-40T
   - is_in_use: true
   ↓
4. Current cargo assignments:
   - GET /fleet/vehicle-cargo-assignments/vehicle/5
   - 3 active cargo assignments
   ↓
5. Checkpoint validation:
   - Expected cargo match confirmed
   - Route continuation approved
```

---

## 🚫 Explicitly Deferred Components

### Intentionally Postponed to Future Migrations

Bu migration **SADECE** fiziksel vehicle infrastructure'ı kapsar. Aşağıdaki operasyonel ve tracking bileşenleri **gelecek migrations'larda** implement edilecektir:

#### 1. **Vehicle Route Execution** (Migration 021+)

**`vehicle_route` Tablosu**:
- Route-vehicle assignment
- Driver assignment
- Departure/arrival tracking
- Route status management

**Neden Ertelendi**:
- Route execution ayrı bir business domain
- Driver management workflows gerektirir
- Real-time status tracking needed

#### 2. **Vehicle Location Tracking** (Migration 022+)

**`vehicle_location_history` Tablosu**:
- GPS coordinates tracking
- Speed and direction monitoring
- Location timestamp history
- GPS accuracy tracking

**Neden Ertelendi**:
- Real-time telemetry infrastructure gerektirir
- GPS device integration needed
- High-volume time-series data handling

#### 3. **Vehicle Fuel Management** (Migration 023+)

**`vehicle_fuel_log` Tablosu**:
- Fuel refueling history
- Fuel cost tracking
- Odometer reading
- Refuel location tracking

**Neden Ertelendi**:
- Fuel management workflows karmaşık
- Cost analytics infrastructure needed
- Employee refuel tracking

#### 4. **Vehicle Cost Analytics** (Migration 024+)

**`vehicle_cost` Tablosu**:
- Periodic cost tracking
- Cost type categorization (insurance, tax, maintenance)
- Period-based cost analysis
- Fleet cost optimization

**Neden Ertelendi**:
- Cost analytics business logic gerektirir
- Period-based reporting infrastructure needed
- Integration with billing module

### Incremental Layering Philosophy

**Cursor's Architectural Approach**:
1. **Migration 020**: Physical infrastructure (vehicles, types, maintenance, assignments)
2. **Migration 021**: Route execution (route-vehicle links, driver workflows)
3. **Migration 022**: Location tracking (GPS, telemetry)
4. **Migration 023**: Fuel management (refueling, cost tracking)
5. **Migration 024**: Cost analytics (comprehensive financial tracking)

**Fayda**:
- Her migration odaklanmış ve test edilebilir
- Dependency management basitleşir
- Incremental deployment mümkün olur
- Code review ve validation kolaylaşır

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. Write operations (create, update, delete) gelecek business logic migrations'ında eklenecektir.

2. **No ORM**: Tüm database queries raw SQL ile yazılmıştır. No TypeORM, no Prisma, no query builders.

3. **Soft Delete**: `vehicle_type`, `vehicle` tablolarında soft delete mevcuttur (`deleted_at` field).

4. **No Soft Delete**: `vehicle_maintenance`, `vehicle_cargo_assignment` tablolarında soft delete yoktur (immutable history).

5. **Decimal Handling**: Tüm decimal field'ler (`parseFloat()`) ile number'a convert edilir DTO'da.

6. **Date Handling**: Tüm date field'ler (`toISOString()`) ile ISO 8601 string'e convert edilir.

7. **CHECK Constraints**: Date logic ve fuel amount constraints DB level'da enforce edilir.

8. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

9. **Indexes**: Performance için partial ve composite index'ler eklenmiştir (soft delete aware).

10. **UNIQUE Constraints**: `vehicle_code`, `license_plate`, `type_code` unique constraint'leri mevcuttur.

---
