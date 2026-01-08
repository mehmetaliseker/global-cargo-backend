# Migration 022: Cold Chain & Special Handling Tables

## 📋 Genel Bakış

Migration 022, Global Cargo Backend sistemine **Cold Chain Logistics & Special Handling Infrastructure** ekler. Bu migration, sıcaklık kontrollü kargolar, tehlikeli maddeler, özel ambalaj gereksinimleri ve teslimat zaman aralıkları için gerekli yapısal altyapıyı oluşturur.

### Tablolar

1. **`cold_chain_cargo`** - Soğuk zincir gereksinimleri
2. **`temperature_log`** - Sıcaklık izleme kayıtları
3. **`temperature_alert`** - Sıcaklık uyarıları (tracking only)
4. **`delivery_time_slot`** - Teslimat zaman aralık tanımları
5. **`time_slot_booking`** - Zaman aralığı rezervasyonları
6. **`special_packaging_requirement`** - Özel ambalaj gereksinimleri
7. **`hazardous_material_detail`** - Tehlikeli madde detayları
8. **`hazmat_certificate`** - Tehlikeli madde sertifikalar

**🚨 CRITICAL NOTE**: Bu migration **SADECE YAPISAL ALTYAPI**dır. Sıcaklık uyarıları otomatik olarak tetiklenmez, sevkiyatlar engellenemez, ve operasyonel enforcements yoktur. Bu intentional (kasıtlı) bir tasarım kararıdır.

---

## 🎯 Purpose of Migration 022

### Why Cold Chain Infrastructure Now?

**Business Context**:
- Migrations 001-021 core logistics altyapısını tamamladı
- Kargo tracking (005), warehouse (019), fleet (020) mevcut
- Özel handling requirements artıyor (pharmaceuticals, food, hazmat)
- Environmental monitoring regulatory compliance gerekiyor

**Migration 022 Hedefi**:
- Cold chain infrastructure'ı **ayrı bir katman** olarak eklemek
- Mevcut cargo/shipment systemine **müdahale etmeden** data model hazırlamak
- Temperature monitoring ve hazmat tracking için yapısal foundation oluşturmak

### What This Migration IS

✅ **Structural Infrastructure**:
- Cold chain requirement definitions
- Temperature logging infrastructure
- Hazmat information repository
- Special handling taxonomy
- Audit trail for environmental conditions

✅ **Non-Invasive Design**:
- Nullable sensor references
- No automatic alerts
- No shipment blocking
- Pure observability infrastructure

✅ **Future-Ready**:
- Temperature threshold definitions
- Alert table structure (tracking only)
- Compliance documentation linkage

### What This Migration IS NOT

❌ **NOT Operational**:
- Does NOT auto-block shipments on temperature breach
- Does NOT trigger real-time alerts
- Does NOT enforce SLA penalties
- Does NOT integrate with pricing/insurance

❌ **NOT Coupled**:
- Does NOT require sensor hardware integration
- Does NOT force cargo to have cold chain
- Does NOT break existing shipping workflows

---

## 🌡️ Why Cold Chain Is Modeled Separately

### Architectural Principle: Environmental Constraints vs Business Logic

**Shipment Logic** (Migrations 005, 010):
- **Purpose**: Move cargo from A to B
- **Focus**: Route optimization, branch tracking, status updates
- **Stakeholders**: Operations, logistics
- **Stability**: Predictable, well-defined workflows

**Environmental Constraints** (Migration 022):
- **Purpose**: Maintain cargo integrity during transport
- **Focus**: Temperature, humidity, handling precautions
- **Stakeholders**: Quality assurance, regulatory compliance
- **Variability**: Product-specific, jurisdiction-specific

### Why NOT Embed into Cargo Table?

**Bad Design** (NOT used):
```sql
-- WRONG: Embedding cold chain into cargo
ALTER TABLE cargo ADD COLUMN requires_cold_chain BOOLEAN;
ALTER TABLE cargo ADD COLUMN temp_min DECIMAL(5,2);
ALTER TABLE cargo ADD COLUMN temp_max DECIMAL(5,2);
```

**Why Bad?**:
1. **Sparse Data**: Less than 10% of cargo needs cold chain
2. **Complex Queries**: Filtering cold chain cargo becomes expensive
3. **Schema Pollution**: Adding 10+ nullable columns to core table
4. **Mixed Concerns**: Cargo shipping logic ≠ environmental monitoring

