# Migration 021: Promotion & Discount Tables

## 📋 Genel Bakış

Migration 021, Global Cargo Backend sistemine **Promotion & Discount Infrastructure** ekler. Bu migration, promosyon kodları, kuponlar, sezonsal fiyatlandırma ve toplu iskonto kuralları için gerekli yapısal altyapıyı oluşturur.

### Tablolar

1. **`promotion`** - Promosyon kampanyaları (yüzde veya sabit iskonto)
2. **`promotion_code`** - Bireysel promosyon kodları
3. **`promotion_usage`** - Promosyon kullanım geçmişi (track only)
4. **`coupon`** - Kupon bazlı iskontolar
5. **`coupon_redemption`** - Kupon kullanım kayıtları
6. **`seasonal_pricing_rule`** - Sezonsal fiyatlandırma kuralları
7. **`bulk_discount_rule`** - Toplu alım iskontoları

**🚨 CRITICAL NOTE**: Bu migration **SADECE YAPISAL ALTYAPI**dır. Promosyonlar henüz otomatik olarak uygulanmaz, fatura hesaplamalarına müdahale etmez, ve zorunlu kılınmaz. Bu intentional (kasıtlı) bir tasarım kararıdır.

---

## 🎯 Purpose of Migration 021

### Why Promotions Now?

**Business Context**:
- Migrations 001-020 core logistics infrastructure'ı tamamladı
- Pricing (003), invoicing (007), customer (002) infrastructure mevcut
- Marketing ve customer retention özellikleri gerekiyor
- Ancak pricing logic stable ve değişmemeli

**Migration 021 Hedefi**:
- Promosyon infrastructure'ını **ayrı bir katman** olarak eklemek
- Mevcut pricing/invoice systemine **müdahale etmeden** veri modelini hazırlamak
- Gelecek migrations'da (022+) promotional logic implement etmeye hazırlanmak

### What This Migration IS

✅ **Structural Infrastructure**:
- Promotion entity definitions
- Discount type taxonomy (percentage, fixed)
- Validity window management
- Usage tracking infrastructure
- Customer-promotion relationships (optional linkage)

✅ **Non-Invasive Design**:
- Nullable foreign keys to cargo/invoice
- No triggers on pricing/invoice tables
- No calculated discount fields in existing tables
- Pure observability and tracking

✅ **Future-Ready**:
- JSONB fields for extensible conditions
- Usage counters for limit enforcement (future)
- Audit trail design

### What This Migration IS NOT

❌ **NOT Behavioral**:
- Does NOT automatically apply promotions
- Does NOT modify invoice calculations
- Does NOT enforce promotion rules
- Does NOT validate discount eligibility

❌ **NOT Coupled**:
- Does NOT require changes to existing pricing logic
- Does NOT force cargo/invoice to use promotions
- Does NOT break existing invoice workflows

---

## 🏗️ Why Promotions Are Modeled Separately from Pricing

### Architectural Principle: Separation of Concerns

**Pricing Layer** (Migrations 003, 007):
- **Purpose**: Calculate base shipping cost
- **Input**: Weight, volume, distance, shipment type
- **Output**: Base price (deterministic)
- **Stability**: Must remain stable and predictable
- **Dependencies**: Country, route, cargo type

**Promotion Layer** (Migration 021):
- **Purpose**: Apply optional discounts
- **Input**: Promotion code, customer eligibility, purchase context
- **Output**: Discount amount (conditional, optional)
- **Flexibility**: Can change frequently (marketing campaigns)
- **Dependencies**: Customer relationship, time windows, business rules

### Why NOT Merge Them?

**Reason 1: Different Lifecycles**:
```
Pricing Rules:
- Change rarely (quarterly/annually)
- Require careful business validation
- Affect ALL shipments
- Must be auditable and compliant

Promotions:
- Change frequently (weekly/daily)
- Marketing-driven, experimental
- Affect SOME shipments (targeted)
- Can be disabled instantly
```

**Reason 2: Different Stakeholders**:
- **Pricing**: Finance, operations (rigid SLA)
- **Promotions**: Marketing, sales (agile experimentation)

**Reason 3: Rollback Safety**:
- If promotion breaks, disable promotion
- Pricing layer unaffected, shipments continue
- No cascade failures

**Reason 4: Testing Isolation**:
- Test promotions without touching pricing
- A/B test promotional campaigns
- Gradual rollout per customer segment

---

## ⏸️ Why Discounts Are NOT Enforced Yet

