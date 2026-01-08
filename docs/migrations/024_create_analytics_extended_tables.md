# Migration 024: Analytics & Dashboard Tables

## 📋 Genel Bakış

Migration 024, Global Cargo Backend sistemine **Analytics & Dashboard Infrastructure** ekler. Bu migration, raporlama, KPI tracking, ve dashboard widget'lar için gerekli denormalized, read-optimized altyapıyı oluşturur.

### Tablolar

1. **`dashboard_config`** - User/admin dashboard konfigürasyonları
2. **`dashboard_widget`** - Dashboard widget tanımları ve yerleşim
3. **`dashboard_metric`** - Metric tanımları ve calculation queries
4. **`time_series_data`** - Zaman-serisi metrikleri (historical tracking)
5. **`geo_coordinate`** - Coğrafi konum tracking (entity-based)
6. **`route_visualization`** - Route harita görselleştirme data

**🚨 CRITICAL NOTE**: Bu migration **SADECE READ-OPTIMIZED ALTYAPI**dır. Metrics otomatik hesaplanmaz, dashboards otomatik güncellenmez, ve real-time streaming yoktur. Bu intentional (kasıtlı) bir tasarım kararıdır.

---

## 🎯 Purpose of Migration 024

### Why Analytics Domain Now?

**Business Context**:
- Migrations 001-023 operational infrastructure tamamladı
- Management KPI tracking gerekiyor
- Compliance reporting ihtiyacı var
- Dashboard ve BI tools için optimized data layer gerekli

**Problem**: Operational tables (cargo, shipment, invoice) üzerinden heavy JOIN'ler:
- Performans sorunları (N+1 queries)
- Operational DB üzerinde yük
- Complex reporting queries yazımı zor
- Historical snapshots yok (operational data değişiyor)

**Migration 024 Goal**:
- **Denormalized analytics layer** oluşturmak
- Pre-aggregated metrics saklamak
- Time-series data için optimized storage
- Dashboard widget konfigürasyonları yönetmek

### What This Migration IS

✅ **Read-Optimized Infrastructure**:
- Denormalized metrics storage
- Time-series data tracking
- Dashboard configuration management
- Historical snapshots preservation

✅ **Reporting Layer**:
- Pre-calculated KPIs
- Date-range queries optimized
- Entity-polymorphic metrics
- JSONB for flexibility

✅ **BI-Ready Design**:
- External BI tools can query directly
- Flat table structure (easy to understand)
- No complex JOINs required

### What This Migration IS NOT

❌ **NOT Real-Time**:
- Does NOT stream data
- Does NOT auto-update metrics
- Does NOT replace operational queries

❌ **NOT Calculation Engine**:
- Does NOT calculate KPIs in backend
- Does NOT aggregate on-the-fly
- Metrics are PRE-COMPUTED (external process)

❌ **NOT Operational**:
- Does NOT replace cargo/shipment tables
- Does NOT affect write workflows
- Read-only for reporting purposes

---

## 📊 Operational vs Analytical Data

### Clear Distinction

**Operational Data** (Migrations 001-023):
- **Purpose**: Run the business
- **Pattern**: Normalized (3NF)
- **Queries**: Transactional (INSERT, UPDATE, DELETE)
- **Performance**: Write-optimized
- **Examples**: cargo, invoice, shipment, customer

**Analytical Data** (Migration 024):
- **Purpose**: Understand the business
- **Pattern**: Denormalized (star schema-like)
- **Queries**: Aggregation (SELECT, GROUP BY)
- **Performance**: Read-optimized
- **Examples**: time_series_data, dashboard_metric

### Why Separate?

**Reason 1: Performance**

Operational Query (slow on large dataset):
```sql
-- Complex JOIN for revenue report:
SELECT DATE(i.created_at), SUM(i.total_amount)
FROM invoice i
INNER JOIN cargo c ON i.cargo_id = c.id
INNER JOIN customer cu ON c.customer_id = cu.id
WHERE i.created_at BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY DATE(i.created_at);
-- Scans millions of rows, multiple JOINs
```

Analytical Query (fast):
```sql
-- Pre-aggregated data:
SELECT * FROM time_series_data
WHERE metric_name = 'daily_revenue'
  AND timestamp BETWEEN '2024-01-01' AND '2024-12-31';
-- Direct index hit, no JOINs
```

**Reason 2: Historical Truth**

