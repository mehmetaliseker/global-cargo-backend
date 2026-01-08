# Migration 027: Finance Budget Tables

## 📋 Genel Bakış

Migration 027, Global Cargo Backend sistemine **Finance Budget Infrastructure** ekler. Bu migration, departman bütçesi yönetimi, maliyet takibi, nakit akışı izleme, kar-zarar analizleri ve finansal kontroller için gerekli transactional operasyonel altyapıyı oluşturur.

### Tablolar

1. **`cost_center`** - Maliyet merkezi tanımları
2. **`cost_allocation`** - Maliyet tahsis kayıtları
3. **`department_budget`** - Departman bütçesi tanımları ve takibi
4. **`budget_tracking`** - Bütçe harcama takibi ve onay süreçleri
5. **`profit_loss_analysis`** - Kar-zarar analizleri (dönemsel)
6. **`cash_flow`** - Nakit akışı kayıtları
7. **`budget_projection`** - Bütçe projeksiyonları
8. **`financial_report`** - Finansal raporlar (gelir tablosu, bilanço, nakit akışı)
9. **`budget_performance`** - Bütçe performans takibi (bütçe vs gerçekleşen)
10. **`financial_control`** - Finansal kontrol eşikleri ve onay zincirleri
11. **`accounting_entry`** - Muhasebe kayıtları (borç/alacak)
12. **`tax_calculation`** - Vergi hesaplama kayıtları
13. **`financial_risk`** - Finansal risk tanımları ve yönetimi
14. **`cost_optimization`** - Maliyet optimizasyon analizleri
15. **`financial_comparison`** - Finansal karşılaştırmalar (yıllık, dönemsel, bütçe vs gerçek)

**🚨 ÖNEMLİ NOT**: Bu migration **OPERASYONEL TRANSACTIONAL ALTYAPI**dır. Bu tablolar günlük finansal operasyonlarda aktif olarak kullanılır ve backend API'ları ile yönetilir.

---

## 🎯 Migration 027'nin Amacı

### Neden Finance Budget Şimdi?

**İş Bağlamı**:
- Migrations 001-026 temel operasyonel altyapıyı tamamladı
- Fatura ve ödeme sistemleri mevcut (Migrations 015-017)
- Finansal yönetim ve bütçe kontrolü için altyapı gerekli
- Departman bazlı maliyet takibi ve bütçe yönetimi kritik
- Kar-zarar analizleri ve finansal raporlama gerekiyor
- Nakit akışı izleme ve finansal risk yönetimi zorunlu

**Problem**: Basit fatura ve ödeme tabloları yeterli değil:
- Departman bazlı bütçe yönetimi yok
- Maliyet merkezleri ve tahsis takibi yok
- Bütçe vs gerçekleşen karşılaştırması yapılamıyor
- Kar-zarar analizleri için yapı eksik
- Nakit akışı izleme ve projeksiyon yapılamıyor
- Finansal kontroller ve onay süreçleri yok

**Migration 027 Hedefi**:
- **Departman bütçesi yönetimi** için transactional altyapı
- Maliyet merkezi ve tahsis takibi için veri modeli
- Bütçe harcama takibi ve onay süreçleri için sistem
- Kar-zarar analizleri için yapı
- Nakit akışı izleme ve projeksiyon desteği
- Finansal kontroller ve risk yönetimi altyapısı

### Bu Migration Neyi Sağlar?

✅ **Bütçe Yönetimi**:
- Departman bazlı bütçe tanımları
- Yıllık bütçe planlama ve takibi
- Bütçe kategorileri (operational, capital, marketing)
- Bütçe vs gerçekleşen karşılaştırması

✅ **Maliyet Takibi**:
- Maliyet merkezi tanımları
- Maliyet tahsis kayıtları
- Harcama takibi ve onay süreçleri
- Maliyet optimizasyon analizleri

✅ **Finansal Analiz**:
- Kar-zarar analizleri (dönemsel)
- Nakit akışı izleme
- Bütçe performans takibi
- Finansal karşılaştırmalar

✅ **Finansal Kontrol**:
- Kontrol eşikleri ve onay zincirleri
- Muhasebe kayıtları (borç/alacak)
- Vergi hesaplama kayıtları
- Finansal risk tanımları ve yönetimi

### Bu Migration Neyi Sağlamaz?

❌ **Otomatik Muhasebe Entegrasyonu DEĞİLDİR**:
- Harici muhasebe sistemleri ile otomatik senkronizasyon yapmaz
- Muhasebe kayıtları manuel veya external service tarafından oluşturulur
- Backend sadece kayıtları saklar ve servis eder

❌ **Otomatik Bütçe Hesaplama Motoru DEĞİLDİR**:
- Bütçe tutarlarını otomatik hesaplamaz
- Harcama tutarlarını otomatik güncellemez
- Bütçe vs gerçekleşen karşılaştırmalarını otomatik yapmaz
- External process veya manuel giriş gerekir

❌ **Finansal Rapor Üretme Motoru DEĞİLDİR**:
- Raporları otomatik oluşturmaz
- Konsolide finansal verileri otomatik hesaplamaz
- Sadece rapor verilerini saklar ve sorgular
- Rapor üretimi external service veya manuel süreç ile yapılır

---

## 📊 Department Budget Tablosu

### Amaç

Departman bazlı bütçe tanımlarını yönetmek, bütçe tutarlarını takip etmek ve harcanmış/mevcut tutarları hesaplamak.

### Yapı

```sql
department_budget (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    department_name VARCHAR(200) NOT NULL,      -- 'Operations', 'Sales', 'IT'
    budget_year INTEGER NOT NULL,                -- 2024
    budget_amount DECIMAL(15, 2) NOT NULL,       -- Toplam bütçe tutarı
    spent_amount DECIMAL(15, 2) DEFAULT 0,       -- Harcanan tutar
    available_amount DECIMAL(15, 2) GENERATED,   -- Mevcut bütçe (budget_amount - spent_amount)
    budget_category VARCHAR(100),                -- 'operational', 'capital', 'marketing'
    currency_id INTEGER NOT NULL,                -- Para birimi
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi 2024 yılı için Operasyon departmanına 500,000 TL operasyonel bütçe ayırdı. Yıl başında bütçe oluşturuldu. İlk 3 ayda 125,000 TL harcandı. Mevcut bütçe: 375,000 TL.

```typescript
// Backend API ile departman bütçesi sorgulanır
GET /finance/department-budgets/department/Operations/year/2024