**Good Design** (Migration 022):
```sql
-- CORRECT: Separate table with 1:1 optional relationship
CREATE TABLE cold_chain_cargo (
  cargo_id INTEGER UNIQUE REFERENCES cargo(id)
);
```

**Why Good?**:
1. **Sparse Storage**: Only cold chain cargo has records
2. **Query Efficiency**: JOIN only when needed
3. **Schema Clarity**: Cargo table remains focused
4. **Independent Evolution**: Can add cold chain fields without touching cargo

### Why NOT Enforced via Triggers?

**Avoided Design**:
```sql
-- NOT CREATED:
CREATE TRIGGER check_temperature_on_log_insert
AFTER INSERT ON temperature_log
FOR EACH ROW
EXECUTE FUNCTION alert_if_out_of_range();
```

**Why Avoided?**:
- **Sensor Reliability**: IoT sensors have false positives
- **Alert Fatigue**: Too many alerts → ignored alerts
- **Business Logic**: Alert handling requires human judgment
- **Testing Complexity**: Triggers difficult to test/debug

**Future Pattern** (Migration 023):
```typescript
// Application layer (future)
temperatureMonitoringService.checkAndAlert(temperatureLog);
```

---

## 🔗 Nullable FK Strategy

### Intentional Nullable Foreign Keys

#### 1. `temperature_log.recorded_by` (Nullable)

```sql
recorded_by INTEGER REFERENCES employee(id) ON DELETE SET NULL
```

**Why Nullable?**:
- Automated sensors record temperature (no employee)
- Manual readings recorded by employee
- IoT device readings are machine-generated

**Logic**:
```
IF recorded_by IS NULL THEN automated sensor reading
ELSE manual employee reading
```

#### 2. `temperature_alert.resolved_by` (Nullable)

**Why Nullable?**:
- Alert might not be resolved yet (`resolved_by = NULL`)
- Auto-resolved by system (future) → NULL or special employee ID
- Resolved by employee → `resolved_by = employee_id`

#### 3. `special_packaging_requirement.fulfilled_by` (Nullable)

**Why Nullable?**:
- Requirement created but not yet fulfilled
- Third-party fulfillment (no employee tracking)
- System-tracked fulfillment

#### 4. `cold_chain_cargo.cargo_id` (UNIQUE, NOT NULL)

**Why UNIQUE?**:
- 1:1 relationship (one cargo = one cold chain profile)
- Prevents duplicate cold chain requirements
- Enforces single source of truth

**Why NOT NULL?**:
- Cold chain record MUST reference a cargo
- Orphan cold chain records meaningless
- Data integrity critical for compliance

---

## 🚫 Why No Alerts / No Automation Yet

### Explicitly Deferred: Automated Alert System

**Current State (Migration 022)**:
- ✅ `temperature_alert` table exists
- ✅ Can INSERT alert records
- ❌ **NO** automatic alert creation
- ❌ **NO** notification system integration
- ❌ **NO** shipment blocking

**Why No Automation?**

### Reason 1: Sensor Reliability Validation

**Problem**: IoT temperature sensors have known issues:
- False positives (sensor malfunction)
- Calibration drift
- Network connectivity issues
- Battery failures

**Risk**:
```
Scenario: Sensor reports 30°C for frozen cargo (-18°C required)
  ↓ (if automated)
Auto-block shipment
  ↓
Operations panic
  ↓
Investigation reveals: Sensor battery dead, actual temp fine
  ↓
Result: Unnecessary business disruption
```

**Solution (Migration 023+)**:
- Sensor validation period
- Machine learning anomaly detection
- Multi-sensor confirmation
- Manual override capability

### Reason 2: Operational Risk

**Blocking Shipments is High-Stakes**:
- Perishable goods → time-sensitive
- Medical supplies → lives at risk
- Wrong block → massive financial loss
- False negatives → compliance violation

**Incremental Approach**:
```
Migration 022: Log everything (observability)
  ↓
Migration 023: Alert creation (no blocking)
  ↓
Migration 024: Human-reviewed enforcement
  ↓
Migration 025: Automated enforcement (after confidence established)
```