Operational data changes:
```
Invoice #123 created: total_amount = $100
  ↓ (discount applied later)
Invoice #123 updated: total_amount = $90

Problem: Historical reports now wrong (was it $100 or $90 in January?)
```

Analytical snapshots preserved:
```
time_series_data:
  - timestamp: 2024-01-15, metric: daily_revenue, value: 5000 (includes $100)
  - timestamp: 2024-02-01, metric: daily_revenue, value: 4800 (includes $90)

Benefit: Historical reports accurate (point-in-time truth)
```

**Reason 3: Query Complexity**

Management question: "What was our average delivery time last quarter?"

Operational approach (complex):
```typescript
// Requires JOIN across 5+ tables
// Calculate shipping time (created_at → delivered_at)
// Group by quarter
// Handle null delivery dates
// 50+ lines of code
```

Analytical approach (simple):
```sql
SELECT AVG(metric_value) FROM time_series_data
WHERE metric_name = 'daily_avg_delivery_time'
  AND timestamp BETWEEN '2024-01-01' AND '2024-03-31';
```

---

## 🔄 Event vs Snapshot vs Aggregation

### Three Analytics Patterns

#### 1. Event (NOT in Migration 024 - Deferred)

**Purpose**: Track discrete occurrences

**Examples**:
- cargo_created
- approval_completed
- vehicle_departed
- temperature_breach_detected

**Pattern**:
```sql
-- Event table (future):
analytics_event (
  event_type VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id INTEGER,
  event_data JSONB,
  occurred_at TIMESTAMP
)
```

**Why Deferred**: Event streaming requires background workers (future Migration 025+).

#### 2. Snapshot (Implemented: `time_series_data`)

**Purpose**: Store point-in-time KPI values

**Examples**:
- daily_revenue: $15,000 on 2024-01-15
- active_cargo_count: 1,234 on 2024-01-15 10:00
- warehouse_utilization: 87% on 2024-01-15

**Pattern**:
```sql
time_series_data (
  metric_name VARCHAR(100),  -- 'daily_revenue'
  metric_value DECIMAL,      -- 15000.00
  timestamp TIMESTAMP,       -- 2024-01-15
  entity_type VARCHAR(100),  -- 'warehouse' (optional)
  entity_id INTEGER          -- 5 (optional)
)
```

**Why Implemented**: Historical truth preservation, trend analysis critical for management.

#### 3. Aggregation (Deferred to future migrations)

**Purpose**: Pre-calculate complex metrics

**Examples**:
- Monthly revenue by customer segment
- Weekly fleet utilization by vehicle type
- Quarterly promotion ROI

**Pattern**:
```sql
-- Future table:
analytics_daily_aggregation (
  aggregation_date DATE,
  entity_type VARCHAR(100),
  metric_name VARCHAR(100),
  aggregated_value DECIMAL
)
```

**Why Deferred**: Requires external aggregation jobs (cron, ETL pipeline).

---

## 📈 KPI Design Philosophy

### Dashboard Metrics Architecture

**`dashboard_metric` Table**:
- Defines WHAT to measure
- Defines HOW to calculate (JSONB query)
- Defines WHEN to refresh (interval)
- Does NOT store values (values in `time_series_data`)

**Example Metric Definition**:
```json
{
  "metric_code": "DAILY_REVENUE",
  "metric_name": "Daily Revenue",
  "metric_type": "sum",
  "data_source": "invoice",
  "calculation_query": {
    "table": "invoice",
    "field": "total_amount",
    "groupBy": "DATE(created_at)",
    "where": "invoice_status = 'paid'"
  },
  "refresh_interval_seconds": 3600
}
```

**Calculation Happens OUTSIDE Backend**:
- Python script / cron job reads `dashboard_metric`
- Executes calculation query
- INSERTs result into `time_series_data`
- Backend READS values, does NOT calculate

### Why Backend Does NOT Calculate?

**Bad Design** (NOT used):
```typescript
// WRONG: Backend calculates on-demand
@Get('metrics/daily-revenue')
async getDailyRevenue() {
  const result = await this.db.query(`
    SELECT DATE(created_at), SUM(total_amount)
    FROM invoice
    WHERE invoice_status = 'paid'
    GROUP BY DATE(created_at)
  `);
  return result;  // Slow, blocks API, resource-intensive
}
```