Response:
[
    {
        "id": 1,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "departmentName": "Operations",
        "budgetYear": 2024,
        "budgetAmount": 500000.00,
        "spentAmount": 125000.00,
        "availableAmount": 375000.00,
        "budgetCategory": "operational",
        "currencyId": 1,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-04-01T12:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **Computed Column (available_amount)**: PostgreSQL GENERATED ALWAYS AS kullanılarak mevcut bütçe otomatik hesaplanır. Application layer'da hesaplama yapılmasına gerek yok, database seviyesinde tutarlılık garantisi var.

2. **UUID**: Harici sistemler ile entegrasyon için UUID kullanılır. Finansal sistemler genellikle ID yerine UUID tercih eder.

3. **Soft Delete**: `deleted_at` ile bütçe kayıtları kalıcı olarak silinmez. Geçmiş bütçe verileri raporlama ve audit için saklanır.

4. **Unique Constraint**: `(department_name, budget_year, budget_category)` unique constraint'i ile aynı departman, yıl ve kategori için tekrar eden bütçe oluşturulması engellenir.

### Backend Implementasyonu

**Module**: `department-budget`

**Endpoints**:
- `GET /finance/department-budgets` - Tüm bütçeler
- `GET /finance/department-budgets/active` - Aktif bütçeler
- `GET /finance/department-budgets/department/:departmentName` - Belirli departman için bütçeler
- `GET /finance/department-budgets/department/:departmentName/year/:budgetYear` - Departman ve yıl bazlı
- `GET /finance/department-budgets/year/:budgetYear` - Belirli yıl için tüm bütçeler
- `GET /finance/department-budgets/year/:budgetYear/active` - Belirli yıl için aktif bütçeler
- `GET /finance/department-budgets/category/:budgetCategory` - Kategori bazlı bütçeler
- `GET /finance/department-budgets/uuid/:uuid` - UUID ile bütçe
- `GET /finance/department-budgets/:id` - ID ile bütçe

**Repository Metodları**:
- `findAll()`: Soft delete edilmemiş tüm bütçeler (yıl ve departman bazlı sıralı)
- `findById(id)`: ID ile bütçe (soft delete kontrolü ile)
- `findByUuid(uuid)`: UUID ile bütçe
- `findByDepartmentName(departmentName)`: Departman bazlı tüm bütçeler
- `findByDepartmentNameAndYear(departmentName, budgetYear)`: Departman ve yıl bazlı
- `findByBudgetYear(budgetYear)`: Yıl bazlı tüm bütçeler
- `findByBudgetCategory(budgetCategory)`: Kategori bazlı bütçeler
- `findActive()`: Aktif bütçeler
- `findActiveByYear(budgetYear)`: Belirli yıl için aktif bütçeler

**SQL Pattern**:
- Soft delete kontrolü: `WHERE deleted_at IS NULL`
- Aktif kayıt kontrolü: `WHERE is_active = true`
- Computed column direkt kullanılır: `available_amount` SELECT'te otomatik hesaplanır
- Sıralama: `ORDER BY budget_year DESC, department_name ASC`

**DTO Mapping**:
- Snake_case database kolonları → camelCase DTO property'leri
- Decimal tipler `parseFloat()` ile number'a çevrilir
- Date tipler `toISOString()` ile string'e çevrilir
- Computed column (available_amount) direkt kullanılır

---

## 💰 Cost Center Tablosu

### Amaç

Maliyet merkezi tanımlarını yönetmek. Maliyet merkezleri, maliyetlerin tahsis edildiği organizasyonel birimlerdir.

### Yapı

```sql
cost_center (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    cost_center_code VARCHAR(50) NOT NULL UNIQUE,  -- 'CC-001', 'CC-002'
    cost_center_name VARCHAR(200) NOT NULL,        -- 'Istanbul Warehouse', 'Ankara Branch'
    department_name VARCHAR(200),                  -- Hangi departmana bağlı
    budget_year INTEGER NOT NULL,                  -- Hangi yıl için geçerli
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi İstanbul Depo'yu maliyet merkezi olarak tanımlıyor. Kod: CC-001, Departman: Operations, Yıl: 2024.

**Neden Bu Şekilde Tasarlandı?**

1. **Cost Center Code**: İnsan tarafından okunabilir unique kod. Raporlarda ve dokümantasyonda kullanılır.

2. **Department Bağlantısı**: Maliyet merkezi bir departmana bağlıdır. Departman bazlı maliyet analizi yapılabilir.

3. **Yıl Bazlı**: Maliyet merkezleri yıl bazlı tanımlanır. Yıllar arası değişiklikler takip edilebilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 💸 Cost Allocation Tablosu

### Amaç

Maliyetlerin maliyet merkezlerine tahsis edilmesini kaydetmek. Bir maliyet, belirli bir entity'ye (kargo, proje, route) bağlı olarak maliyet merkezine tahsis edilir.

### Yapı

```sql
cost_allocation (
    id SERIAL PRIMARY KEY,
    cost_center_id INTEGER NOT NULL,              -- Hangi maliyet merkezine tahsis edildi
    allocation_type VARCHAR(50) NOT NULL,         -- 'cargo', 'project', 'route', 'vehicle'
    entity_id INTEGER NOT NULL,                   -- Hangi entity'ye ait (cargo_id, project_id, vb.)
    cost_amount DECIMAL(15, 2) NOT NULL,          -- Tahsis edilen maliyet tutarı
    currency_id INTEGER NOT NULL,
    allocation_date DATE NOT NULL,                -- Tahsis tarihi
    description TEXT,                             -- Açıklama
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Bir kargo İstanbul Depo'dan gönderildi. Kargo ID: 12345, Maliyet: 150 TL (depolama + elleçleme). Bu maliyet Cost Center CC-001'e (Istanbul Warehouse) tahsis edildi.

```typescript
// Cost allocation kaydı oluşturulur
POST /finance/cost-allocations
{
    "costCenterId": 1,
    "allocationType": "cargo",
    "entityId": 12345,
    "costAmount": 150.00,
    "currencyId": 1,
    "allocationDate": "2024-01-15",
    "description": "Depolama ve elleçleme maliyeti"
}
```

**Neden Bu Şekilde Tasarlandı?**

1. **Polymorphic Allocation**: `allocation_type` + `entity_id` pattern'i ile farklı entity tiplerine maliyet tahsis edilebilir. Schema değişikliği yapmadan yeni entity tipleri eklenebilir.

2. **Audit Trail**: Her maliyet tahsis kaydedilir. Geçmiş maliyetlere referans verilebilir.

3. **Maliyet Merkezi Bağlantısı**: Her tahsis bir maliyet merkezine bağlıdır. Maliyet merkezi bazlı maliyet analizi yapılabilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 📝 Budget Tracking Tablosu

### Amaç

Bütçe harcamalarını kaydetmek ve onay süreçlerini takip etmek. Her harcama bir departman bütçesine bağlıdır ve onay sürecinden geçer.

### Yapı

```sql
budget_tracking (
    id SERIAL PRIMARY KEY,
    department_budget_id INTEGER NOT NULL,        -- Hangi bütçeye ait harcama
    expense_type VARCHAR(100) NOT NULL,           -- 'office_supplies', 'travel', 'equipment'
    expense_amount DECIMAL(15, 2) NOT NULL,       -- Harcama tutarı
    currency_id INTEGER NOT NULL,
    expense_date DATE NOT NULL,                   -- Harcama tarihi
    description TEXT,                             -- Harcama açıklaması
    approved_by INTEGER,                          -- Onaylayan employee ID
    approval_date TIMESTAMP WITH TIME ZONE,       -- Onay tarihi
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Operasyon departmanı 5,000 TL ofis malzemesi satın aldı. Harcama 15 Ocak 2024'te yapıldı. Departman Müdürü (Employee #456) 16 Ocak 2024'te harcamayı onayladı.

```typescript
// Budget tracking kaydı oluşturulur
POST /finance/budget-trackings
{
    "departmentBudgetId": 1,
    "expenseType": "office_supplies",
    "expenseAmount": 5000.00,
    "currencyId": 1,
    "expenseDate": "2024-01-15",
    "description": "Ofis malzemeleri satın alındı",
    "approvedBy": 456,
    "approvalDate": "2024-01-16T10:00:00.000Z"
}

// Bu harcama department_budget tablosundaki spent_amount'u artırmalı
// (Bu mantık application layer'da veya trigger ile yapılabilir)
```

**Neden Bu Şekilde Tasarlandı?**

1. **Onay Takibi**: `approved_by` ve `approval_date` alanları ile harcama onay süreçleri takip edilir. Onaylanmamış harcamalar tespit edilebilir.

2. **Harcama Tipi**: `expense_type` ile harcamalar kategorize edilir. Harcama tipi bazlı analizler yapılabilir.

3. **Bütçe Bağlantısı**: Her harcama bir bütçeye bağlıdır. Bütçe bazlı harcama analizi yapılabilir.

4. **Onay İş Akışı**: Onay süreçleri workflow modülü ile entegre edilebilir. `approved_by` alanı ile onaylayan kişi takip edilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

**Önemli Not**: `budget_tracking` tablosuna yeni kayıt eklendiğinde, `department_budget` tablosundaki `spent_amount` güncellenmelidir. Bu güncelleme:
- Application layer'da transaction içinde yapılabilir
- Database trigger ile otomatik yapılabilir
- Scheduled job ile periyodik yapılabilir

Şu anda backend implementasyonunda bu mantık yok, ancak production'da mutlaka eklenmelidir.

---

## 📈 Profit Loss Analysis Tablosu

### Amaç

Kar-zarar analizlerini dönemsel olarak kaydetmek. Gelir, maliyet ve kar-zarar tutarları iş birimi bazında saklanır.

### Yapı

```sql
profit_loss_analysis (
    id SERIAL PRIMARY KEY,
    business_unit VARCHAR(200) NOT NULL,          -- 'Turkey Operations', 'International'
    analysis_period VARCHAR(50) NOT NULL,         -- 'month', 'quarter', 'year'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    revenue DECIMAL(15, 2) NOT NULL,              -- Gelir
    cost DECIMAL(15, 2) NOT NULL,                 -- Maliyet
    profit DECIMAL(15, 2) GENERATED,              -- Kar (revenue - cost)
    profit_margin_percentage DECIMAL(5, 2) GENERATED,  -- Kar marjı % ((profit / revenue) * 100)
    currency_id INTEGER NOT NULL,
    analysis_date TIMESTAMP WITH TIME ZONE,
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi Ocak 2024 ayı için Türkiye Operasyonları iş biriminin kar-zarar analizi:

- Gelir: 2,000,000 TL
- Maliyet: 1,500,000 TL
- Kar: 500,000 TL
- Kar Marjı: 25%

```typescript
GET /finance/profit-loss-analyses/business-unit/Turkey Operations/period/month?startDate=2024-01-01&endDate=2024-01-31

Response:
[
    {
        "id": 1,
        "businessUnit": "Turkey Operations",
        "analysisPeriod": "month",
        "periodStart": "2024-01-01",
        "periodEnd": "2024-01-31",
        "revenue": 2000000.00,
        "cost": 1500000.00,
        "profit": 500000.00,
        "profitMarginPercentage": 25.00,
        "currencyId": 1,
        "analysisDate": "2024-02-05T10:00:00.000Z",
        "createdAt": "2024-02-05T10:00:00.000Z",
        "updatedAt": "2024-02-05T10:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **Computed Columns**: `profit` ve `profit_margin_percentage` computed columns olarak tanımlanmış. Database seviyesinde tutarlılık garantisi var.

2. **İş Birimi Bazlı**: Farklı iş birimleri için ayrı kar-zarar analizleri yapılabilir. İş birimi bazlı performans karşılaştırması yapılabilir.

3. **Dönemsel Takip**: Aylık, çeyreklik ve yıllık kar-zarar analizleri saklanır. Trend analizi yapılabilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 💵 Cash Flow Tablosu

### Amaç

Nakit akışı kayıtlarını saklamak. Belirli bir dönem için açılış bakiyesi, kapanış bakiyesi, giriş ve çıkış tutarları kaydedilir.

### Yapı

```sql
cash_flow (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance DECIMAL(15, 2) NOT NULL,      -- Dönem başı bakiye
    closing_balance DECIMAL(15, 2) NOT NULL,      -- Dönem sonu bakiye
    currency_id INTEGER NOT NULL,
    inflow_amount DECIMAL(15, 2) DEFAULT 0,       -- Giriş tutarı
    outflow_amount DECIMAL(15, 2) DEFAULT 0,      -- Çıkış tutarı
    net_cash_flow DECIMAL(15, 2) GENERATED,       -- Net nakit akışı (inflow - outflow)
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi Ocak 2024 ayı nakit akışı:

- Açılış Bakiye: 1,000,000 TL
- Giriş: 500,000 TL
- Çıkış: 300,000 TL
- Net Nakit Akışı: 200,000 TL
- Kapanış Bakiye: 1,200,000 TL

**Neden Bu Şekilde Tasarlandı?**

1. **Computed Column**: `net_cash_flow` computed column olarak tanımlanmış. Database seviyesinde tutarlılık garantisi var.

2. **Dönemsel Takip**: Belirli bir dönem için nakit akışı kaydedilir. Dönemler arası karşılaştırma yapılabilir.

3. **Bakiye Takibi**: Açılış ve kapanış bakiyeleri saklanır. Nakit durumu takip edilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 📊 Budget Performance Tablosu

### Amaç

Bütçe performansını takip etmek. Bütçelenen tutar ile gerçekleşen tutar karşılaştırılır, sapma (variance) hesaplanır.

### Yapı

```sql
budget_performance (
    id SERIAL PRIMARY KEY,
    department_budget_id INTEGER NOT NULL,
    performance_period VARCHAR(50) NOT NULL,      -- 'month', 'quarter', 'year'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    budgeted_amount DECIMAL(15, 2) NOT NULL,      -- Bütçelenen tutar
    actual_amount DECIMAL(15, 2) NOT NULL,        -- Gerçekleşen tutar
    variance_amount DECIMAL(15, 2) GENERATED,     -- Sapma (actual - budgeted)
    variance_percentage DECIMAL(5, 2) GENERATED,  -- Sapma % ((variance / budgeted) * 100)
    currency_id INTEGER NOT NULL,
    analysis_date TIMESTAMP WITH TIME ZONE,
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Operasyon departmanı Ocak 2024 ayı bütçe performansı:

- Bütçelenen: 50,000 TL
- Gerçekleşen: 45,000 TL
- Sapma: -5,000 TL (altında)
- Sapma %: -10% (bütçenin %10 altında kalmış)

**Neden Bu Şekilde Tasarlandı?**

1. **Computed Columns**: `variance_amount` ve `variance_percentage` computed columns olarak tanımlanmış. Database seviyesinde tutarlılık garantisi var.

2. **Dönemsel Takip**: Bütçe performansı dönemsel olarak ölçülür. Trend analizi yapılabilir.

3. **Sapma Analizi**: Pozitif sapma (üstünde) ve negatif sapma (altında) tespit edilebilir. Bütçe kontrolü için kritik.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 🔒 Financial Control Tablosu

### Amaç

Finansal kontroller ve onay eşiklerini tanımlamak. Belirli tutarların üzerindeki işlemler için onay gerekir.

### Yapı

```sql
financial_control (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    control_type VARCHAR(100) NOT NULL,           -- 'expense_approval', 'budget_transfer'
    threshold_amount DECIMAL(15, 2) NOT NULL,     -- Eşik tutarı
    approval_required BOOLEAN DEFAULT true,       -- Onay gerekli mi?
    approval_chain_id INTEGER,                    -- Onay zinciri (workflow)
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi harcama onay kontrolü tanımlıyor:

- Kontrol Tipi: expense_approval
- Eşik Tutarı: 10,000 TL
- Onay Gerekli: true
- Onay Zinciri: Approval Chain #1 (Department Manager → Finance Manager → CFO)

10,000 TL'nin üzerindeki harcamalar için onay zinciri devreye girer.

**Neden Bu Şekilde Tasarlandı?**

1. **Onay Kontrolü**: Belirli tutarların üzerindeki işlemler için otomatik onay kontrolü yapılabilir.

2. **Onay Zinciri Entegrasyonu**: `approval_chain_id` ile workflow modülü ile entegrasyon sağlanır.

3. **Esnek Kontroller**: Farklı kontrol tipleri için farklı eşikler tanımlanabilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 📖 Accounting Entry Tablosu

### Amaç

Muhasebe kayıtlarını saklamak. Her kayıt borç (debit) veya alacak (credit) olabilir ve bir hesap koduna bağlıdır.

### Yapı

```sql
accounting_entry (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    entry_type VARCHAR(10) NOT NULL,              -- 'debit' veya 'credit'
    account_code VARCHAR(50) NOT NULL,            -- Hesap kodu (120, 320, vb.)
    amount DECIMAL(15, 2) NOT NULL,
    currency_id INTEGER NOT NULL,
    reference_entity_type VARCHAR(100),           -- 'invoice', 'payment', 'budget'
    reference_entity_id INTEGER,                  -- Referans entity ID
    entry_date DATE NOT NULL,
    description TEXT,
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Bir fatura ödendi. Muhasebe kaydı:

- Borç (Debit): Hesap 120 (Alıcılar) - 10,000 TL
- Alacak (Credit): Hesap 100 (Kasa) - 10,000 TL

```typescript
// Accounting entry kayıtları oluşturulur (çift taraflı kayıt)
POST /finance/accounting-entries
[
    {
        "entryType": "debit",
        "accountCode": "120",
        "amount": 10000.00,
        "currencyId": 1,
        "referenceEntityType": "invoice",
        "referenceEntityId": 12345,
        "entryDate": "2024-01-15",
        "description": "Fatura ödemesi - Alıcılar hesabı"
    },
    {
        "entryType": "credit",
        "accountCode": "100",
        "amount": 10000.00,
        "currencyId": 1,
        "referenceEntityType": "invoice",
        "referenceEntityId": 12345,
        "entryDate": "2024-01-15",
        "description": "Fatura ödemesi - Kasa hesabı"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **Çift Taraflı Kayıt (Double Entry)**: Muhasebe prensibi gereği her işlem için borç ve alacak kaydı oluşturulur.

2. **Polymorphic Reference**: `reference_entity_type` + `reference_entity_id` pattern'i ile farklı entity tiplerine referans verilebilir.

3. **Hesap Kodu**: Standardize edilmiş hesap kodları kullanılır. Muhasebe standartlarına uyum sağlanır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 💳 Tax Calculation Tablosu

### Amaç

Vergi hesaplama kayıtlarını saklamak. Her ülke için farklı vergi tipleri ve oranları hesaplanır.

### Yapı

```sql
tax_calculation (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    tax_type VARCHAR(100) NOT NULL,               -- 'VAT', 'income_tax', 'customs_duty'
    tax_rate DECIMAL(10, 4) NOT NULL,             -- Vergi oranı (18.00 = %18)
    taxable_amount DECIMAL(15, 2) NOT NULL,       -- Vergiye tabi tutar
    calculated_tax DECIMAL(15, 2) NOT NULL,       -- Hesaplanan vergi
    country_id INTEGER NOT NULL,                  -- Hangi ülke için
    tax_regulation_version_id INTEGER,            -- Vergi mevzuat versiyonu
    calculation_date DATE NOT NULL,
    created_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Bir fatura için KDV hesaplandı:

- Vergi Tipi: VAT (KDV)
- Vergi Oranı: 18.00%
- Vergiye Tabi Tutar: 1,000 TL
- Hesaplanan Vergi: 180 TL
- Ülke: Türkiye

**Neden Bu Şekilde Tasarlandı?**

1. **Vergi Mevzuat Versiyonu**: Vergi mevzuatları zaman içinde değişebilir. Versiyon takibi ile geçmiş hesaplamalar doğru mevzuata referans verir.

2. **Ülke Bazlı**: Farklı ülkeler için farklı vergi tipleri ve oranları hesaplanır.

3. **Audit Trail**: Her vergi hesaplaması kaydedilir. Geçmiş hesaplamalara referans verilebilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## ⚠️ Financial Risk Tablosu

### Amaç

Finansal riskleri tanımlamak, risk seviyesini belirlemek ve yönetim planlarını takip etmek.

### Yapı

```sql
financial_risk (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    risk_type VARCHAR(100) NOT NULL,              -- 'currency', 'credit', 'liquidity'
    risk_level VARCHAR(50) NOT NULL,              -- 'low', 'medium', 'high', 'critical'
    risk_score DECIMAL(5, 2) NOT NULL,            -- 0-100 arası risk skoru
    mitigation_plan JSONB,                        -- Azaltma planı
    risk_description TEXT,                        -- Risk açıklaması
    identified_date DATE NOT NULL,                -- Risk tespit tarihi
    mitigation_status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'in_progress', 'completed'
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi döviz kuru riski tespit etti:

- Risk Tipi: currency
- Risk Seviyesi: high
- Risk Skoru: 75/100
- Açıklama: USD/TL kurunda yüksek volatilite, döviz pozisyonu riskli
- Azaltma Planı: Hedging stratejisi uygulanacak
- Durum: in_progress

**Neden Bu Şekilde Tasarlandı?**

1. **Risk Skoru**: 0-100 arası sayısal skor ile riskler karşılaştırılabilir ve önceliklendirilebilir.

2. **JSONB Azaltma Planı**: Farklı risk tipleri için farklı azaltma planları tanımlanabilir. JSONB formatı esneklik sağlar.

3. **Durum Takibi**: Risk azaltma süreci takip edilir. Tamamlanan riskler işaretlenir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 🔍 Cost Optimization Tablosu

### Amaç

Maliyet optimizasyon analizlerini kaydetmek. Mevcut maliyet ile optimize edilmiş maliyet karşılaştırılır, tasarruf potansiyeli hesaplanır.

### Yapı

```sql
cost_optimization (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    analysis_period VARCHAR(50) NOT NULL,         -- 'month', 'quarter', 'year'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    current_cost DECIMAL(15, 2) NOT NULL,         -- Mevcut maliyet
    optimized_cost DECIMAL(15, 2) NOT NULL,       -- Optimize edilmiş maliyet
    savings_potential DECIMAL(15, 2) GENERATED,   -- Tasarruf potansiyeli (current - optimized)
    recommendation JSONB,                         -- Öneriler
    analysis_date TIMESTAMP WITH TIME ZONE,
    analyzed_by INTEGER,                          -- Analizi yapan employee
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi lojistik maliyetleri için optimizasyon analizi yaptı:

- Analiz Dönemi: Ocak 2024
- Mevcut Maliyet: 500,000 TL
- Optimize Edilmiş Maliyet: 450,000 TL
- Tasarruf Potansiyeli: 50,000 TL (%10)
- Öneriler: Route optimizasyonu, yakıt tasarrufu, stok yönetimi iyileştirmesi

**Neden Bu Şekilde Tasarlandı?**

1. **Computed Column**: `savings_potential` computed column olarak tanımlanmış. Database seviyesinde tutarlılık garantisi var.

2. **JSONB Öneriler**: Farklı optimizasyon senaryoları için farklı öneriler tanımlanabilir. JSONB formatı esneklik sağlar.

3. **Dönemsel Takip**: Optimizasyon analizleri dönemsel olarak yapılır. Trend analizi yapılabilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 📊 Financial Comparison Tablosu

### Amaç

Finansal karşılaştırmaları kaydetmek. Yıllık, dönemsel veya bütçe vs gerçekleşen karşılaştırmaları yapılır.

### Yapı

```sql
financial_comparison (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    comparison_type VARCHAR(50) NOT NULL,         -- 'year_over_year', 'period_over_period', 'budget_vs_actual'
    baseline_period VARCHAR(100) NOT NULL,        -- Referans dönem ('2023', 'Q1-2024')
    comparison_period VARCHAR(100) NOT NULL,      -- Karşılaştırılan dönem ('2024', 'Q2-2024')
    metrics JSONB NOT NULL,                       -- Karşılaştırma metrikleri
    comparison_date TIMESTAMP WITH TIME ZONE,
    created_by INTEGER,                           -- Karşılaştırmayı yapan employee
    created_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi 2024 yılını 2023 yılı ile karşılaştırıyor:

- Karşılaştırma Tipi: year_over_year
- Referans Dönem: 2023
- Karşılaştırılan Dönem: 2024
- Metrikler:
  - Gelir: +15% artış
  - Maliyet: +10% artış
  - Kar: +25% artış
  - Müşteri Sayısı: +20% artış

**Neden Bu Şekilde Tasarlandı?**

1. **JSONB Metrikler**: Farklı karşılaştırma tipleri için farklı metrikler tanımlanabilir. JSONB formatı esneklik sağlar.

2. **Esnek Dönem Tanımları**: String formatında dönem tanımları ile çeşitli dönem formatları desteklenir ('2023', 'Q1-2024', 'Jan-2024').

3. **Audit Trail**: Karşılaştırmayı yapan kişi ve tarih kaydedilir. Geçmiş karşılaştırmalara referans verilebilir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 027 kapsamında sonraki adımlarda implement edilecek.

---

## 🏗️ Backend Implementasyonu (Migration 027)

### Implement Edilen Modüller

#### 1. DepartmentBudgetModule

**Konum**: `src/finance/department-budget/`

**Amaç**: Departman bütçesi tanımlarını yönetmek ve sorgulamak.

**Dosya Yapısı**:
- `department-budget.module.ts` - NestJS modül tanımı
- `controllers/department-budget.controller.ts` - REST endpoint'leri
- `services/department-budget.service.ts` - İş mantığı
- `repositories/department-budget.repository.ts` - Raw SQL sorguları
- `repositories/department-budget.repository.interface.ts` - Repository interface ve entity tanımları
- `dto/department-budget.dto.ts` - Response DTO

**Endpoints**:
- `GET /finance/department-budgets` - Tüm bütçeler (soft delete edilmemiş)
- `GET /finance/department-budgets/active` - Aktif bütçeler
- `GET /finance/department-budgets/department/:departmentName` - Belirli departman için bütçeler
- `GET /finance/department-budgets/department/:departmentName/year/:budgetYear` - Departman ve yıl bazlı
- `GET /finance/department-budgets/year/:budgetYear` - Belirli yıl için tüm bütçeler
- `GET /finance/department-budgets/year/:budgetYear/active` - Belirli yıl için aktif bütçeler
- `GET /finance/department-budgets/category/:budgetCategory` - Kategori bazlı bütçeler
- `GET /finance/department-budgets/uuid/:uuid` - UUID ile bütçe
- `GET /finance/department-budgets/:id` - ID ile bütçe

**Repository Metodları**:
- `findAll()`: Soft delete edilmemiş tüm bütçeler (yıl ve departman bazlı sıralı)
- `findById(id)`: ID ile bütçe (soft delete kontrolü ile)
- `findByUuid(uuid)`: UUID ile bütçe
- `findByDepartmentName(departmentName)`: Departman bazlı tüm bütçeler
- `findByDepartmentNameAndYear(departmentName, budgetYear)`: Departman ve yıl bazlı
- `findByBudgetYear(budgetYear)`: Yıl bazlı tüm bütçeler
- `findByBudgetCategory(budgetCategory)`: Kategori bazlı bütçeler
- `findActive()`: Aktif bütçeler
- `findActiveByYear(budgetYear)`: Belirli yıl için aktif bütçeler

**SQL Pattern**:
- Soft delete kontrolü: `WHERE deleted_at IS NULL`
- Aktif kayıt kontrolü: `WHERE is_active = true`
- Computed column direkt kullanılır: `available_amount` SELECT'te otomatik hesaplanır
- Sıralama: `ORDER BY budget_year DESC, department_name ASC`

**DTO Mapping**:
- Snake_case database kolonları → camelCase DTO property'leri
- Decimal tipler `parseFloat()` ile number'a çevrilir
- Date tipler `toISOString()` ile string'e çevrilir
- Computed column (available_amount) direkt kullanılır

### Implement Edilmeyen Modüller (Sonraki Adımlar)

Migration 027 kapsamında aşağıdaki modüller henüz implement edilmedi:

1. **CostCenterModule** - Maliyet merkezi tanımları için
2. **CostAllocationModule** - Maliyet tahsis kayıtları için
3. **BudgetTrackingModule** - Bütçe harcama takibi için
4. **ProfitLossAnalysisModule** - Kar-zarar analizleri için
5. **CashFlowModule** - Nakit akışı kayıtları için
6. **BudgetProjectionModule** - Bütçe projeksiyonları için
7. **FinancialReportModule** - Finansal raporlar için
8. **BudgetPerformanceModule** - Bütçe performans takibi için
9. **FinancialControlModule** - Finansal kontroller için
10. **AccountingEntryModule** - Muhasebe kayıtları için
11. **TaxCalculationModule** - Vergi hesaplama kayıtları için
12. **FinancialRiskModule** - Finansal risk tanımları için
13. **CostOptimizationModule** - Maliyet optimizasyon analizleri için
14. **FinancialComparisonModule** - Finansal karşılaştırmalar için

Bu modüller aynı pattern ile implement edilecektir.

---

## 📐 Mimari Kararlar ve Gerekçeleri

### Neden Backend API Gerekli?

**Operasyonel Kullanım**:
- Finans departmanı bütçe tanımlarını admin panel üzerinden yönetmeli
- Departman yöneticileri bütçe durumunu görmeli
- Maliyet muhasebesi departmanı maliyet tahsis kayıtlarını takip etmeli
- Yönetim dashboard'larında bütçe ve finansal metrikleri görüntülenmeli

**Transactional İşlemler**:
- Bütçe tanımları gerçek zamanlı oluşturulmalı
- Harcama kayıtları takip edilmeli
- Bütçe vs gerçekleşen karşılaştırmaları yapılmalı
- Finansal raporlar düzenli olarak kaydedilmeli

### Neden RAW SQL?

**Mevcut Altyapı**:
- Proje zaten RAW SQL kullanıyor
- ORM kullanılmıyor
- DatabaseService üzerinden pg pool kullanılıyor
- Repository pattern mevcut, ancak ORM yerine RAW SQL ile

**Performans**:
- Bütçe sorguları sık kullanılacak
- Yıl ve departman bazlı filtreleme performanslı olmalı
- Computed column'lar database seviyesinde hesaplanır, performanslı
- RAW SQL ile query optimizasyonu tam kontrol altında

**Basitlik**:
- Kompleks ORM yapılandırmasına gerek yok
- SQL sorguları direkt ve anlaşılır
- Debug ve profiling kolay

### Neden Repository Pattern?

**Separation of Concerns**:
- Controller: HTTP request/response handling
- Service: İş mantığı ve DTO mapping
- Repository: Veritabanı erişimi ve SQL sorguları

**Testability**:
- Repository mock'lanabilir
- Service logic unit test edilebilir
- Controller integration test edilebilir

**Consistency**:
- Projede mevcut pattern ile uyumlu
- Aynı yaklaşım tüm modüllerde kullanılıyor
- Yeni geliştiriciler için öğrenme eğrisi düşük

### Neden Soft Delete?

**Audit Trail**:
- Bütçe tanımları değişebilir, ancak geçmiş kayıtlar saklanmalı
- Raporlarda geçmiş bütçe verileri görüntülenebilmeli
- Compliance için veri silme izni yok

**Data Integrity**:
- `budget_tracking` tablosu `department_budget_id` referans eder
- Bütçe silinirse harcama kayıtları broken reference olur
- Soft delete ile referanslar korunur

**Recovery**:
- Yanlışlıkla silinen kayıtlar geri yüklenebilir
- `deleted_at IS NULL` kontrolü kaldırılarak kayıt geri getirilebilir

### Neden Computed Columns?

**Tutarlılık**:
- `available_amount`, `profit`, `variance_amount` gibi hesaplanmış değerler database seviyesinde hesaplanır
- Application layer'da hesaplama hatası riski yok
- Database seviyesinde tutarlılık garantisi var

**Performans**:
- Computed column'lar index'lenebilir
- SELECT query'lerinde direkt kullanılabilir
- Application layer'da hesaplama yapılmasına gerek yok

**Basitlik**:
- Complex calculation logic database'de tanımlı
- Service layer'da hesaplama kodu yok
- Kod daha basit ve okunabilir

---

## 🔒 Veri Bütünlüğü ve Kısıtlamalar

### Database Constraints

**department_budget Tablosu**:
```sql
CHECK (budget_year >= 2000 AND budget_year <= 2100)
UNIQUE (department_name, budget_year, budget_category) WHERE deleted_at IS NULL
```

Bu kısıtlamalar:
- Geçersiz yıl değerlerini engeller
- Aynı departman, yıl ve kategori için tekrar eden bütçe oluşturulmasını engeller

**budget_tracking Tablosu**:
```sql
-- Onay kontrolü: approved_by NULL ise onaylanmamış, NULL değilse onaylanmış
-- Application layer'da onay kontrolü yapılmalı
```

**profit_loss_analysis Tablosu**:
```sql
CHECK (analysis_period IN ('month', 'quarter', 'year'))
CHECK (period_end >= period_start)
```

**budget_performance Tablosu**:
```sql
CHECK (performance_period IN ('month', 'quarter', 'year'))
CHECK (period_end >= period_start)
```

### Foreign Key Constraints

**department_budget.currency_id → currency_enum.id**:
- `ON DELETE RESTRICT`: Para birimi silinemez (bütçe kayıtları varsa)
- `ON UPDATE CASCADE`: Para birimi ID değişirse bütçe referansları güncellenir

**budget_tracking.department_budget_id → department_budget.id**:
- `ON DELETE RESTRICT`: Bütçe silinemez (harcama kayıtları varsa)
- `ON UPDATE CASCADE`: Bütçe ID değişirse harcama referansları güncellenir

**Not**: Soft delete kullanıldığı için RESTRICT delete dikkatli kullanılmalı. Bütçe silindiğinde soft delete yapılmalı, hard delete yapılmamalı.

### Index'ler

**department_budget Tablosu**:
```sql
CREATE INDEX idx_department_budget_name_year ON department_budget(department_name, budget_year) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_department_budget_unique ON department_budget(department_name, budget_year, budget_category) WHERE deleted_at IS NULL;
```

Bu index'ler:
- Departman ve yıl bazlı sorguları hızlandırır
- Unique constraint'i destekler
- Partial index ile sadece aktif kayıtlar indexlenir (disk tasarrufu)

**budget_tracking Tablosu**:
```sql
CREATE INDEX idx_budget_tracking_budget_id ON budget_tracking(department_budget_id);
CREATE INDEX idx_budget_tracking_date ON budget_tracking(expense_date);
```

Bu index'ler:
- Bütçe bazlı harcama sorgularını hızlandırır
- Tarih bazlı harcama sorgularını hızlandırır

---

## 🚨 Önemli Notlar ve Riskler

### 1. Budget Tracking vs Department Budget Senkronizasyonu

**Sorun**: `budget_tracking` tablosuna yeni harcama kaydı eklendiğinde, `department_budget` tablosundaki `spent_amount` güncellenmelidir.

**Çözüm Seçenekleri**:

1. **Application Layer Transaction**:
```typescript
// Service layer'da transaction içinde:
await databaseService.transaction(async (client) => {
    // 1. budget_tracking kaydı ekle
    await client.query('INSERT INTO budget_tracking ...', [...]);
    
    // 2. department_budget spent_amount'u güncelle
    await client.query('UPDATE department_budget SET spent_amount = spent_amount + $1 WHERE id = $2', [amount, budgetId]);
});
```

2. **Database Trigger**:
```sql
CREATE TRIGGER update_budget_spent_amount
AFTER INSERT ON budget_tracking
FOR EACH ROW
EXECUTE FUNCTION update_department_budget_spent();
```

**Öneri**: Production'da mutlaka trigger veya transaction kullanılmalı. Şu anda backend implementasyonunda bu mantık yok, ancak eklenmelidir.

### 2. Computed Column Performansı

**Sorun**: `available_amount`, `profit`, `variance_amount` gibi computed column'lar SELECT query'lerinde her zaman hesaplanır.

**Çözüm**: Computed column'lar index'lenebilir (PostgreSQL 12+). Gerekirse materialized view kullanılabilir.

### 3. Decimal Precision

**Sorun**: `DECIMAL(15, 2)` formatındaki para tutarları JavaScript'te number olarak parse edilirken precision kaybı olabilir.

**Çözüm**: `parseFloat()` kullanılır. Daha hassas işlemler için Decimal.js gibi kütüphane kullanılabilir, ancak şimdilik yeterli.

### 4. JSONB Performansı

**Sorun**: `financial_risk.mitigation_plan`, `cost_optimization.recommendation` gibi JSONB alanlar büyük olabilir ve sorgu performansını etkileyebilir.

**Çözüm**: Gerekirse GIN index eklenebilir. Şimdilik sorgu pattern'i JSONB içeriğine göre değil, diğer alanlara göre, bu yüzden sorun yok.

### 5. Budget vs Actual Güncelleme Stratejisi

**Sorun**: `budget_performance` tablosundaki `actual_amount` nasıl güncellenir?

**Çözüm**: 
- Scheduled job ile periyodik güncelleme (günlük, haftalık)
- `budget_tracking` tablosundan otomatik hesaplama
- External ETL process ile güncelleme

**Öneri**: Production'da scheduled job veya trigger kullanılmalı. Şu anda backend implementasyonunda bu mantık yok, ancak eklenmelidir.

---

## 🔄 İleride Yapılacaklar

### Phase 1: Kalan Modüller (Migration 027 Tamamlama)

1. **CostCenterModule** - Maliyet merkezi tanımları
2. **CostAllocationModule** - Maliyet tahsis kayıtları
3. **BudgetTrackingModule** - Bütçe harcama takibi (öncelikli: department_budget spent_amount güncellemesi gerekli)
4. **ProfitLossAnalysisModule** - Kar-zarar analizleri
5. **CashFlowModule** - Nakit akışı kayıtları
6. **BudgetProjectionModule** - Bütçe projeksiyonları
7. **FinancialReportModule** - Finansal raporlar
8. **BudgetPerformanceModule** - Bütçe performans takibi (öncelikli: actual_amount güncelleme stratejisi gerekli)
9. **FinancialControlModule** - Finansal kontroller
10. **AccountingEntryModule** - Muhasebe kayıtları (öncelikli: double entry mantığı gerekli)
11. **TaxCalculationModule** - Vergi hesaplama kayıtları
12. **FinancialRiskModule** - Finansal risk tanımları
13. **CostOptimizationModule** - Maliyet optimizasyon analizleri
14. **FinancialComparisonModule** - Finansal karşılaştırmalar

### Phase 2: İş Mantığı Genişletmeleri

1. **Budget Tracking Service**: `department_budget.spent_amount` otomatik güncelleme mantığı
2. **Budget Performance Service**: `budget_performance.actual_amount` otomatik hesaplama mantığı
3. **Accounting Entry Service**: Double entry (borç/alacak) mantığı
4. **Financial Control Service**: Onay kontrolü ve eşik mantığı

### Phase 3: Raporlama ve Analitik

1. Bütçe vs gerçekleşen raporları
2. Departman bazlı maliyet raporları
3. Kar-zarar trend analizleri
4. Nakit akışı projeksiyonları
5. Finansal risk dashboard'ları

### Phase 4: Entegrasyonlar

1. Harici muhasebe sistemleri ile entegrasyon
2. Ödeme sistemleri ile entegrasyon
3. BI tools ile entegrasyon
4. ETL pipeline'ları ile entegrasyon

---

## ✅ Özet

Migration 027, Global Cargo Backend sistemine finansal yönetim ve bütçe kontrolünün genişletilmiş altyapısını ekler. Bu migration ile:

- Departman bütçesi yönetimi transactional olarak yapılabilir
- Maliyet merkezi ve tahsis takibi yapılabilir
- Bütçe harcama takibi ve onay süreçleri yönetilebilir
- Kar-zarar analizleri düzenli olarak kaydedilebilir
- Nakit akışı izleme ve projeksiyon yapılabilir
- Finansal kontroller ve risk yönetimi yapılabilir

**Şu anda implement edilen**: `DepartmentBudgetModule`

**Sonraki adım**: Kalan 14 modülün aynı pattern ile implement edilmesi

**Kritik Notlar**:
- `budget_tracking` ile `department_budget` senkronizasyonu production'da mutlaka implement edilmeli
- `budget_performance.actual_amount` güncelleme stratejisi belirlenmeli
- `accounting_entry` için double entry mantığı implement edilmeli