### Reason 3: Regulatory Requirements

**Compliance Complexity**:
- FDA regulations (pharmaceuticals)
- EU Cold Chain GDP (Good Distribution Practice)
- National health authority rules
- Varies by product type and jurisdiction

**Current State**: Infrastructure to MEET compliance (logging, audit trail)

**Future State**: Business logic to ENFORCE compliance (migration 023+)

---

## 🥶 Cold Chain vs Special Handling vs Hazmat

### Why These Are Separate Concepts

#### Cold Chain: Numeric & Continuous

**Nature**:
- Temperature range (min/max)
- Humidity range (optional)
- Continuous monitoring
- Measurable deviations

**Example**:
```
Cold Chain Cargo:
- Type: frozen
- Temp Min: -20°C
- Temp Max: -15°C
- Monitoring: Required
```

**Tracking**: Time-series data (every 5 minutes)

#### Special Handling: Categorical & Boolean

**Nature**:
- Fragile (yes/no)
- Orientation restrictions (yes/no)
- Manual handling required (yes/no)
- Categorical attributes

**Example**:
```
Special Packaging:
- Type: Fragile Glass
- Requires: Bubble wrap + wooden crate
- Manual handling: YES
```

**Tracking**: Boolean flags and text descriptions

#### Hazmat: Regulatory & Certificate-Based

**Nature**:
- UN hazard classification
- Legal shipping names
- Certificate requirements
- Emergency protocols

**Example**:
```
Hazmat Detail:
- Hazard Class: Class 3 (Flammable liquids)
- UN Number: UN1203
- Packing Group: II
- Certificate: IATA-DG-2024-0001
```

**Tracking**: Compliance documentation

### Why Separate Tables?

**Reason**: **Different Data Models, Different Lifecycles, Different Compliance Regimes**

| Aspect | Cold Chain | Special Handling | Hazmat |
|--------|-----------|------------------|---------|
| **Data Type** | Numeric ranges | Categorical flags | Regulatory codes |
| **Change Frequency** | Continuous (logs) | Static (at booking) | Static (certification) |
| **Compliance** | FDA, GDP | Internal SOP | IATA, DOT, UN |
| **Enforcement** | Real-time monitoring | Pre-shipping checklist | Certificate validation |

**Benefit of Separation**:
- Query efficiency (filter by concern)
- Independent schema evolution
- Clear responsibility boundaries

---

## 📦 Intentional Design Omissions

### What is INTENTIONALLY Missing

#### 1. ❌ Real-Time Temperature Monitoring

**Omitted**:
```typescript
// NOT IN MIGRATION 022:
class TemperatureMonitoringService {
  async monitorRealTime(sensorId: string) {
    // WebSocket connection to IoT sensors
    // Real-time alert triggering
    // Automatic shipment blocking
  }
}
```

**Why Omitted**:
- IoT sensor integration requires hardware partnerships
- Real-time data streaming infrastructure (Kafka, Redis Streams) not in scope
- Sensor reliability must be validated first

**Future Implementation** (Migration 023):
- IoT device management module
- Real-time data pipeline
- Alert threshold evaluation engine

#### 2. ❌ Automatic Shipment Blocking

**Omitted**:
```sql
-- NOT CREATED:
CREATE TRIGGER block_shipment_on_temperature_breach
AFTER INSERT ON temperature_alert
FOR EACH ROW
EXECUTE FUNCTION set_cargo_status_blocked();
```

**Why Omitted**:
- Too risky for automated decision
- Requires human judgment (sensor malfunction vs actual breach)
- False positives cause business disruption

**Future Implementation** (Migration 024):
- Alert review workflow
- Manual block/approve process
- Eventually: ML-assisted automation

#### 3. ❌ SLA Penalty Calculation

**Omitted**:
```sql
-- NOT ADDED TO invoice TABLE:
ALTER TABLE invoice ADD COLUMN cold_chain_breach_penalty DECIMAL(15,2);
```

**Why Omitted**:
- Invoice table is production-critical
- Penalty calculation requires legal review
- SLA terms not yet defined

**Future Implementation** (Migration 025):
- SLA breach analytics
- Penalty calculation service
- Invoice integration (optional line item)

#### 4. ❌ Sensor Device Management