**Good Design** (Migration 024):
```typescript
// CORRECT: Backend reads pre-calculated values
@Get('time-series/metric/:metricName')
async getTimeSeriesData(metricName: string) {
  return await this.timeSeriesRepo.findByMetricName(metricName);
  // Fast, no heavy queries
}
```

**Benefits**:
1. **Performance**: API responses instant (data pre-computed)
2. **Scalability**: Heavy calculations offloaded to ETL pipeline
3. **Separation**: Analytics jobs can scale independently
4. **Reliability**: API doesn't crash from complex queries

---

## 🔒 Historical Immutability Rationale

### Why Analytics Tables Are Append-Only

**`time_series_data` Has NO `deleted_at`**:
```sql
-- Immutable by design:
CREATE TABLE time_series_data (
  -- NO deleted_at field
  -- NO updated_at field (only created_at)
);
```

**Why Immutable?**

### Reason 1: Historical Accuracy

**Scenario**:
```
Jan 15: daily_revenue = $10,000
  ↓ (mistake discovered)
Feb 1: Accountant wants to "fix" Jan 15 data to $9,500

If UPDATE allowed:
  → Historical reports change retroactively
  → Audit trail broken
  → Compliance violation

If INSERT only:
  → Original record preserved
  → Correction logged as new entry
  → Audit trail intact
```

### Reason 2: Trend Analysis

**Question**: "Did revenue increase or decrease in Q1?"

**With Mutable Data**:
- Trends change based on when query runs
- Cannot reproduce historical reports
- Data integrity questionable

**With Immutable Data**:
- Trends permanent (snapshots)
- Reports reproducible
- Data trustworthy

### Reason 3: Regulatory Compliance

**FDA, SOX, GDPR Requirements**:
- Audit trail must be permanent
- Management reports must be reproducible
- KPIs cannot be retroactively altered

**Immutability Enforcement**:
- Database triggers (from views_triggers script)
- Application layer validation
- ETL pipeline INSERT-only mode

---

## 📖 Why Analytics Tables Are READ-ONLY

### Backend Controllers Are GET-Only

**All Controllers**:
```typescript
// ONLY GET endpoints:
@Controller('analytics/metrics')
export class DashboardMetricController {
  @Get() findAll() {}
  @Get(':id') findById() {}
  @Get('code/:code') findByCode() {}
  // NO @Post, NO @Put, NO @Delete
}
```

**Why No Write Endpoints?**

### Reason 1: Data Ingestion Is External

**Analytics Data Flow**:
```
Operational DB (PostgreSQL)
  ↓ (ETL Job, Python script, cron)
Analytics Tables (INSERT)
  ↓ (Backend READ-ONLY)
Dashboard / BI Tools
```

**Backend's Role**: Serve pre-computed data, NOT compute data.

### Reason 2: Complexity Isolation

**Calculation Logic is Complex**:
- Aggregations across multiple tables
- Date grouping, windowing functions
- Statistical calculations
- External data sources (e.g., currency rates)

**Where Complexity Belongs**:
- ❌ NOT in NestJS services (wrong layer)
- ✅ IN dedicated analytics pipeline (dbt, Airflow, Python)

### Reason 3: Performance Protection

**Write Operations Would**:
- Allow API users to insert arbitrary metrics
- Risk data integrity (garbage in)
- Require complex validation
- Increase attack surface

**Read-Only Approach**:
- API users can only query
- Data integrity guaranteed (controlled ingestion)
- Simple authorization (read permissions)
- Minimal attack surface

---

## 🚀 Why Calculations Are NOT Done in Backend Services

### Antipattern: Backend Aggregation

**What NOT to Do**:
```typescript
// WRONG: Calculate KPIs in service layer
@Injectable()
export class DashboardService {
  async getDailyRevenue() {
    const invoices = await this.invoiceRepo.findPaidInvoices();
    const grouped = this.groupByDate(invoices);
    const summed = grouped.map(g => ({
      date: g.date,
      revenue: g.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    }));
    return summed;
  }
}
```

**Problems**:
1. **Performance**: Loads entire dataset into memory
2. **Scalability**: Cannot handle millions of invoices
3. **Duplication**: Every dashboard widget recalculates
4. **Inconsistency**: Different requests = different results (race conditions)

### Correct Pattern: Pre-Computed Metrics

**What to Do**:
```typescript
// CORRECT: Read pre-computed values
@Injectable()
export class TimeSeriesDataService {
  async getMetricData(metricName: string, startDate: Date, endDate: Date) {
    return await this.repo.findByMetricAndDateRange(metricName, startDate, endDate);
    // Returns pre-computed values, instant response
  }
}
```

