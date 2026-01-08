# Migration 023: Workflow & Approval Tables

## 📋 Genel Bakış

Migration 023, Global Cargo Backend sistemine **Generic Workflow & Approval Engine** ekler. Bu migration, insan onayı gerektiren süreçler için yeniden kullanılabilir, cross-domain workflow infrastructure'ı oluşturur.

### Tablolar

1. **`workflow_definition`** - Yeniden kullanılabilir workflow şablonları
2. **`workflow_instance`** - Runtime workflow execution
3. **`workflow_step`** - Workflow adım tanımları
4. **`approval_chain`** - Onay seviyesi tanımları
5. **`approval_request`** - Onay talepleri
6. **`approval_history`** - İmmutable onay kararları

**🚨 CRITICAL NOTE**: Bu migration **SADECE YAPISAL ALTYAPI**dır. Workflow'lar otomatik olarak ilerlemez, onaylar otomatik verilmez, ve domain-specific enforcement yoktur. Bu intentional (kasıtlı) bir tasarım kararıdır.

---

## 🎯 Purpose of Migration 023

### Why Generic Workflow Engine Now?

**Business Context**:
- Migrations 019-022 risk-bearing infrastructure introduced:
  - Cold chain (022): Temperature breach requires approval
  - Promotion (021): discount application requires approval
  - Hazmat (022): Shipping authorization requires approval
  - (Future) Pricing exceptions, insurance claims, HR workflows

**Problem**: Each domain building its own approval logic = duplication, inconsistency, technical debt

**Migration 023 Goal**:
- Create **GENERIC, REUSABLE** workflow engine
- Separate workflow infrastructure from domain logic
- Support **HUMAN-IN-THE-LOOP** across all domains
- Enable consistent audit trail

### What This Migration IS

✅ **Generic Infrastructure**:
- Workflow definition templates
- Instance execution tracking
- Approval level management
- Decision history (immutable)

✅ **Cross-Domain Design**:
- `entity_type` + `entity_id` polymorphism
- No hard FK to specific entities (cargo, invoice, employee, etc.)
- JSONB for flexible configuration
- Reusable by any domain

✅ **Human-Centric**:
- Decisions made by employees
- Status transitions representational, not automatic
- No triggers, no automation
- Audit trail for compliance

### What This Migration IS NOT

❌ **NOT Domain-Specific**:
- Does NOT contain cold chain approval logic
- Does NOT contain pricing approval logic
- Does NOT contain HR approval logic

❌ **NOT Automated**:
- Does NOT auto-approve based on conditions
- Does NOT auto-progress workflow steps
- Does NOT enforce SLAs

❌ **NOT Coupled**:
- Does NOT modify cargo, invoice, or shipment tables
- Domain tables CONSUME workflows, not own them
- Workflow engine is a SERVICE, not embedded logic

---

## 🏗️ Why Approval Workflows Are Separated from Domain Logic

### Architectural Principle: Generic vs Domain-Specific

**Domain Logic** (Cargo, Pricing, Cold Chain):
- **Purpose**: Business-specific rules
- **Examples**: Temperature thresholds, pricing formulas, hazmat classifications
- **Ownership**: Domain teams (logistics, finance, QA)
- **Change Frequency**: Low (stable business rules)

**Workflow Logic** (Migration 023):
- **Purpose**: Generic approval orchestration
- **Examples**: Multi-level approval, decision tracking, timeout handling
- **Ownership**: Platform team
- **Change Frequency**: Very low (workflow patterns stable)

### Why Separation is Critical

**Reason 1: Reusability**

**Bad Design** (NOT used):
```sql
-- WRONG: Embedding approval into cold chain
CREATE TABLE cold_chain_approval (
  cold_chain_cargo_id INTEGER,
  approver_id INTEGER,
  decision VARCHAR(50)
);

-- Then repeat for pricing, HR, insurance...
CREATE TABLE pricing_approval (...);
CREATE TABLE hr_approval (...);
-- = 10+ duplicate approval tables
```

**Good Design** (Migration 023):
```sql
-- CORRECT: Generic approval engine
CREATE TABLE approval_request (
  entity_type VARCHAR(100),  -- 'cold_chain_cargo', 'pricing_exception', etc.
  entity_id INTEGER          -- Polymorphic reference
);
```

**Benefit**: One workflow engine serves unlimited domains.

**Reason 2: Consistency**

All approvals follow same pattern:
- Same audit trail format
- Same decision vocabulary (approved/rejected)
- Same notification mechanisms (future)
- Same SLA tracking (future)

**Reason 3: Evolution Independence**

