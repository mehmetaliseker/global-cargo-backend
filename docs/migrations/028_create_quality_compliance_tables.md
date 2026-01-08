# Migration 028: Quality Compliance Tables

## 📋 Genel Bakış

Migration 028, Global Cargo Backend sistemine **Quality Compliance Infrastructure** ekler. Bu migration, uyumluluk sertifikaları, uyumluluk denetimleri, kalite kontrol listeleri, kalite kontrol sonuçları, iş sürekliliği planları ve afet kurtarma testleri için gerekli transactional operasyonel altyapıyı oluşturur.

### Tablolar

1. **`compliance_certificate`** - Uyumluluk sertifikaları (ISO, FDA, vb.)
2. **`compliance_audit`** - Uyumluluk denetimleri ve bulgular
3. **`quality_checklist`** - Kalite kontrol listeleri (şablonlar)
4. **`quality_check_result`** - Kalite kontrol sonuçları (entity bazlı)
5. **`business_continuity_plan`** - İş sürekliliği planları
6. **`disaster_recovery_test`** - Afet kurtarma testleri ve sonuçları

**🚨 ÖNEMLİ NOT**: Bu migration **OPERASYONEL TRANSACTIONAL ALTYAPI**dır. Bu tablolar günlük kalite ve uyumluluk operasyonlarında aktif olarak kullanılır ve backend API'ları ile yönetilir.

---

## 🎯 Migration 028'nin Amacı

### Neden Quality Compliance Şimdi?

**İş Bağlamı**:
- Migrations 001-027 temel operasyonel altyapıyı tamamladı
- Kargo operasyonları için kalite kontrolü ve uyumluluk gereksinimleri var
- ISO, FDA, GDPR gibi standartlara uyumluluk zorunlu
- Soğuk zincir ve tehlikeli madde operasyonları için özel kontroller gerekli
- İş sürekliliği ve afet kurtarma planlaması kritik

**Problem**: Kalite ve uyumluluk için yapı eksik:
- Uyumluluk sertifikaları takip edilmiyor
- Denetim sonuçları sistematik kaydedilmiyor
- Kalite kontrol listeleri ve sonuçları merkezi değil
- İş sürekliliği planları versiyonlanmıyor
- Afet kurtarma testleri takip edilmiyor

**Migration 028 Hedefi**:
- **Uyumluluk sertifikası yönetimi** için transactional altyapı
- Denetim sonuçları ve bulgular için veri modeli
- Kalite kontrol listeleri ve sonuçları için sistem
- İş sürekliliği planları ve versiyonlama desteği
- Afet kurtarma testleri ve sonuçları takibi

### Bu Migration Neyi Sağlar?

✅ **Uyumluluk Yönetimi**:
- Sertifika tanımları ve geçerlilik takibi
- Denetim sonuçları ve bulgular kaydı
- Uyumluluk durumu takibi (compliant, non_compliant, partial)

✅ **Kalite Kontrolü**:
- Şablon kalite kontrol listeleri
- Entity bazlı kalite kontrol sonuçları
- Kontrol geçmişi ve trend analizi

✅ **İş Sürekliliği**:
- İş sürekliliği planları versiyonlama
- Plan gözden geçirme takibi
- Afet kurtarma testleri ve sonuçları

### Bu Migration Neyi Sağlamaz?

❌ **Otomatik Kalite Kontrolü DEĞİLDİR**:
- Kalite kontrollerini otomatik yapmaz
- Sadece kontrol sonuçlarını kaydeder
- Kontrol işlemi manuel veya external sistem tarafından yapılır

❌ **Otomatik Denetim DEĞİLDİR**:
- Denetimleri otomatik gerçekleştirmez
- Sadece denetim sonuçlarını kaydeder
- Denetim işlemi manuel veya external auditor tarafından yapılır

❌ **Sertifika Yenileme Hatırlatıcısı DEĞİLDİR**:
- Sertifika süreleri otomatik kontrol edilmez
- Hatırlatma mekanizması yok
- External cron job veya scheduled task gerekir

---

## 📜 Compliance Certificate Tablosu

### Amaç

Uyumluluk sertifikalarını yönetmek, sertifika tiplerini, geçerlilik tarihlerini ve durumunu takip etmek.

### Yapı