**Benefits**:
1. **Performance**: Simple SELECT query, < milliseconds
2. **Scalability**: Works for any dataset size
3. **Consistency**: Same data for all requests
4. **Simplicity**: No complex logic in API layer

### Where Calculations Happen

**External Analytics Pipeline**:
```python
# Example ETL job (runs daily):
import psycopg2

# 1. Calculate metric
query = "SELECT DATE(created_at), SUM(total_amount) FROM invoice WHERE invoice_status = 'paid' GROUP BY DATE(created_at)"
results = cursor.execute(query)

# 2. Insert into analytics table
for row in results:
    insert_query = "INSERT INTO time_series_data (metric_name, metric_value, timestamp) VALUES (%s, %s, %s)"
    cursor.execute(insert_query, ('daily_revenue', row[1], row[0]))

# Backend just reads this data later
```

---

## ⚙️ Performance & Indexing Strategy

### Time-Series Optimizations

**Indexes Created**:
```sql
CREATE INDEX idx_time_series_data_entity ON time_series_data(entity_type, entity_id);
CREATE INDEX idx_time_series_data_timestamp ON time_series_data(timestamp);
CREATE INDEX idx_time_series_data_metric ON time_series_data(metric_name);
```

**Query Patterns Optimized**:
1. Filter by entity: `WHERE entity_type = 'warehouse' AND entity_id = 5`
2. Date range: `WHERE timestamp BETWEEN start AND end`
3. Metric lookup: `WHERE metric_name = 'daily_revenue'`
4. Combined: `WHERE metric_name = 'X' AND timestamp BETWEEN ...`

### JSONB Performance

**`dashboard_config.layout` and `dashboard_metric.calculation_query`**:
- JSONB storage efficient (binary format)
- GIN indexes available (if needed future)
- Flexible schema evolution

**Trade-off**:
- Slower than relational columns
- Acceptable for low-frequency reads (dashboard config)

### Partial Indexes

```sql
CREATE INDEX idx_dashboard_metric_code ON dashboard_metric(metric_code) WHERE deleted_at IS NULL;
```

**Benefit**: Smaller index (ignores deleted records), faster queries.

---

## 🌍 Multi-Entity Analytics Support

### Polymorphic Metrics

**`time_series_data` Pattern**:
```sql
time_series_data (
  entity_type VARCHAR(100),  -- 'warehouse', 'customer', 'vehicle'
  entity_id INTEGER,         -- Specific entity
  metric_name VARCHAR(100),  -- 'utilization', 'revenue', 'distance_traveled'
  metric_value DECIMAL
)
```

**Examples**:

Warehouse Utilization:
```sql
INSERT INTO time_series_data (entity_type, entity_id, metric_name, metric_value, timestamp)
VALUES ('warehouse', 5, 'capacity_utilization_percent', 87.5, '2024-01-15');
```

Customer Lifetime Value:
```sql
INSERT INTO time_series_data (entity_type, entity_id, metric_name, metric_value, timestamp)
VALUES ('customer', 123, 'lifetime_value', 45000.00, '2024-01-15');
```

Vehicle Efficiency:
```sql
INSERT INTO time_series_data (entity_type, entity_id, metric_name, metric_value, timestamp)
VALUES ('vehicle', 7, 'fuel_efficiency_km_per_liter', 8.5, '2024-01-15');
```

**Query Pattern**:
```typescript
// Get all warehouse utilization metrics:
await timeSeriesRepo.findByEntity('warehouse', warehouseId);

// Get customer LTV trend:
await timeSeriesRepo.findByEntityAndDateRange('customer', customerId, startDate, endDate);
```

**Benefits**:
- Single table for all entity types
- Flexible metric definitions
- Easy to add new entity types (no schema change)

---

## 📊 Real-World Dashboard Examples

### Example 1: Operations Dashboard

**Widgets**:
1. Active Cargo Count (metric: `active_cargo_count`)
2. Vehicles In Use (metric: `vehicles_in_use_count`)
3. Average Delivery Time (metric: `avg_delivery_time_hours`)
4. Warehouse Capacity (metric: `warehouse_utilization_percent`)