- Workflow engine can add features (e.g., delegation, escalation) without touching domains
- Domains can change business rules without touching workflow engine
- Platform team owns workflow, domain teams own rules

---

## 🚫 Why NO Automation Is Introduced

### Explicitly Deferred: Automated Workflow Progression

**Current State (Migration 023)**:
- ✅ `workflow_instance` table exists
- ✅ `current_step` field tracks position
- ❌ **NO** automatic step progression
- ❌ **NO** auto-approval logic
- ❌ **NO** timeout enforcement

**Why No Automation?**

### Reason 1: Business Rules Not Yet Defined

**Questions Requiring Business Stakeholder Input**:
```
Cold Chain Approval:
- Who can approve temperature breaches?
- Do different breach severities need different approvers?
- Can approvals be delegated?
- What happens if approver is unavailable?
- Should some breaches skip approval (minor deviations)?

Pricing Approval:
- Who approves discounts > 10%?
- Who approves discounts > 25%?
- Can sales managers self-approve up to 15%?
- What's the escalation path if approval times out?
```

**Current State**: These questions **not yet answered** by business.

**Migration 023 Approach**: Create infrastructure, defer logic until requirements clear.

### Reason 2: Premature Automation = Inflexibility

**Risk Scenario**:
```
IF we auto-approve based on role:
  IF user.role = 'manager' THEN auto-approve discounts < 10%

Business changes rule 2 weeks later:
  "Managers can only approve if customer segment = 'premium'"

Result: Hard-coded logic now wrong, requires code change
```

**Better Approach** (Migration 023):
- Store approval decisions (data)
- Business logic determines approval rules (code layer, future)
- Flexibility to change rules without schema change

### Reason 3: Human Judgment Required

**Approval Decisions Have Nuance**:
- Temperature breach: Was it sensor malfunction or real?
- Pricing exception: Is customer strategic or one-time?
- Hazmat approval: Are documents sufficient or need follow-up?

**Automated Approval Cannot**:
- Read between the lines
- Consider context
- Escalate edge cases
- Make judgment calls

**Human-in-the-Loop**:
- Migration 023 provides infrastructure
- Migration 024+ adds decision support tools
- Migration 025+ potentially adds ML-assisted suggestions (NOT auto-approval)

---

## 💾 Why Approval Decisions Are Immutable

### Immutable Audit Trail Design

**Table**: `approval_history`

**No Soft Delete**:
```sql
-- NOT INCLUDED:
deleted_at TIMESTAMP WITH TIME ZONE NULL
```

**No UPDATE Allowed** (application layer enforces):
```typescript
// Future service layer rule:
// approval_history records NEVER updated, only INSERT
```

**Why Immutable?**

### Reason 1: Legal & Compliance

**Regulatory Requirements**:
- FDA (pharmaceuticals): Approval trail must be permanent
- SOX (financial): Cannot alter approval decisions retrospectively
- GDPR: Right to be forgotten ≠ right to alter audit trail

**Audit Question**:
```
"Who approved shipping this temperature-breached pharma cargo on Jan 15, 2024?"

Answer MUST be retrievable and trustworthy, even if:
- Employee no longer works here
- Approval was later found to be mistake
- System has changed
```

### Reason 2: Accountability

**Scenario**:
```
Manager approves risky decision
  ↓
Outcome is negative (customer claim, regulatory fine)
  ↓
Investigation: Who approved this and when?
  ↓
approval_history provides irrefutable evidence
```

**If History is Mutable**:
- Manager could retroactively "un-approve"
- Timestamps could be altered
- Evidence destroyed

**Immutability = Accountability**

### Reason 3: Temporal Queries

**Question**: "What was the approval state on March 1?"

**With Immutable History**:
```sql
SELECT * FROM approval_history
WHERE decision_date <= '2024-03-01'
ORDER BY decision_date ASC;
```

**With Mutable History**: Impossible to answer (data might have changed).

---

## 🔄 Why Enforcement Is Deferred to Later Migrations

### What "Enforcement" Means

**Enforcement Examples**:
- Block cargo shipment if cold chain approval rejected
- Apply discount ONLY if promotion approval granted
- Hire employee ONLY if HR approval chain complete

**Current State (Migration 023)**:
- ✅ Can track approval requests
- ✅ Can record decisions
- ❌ **Decision ≠ Action**

**Why Deferred?**

### Reason 1: Domains Must Opt-In

**Workflow Engine is a SERVICE**:
```
Workflow Engine (Migration 023)
  ↑ consumed by
Domain Modules (Migration 024+)
```