```sql
compliance_certificate (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    certificate_type VARCHAR(100) NOT NULL,       -- 'ISO_9001', 'FDA', 'GDPR'
    certificate_number VARCHAR(100) NOT NULL UNIQUE,  -- 'ISO-2024-001'
    issuing_authority VARCHAR(200) NOT NULL,      -- 'TÜV', 'BSI'
    issue_date DATE NOT NULL,
    expiry_date DATE,                             -- NULL = süresiz geçerli
    scope JSONB,                                  -- Sertifika kapsamı
    certificate_file_reference VARCHAR(500),      -- Sertifika dosyası referansı
    is_valid BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi ISO 9001:2015 kalite yönetim sistemi sertifikası aldı. Sertifika 15 Ocak 2024'te verildi, 3 yıl geçerli (15 Ocak 2027'ye kadar).

```typescript
GET /quality/compliance-certificates/type/ISO_9001

Response:
[
    {
        "id": 1,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "certificateType": "ISO_9001",
        "certificateNumber": "ISO-2024-001",
        "issuingAuthority": "TÜV",
        "issueDate": "2024-01-15",
        "expiryDate": "2027-01-15",
        "scope": {
            "locations": ["Istanbul", "Ankara", "Izmir"],
            "services": ["cargo_handling", "warehousing", "distribution"]
        },
        "certificateFileReference": "/certificates/iso-2024-001.pdf",
        "isValid": true,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **UUID**: Harici sistemler ile entegrasyon için UUID kullanılır. Sertifika dosyaları ve harici sistemler UUID ile referans verir.

2. **JSONB Scope**: Sertifika kapsamı farklı sertifika tipleri için farklı olabilir. JSONB formatı esneklik sağlar.

3. **File Reference**: Sertifika dosyası ayrı bir storage sisteminde saklanabilir. Sadece referans saklanır, dosya içeriği değil.

4. **Soft Delete**: `deleted_at` ile sertifika kayıtları kalıcı olarak silinmez. Geçmiş sertifikalar audit için saklanır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 028 kapsamında sonraki adımlarda implement edilecek.

---

## 🔍 Compliance Audit Tablosu

### Amaç

Uyumluluk denetimlerini kaydetmek, denetim sonuçlarını, bulguları ve aksiyon planlarını takip etmek.

### Yapı

```sql
compliance_audit (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    audit_type VARCHAR(100) NOT NULL,            -- 'internal', 'external', 'certification'
    audit_date DATE NOT NULL,
    auditor_name VARCHAR(200),                   -- Denetçi adı
    auditor_organization VARCHAR(200),           -- Denetçi organizasyonu
    findings JSONB,                              -- Denetim bulguları
    compliance_status VARCHAR(50) NOT NULL,      -- 'compliant', 'non_compliant', 'partial'
    action_items JSONB,                          -- Aksiyon planı
    follow_up_date DATE,                         -- Takip tarihi
    follow_up_completed BOOLEAN DEFAULT false,   -- Takip tamamlandı mı?
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi yıllık ISO 9001 iç denetimi yaptı. Denetim 20 Mart 2024'te gerçekleşti. Denetçi: Ayşe Yılmaz (Internal Quality Team). Sonuç: Partial (kısmen uyumlu). Bulgular: 2 minor non-conformity. Aksiyon planı: 2 düzeltici faaliyet, takip tarihi: 15 Nisan 2024.

```typescript
GET /quality/compliance-audits/type/internal?startDate=2024-01-01&endDate=2024-12-31

Response:
[
    {
        "id": 1,
        "uuid": "660e8400-e29b-41d4-a716-446655440001",
        "auditType": "internal",
        "auditDate": "2024-03-20",
        "auditorName": "Ayşe Yılmaz",
        "auditorOrganization": "Internal Quality Team",
        "findings": {
            "nonConformities": [
                {
                    "id": "NC-001",
                    "severity": "minor",
                    "description": "Dokümantasyon eksikliği",
                    "clause": "ISO 9001:2015 - 7.5.3"
                },
                {
                    "id": "NC-002",
                    "severity": "minor",
                    "description": "Kayıt tutma eksikliği",
                    "clause": "ISO 9001:2015 - 7.5.3"
                }
            ]
        },
        "complianceStatus": "partial",
        "actionItems": [
            {
                "id": "AI-001",
                "description": "Dokümantasyon eksiklerini tamamla",
                "owner": "Quality Manager",
                "dueDate": "2024-04-10"
            },
            {
                "id": "AI-002",
                "description": "Kayıt tutma prosedürünü güncelle",
                "owner": "Quality Manager",
                "dueDate": "2024-04-15"
            }
        ],
        "followUpDate": "2024-04-15",
        "followUpCompleted": false,
        "createdAt": "2024-03-20T14:00:00.000Z",
        "updatedAt": "2024-03-20T14:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **JSONB Findings**: Denetim bulguları farklı denetim tipleri için farklı formatlarda olabilir. JSONB formatı esneklik sağlar.

2. **JSONB Action Items**: Aksiyon planları farklı denetim tipleri için farklı yapıda olabilir. JSONB formatı esneklik sağlar.

3. **Follow-up Takibi**: `follow_up_date` ve `follow_up_completed` alanları ile takip süreçleri takip edilir. Gecikmiş takipler tespit edilebilir.

4. **Compliance Status**: Üç durum vardır: compliant, non_compliant, partial. Bu durumlar CHECK constraint ile garanti edilir.

### Backend Implementasyonu

**Module**: `compliance-audit`

**Endpoints**:
- `GET /quality/compliance-audits` - Tüm denetimler (soft delete edilmemiş)
- `GET /quality/compliance-audits/active` - Aktif denetimler (son 100 kayıt)
- `GET /quality/compliance-audits/pending-follow-up` - Takibi bekleyen denetimler
- `GET /quality/compliance-audits/audit-type/:auditType` - Denetim tipi bazlı
- `GET /quality/compliance-audits/compliance-status/:complianceStatus` - Uyumluluk durumu bazlı
- `GET /quality/compliance-audits/date-range?startDate=&endDate=` - Tarih aralığı bazlı
- `GET /quality/compliance-audits/uuid/:uuid` - UUID ile denetim
- `GET /quality/compliance-audits/:id` - ID ile denetim

**Repository Metodları**:
- `findAll()`: Soft delete edilmemiş tüm denetimler (tarih bazlı sıralı)
- `findById(id)`: ID ile denetim (soft delete kontrolü ile)
- `findByUuid(uuid)`: UUID ile denetim
- `findByAuditType(auditType)`: Denetim tipi bazlı denetimler
- `findByComplianceStatus(complianceStatus)`: Uyumluluk durumu bazlı denetimler
- `findByDateRange(startDate, endDate)`: Tarih aralığı bazlı denetimler
- `findPendingFollowUp()`: Takibi bekleyen denetimler (follow_up_date geçmiş ve tamamlanmamış)
- `findActive()`: Aktif denetimler (son 100 kayıt, performans için limit)

**SQL Pattern**:
- Soft delete kontrolü: `WHERE deleted_at IS NULL`
- Follow-up kontrolü: `follow_up_completed = false AND follow_up_date <= CURRENT_DATE`
- Sıralama: `ORDER BY audit_date DESC`
- Limit: `LIMIT 100` (findActive için performans)

**DTO Mapping**:
- Snake_case database kolonları → camelCase DTO property'leri
- Date tipler `toISOString().split('T')[0]` ile date-only string'e çevrilir
- JSONB alanlar olduğu gibi korunur (optional handling ile)

---

## ✅ Quality Checklist Tablosu

### Amaç

Kalite kontrol listesi şablonlarını yönetmek. Bu listeler entity bazlı kalite kontrolleri için şablon olarak kullanılır.

### Yapı

```sql
quality_checklist (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    checklist_name VARCHAR(200) NOT NULL,        -- 'Warehouse Inspection', 'Vehicle Pre-Trip'
    checklist_type VARCHAR(100) NOT NULL,        -- 'warehouse', 'vehicle', 'cargo'
    items JSONB NOT NULL,                         -- Checklist maddeleri
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi depo denetimi için kalite kontrol listesi oluşturdu:

- Liste Adı: Warehouse Inspection
- Liste Tipi: warehouse
- Maddeler:
  1. Depo sıcaklığı kontrolü (hedef: 18-22°C)
  2. Güvenlik kameraları çalışıyor mu?
  3. Yangın söndürücüler güncel mi?
  4. Depo temizliği yeterli mi?
  5. Erişim kontrolü çalışıyor mu?

```typescript
GET /quality/quality-checklists/type/warehouse

Response:
[
    {
        "id": 1,
        "uuid": "770e8400-e29b-41d4-a716-446655440002",
        "checklistName": "Warehouse Inspection",
        "checklistType": "warehouse",
        "items": [
            {
                "id": 1,
                "description": "Depo sıcaklığı kontrolü",
                "target": "18-22°C",
                "critical": true
            },
            {
                "id": 2,
                "description": "Güvenlik kameraları çalışıyor mu?",
                "target": "All cameras operational",
                "critical": true
            },
            {
                "id": 3,
                "description": "Yangın söndürücüler güncel mi?",
                "target": "All extinguishers within expiry",
                "critical": true
            },
            {
                "id": 4,
                "description": "Depo temizliği yeterli mi?",
                "target": "Clean and organized",
                "critical": false
            },
            {
                "id": 5,
                "description": "Erişim kontrolü çalışıyor mu?",
                "target": "Access control operational",
                "critical": true
            }
        ],
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **JSONB Items**: Checklist maddeleri farklı checklist tipleri için farklı formatlarda olabilir. JSONB formatı esneklik sağlar.

2. **Checklist Type**: Checklist tipi ile filtreleme yapılabilir. Warehouse, vehicle, cargo gibi farklı entity tipleri için farklı listeler.

3. **Active Flag**: Aktif/pasif checklist yönetimi. Pasif listeler geçmiş versiyonlar olarak saklanır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 028 kapsamında sonraki adımlarda implement edilecek.

---

## 📋 Quality Check Result Tablosu

### Amaç

Entity bazlı kalite kontrol sonuçlarını kaydetmek. Her kontrol bir checklist'e ve bir entity'ye (warehouse, vehicle, cargo) bağlıdır.

### Yapı

```sql
quality_check_result (
    id SERIAL PRIMARY KEY,
    quality_checklist_id INTEGER NOT NULL,       -- Hangi checklist kullanıldı
    entity_type VARCHAR(100) NOT NULL,           -- 'warehouse', 'vehicle', 'cargo'
    entity_id INTEGER NOT NULL,                  -- Hangi entity kontrol edildi
    checked_by INTEGER,                          -- Kontrolü yapan employee
    check_date TIMESTAMP WITH TIME ZONE,         -- Kontrol tarihi
    results JSONB NOT NULL,                      -- Kontrol sonuçları (madde bazlı)
    pass_status VARCHAR(50) NOT NULL,            -- 'passed', 'failed', 'partial'
    issues_found TEXT,                           -- Bulunan sorunlar
    corrective_actions TEXT,                     -- Düzeltici faaliyetler
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: İstanbul Depo (Warehouse #5) için kalite kontrolü yapıldı. Kontrol 10 Ocak 2024'te gerçekleşti. Kontrolü yapan: Mehmet Özkan (Quality Inspector). Sonuç: Partial (kısmen geçti). Sorunlar: Depo sıcaklığı 24°C (hedef: 18-22°C), 1 güvenlik kamerası çalışmıyor. Düzeltici faaliyetler: Klima ayarlanacak, kamera tamir edilecek.

```typescript
GET /quality/quality-check-results/entity/warehouse/5

Response:
[
    {
        "id": 1,
        "qualityChecklistId": 1,
        "entityType": "warehouse",
        "entityId": 5,
        "checkedBy": 789,
        "checkDate": "2024-01-10T09:00:00.000Z",
        "results": {
            "items": [
                {
                    "itemId": 1,
                    "status": "failed",
                    "actual": "24°C",
                    "target": "18-22°C",
                    "comment": "Klima ayarı yapılmalı"
                },
                {
                    "itemId": 2,
                    "status": "failed",
                    "actual": "1 camera not working",
                    "target": "All cameras operational",
                    "comment": "Camera #3 needs repair"
                },
                {
                    "itemId": 3,
                    "status": "passed",
                    "actual": "All extinguishers within expiry",
                    "target": "All extinguishers within expiry"
                },
                {
                    "itemId": 4,
                    "status": "passed",
                    "actual": "Clean and organized",
                    "target": "Clean and organized"
                },
                {
                    "itemId": 5,
                    "status": "passed",
                    "actual": "Access control operational",
                    "target": "Access control operational"
                }
            ]
        },
        "passStatus": "partial",
        "issuesFound": "Depo sıcaklığı hedefin üzerinde (24°C). 1 güvenlik kamerası çalışmıyor.",
        "correctiveActions": "Klima ayarlanacak. Camera #3 tamir edilecek.",
        "createdAt": "2024-01-10T09:00:00.000Z",
        "updatedAt": "2024-01-10T09:00:00.000Z"
    }
]
```

**Neden Bu Şekilde Tasarlandı?**

1. **Polymorphic Entity**: `entity_type` + `entity_id` pattern'i ile farklı entity tiplerine kalite kontrol yapılabilir. Schema değişikliği yapmadan yeni entity tipleri eklenebilir.

2. **JSONB Results**: Kontrol sonuçları checklist maddeleri bazlı saklanır. Her madde için durum, gerçekleşen değer, hedef değer ve yorum saklanır.

3. **Pass Status**: Genel kontrol durumu ('passed', 'failed', 'partial'). Bu durum CHECK constraint ile garanti edilir.

4. **Corrective Actions**: Düzeltici faaliyetler text olarak saklanır. Detaylı aksiyon takibi için ayrı tablo kullanılabilir (future enhancement).

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 028 kapsamında sonraki adımlarda implement edilecek.

---

## 📄 Business Continuity Plan Tablosu

### Amaç

İş sürekliliği planlarını yönetmek, versiyonlamak ve gözden geçirme tarihlerini takip etmek.

### Yapı

```sql
business_continuity_plan (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    plan_name VARCHAR(200) NOT NULL,             -- 'IT Disaster Recovery Plan'
    plan_version VARCHAR(50) NOT NULL,           -- 'v1.0', 'v2.0'
    document_reference VARCHAR(500),             -- Plan dokümanı referansı
    last_reviewed_date DATE,                     -- Son gözden geçirme tarihi
    next_review_date DATE,                       -- Sonraki gözden geçirme tarihi
    is_active BOOLEAN DEFAULT true,
    created_at, updated_at, deleted_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: Global Cargo şirketi IT Afet Kurtarma Planı oluşturdu. Plan versiyonu: v2.0. Son gözden geçirme: 1 Ocak 2024. Sonraki gözden geçirme: 1 Ocak 2025.

**Neden Bu Şekilde Tasarlandı?**

1. **Versiyonlama**: Plan versiyonları takip edilir. Geçmiş versiyonlar saklanır.

2. **Gözden Geçirme Takibi**: Planlar düzenli olarak gözden geçirilmelidir. `next_review_date` ile takip yapılır.

3. **Document Reference**: Plan dokümanı ayrı bir storage sisteminde saklanabilir. Sadece referans saklanır.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 028 kapsamında sonraki adımlarda implement edilecek.

---

## 🧪 Disaster Recovery Test Tablosu

### Amaç

Afet kurtarma testlerini kaydetmek, test sonuçlarını ve düzeltici faaliyetleri takip etmek.

### Yapı

```sql
disaster_recovery_test (
    id SERIAL PRIMARY KEY,
    business_continuity_plan_id INTEGER NOT NULL,  -- Hangi plan için test yapıldı
    test_date DATE NOT NULL,
    test_type VARCHAR(100) NOT NULL,               -- 'full', 'partial', 'tabletop'
    test_results TEXT NOT NULL,                    -- Test sonuçları
    pass_status VARCHAR(50) NOT NULL,              -- 'passed', 'failed', 'partial'
    issues_found TEXT,                             -- Bulunan sorunlar
    corrective_actions TEXT,                       -- Düzeltici faaliyetler
    next_test_date DATE,                           -- Sonraki test tarihi
    tested_by INTEGER,                             -- Testi yapan employee
    created_at, updated_at
)
```

### Gerçek Hayat Kullanım Senaryosu

**Senaryo**: IT Afet Kurtarma Planı için tam test yapıldı. Test 15 Ocak 2024'te gerçekleşti. Test Tipi: full. Sonuç: Partial (kısmen başarılı). Sorunlar: Backup restore süresi hedefin üzerinde (4 saat, hedef: 2 saat). Düzeltici faaliyetler: Backup stratejisi optimize edilecek. Sonraki test: 15 Nisan 2024.

**Neden Bu Şekilde Tasarlandı?**

1. **Test Type**: Farklı test tipleri desteklenir (full, partial, tabletop). Her test tipi farklı kapsam ve süre gerektirir.

2. **Pass Status**: Test sonucu ('passed', 'failed', 'partial'). Bu durum CHECK constraint ile garanti edilir.

3. **Next Test Date**: Düzenli test takibi. `next_test_date` ile sonraki test tarihi belirlenir.

### Backend Implementasyonu

**Not**: Bu modül henüz implement edilmedi. Migration 028 kapsamında sonraki adımlarda implement edilecek.

---

## 🏗️ Backend Implementasyonu (Migration 028)

### Implement Edilen Modüller

#### 1. ComplianceAuditModule

**Konum**: `src/quality/compliance-audit/`

**Amaç**: Uyumluluk denetimlerini yönetmek ve sorgulamak.

**Dosya Yapısı**:
- `compliance-audit.module.ts` - NestJS modül tanımı
- `controllers/compliance-audit.controller.ts` - REST endpoint'leri
- `services/compliance-audit.service.ts` - İş mantığı
- `repositories/compliance-audit.repository.ts` - Raw SQL sorguları
- `repositories/compliance-audit.repository.interface.ts` - Repository interface ve entity tanımları
- `dto/compliance-audit.dto.ts` - Response DTO

**Endpoints**:
- `GET /quality/compliance-audits` - Tüm denetimler (soft delete edilmemiş)
- `GET /quality/compliance-audits/active` - Aktif denetimler (son 100 kayıt)
- `GET /quality/compliance-audits/pending-follow-up` - Takibi bekleyen denetimler
- `GET /quality/compliance-audits/audit-type/:auditType` - Denetim tipi bazlı
- `GET /quality/compliance-audits/compliance-status/:complianceStatus` - Uyumluluk durumu bazlı
- `GET /quality/compliance-audits/date-range?startDate=&endDate=` - Tarih aralığı bazlı
- `GET /quality/compliance-audits/uuid/:uuid` - UUID ile denetim
- `GET /quality/compliance-audits/:id` - ID ile denetim

**Repository Metodları**:
- `findAll()`: Soft delete edilmemiş tüm denetimler (tarih bazlı sıralı)
- `findById(id)`: ID ile denetim (soft delete kontrolü ile)
- `findByUuid(uuid)`: UUID ile denetim
- `findByAuditType(auditType)`: Denetim tipi bazlı denetimler
- `findByComplianceStatus(complianceStatus)`: Uyumluluk durumu bazlı denetimler
- `findByDateRange(startDate, endDate)`: Tarih aralığı bazlı denetimler
- `findPendingFollowUp()`: Takibi bekleyen denetimler (follow_up_date geçmiş ve tamamlanmamış)
- `findActive()`: Aktif denetimler (son 100 kayıt, performans için limit)

**SQL Pattern**:
- Soft delete kontrolü: `WHERE deleted_at IS NULL`
- Follow-up kontrolü: `follow_up_completed = false AND follow_up_date <= CURRENT_DATE`
- Sıralama: `ORDER BY audit_date DESC`
- Limit: `LIMIT 100` (findActive için performans)

**DTO Mapping**:
- Snake_case database kolonları → camelCase DTO property'leri
- Date tipler `toISOString().split('T')[0]` ile date-only string'e çevrilir
- JSONB alanlar olduğu gibi korunur (optional handling ile)

### Implement Edilmeyen Modüller (Sonraki Adımlar)

Migration 028 kapsamında aşağıdaki modüller henüz implement edilmedi:

1. **ComplianceCertificateModule** - Uyumluluk sertifikaları için
2. **QualityChecklistModule** - Kalite kontrol listeleri için
3. **QualityCheckResultModule** - Kalite kontrol sonuçları için
4. **BusinessContinuityPlanModule** - İş sürekliliği planları için
5. **DisasterRecoveryTestModule** - Afet kurtarma testleri için

Bu modüller aynı pattern ile implement edilecektir.

---

## 📐 Mimari Kararlar ve Gerekçeleri

### Neden Backend API Gerekli?

**Operasyonel Kullanım**:
- Kalite departmanı denetim sonuçlarını admin panel üzerinden yönetmeli
- Uyumluluk yöneticileri sertifika durumunu görmeli
- Operasyon yöneticileri kalite kontrol sonuçlarını takip etmeli
- Yönetim dashboard'larında kalite metrikleri görüntülenmeli

**Transactional İşlemler**:
- Denetim sonuçları gerçek zamanlı kaydedilmeli
- Kalite kontrol sonuçları takip edilmeli
- Sertifika durumları güncellenmeli
- İş sürekliliği planları versiyonlanmalı

### Neden RAW SQL?

**Mevcut Altyapı**:
- Proje zaten RAW SQL kullanıyor
- ORM kullanılmıyor
- DatabaseService üzerinden pg pool kullanılıyor
- Repository pattern mevcut, ancak ORM yerine RAW SQL ile

**Performans**:
- Denetim sorguları sık kullanılacak
- Tarih ve durum bazlı filtreleme performanslı olmalı
- JSONB alanlar sorgulanabilir (GIN index ile)
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
- Denetim sonuçları ve sertifikalar değişebilir, ancak geçmiş kayıtlar saklanmalı
- Raporlarda geçmiş kalite verileri görüntülenebilmeli
- Compliance için veri silme izni yok

**Data Integrity**:
- `quality_check_result` tablosu `quality_checklist_id` referans eder
- Checklist silinirse kontrol sonuçları broken reference olur
- Soft delete ile referanslar korunur

**Recovery**:
- Yanlışlıkla silinen kayıtlar geri yüklenebilir
- `deleted_at IS NULL` kontrolü kaldırılarak kayıt geri getirilebilir

### Neden JSONB?

**Esneklik**:
- `compliance_audit.findings` ve `action_items` farklı denetim tipleri için farklı formatlarda olabilir
- `quality_checklist.items` farklı checklist tipleri için farklı maddeler içerebilir
- `quality_check_result.results` checklist maddeleri bazlı detaylı sonuçlar içerebilir
- Schema değişikliği yapmadan yeni alanlar eklenebilir

**Performans**:
- JSONB binary format kullanır, TEXT'ten daha hızlı
- GIN index ile JSONB alanlar sorgulanabilir
- PostgreSQL JSONB operatörleri ile esnek sorgulama yapılabilir

**Trade-off**:
- Schema validation yok (application layer'da yapılmalı)
- Type safety yok (TypeScript'te interface ile sağlanmalı)

---

## 🔒 Veri Bütünlüğü ve Kısıtlamalar

### Database Constraints

**compliance_audit Tablosu**:
```sql
CHECK (compliance_status IN ('compliant', 'non_compliant', 'partial'))
```

Bu kısıtlama:
- Geçersiz uyumluluk durumlarını engeller

**compliance_certificate Tablosu**:
```sql
CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
```

Bu kısıtlama:
- Geçerlilik tarihlerinin mantıklı olmasını garanti eder

**quality_check_result Tablosu**:
```sql
CHECK (pass_status IN ('passed', 'failed', 'partial'))
```

Bu kısıtlama:
- Geçersiz kontrol durumlarını engeller

**business_continuity_plan Tablosu**:
```sql
CHECK (next_review_date IS NULL OR next_review_date >= last_reviewed_date)
```

Bu kısıtlama:
- Gözden geçirme tarihlerinin mantıklı olmasını garanti eder

**disaster_recovery_test Tablosu**:
```sql
CHECK (pass_status IN ('passed', 'failed', 'partial'))
CHECK (next_test_date IS NULL OR next_test_date >= test_date)
```

Bu kısıtlamalar:
- Geçersiz test durumlarını engeller
- Test tarihlerinin mantıklı olmasını garanti eder

### Foreign Key Constraints

**quality_check_result.quality_checklist_id → quality_checklist.id**:
- `ON DELETE RESTRICT`: Checklist silinemez (kontrol sonuçları varsa)
- `ON UPDATE CASCADE`: Checklist ID değişirse kontrol sonuçları referansları güncellenir

**disaster_recovery_test.business_continuity_plan_id → business_continuity_plan.id**:
- `ON DELETE RESTRICT`: Plan silinemez (test kayıtları varsa)
- `ON UPDATE CASCADE`: Plan ID değişirse test referansları güncellenir

**Not**: Soft delete kullanıldığı için RESTRICT delete dikkatli kullanılmalı. Checklist veya plan silindiğinde soft delete yapılmalı, hard delete yapılmamalı.

### Index'ler

**compliance_certificate Tablosu**:
```sql
CREATE INDEX idx_compliance_certificate_type ON compliance_certificate(certificate_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_compliance_certificate_number ON compliance_certificate(certificate_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_compliance_certificate_valid ON compliance_certificate(is_valid) WHERE deleted_at IS NULL AND is_valid = true;
```

Bu index'ler:
- Sertifika tipi bazlı sorguları hızlandırır
- Sertifika numarası bazlı sorguları hızlandırır
- Geçerli sertifikalar sorgusunu optimize eder (partial index)

**compliance_audit Tablosu**:
```sql
CREATE INDEX idx_compliance_audit_type ON compliance_audit(audit_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_compliance_audit_date ON compliance_audit(audit_date);
```

Bu index'ler:
- Denetim tipi bazlı sorguları hızlandırır
- Tarih bazlı sorguları hızlandırır

**quality_check_result Tablosu**:
```sql
CREATE INDEX idx_quality_check_result_entity ON quality_check_result(entity_type, entity_id);
CREATE INDEX idx_quality_check_result_status ON quality_check_result(pass_status);
```

Bu index'ler:
- Entity bazlı kontrol sonuçları sorgularını hızlandırır
- Durum bazlı kontrol sonuçları sorgularını hızlandırır

---

## 🚨 Önemli Notlar ve Riskler

### 1. JSONB Schema Validation

**Sorun**: JSONB alanlar için database seviyesinde schema validation yok. Geçersiz JSON yapıları kaydedilebilir.

**Çözüm**: Application layer'da validation yapılmalı. TypeScript interface'leri ile type safety sağlanmalı.

**Örnek**:
```typescript
interface ComplianceAuditFindings {
    nonConformities?: Array<{
        id: string;
        severity: 'minor' | 'major' | 'critical';
        description: string;
        clause?: string;
    }>;
}
```

### 2. Follow-up Takibi

**Sorun**: `compliance_audit.follow_up_date` geçmiş ve `follow_up_completed = false` olan denetimler için otomatik hatırlatma yok.

**Çözüm**: Scheduled job veya cron task ile düzenli kontrol yapılmalı. Geçmiş follow-up'lar için uyarı gönderilmeli.

### 3. Certificate Expiry Tracking

**Sorun**: `compliance_certificate.expiry_date` yaklaşan sertifikalar için otomatik uyarı yok.

**Çözüm**: Scheduled job ile düzenli kontrol yapılmalı. 30 gün, 15 gün, 7 gün önce uyarı gönderilmeli.

### 4. JSONB Performansı

**Sorun**: `compliance_audit.findings`, `quality_checklist.items` gibi JSONB alanlar büyük olabilir ve sorgu performansını etkileyebilir.

**Çözüm**: Gerekirse GIN index eklenebilir. Şimdilik sorgu pattern'i JSONB içeriğine göre değil, diğer alanlara göre, bu yüzden sorun yok.

### 5. Quality Check Result vs Quality Checklist Senkronizasyonu

**Sorun**: `quality_check_result` tablosunda `results` JSONB alanındaki item'lar `quality_checklist.items` ile uyumlu olmayabilir.

**Çözüm**: Application layer'da kontrol yapılmalı. Checklist değiştiğinde eski kontrol sonuçları korunur, ancak yeni kontroller güncel checklist'i kullanır.

---

## 🔄 İleride Yapılacaklar

### Phase 1: Kalan Modüller (Migration 028 Tamamlama)

1. **ComplianceCertificateModule** - Uyumluluk sertifikaları
2. **QualityChecklistModule** - Kalite kontrol listeleri
3. **QualityCheckResultModule** - Kalite kontrol sonuçları
4. **BusinessContinuityPlanModule** - İş sürekliliği planları
5. **DisasterRecoveryTestModule** - Afet kurtarma testleri

### Phase 2: İş Mantığı Genişletmeleri

1. **Certificate Expiry Alert Service**: Yaklaşan sertifika süreleri için uyarı servisi
2. **Follow-up Reminder Service**: Gecikmiş follow-up'lar için hatırlatma servisi
3. **Quality Check Scheduler**: Düzenli kalite kontrolleri için scheduler
4. **Audit Report Generator**: Denetim raporları oluşturma servisi

### Phase 3: Raporlama ve Analitik

1. Uyumluluk durumu trend analizleri
2. Kalite kontrol geçmiş raporları
3. Sertifika durum dashboard'ları
4. Afet kurtarma test başarı oranları

### Phase 4: Entegrasyonlar

1. Harici kalite yönetim sistemleri ile entegrasyon
2. Sertifika kuruluşları ile entegrasyon
3. E-posta bildirimleri (sertifika süresi, follow-up hatırlatmaları)
4. BI tools ile entegrasyon

---

## ✅ Özet

Migration 028, Global Cargo Backend sistemine kalite ve uyumluluk yönetiminin genişletilmiş altyapısını ekler. Bu migration ile:

- Uyumluluk sertifikaları transactional olarak yönetilebilir
- Denetim sonuçları ve bulgular kaydedilebilir
- Kalite kontrol listeleri ve sonuçları takip edilebilir
- İş sürekliliği planları versiyonlanabilir ve yönetilebilir
- Afet kurtarma testleri ve sonuçları kaydedilebilir

**Şu anda implement edilen**: `ComplianceAuditModule`

**Sonraki adım**: Kalan 5 modülün aynı pattern ile implement edilmesi

**Kritik Notlar**:
- Sertifika süresi takibi için scheduled job eklenmeli
- Follow-up hatırlatmaları için scheduled job eklenmeli
- JSONB schema validation application layer'da yapılmalı