**Omitted**:
```sql
-- NOT CREATED:
CREATE TABLE iot_sensor_device (
  sensor_id VARCHAR(100) PRIMARY KEY,
  sensor_type VARCHAR(50),
  last_calibration_date DATE,
  battery_level INTEGER
);
```

**Why Omitted**:
- Sensor management is operational (not structural)
- Vendor-specific (different IoT platforms)
- Premature to standardize

**Future Implementation** (Migration 026):
- IoT device registry
- Calibration tracking
- Battery monitoring

#### 5. ❌ Hazmat Training Requirements

**Omitted**:
```sql
-- NOT CREATED:
CREATE TABLE hazmat_employee_training (
  employee_id INTEGER,
  hazard_class VARCHAR(50),
  certification_date DATE,
  expiry_date DATE
);
```

**Why Omitted**:
- HR module not yet scoped
- Training management is separate domain
- Employee certifications tracked elsewhere (future)

**Future Implementation** (Migration 027):
- Employee certification module
- Hazmat handling authorization
- Training expiry alerts

#### 6. ❌ Insurance Integration

**Omitted**:
```sql
-- NO FOREIGN KEY TO insurance_policy:
cold_chain_cargo.insurance_policy_id
```

**Why Omitted**:
- Insurance module scope unclear
- Cold chain breach → claim process not defined
- Premature coupling

**Future Implementation** (Migration 028):
- Insurance claim for temperature breach
- Premium adjustment for cold chain cargo
- Claim evidence (temperature logs)

---

## 🔮 Future Migration Roadmap

### Planned Migrations for Cold Chain Enforcement

#### Migration 023: Temperature Monitoring & Alerting

**Scope**:
1. **IoT Sensor Integration**:
   - Sensor device registry
   - Real-time temperature streaming
   - Data validation rules

2. **Alert Generation Service**:
   - Threshold evaluation
   - Alert creation workflow
   - Notification dispatch (email, SMS)

3. **Alert Management**:
   - Alert review UI
   - Acknowledgment workflow
   - Resolution tracking

#### Migration 024: Cold Chain SLA Enforcement

**Scope**:
1. **SLA Definition**:
   - Temperature breach tolerance
   - Time-out-of-range limits
   - Severity classification

2. **Enforcement Logic**:
   - Shipment hold/block
   - Manual override process
   - Escalation workflows

3. **Audit & Compliance**:
   - Breach report generation
   - Regulatory documentation
   - Customer notification

#### Migration 025: Insurance & Financial Integration

**Scope**:
1. **Claim Processing**:
   - Temperature breach → auto-claim creation
   - Evidence package (logs, alerts)
   - Claim adjudication

2. **Penalty Calculation**:
   - SLA breach penalties
   - Insurance premium adjustments
   - Invoice line item integration

#### Migration 026: IoT Device Management

**Scope**:
1. **Device Registry**:
   - Sensor inventory
   - Calibration schedules
   - Battery monitoring

2. **Device Health**:
   - Connectivity status
   - Data quality metrics
   - Failure prediction

#### Migration 027: Hazmat Operational Workflows

**Scope**:
1. **Employee Certification**:
   - Hazmat training tracking
   - Certification expiry alerts
   - Handling authorization

2. **Compliance Workflows**:
   - Certificate validation before shipping
   - Emergency contact verification
   - Regulatory documentation

---

## 🛠️ Backend Implementation (Migration 022)

### Oluşturulan Modüller

#### 1. ColdChainCargoModule
**Location**: `src/coldchain/cold-chain-cargo/`

**Files Created**:
- `repositories/cold-chain-cargo.repository.interface.ts`
- `repositories/cold-chain-cargo.repository.ts` - Raw SQL
- `services/cold-chain-cargo.service.ts` - Temperature decimal parsing
- `controllers/cold-chain-cargo.controller.ts` - 5 GET endpoints
- `dto/cold-chain-cargo.dto.ts` - Enum validation (frozen/refrigerated/chilled)
- `cold-chain-cargo.module.ts`

**Endpoints**:
- `GET /coldchain/cargo` - All cold chain cargo
- `GET /coldchain/cargo/monitoring-required` - Monitoring required only
- `GET /coldchain/cargo/type/:type` - By cold chain type
- `GET /coldchain/cargo/cargo/:cargoId` - By cargo ID
- `GET /coldchain/cargo/:id` - By ID