**Each Domain Decides**:
- Whether to use workflows
- Which operations require approval
- How to handle rejections

**Example** (Future):
```typescript
// Cold chain module (Migration 024):
async shipColdChainCargo(cargoId: number) {
  const approval = await workflowService.getApprovalForEntity('cold_chain_cargo', cargoId);
  
  if (approval.status !== 'approved') {
    throw new Error('Cannot ship: Awaiting approval');
  }
  
  // Proceed with shipment...
}
```

**Migration 023 Does NOT**:
- Inject this logic into domains
- Modify existing domain tables
- Force domains to use workflows

### Reason 2: Integration Complexity

**Enforcement Requires**:
1. Domain-specific business rules (cold chain vs pricing vs HR)
2. Error handling (what if approval rejected?)
3. Rollback mechanisms (undo partial operations)
4. User notifications (inform requester of decision)
5. UI integration (approval dashboards, buttons)

**Migration 023 Scope**: Table structure only

**Future Migrations**: Behavioral integration

### Reason 3: Backward Compatibility

**Existing Workflows Continue**:
- Cargo shipping (Migration 005) works WITHOUT workflows
- Invoice creation (Migration 007) works WITHOUT workflows
- Promotion application (Migration 021) works WITHOUT workflows

**Adding Workflows Must Be**:
- Optional (not forced)
- Additive (not breaking)
- Gradual (domain by domain)

---

## 🌐 Why This System Is Generic and Cross-Domain

### Polymorphic Entity Reference Design

**Pattern**: `entity_type` + `entity_id`

```sql
-- Generic reference (no hard FK):
approval_request (
  entity_type VARCHAR(100),  -- 'cargo', 'invoice', 'employee', etc.
  entity_id INTEGER          -- ID in respective table
)
```

**Why Not Foreign Keys?**

**Bad Design** (NOT used):
```sql
-- WRONG: Hard FK to specific entities
approval_request (
  cargo_id INTEGER REFERENCES cargo(id),       -- OR
  invoice_id INTEGER REFERENCES invoice(id),   -- OR
  employee_id INTEGER REFERENCES employee(id)  -- = Impossible
)
```

**Problem**: Cannot have FK to multiple tables simultaneously.

**Good Design** (Migration 023):
- Entity polymorphism
- Application layer enforces referential integrity
- Unlimited entity types supported

### Cross-Domain Usage Examples

#### Example 1: Cold Chain Approval

```sql
-- Workflow for temperature breach:
INSERT INTO approval_request (entity_type, entity_id, approval_chain_id)
VALUES ('cold_chain_cargo', 123, 5);  -- Chain 5 = "QA Manager -> Director"
```

#### Example 2: Pricing Approval

```sql
-- Workflow for discount exception:
INSERT INTO approval_request (entity_type, entity_id, approval_chain_id)
VALUES ('pricing_exception', 456, 3);  -- Chain 3 = "Sales Manager -> CFO"
```

#### Example 3: HR Approval

```sql
-- Workflow for employee hire:
INSERT INTO approval_request (entity_type, entity_id, approval_chain_id)
VALUES ('employee', 789, 2);  -- Chain 2 = "HR -> Department Head -> CEO"
```

**Same Infrastructure, Different Domains**

---

## 🚨 Comparison with BAD DESIGN

### Antipattern: Embedded Approvals

**What NOT to Do**:

```sql
-- ANTIPATTERN 1: Approval columns in domain tables
ALTER TABLE cargo ADD COLUMN approval_status VARCHAR(50);
ALTER TABLE cargo ADD COLUMN approved_by INTEGER;
ALTER TABLE cargo ADD COLUMN approved_at TIMESTAMP;

-- ANTIPATTERN 2: Domain-specific approval tables
CREATE TABLE cargo_approval (...)
CREATE TABLE invoice_approval (...)
CREATE TABLE employee_approval (...)
-- = 10+ duplicate tables

-- ANTIPATTERN 3: Triggers for auto-progression
CREATE TRIGGER auto_approve_cargo
AFTER INSERT ON cargo_approval
FOR EACH ROW
EXECUTE FUNCTION progress_workflow();
```

**Why These Are Bad**:

| Antipattern | Problem |
|-------------|---------|
| Approval columns in cargo | Mixes concerns, sparse data, hard to extend |
| Duplicate approval tables | Code duplication, inconsistent patterns, maintenance nightmare |
| Triggers | Hard to debug, opaque logic, performance issues |

### Good Design (Migration 023)