### Intentional Deferred Enforcement

**Current State (Migration 021)**:
- ✅ `promotion` table created
- ✅ `promotion_usage` table created
- ✅ Nullable `invoice_id` and `cargo_id` foreign keys
- ❌ **NO** automatic discount application
- ❌ **NO** invoice calculation hooks
- ❌ **NO** business rule enforcement

**Why Defer Enforcement?**

### Reason 1: Incremental Rollout Philosophy

**Cursor's Layered Approach** (Observed Pattern):
```
Migration 019: Warehouse Infrastructure (tables only)
Migration 020: Fleet Infrastructure (tables only)
Migration 021: Promotion Infrastructure (tables only)
Migration 022: Warehouse Operations (behavior)
Migration 023: Fleet Operations (behavior)
Migration 024: Promotion Operations (behavior) ← Future
```

**Pattern**: Structure first, behavior later.

**Rationale**:
- Reduces migration complexity
- Allows schema validation before logic implementation
- Enables gradual testing
- Prevents breaking changes

### Reason 2: Business Rule Complexity

**Promotional Logic is Complex**:
```typescript
// Pseudo-code for future migration
async applyPromotion(invoiceId: number, promotionCode: string) {
  // Must check:
  // 1. Is promotion active?
  // 2. Is promotion valid (date range)?
  // 3. Has usage limit been exceeded?
  // 4. Does customer qualify?
  // 5. Does cargo type match?
  // 6. Is minimum purchase amount met?
  // 7. How to handle multiple promotions?
  // 8. What if invoice already has promotion?
  // 9. Should we update invoice.discount_amount?
  // 10. How to handle currency conversion?
  // ...
}
```

**Why Not Now?**:
- Requires business stakeholder input
- Requires edge case analysis
- Requires user acceptance testing
- Too risky for single migration

### Reason 3: Existing Invoice Stability

**Invoice Table** (Migration 007) is **production-critical**:
- Used by finance reports
- Referenced in payment reconciliation
- Fed into accounting systems
- Legally binding documents

**Risk of Coupling**:
```sql
-- DANGEROUS (NOT in Migration 021):
ALTER TABLE invoice ADD COLUMN applied_promotion_id INTEGER REFERENCES promotion(id);
```

**Why Dangerous?**:
- Forces ALL invoices to consider promotions
- Breaks existing invoice creation workflows
- Requires migration of historical invoices
- Potential data integrity issues

**Safe Approach (Migration 021)**:
```sql
-- SAFE (Actual design):
CREATE TABLE promotion_usage (
  invoice_id INTEGER REFERENCES invoice(id) ON DELETE SET NULL  -- Nullable
);
```

**Why Safe?**:
- Optional linkage
- Existing invoices unaffected
- New invoices can ignore promotions
- Gradual adoption possible

---

## 🔗 Why Certain Relations Are Nullable

### Intentional Nullable Foreign Keys

#### 1. `promotion_usage.cargo_id` (Nullable)

```sql
cargo_id INTEGER REFERENCES cargo(id) ON DELETE SET NULL
```

**Why Nullable?**:
- Promotions can apply to **entire invoice** (not specific cargo)
- Some promotions are **account-level** (customer loyalty)
- Some promotions are **order-level** (bulk discount)

**Design Philosophy**:
```
Promotion Application Levels:
1. Cargo-specific: cargo_id NOT NULL, invoice_id NULL
2. Invoice-specific: cargo_id NULL, invoice_id NOT NULL
3. Both: cargo_id NOT NULL, invoice_id NOT NULL (itemized invoice

)
```

**CHECK Constraint**:
```sql
CHECK (cargo_id IS NOT NULL OR invoice_id IS NOT NULL)
```
**Meaning**: At least ONE must be populated (prevent orphan records).

#### 2. `promotion_usage.invoice_id` (Nullable)

**Why Nullable?**:
- Some promotions applied **before invoicing** (pre-paid scenarios)
- Some promotions applied **during booking** (cargo creation)
- Invoice may not exist yet

**Future Workflow**:
```
1. Customer enters promo code during booking
2. Promotion validated and reserved
3. cargo_id recorded in promotion_usage
4. Invoice created later
5. Invoice calculation reads promotion_usage.cargo_id
6. invoice_id backfilled
```

#### 3. `promotion_code.used_by` (Nullable)

```sql
used_by INTEGER REFERENCES customer(id) ON DELETE SET NULL
```