**Configuration**:
```json
{
  "dashboard_config": {
    "user_id": 5,
    "user_type": "employee",
    "dashboard_name": "Operations Overview",
    "layout": {
      "rows": 2,
      "columns": 2
    }
  },
  "widgets": [
    {
      "widget_type": "metric_card",
      "widget_config": {
        "metric_code": "ACTIVE_CARGO_COUNT",
        "display_type": "number"
      },
      "position_x": 0,
      "position_y": 0
    }
  ]
}
```

### Example 2: Financial Dashboard

**Widgets**:
1. Daily Revenue Trend (time-series chart)
2. Promotion Discount Impact (comparison)
3. Invoice Payment Status (pie chart)
4. Top Customers by Revenue (table)

**Data Sources**:
- `time_series_data` WHERE metric_name = 'daily_revenue'
- `time_series_data` WHERE metric_name = 'daily_discount_given'
- JOIN invoice status counts
- Aggregate invoice.total_amount by customer

### Example 3: Fleet Management Dashboard

**Widgets**:
1. Vehicle Availability (gauge)
2. Maintenance Due Soon (list)
3. Fuel Consumption Trend (line chart)
4. Route Efficiency Map (geo visualization)

**Data Sources**:
- `time_series_data` WHERE entity_type = 'vehicle'
- `vehicle_maintenance` WHERE next_maintenance_date < NOW() + 7 days
- `time_series_data` WHERE metric_name = 'daily_fuel_consumption'
- `route_visualization` + `geo_coordinate`

---

## 🛡️ Compliance & Audit Considerations

### Regulatory Requirements Met

**SOX (Sarbanes-Oxley)**:
- ✅ Financial metrics immutable
- ✅ Audit trail preserved (time_series_data)
- ✅ Historical reports reproducible

**GDPR**:
- ⚠️ Customer metrics anonymizable (entity_id can be pseudonymized)
- ✅ Data retention policies enforceable (date-based deletion)

**FDA (for cold chain)**:
- ✅ Temperature breach metrics logged
- ✅ Historical snapshots permanent
- ✅ Compliance KPIs tracked

### Audit Trail Design

**Every Metric Entry Includes**:
- `timestamp`: When metric was recorded
- `created_at`: When row was inserted
- `entity_type` + `entity_id`: What was measured
- `metric_name` + `metric_value`: Measurement

**Audit Questions Answered**:
- "What was revenue on March 15?" → Query time_series_data WHERE timestamp = '2024-03-15'
- "When was this metric last updated?" → created_at field
- "Which entities had performance issues in Q1?" → Filter by entity_type, date range

---

## ❌ Why This Is NOT Implemented via Views

### Views vs Tables for Analytics

**SQL Views** (from `900_views_triggers_seed_data.sql`):
- ✅ Good for: Current state aggregations
- ✅ Example: `v_cargo_full_details` (current cargo + customer info)
- ❌ Bad for: Historical snapshots, time-series

**Analytics Tables** (Migration 024):
- ✅ Good for: Historical data, trends, snapshots
- ✅ Example: `time_series_data` (revenue history for 12 months)
- ❌ Bad for: Real-time operational queries

### Why Not Just Use Views?

**Problem with Views for Analytics**:
```sql
-- View for daily revenue:
CREATE VIEW v_daily_revenue AS
SELECT DATE(created_at), SUM(total_amount)
FROM invoice
WHERE invoice_status = 'paid'
GROUP BY DATE(created_at);
```

**Issues**:
1. **Performance**: Recalculates on every query (slow for large datasets)
2. **No History**: If invoice updated, historical reports change
3. **Resource Intensive**: Aggregates millions of rows on-demand

**Analytics Tables Solve This**:
```sql
-- Pre-computed, permanent snapshots:
SELECT * FROM time_series_data
WHERE metric_name = 'daily_revenue'
  AND timestamp BETWEEN '2024-01-01' AND '2024-12-31';
-- Instant response, historical accuracy guaranteed
```

### When to Use Each

| Need | Solution |
|------|----------|
| Current operational state | Views (`v_cargo_full_details`) |
| Historical trends | Tables (`time_series_data`) |
| Real-time aggregation | Views (acceptable if small dataset) |
| Management KPIs (monthly reports) | Tables (pre-computed) |

---

## 🚫 Explicitly Deferred Components

### What is INTENTIONALLY Missing

#### 1. ❌ Real-Time Streaming

**Omitted**:
```typescript
// NOT IN MIGRATION 024:
class MetricsStreamingService {
  async streamLiveMetrics() {
    // WebSocket connection
    // Push real-time updates to dashboard
  }
}
```