#### 2. HazardousMaterialDetailModule
**Location**: `src/coldchain/hazardous-material-detail/`

**Files Created**:
- `repositories/hazardous-material-detail.repository.interface.ts`
- `repositories/hazardous-material-detail.repository.ts`
- `services/hazardous-material-detail.service.ts`
- `controllers/hazardous-material-detail.controller.ts` - 4 GET endpoints
- `dto/hazardous-material-detail.dto.ts`
- `hazardous-material-detail.module.ts`

**Endpoints**:
- `GET /coldchain/hazmat` - All hazmat details
- `GET /coldchain/hazmat/class/:hazardClass` - By hazard class
- `GET /coldchain/hazmat/cargo/:cargoId` - By cargo ID
- `GET /coldchain/hazmat/:id` - By ID

### Main Aggregator

**File**: `src/coldchain/coldchain.module.ts`
- Imports bounding modules
- Exports for cross-module usage
- Wired to `app.module.ts`

---

## 📐 Pattern Consistency

### Following Migrations 019-021

**Repository Layer**:
- ✅ Raw SQL (no ORM)
- ✅ Explicit column selection
- ✅ Parameterized queries
- ✅ No soft delete on log tables (immutable)

**Service Layer**:
- ✅ `mapToDto()` functions
- ✅ `parseFloat()` for temperature decimals
- ✅ `toISOString()` for dates
- ✅ `NotFoundException` handling

**Controller Layer**:
- ✅ GET-only endpoints
- ✅ RESTful paths
- ✅ `ParseIntPipe` validation

**DTO Layer**:
- ✅ camelCase properties
- ✅ `class-validator` decorators
- ✅ Enum validation with `@IsIn`

---

## 🚨 Önemli Notlar

1. **READ-ONLY Infrastructure**: Bu migration SADECE veri modeli oluşturur. Temperature monitoring logic Migration 023'de implement edilecektir.

2. **No Automatic Alerts**: Alert records manualy veya future services tarafından oluşturulacak. Otomatik trigger yok.

3. **No Shipment Blocking**: Temperature breach shipment'ı otomatik olarak engellemez.

4. **Immutable Logs**: `temperature_log` ve `temperature_alert` immutable audit trail'dir.

5. **CHECK Constraints**: Temperature min/max, cold chain type, alert type DB level'da enforce edilir.

6. **UNIQUE Constraints**: `cargo_id` UNIQUE in `cold_chain_cargo` and `hazardous_material_detail` (1:1 relationship).

7. **ON DELETE Behaviors**:
   - `cold_chain_cargo.cargo_id`: RESTRICT (cannot delete cargo with cold chain)
   - `temperature_log.cold_chain_cargo_id`: CASCADE (delete logs with cargo)
   - `hazmat_certificate.hazardous_material_detail_id`: CASCADE

8. **Index Strategy**: Time-based index on `temperature_log.recorded_at` for analytics.

9. **Nullable Employees**: `recorded_by`, `resolved_by`, `fulfilled_by` nullable (automated vs manual).

10. **No Pricing Integration**: Cold chain does NOT affect pricing (yet). Deferred to Migration 025.

---

## ✅ Why This Design Approach?

### Summary of Design Philosophy

**Incremental Complexity**:
- Migration 022: Structure (tables, relationships, constraints)
- Migration 023: Monitoring (real-time alerts, IoT integration)
- Migration 024: Enforcement (SLA, blocking, penalties)
- Migration 025: Financial (insurance claims, pricing impact)

**Non-Invasive Integration**:
- Existing cargo/shipment logic UNTOUCHED
- Optional 1:1 relationships (not all cargo has cold chain)
- Future-ready (temperature thresholds defined, not enforced)

**Sensor Reliability First**:
- No automated enforcement until sensor validation
- Human-in-the-loop for critical decisions
- Gradual trust building

**Regulatory Compliance Ready**:
- Audit trail infrastructure (immutable logs)
- Certificate tracking (hazmat)
- Evidence chain for claims (temperature history)

**Production Safety**:
- No triggers (deterministic behavior)
- No shipment blocking (operational continuity)
- No invoice coupling (financial stability)

---