**Why Nullable?**:
- Code might exist but not yet used (`used_by = NULL`)
- Code might be used by anonymous user (guest checkout - future)
- Customer account might be deleted (soft delete, SET NULL)

#### 4. `seasonal_pricing_rule.shipment_type_id` (Nullable)

```sql
shipment_type_id INTEGER REFERENCES shipment_type_enum(id) ON DELETE RESTRICT
```

**Why Nullable?**:
- Rule can apply to **ALL** shipment types (global seasonal adjustment)
- Rule can be **shipment-type specific** (e.g., air cargo only)

**Logic**:
```
IF shipment_type_id IS NULL THEN apply to all types
ELSE apply only to specified type
```

---

## 📊 Deferred Enforcement Strategy

### What Happens in Migration 022+ ?

**Migration 022: Promotional Logic Implementation** (Future)

**Planned Features**:
1. **Promotion Validation Service**:
   - Validate promotion code
   - Check eligibility (customer, cargo type, dates)
   - Calculate discount amount
   - Enforce usage limits

2. **Invoice Integration**:
   - Optional promotion parameter in invoice creation
   - Discount line item in invoice
   - Promotion reference in invoice metadata

3. **Audit Trail Enhancement**:
   - Detailed promotion application logs
   - Discount calculation breakdown
   - Customer notification triggers

4. **Business Rule Engine**:
   - Stacking rules (can multiple promos combine?)
   - Priority rules (which promo wins?)
   - Conflict resolution

**Why Not Now?**:
- Requires business stakeholder workshops
- Requires A/B testing framework
- Requires fraud prevention analysis
- Requires legal/compliance review

---

## 🗂️ Table Design Philosophy

### 1. `promotion` Table

**Purpose**: Master promotion entity

**Design Decisions**:
- `discount_type`: CHECK constraint `('percentage', 'fixed_amount')`
  - **Why**: Only 2 discount models needed initially
  - **Future**: Can add 'tiered', 'buy_x_get_y' via enum extension
  
- `applicable_to_cargo_types`: JSONB
  - **Why**: Flexible cargo type filtering without rigid foreign keys
  - **Example**: `["express", "standard", "fragile"]`
  - **Rationale**: Cargo taxonomy may evolve, JSONB future-proofs

- `usage_limit` and `used_count`:
  - **Why**: Track usage without blocking invoice flow
  - **Strategy**: Soft enforcement (can be bypassed for VIP customers)
  - **Future**: Hard enforcement in Migration 022

- `valid_from` / `valid_to`:
  - **Why**: Time-bound campaigns
  - CHECK constraint ensures `valid_to >= valid_from`
  - `valid_to` nullable → unlimited duration

### 2. `promotion_code` Table

**Purpose**: Individual promo code instances

**Design Decisions**:
- Separate from `promotion`:
  - **Why**: One promotion → many codes
  - **Example**: "SUMMER2024" promotion → "SUMMER2024-A", "SUMMER2024-B", ...
  - **Use Case**: Influencer tracking, channel attribution

- `is_single_use`:
  - **Why**: Code can be universal (WELCOME10) or one-time (VIPJOHN123)
  - **Logic**: If single-use, code expires after `used_by` populated

### 3. `promotion_usage` Table

**Purpose**: Audit trail of promotion application

**Design Decisions**:
- Immutable (no soft delete):
  - **Why**: Legal/audit requirement
  - **Compliance**: Must track all discount applications
  
- `discount_applied`:
  - **Why**: Store actual discount (not just promotion_id)
  - **Rationale**: Promotion rules may change, need historical accuracy
  - **Example**: Promotion was "20%" but later changed to "15%". Historical records show actual "20%" applied.

- ON DELETE RESTRICT on `customer_id`:
  - **Why**: Cannot delete customer if they have promotion history
  - **GDPR**: Customer deletion requires special process (anonymization)

### 4. `coupon` vs `promotion`

**Why Two Separate Tables?**

**Coupon**:
- Consumer-facing (GIFT10, WELCOME15)
- Typically single-use per customer
- Marketing channel: email, social media
- Short-lived (days/weeks)

**Promotion**:
- Business-facing or system-generated
- Can be multi-use
- Integrated into platform workflows
- Long-lived (months/quarters)

**Could They Be Merged?**:
- Yes, technically possible
- **Why Separate**: Different lifecycle management, reporting needs
- **Business Stakeholder Request**: Marketing wants separate coupon analytics

### 5. `seasonal_pricing_rule` Table

**Purpose**: Seasonal price multipliers (peak season surcharge)