**Why Omitted**:
- Requires WebSocket infrastructure
- High complexity (connection management, scaling)
- Low immediate value (dashboards refresh every minute is acceptable)

**Future Implementation** (Migration 025+):
- WebSocket module for live updates
- Redis pub/sub for real-time events
- Auto-refresh dashboard widgets

#### 2. ❌ External BI Integration

**Omitted**:
- No Tableau connector
- No Power BI integration
- No Looker/Metabase config

**Why Omitted**:
- BI tools can connect directly to PostgreSQL
- No custom adapter needed at this stage
- Business hasn't chosen BI tool yet

**Future Implementation** (Migration 026+):
- Read-only DB user for BI tools
- Materialized views for BI performance
- BI-specific schemas/views

#### 3. ❌ Automated Metric Calculation (Cron Jobs)

**Omitted**:
```typescript
// NOT IN MIGRATION 024:
@Cron('0 0 0 * * *')  // Daily at midnight
async calculateDailyMetrics() {
  // Aggregate invoices
  // Calculate KPIs
  // Insert into time_series_data
}
```

**Why Omitted**:
- Cron/scheduler infrastructure separate concern
- Calculation logic is analytics pipeline (Python/dbt)
- NestJS not ideal for heavy ETL jobs

**Future Implementation** (External):
- Airflow DAGs for metric calculation
- Python scripts + cron
- dbt models for transformations

#### 4. ❌ Materialized Views

**Omitted**:
```sql
-- NOT CREATED:
CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT DATE(created_at), SUM(total_amount)
FROM invoice
WHERE invoice_status = 'paid'
GROUP BY DATE(created_at);
```

**Why Omitted**:
- Materialized views are PostgreSQL-specific advanced feature
- Requires REFRESH strategy (cron, manual)
- `time_series_data` achieves same goal (pre-computed storage)

**Future Consideration**:
- Evaluate materialized views for complex aggregations
- Benchmark vs `time_series_data` approach

#### 5. ❌ OLAP Cube / Columnar Storage

**Omitted**:
- No Snowflake integration
- No BigQuery export
- No ClickHouse columnar storage

**Why Omitted**:
- Premature optimization (current dataset size manageable)
- External OLAP tools optional (not required)

**Future Implementation** (Migration 027+):
- If dataset grows to billions of rows
- If complex multidimensional analysis needed
- Evaluate ClickHouse, Snowflake, or BigQuery

#### 6. ❌ Dashboard Widget POST/PUT Endpoints

**Omitted**:
```typescript
// NOT IN MIGRATION 024:
@Post('dashboards')
async createDashboard(@Body() dto: CreateDashboardDto) {}

@Put('dashboards/:id')
async updateDashboard(@Param('id') id: number, @Body() dto: UpdateDashboardDto) {}
```

**Why Omitted**:
- Migration 024 is READ-ONLY infrastructure
- Dashboard creation/editing is admin UI concern (future frontend)
- Focus on data layer first, UI layer later

**Future Implementation** (Migration 025):
- Admin dashboard management endpoints
- Widget CRUD operations
- Layout save/restore

---

## 🔮 Future Evolution Path

### Planned Migrations for Analytics Enhancement

#### Migration 025: Dashboard Management API

**Scope**:
1. **Write Endpoints**:
   - POST /analytics/dashboards (create configuration)
   - PUT /analytics/dashboards/:id (update layout)
   - DELETE /analytics/dashboards/:id (soft delete)

2. **Widget Management**:
   - POST /analytics/widgets (add widget to dashboard)
   - PUT /analytics/widgets/:id (update position/config)
   - DELETE /analytics/widgets/:id (remove widget)

3. **User Preferences**:
   - Default dashboard selection
   - Widget visibility toggles

#### Migration 026: ETL Pipeline Integration

**Scope**:
1. **Metric Calculation Jobs**:
   - Python scripts for aggregations
   - dbt models for transformations
   - Airflow DAGs for scheduling

2. **Data Ingestion**:
   - Batch INSERT into `time_series_data`
   - Incremental updates
   - Error handling and logging

3. **Monitoring**:
   - Pipeline health checks
   - Data quality validation
   - Alert on stale metrics

#### Migration 027: Advanced Analytics

**Scope**:
1. **Predictive Analytics**:
   - ML model predictions stored as metrics
   - Forecast future revenue, demand
   - Anomaly detection