```sql
-- CORRECT: Generic workflow engine
CREATE TABLE workflow_definition (...);  -- Reusable templates
CREATE TABLE approval_request (...);     -- Polymorphic references
CREATE TABLE approval_history (...);     -- Immutable audit trail

-- Application layer (future):
workflowService.createApproval('cargo', cargoId, chainId);
```

**Benefits**:
- ✅ Reusable across domains
- ✅ Consistent audit trail
- ✅ Testable (no hidden triggers)
- ✅ Flexible (JSONB configuration)
- ✅ Future-proof (easy to extend)

---

## 🔮 Future Roadmap

### Planned Migrations for Workflow Enforcement

#### Migration 024: Cold Chain Workflow Integration

**Scope**:
1. **Approval Trigger Points**:
   - Temperature breach → Create approval request
   - Approval decision → Update cargo status

2. **Business Rules**:
   - Minor breach (< 5°C) → Manager approval
   - Major breach (>= 5°C) → Director approval
   - Critical breach (>= 10°C) → CEO approval

3. **Enforcement**:
   - Blocked shipment if approval pending/rejected
   - Notification to approvers

#### Migration 025: Pricing Exception Workflows

**Scope**:
1. **Discount Approval**:
   - > 10% discount → Sales Manager
   - > 20% discount → CFO
   - > 30% discount → CEO

2. **Automated Suggestions** (NOT auto-approval):
   - ML model suggests approval/reject
   - Human final decision

#### Migration 026: Workflow Notification & Escalation

**Scope**:
1. **Notification System**:
   - Email/SMS on approval request
   - Reminder after 24h
   - Escalation after 48h

2. **Delegation**:
   - Approver can delegate to colleague
   - Out-of-office auto-delegation

#### Migration 027: Workflow Analytics

**Scope**:
1. **Metrics**:
   - Average approval time
   - Approval vs rejection rate
   - Bottleneck identification

2. **Reporting**:
   - Approver performance dashboard
   - SLA breach reports

---

## 🏗️ Backend Implementation (Migration 023)

### Oluşturulan Modüller

#### 1. WorkflowDefinitionModule
**Location**: `src/workflow/workflow-definition/`

**Files Created**: 6 files (repository interface/impl, service, controller, DTO, module)

**Key Features**:
- Reusable workflow templates
- JSONB steps configuration
- Workflow type categorization
- Active/inactive toggling

**Endpoints**:
- `GET /workflow/definitions` - All workflows
- `GET /workflow/definitions/active` - Active only
- `GET /workflow/definitions/type/:type` - By workflow type
- `GET /workflow/definitions/code/:code` - By workflow code
- `GET /workflow/definitions/uuid/:uuid` - By UUID
- `GET /workflow/definitions/:id` - By ID

#### 2. ApprovalRequestModule
**Location**: `src/workflow/approval-request/`

**Files Created**: 6 files (repository interface/impl, service, controller, DTO, module)

**Key Features**:
- Polymorphic entity references
- Status tracking (pending/approved/rejected)
- Approval level progression
- Pending request filtering

**Endpoints**:
- `GET /workflow/approval-requests` - All requests
- `GET /workflow/approval-requests/pending` - Pending only
- `GET /workflow/approval-requests/status/:status` - By status
- `GET /workflow/approval-requests/entity/:entityType/:entityId` - By entity
- `GET /workflow/approval-requests/uuid/:uuid` - By UUID
- `GET /workflow/approval-requests/:id` - By ID

### Main Aggregator

**File**: `src/workflow/workflow.module.ts`
- Imports 2 submodules
- Exports for cross-module usage
- Wired to `app.module.ts`

---

## 📐 Pattern Consistency

### Following Migrations 019-022

**Repository Layer**:
- ✅ Raw SQL (no ORM)
- ✅ Explicit column selection
- ✅ Parameterized queries
- ✅ No triggers or stored procedures

**Service Layer**:
- ✅ `mapToDto()` functions
- ✅ JSONB field handling (pass-through, no validation)
- ✅ `toISOString()` for dates
- ✅ `NotFoundException` handling

**Controller Layer**:
- ✅ GET-only endpoints
- ✅ RESTful paths
- ✅ `ParseIntPipe` validation

**DTO Layer**:
- ✅ camelCase properties
- ✅ `class-validator` decorators
- ✅ JSONB as `any` type (flexible schema)

---

## 🚫 Explicit List of WHAT IS INTENTIONALLY MISSING

### Omissions and Justification

#### 1. ❌ Workflow Step Auto-Progression