**Design Decisions**:
- `price_multiplier`:
  - **Why**: Multiplicative adjustment (1.2 = +20% surcharge)
  - **Flexibility**: Can also do discount (0.9 = -10%)
  - CHECK: `price_multiplier > 0`

- `additional_fee`:
  - **Why**: Fixed fee on top of multiplier
  - **Example**: Peak season = 1.1x price + $50 fee

- `applicable_countries`: JSONB array
  - **Why**: Seasonality is geography-specific
  - **Example**: `["US", "CA", "MX"]` for North America winter surcharge

### 6. `bulk_discount_rule` Table

**Purpose**: Volume-based discounts

**Design Decisions**:
- `min_quantity`: Minimum cargo count
- `applicable_to`: `('all', 'customer_segment', 'institution')`
  - **Why**: Bulk discounts can be universal or targeted
  - **Example**: Institutions get bulk discounts at lower thresholds

- `applicable_customer_segment_ids`: JSONB
  - **Why**: Links to CRM customer segments (Migration 017)
  - **Flexibility**: No hard foreign key (CRM segment taxonomy evolving)

---

## 🚫 Intentional Design Omissions

### What is INTENTIONALLY Missing

#### 1. ❌ Automatic Discount Application

**Omitted**:
```sql
-- NOT CREATED:
CREATE TRIGGER apply_promotion_on_invoice_insert ...
```

**Why Omitted**:
- Triggers are difficult to debug
- Business logic should be in application layer
- Invoice creation must remain fast and predictable

**Future Plan (Migration 022)**:
```typescript
// Application layer (future)
invoiceService.create({ promotionCode: 'SUMMER20' })
```

#### 2. ❌ Promotion Stacking Rules

**Omitted**:
```sql
-- NOT CREATED:
CREATE TABLE promotion_stacking_rule (...)
```

**Why Omitted**:
- Stacking strategy not yet defined by business
- Requires marketing stakeholder consultation
- Can be added in Migration 022+ without schema changes

**Question for Business**:
- Can customer use both "WELCOME10" and "LOYALTY5"?
- Which promotion takes priority?
- Is it additive (15% total) or exclusive (max 10%)?

#### 3. ❌ Promotion-Customer Eligibility Mapping

**Omitted**:
```sql
-- NOT CREATED:
CREATE TABLE promotion_eligible_customers (
  promotion_id INTEGER,
  customer_id INTEGER
);
```

**Why Omitted**:
- Most promotions are universal (open to all)
- Customer targeting can be handled via JSONB filters
- Explicit mapping only needed for VIP/exclusive promotions

**Future**:
- If exclusive promotions become common → Add mapping table in Migration 023

#### 4. ❌ Discount Amount Column in Invoice

**Omitted**:
```sql
-- NOT ADDED TO invoice TABLE:
ALTER TABLE invoice ADD COLUMN discount_amount DECIMAL(15,2);
```

**Why Omitted**:
- Invoice table is production-critical (Migration 007)
- Adding column requires migration of ALL existing invoices
- Discount can be stored in `promotion_usage` for now

**Future** (Migration 022):
- Evaluate if discount should be denormalized into invoice
- Requires careful performance testing

#### 5. ❌ Promotion Application Service Endpoint

**Omitted**:
```typescript
// NOT IN MIGRATION 021:
POST /promotion/apply
{
  "invoiceId": 123,
  "promotionCode": "SUMMER20"
}
```

**Why Omitted**:
- Migration 021 is READ-ONLY infrastructure
- Application logic deferred to Migration 022
- Current endpoints: GET only (observability)

**Current Endpoints (Migration 021)**:
```
GET /promotion/promotions (list all)
GET /promotion/promotions/valid (currently valid)
GET /promotion/promotions/code/:code (lookup by code)
```

**Future Endpoints (Migration 022+)**:
```
POST /promotion/validate (check eligibility)
POST /promotion/apply (apply to invoice)
POST /promotion/redeem (redeem coupon)
```

---

## 🔮 Future Migration Notes (022+)

### Planned Migration 022: Promotional Logic

**Scope**:
1. **Validation Service**:
   - Validate promotion code exists
   - Check date validity
   - Check usage limits
   - Check customer eligibility
   - Check cargo/shipment type match

2. **Application Service**:
   - Calculate discount amount
   - Create `promotion_usage` record
   - Increment `promotion.used_count`
   - Return discount details

3. **Invoice Integration**:
   - Optional promotion parameter in invoice creation
   - Apply discount to invoice total
   - Store promotion reference