2. **Comparative Analytics**:
   - Year-over-year comparisons
   - Benchmark against industry standards
   - Performance goals tracking

#### Migration 028: External BI Integration

**Scope**:
1. **BI Tool Connectors**:
   - Tableau published data source
   - Power BI custom connector
   - Looker LookML models

2. **Performance Layer**:
   - Materialized views for BI
   - Columnar indexes
   - Query result caching

---

## 🏗️ Backend Implementation (Migration 024)

### Oluşturulan Modüller

#### 1. DashboardMetricModule
**Location**: `src/analytics/dashboard-metric/`

**Purpose**: Metric definitions and calculation templates

**Endpoints**:
- `GET /analytics/metrics` - All metrics
- `GET /analytics/metrics/active` - Active metrics only
- `GET /analytics/metrics/type/:metricType` - By type (count, sum, average, etc.)
- `GET /analytics/metrics/code/:metricCode` - By unique metric code
- `GET /analytics/metrics/:id` - By ID

#### 2. TimeSeriesDataModule
**Location**: `src/analytics/time-series-data/`

**Purpose**: Historical metric values storage and retrieval

**Endpoints**:
- `GET /analytics/time-series` - Recent time-series data (limited)
- `GET /analytics/time-series/date-range?start=&end=` - By date range
- `GET /analytics/time-series/metric/:metricName` - By metric name
- `GET /analytics/time-series/entity/:entityType/:entityId` - By entity
- `GET /analytics/time-series/entity/:entityType/:entityId/date-range?start=&end=` - Combined
- `GET /analytics/time-series/:id` - By ID

### Main Aggregator

**File**: `src/analytics/analytics.module.ts`
- Imports 2 core submodules
- Exports for cross-module usage
- Wired to `app.module.ts`

---

## 📐 Pattern Consistency

### Following Migrations 019-023

**Repository Layer**:
- ✅ Raw SQL (no ORM)
- ✅ Explicit column selection
- ✅ Parameterized queries
- ✅ Date range query support

**Service Layer**:
- ✅ `mapToDto()` functions
- ✅ `parseFloat()` for decimal metrics
- ✅ `toISOString()` for timestamps
- ✅ `NotFoundException` handling

**Controller Layer**:
- ✅ GET-only endpoints
- ✅ Query parameters for filtering
- ✅ `ParseIntPipe` validation

**DTO Layer**:
- ✅ camelCase properties
- ✅ `class-validator` decorators
- ✅ JSONB as `any` type (flexible schema)

---

## 🚨 Önemli Notlar

1. **READ-ONLY Infrastructure**: Bu migration SADECE veri okuma altyapısı oluşturur. Metric calculation logic external ETL pipeline'da implement edilecektir.

2. **No Real-Time**: Metrics real-time olarak hesaplanmaz. Pre-computed values stored and served.

3. **Immutable Time-Series**: `time_series_data` immutable audit trail'dir. Historical accuracy guaranteed.

4. **Polymorphic Entities**: `entity_type` + `entity_id` pattern multi-domain metrics destekler.

5. **JSONB Flexibility**: `dashboard_config.layout`, `dashboard_metric.calculation_query` JSONB flexibility sağlar.

6. **No Write Endpoints**: Analytics domain READ-ONLY. Dashboard management future migration.

7. **External Calculation**: Backend KPI hesaplamaz, sadece pre-computed values serve eder.

8. **Performance Optimized**: Time-based and entity-based indexes for fast queries.

9. **No Soft Delete on Time-Series**: `time_series_data` has NO `deleted_at` (immutable).

10. **BI-Ready**: External BI tools can query tables directly (flat structure).

---

## ✅ Why This Design Approach?

### Summary of Design Philosophy

**Denormalization Intentional**:
- Performance over normalization
- Read-optimized over write-optimized
- Historical snapshots over current truth

**Pre-Computation Strategy**:
- Calculate once (ETL), serve many (API)
- Complex logic in analytics pipeline
- Simple queries in backend

**Separation of Concerns**:
- Operational data (transactions)
- Analytical data (reporting)
- Different performance profiles, different storage

**Immutability for Compliance**:
- Audit trail permanent
- Historical reports reproducible
- Regulatory requirements met

**Future-Proof Flexibility**:
- JSONB for schema evolution
- Polymorphic entity support
- Easy BI tool integration

---