**Omitted**:
```typescript
// NOT IN MIGRATION 023:
class WorkflowService {
  async progressToNextStep(instanceId: number) {
    // Automatic step advancement
    // Auto-approval based on rules
  }
}
```

**Why Omitted**:
- Business rules for progression not defined
- Each domain has different step logic
- Requires conditional evaluation (deferred)

**When Added**: Migration 024+ (domain-specific integration)

#### 2. ❌ Approval Decision POST Endpoint

**Omitted**:
```typescript
// NOT IN MIGRATION 023:
@Post('approve')
async approve(@Body() dto: ApprovalDecisionDto) {
  // Create approval_history record
  // Update approval_request status
  // Notify requester
}
```

**Why Omitted**:
- Migration 023 is READ-ONLY infrastructure
- Decision creation requires business logic
- Notification system not yet built

**When Added**: Migration 024 (approval action endpoints)

#### 3. ❌ Timeout Enforcement

**Omitted**:
```sql
-- workflow_step.timeout_hours exists but NOT enforced
```

**Why Omitted**:
- Timeout handling requires background jobs (cron)
- Escalation rules not defined
- Notification system prerequisite

**When Added**: Migration 026 (escalation workflows)

#### 4. ❌ Role-Based Approval Authorization

**Omitted**:
```typescript
// NOT IN MIGRATION 023:
async canApprove(employeeId: number, requestId: number): Promise<boolean> {
  // Check if employee has required role
  // Check if employee is in approval chain
}
```

**Why Omitted**:
- RBAC module integration not scoped
- Role hierarchy rules need definition
- Belongs to security module (future)

**When Added**: Migration 027 (RBAC integration)

#### 5. ❌ Workflow Instance Creation Endpoint

**Omitted**:
```typescript
// NOT IN MIGRATION 023:
@Post('instances')
async createInstance(@Body() dto: CreateInstanceDto) {
  // Start workflow for entity
  // Create approval requests
}
```

**Why Omitted**:
- Instance creation is domain-triggered (not manual)
- Each domain has different trigger points
- Belongs in domain modules (024+)

**When Added**: Domain modules (024+) call workflow service

#### 6. ❌ Approval Delegation

**Omitted**:
```sql
-- NOT CREATED:
CREATE TABLE approval_delegation (
  approver_id INTEGER,
  delegate_id INTEGER,
  effective_from DATE,
  effective_to DATE
);
```

**Why Omitted**:
- Delegation rules complex (temporary vs permanent)
- Out-of-office system not built
- Low priority for MVP

**When Added**: Migration 026 (advanced workflow features)

---

## 🚨 Önemli Notlar

1. **READ-ONLY Infrastructure**: Bu migration SADECE veri modeli oluşturur. Approval logic Migration 024+'da implement edilecektir.

2. **No Automation**: Workflows manuel olarak veya future domain services tarafından başlatılacak. Otomatik progression yok.

3. **Immutable History**: `approval_history` immutable audit trail'dir. ASLA güncellenmez veya silinmez.

4. **Polymorphic References**: `entity_type` + `entity_id` pattern kullanılır. Hard FK yok (generic design).

5. **JSONB Flexibility**: `workflow_definition.steps`, `approval_chain.approval_levels` JSONB alanlar esnek konfigürasyon sağlar.

6. **No Domain Coupling**: Workflow engine domain tablolarına FK içermez. Domains workflow'u CONSUME eder.

7. **CHECK Constraints**: `approval_history.decision` IN ('approved', 'rejected') DB level'da enforce edilir.

8. **ON DELETE Behaviors**:
   - `approval_request.approval_chain_id`: RESTRICT (cannot delete active chains)
   - `approval_history.approver_id`: RESTRICT (cannot delete approvers with history)
   - `approval_history.approval_request_id`: CASCADE

9. **Index Strategy**: Partial indexes on `status = 'pending'` and `status = 'active'` for performance.

10. **No Soft Delete on History**: `approval_history` has NO `deleted_at` (immutable audit trail).

---

## ✅ Why This Design Approach?

### Summary of Design Philosophy

**Generic Infrastructure**:
- One workflow engine serves unlimited domains
- Polymorphic entity references
- JSONB for flexibility

**Human-in-the-Loop**:
- No automated approvals
- Decisions require human judgment
- Audit trail for accountability

**Deferred Enforcement**:
- Infrastructure first (Migration 023)
- Integration later (Migration 024+)
- Domain opt-in (not forced)

**Immutable Audit Trail**:
- Legal compliance
- Accountability
- Temporal queries

**Future-Ready**:
- Extensible via JSONB
- Supports delegation, escalation (future)
- Analytics-ready

---