### Planned Migration 023: Promotional Analytics

**Scope**:
1. **Reporting Tables**:
   - Daily promotion performance summary
   - Customer segment promotion usage
   - ROI tracking

2. **Analytics Endpoints**:
   - Promotion redemption rates
   - Most effective promotions
   - Customer acquisition cost

### Planned Migration 024: Advanced Promotion Rules

**Scope**:
1. **Stacking Rules**:
   - Define promotion combination logic
   - Priority/precedence rules

2. **Conditional Promotions**:
   - Buy X get Y free
   - Tiered discounts
   - Loyalty point integration

---

## 📚 Backend Implementation (Migration 021)

### Oluşturulan Modüller

1. **PromotionModule** - `src/promotion/promotion/`
   - Promotion master data
   - Validity checking (valid_from, valid_to, usage_limit)
   - Discount type enforcement (percentage, fixed_amount)

**Endpoints**:
- `GET /promotion/promotions` - All promotions
- `GET /promotion/promotions/active` - Active promotions
- `GET /promotion/promotions/valid` - Currently valid promotions
- `GET /promotion/promotions/code/:code` - Lookup by code
- `GET /promotion/promotions/:id` - By ID

### Mimari Yapı

**Repository Layer**:
- Raw SQL queries
- Soft delete filtering (`WHERE deleted_at IS NULL`)
- Validity query: `valid_from <= NOW() AND (valid_to IS NULL OR valid_to >= NOW())`
- Usage limit check: `used_count < usage_limit`

**Service Layer**:
- `mapToDto()` functions
- JSONB field handling (applicable_to_cargo_types)
- Decimal conversions (`parseFloat()`)
- Date conversions (`toISOString()`)

**Controller Layer**:
- READ-ONLY (GET endpoints only)
- No POST/PUT/DELETE (deferred to Migration 022)

**DTO Layer**:
- JSONB fields as `any` type (flexible schema)
- Discount type enum validation (`@IsIn(['percentage', 'fixed_amount'])`)

---

## 🚨 Önemli Notlar

1. **READ-ONLY Infrastructure**: Bu migration SADECE veri modeli oluşturur. Promosyon application logic Migration 022'de implement edilecektir.

2. **Nullable Foreign Keys**: `cargo_id` ve `invoice_id` nullable by design. Promotions cargo veya invoice seviyesinde uygulanabilir.

3. **No Automatic Application**: Promotions otomatik olarak uygulanmaz. Manuel veya API-driven application gerektirir (future).

4. **JSONB Flexibility**: `applicable_to_cargo_types`, `applicable_to_shipment_types`, `applicable_countries` JSONB alanlar schema evolution için esneklik sağlar.

5. **Soft Delete**: `promotion`, `coupon`, `seasonal_pricing_rule`, `bulk_discount_rule` soft delete destekler. Usage/redemption tables immutable (audit trail).

6. **Usage Tracking**: `promotion_usage` ve `coupon_redemption` immutable audit trail'dir. Silinmez, asla güncellenmez.

7. **CHECK Constraints**: Discount type, date validity, usage limits DB level'da enforce edilir.

8. **ON DELETE Behaviors**: 
   - `promotion_usage.promotion_id`: RESTRICT (cannot delete used promotions)
   - `promotion_usage.cargo_id`: SET NULL (cargo deletion doesn't break audit trail)
   - `promotion_code.promotion_id`: CASCADE (deleting promotion removes codes)

9. **Index Strategy**: Partial indexes on active and valid promotions for performance.

10. **No Triggers**: Intentionally no triggers. Business logic in application layer (future migrations).

---

## ✅ Why This Design Approach?

### Summary of Design Philosophy

**Incremental Complexity**:
- Migration 021: Structure (tables, relationships, constraints)
- Migration 022: Behavior (validation, application, enforcement)
- Migration 023: Analytics (reporting, insights, optimization)

**Non-Invasive Integration**:
- Existing pricing/invoice logic UNTOUCHED
- Optional linkage via nullable foreign keys
- Gradual adoption possible

**Future-Proof Flexibility**:
- JSONB fields allow schema evolution
- Nullable columns allow new use cases
- Soft deletes preserve history

**Production Safety**:
- No changes to critical invoice/cargo tables
- No triggers (deterministic behavior)
- No calculated fields (explicit tracking)

**Business Alignment**:
- Marketing can create promotions
- Finance can audit discounts
- Engineering can iterate on rules

---
