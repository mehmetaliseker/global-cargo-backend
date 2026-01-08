# Migration 025: Localization & Regional Configuration Tables

## 📋 Genel Bakış

Migration 025, Global Cargo Backend sistemine **Localization & Regional Configuration Infrastructure** ekler. Bu migration, çok dilli destek, bölgesel ayarlar, ve yasal dokümantasyon için gerekli data-driven altyapıyı oluşturur.

### Tablolar

1. **`translation`** - Anahtar-değer translation pairs (UI keys, API messages)
2. **`localized_content`** - İçerik lokalizasyonu (polymorphic)
3. **`locale_setting`** - Bölgesel format ayarları (date, time, currency, number)
4. **`regional_config`** - Ülke/bölge-specific konfigürasyonlar (JSONB)
5. **`legal_document`** - Yasal dokümantasyon (versioned, per language)
6. **`terms_conditions_version`** - Şartlar & koşullar versiyonlama

**🚨 CRITICAL NOTE**: Bu migration **SADECE DATA LAYER ALTYAPI**dır. Çalışma zamanında dil çözümleme, fallback mantığı, ve otomatik translation sağlamaz. Bu intentional (kasıtlı) bir tasarım kararıdır.

---

## 🎯 Purpose of Migration 025

### Why Localization Now?

**Business Context**:
- Global Cargo artık uluslararası operasyonlar yapıyor
- Farklı ülkelerde farklı diller gerekiyor (EN, TR, DE, AR, FR)
- Yasal uyumluluk: Şartlar & koşullar her dilde mevcut olmalı
- Kullanıcı deneyimi: Native language interface beklentisi

**Problem**: Hard-coded strings:
```typescript
// BAD: Hard-coded English
throw new Error('Cargo not found');

// WORSE: Mixed languages in codebase
const message = 'Cargo bulunamadı';  // Turkish in English codebase
```

**Migration 025 Goal**:
- **Data-driven localization** infrastructure oluşturmak
- Translation key-value pairs saklamak
- Bölgesel format ayarları merkezi yönetmek
- Yasal dokümantasyon versiyonlamayı desteklemek

### What This Migration IS

✅ **Data Layer Foundation**:
- Translation storage
- Locale configuration management
- Legal document versioning
- Regional settings repository

✅ **Multi-Language Support**:
- UI string translations
- API error messages localization
- Enum value translations
- Dynamic content localization

✅ **Regional Customization**:
- Date/time format preferences
- Currency display formats
- Number formatting (decimal separator, thousands separator)
- Timezone configuration

### What This Migration IS NOT

❌ **NOT Runtime Resolution**:
- Does NOT automatically detect user language
- Does NOT provide fallback mechanism
- Does NOT resolve translations at API level

❌ **NOT Translation Service**:
- Does NOT translate content (no Google Translate API)
- Does NOT auto-generate translations
- Does NOT validate translation quality

❌ **NOT I18n Framework**:
- Does NOT replace i18next or similar libraries
- Does NOT handle plural rules
- Does NOT manage translation workflows

---

## 🌍 Why Localization Is Data-Driven (Not Code-Driven)

### Architectural Principle: Data Over Code

**Code-Driven Localization** (Antipattern):
```typescript
// WRONG: Translations in code
const messages = {
  en: {
    cargoNotFound: 'Cargo not found',
    invalidStatus: 'Invalid cargo status'
  },
  tr: {
    cargoNotFound: 'Kargo bulunamadı',
    invalidStatus: 'Geçersiz kargo durumu'
  }
};
```

**Problems**:
1. **Deployment Required**: Every translation change requires code deployment
2. **Developer Dependency**: Non-technical translators cannot update
3. **Version Control Noise**: Translation updates pollute git history
4. **No Audit Trail**: Who changed translation and when?
5. **Hard to Scale**: 100+ languages = massive code files

**Data-Driven Localization** (Migration 025):
```sql
-- CORRECT: Translations in database
INSERT INTO translation (translation_key, language_code, translation_value)
VALUES ('CARGO_NOT_FOUND', 'en', 'Cargo not found'),
       ('CARGO_NOT_FOUND', 'tr', 'Kargo bulunamadı'),
       ('CARGO_NOT_FOUND', 'de', 'Fracht nicht gefunden');
```

**Benefits**:
1. ✅ **No Deployment**: Update translations via database/admin UI
2. ✅ **Translator-Friendly**: Non-developers can manage translations
3. ✅ **Audit Trail**: `created_at`, `updated_at`, `is_approved` fields
4. ✅ **Scalability**: Add languages without code changes
5. ✅ **Versioning**: Track translation history

---

## 🚫 Why No Fallback Logic Exists at This Level

### Deferred: Runtime Fallback Mechanism

**What's Missing** (Intentional):
```typescript
// NOT IN MIGRATION 025:
function getTranslation(key: string, lang: string): string {
  const translation = await translationRepo.find(key, lang);
  
  if (!translation && lang !== 'en') {
    // Fallback to English
    return await translationRepo.find(key, 'en');
  }
  
  if (!translation) {
    // Fallback to key itself
    return key;
  }
  
  return translation.value;
}
```

**Why Deferred?**

### Reason 1: Fallback Strategy is Domain-Specific

Different parts of system have different fallback needs:

**Customer-Facing**:
```
User language: Turkish
Translation missing → Fallback to English (acceptable)
```

**Legal Documents**:
```
User language: Arabic
Legal doc missing → Fallback to English (NOT ACCEPTABLE - legal risk)
Better: Show error, prevent action
```

**API Responses**:
```
Accept-Language: fr
Translation missing → Return en-US or return translation key?
Depends on API consumer requirements
```

**Conclusion**: One-size-fits-all fallback logic premature.

### Reason 2: Performance Considerations

**Naive Fallback** (slow):
```typescript
// Query 1: Check user language
// Query 2: If not found, check default language
// Query 3: If not found, return key
// = 3 database queries per translation
```

**Better Approach** (future):
- Cache all translations in Redis
- Preload fallback chain
- Single lookup, in-memory fallback

### Reason 3: Application Layer Responsibility

**Database Responsibility**:
- Store translations
- Ensure data integrity
- Provide fast lookups

**Application Layer Responsibility** (future):
- Determine user language (Accept-Language header, user profile)
- Implement fallback strategy
- Cache translations
- Handle missing translations gracefully

**Migration 025**: Provides data foundation. Application logic is future migrations.

---

## 🖥️ Why Frontend/Backend Resolution Is Deferred

### Current State (Migration 025): Data Layer Only

**No Backend Resolution Service**:
```typescript
// NOT IN MIGRATION 025:
@Injectable()
export class LocalizationService {
  async translate(key: string, lang: string): Promise<string> {
    // ...fallback logic, caching, etc.
  }
}

@Get('translations/:key')
async getTranslation(@Param('key') key: string, @Headers('accept-language') lang: string) {
  return await this.localizationService.translate(key, lang);
}
```

**Why Deferred?**

### Reason 1: Frontend vs Backend Localization Strategy Undefined

**Two Approaches Possible**:

**Approach A: Frontend-Driven**:
```
Frontend downloads entire translation bundle (JSON)
↓
Client-side library (i18next) handles resolution
↓
Backend sends only keys (e.g., error code: "CARGO_NOT_FOUND")
↓
Frontend resolves to user language
```

**Approach B: Backend-Driven**:
```
Backend detects user language (Accept-Language header)
↓
Backend resolves all strings before sending response
↓
Frontend displays pre-translated strings
↓
No client-side translation logic needed
```

**Current State**: Business hasn't decided which approach. Migration 025 supports both.

### Reason 2: API Contract Not Defined

**Question**: How should API return localized errors?

**Option 1**: HTTP header
```http
GET /cargo/123
Accept-Language: tr

404 Not Found
X-Error-Message: Kargo bulunamadı
```

**Option 2**: Response body
```json
{
  "error": {
    "code": "CARGO_NOT_FOUND",
    "message": "Kargo bulunamadı",
    "message_en": "Cargo not found"
  }
}
```

**Option 3**: Error code only
```json
{
  "error": {
    "code": "CARGO_NOT_FOUND"
  }
}
```

**Migration 025**: Stores all translations. API design is future decision.

### Reason 3: Performance Optimization Premature

**Translation Resolution** can be:
- Database query (slow, accurate)
- Redis cache (fast, requires cache invalidation)
- In-memory bundle (fastest, requires reload mechanism)

**Optimization Decision** depends on:
- Number of translation keys (100? 10,000?)
- Update frequency (daily? weekly?)
- Memory constraints

**Migration 025**: Establishes data structure. Optimization is future engineering.

---

## 📝 Example Future Usage Scenarios

### Scenario 1: UI String Translation (Frontend-Driven)

**Use Case**: React dashboard displays cargo status

**Implementation** (Future):
```typescript
// 1. Frontend loads translation bundle on app start
const translations = await fetch('/api/translations/bundle?lang=tr');

// 2. i18next library configured
i18n.init({
  resources: { tr: translations },
  lng: 'tr'
});

// 3. Component uses translation key
<p>{t('CARGO_STATUS_IN_TRANSIT')}</p>
// Displays: "Taşınıyor"
```

**Migration 025 Role**: Provides `/api/translations/bundle` endpoint data source.

---

### Scenario 2: API Error Message (Backend-Driven)

**Use Case**: Mobile app requests cargo details, cargo not found

**Implementation** (Future):
```typescript
// Backend service (future migration):
@Get('cargo/:id')
async findCargo(@Param('id') id: number, @Headers('accept-language') lang: string) {
  const cargo = await this.cargoRepo.findById(id);
  
  if (!cargo) {
    const message = await this.translationService.get('CARGO_NOT_FOUND', lang);
    throw new NotFoundException(message);
    // Throws: "Kargo bulunamadı" (if lang=tr)
  }
  
  return cargo;
}
```

**Migration 025 Role**: `translation` table stores `CARGO_NOT_FOUND` in multiple languages.

---

### Scenario 3: Enum Value Localization

**Use Case**: Dropdown showing cargo status options

**Schema** (Current):
```sql
-- Cargo status enum:
cargo_status IN ('pending', 'in_transit', 'delivered', 'cancelled')
```

**Translation Mapping** (Future):
```sql
-- Translation table:
translation_key='CARGO_STATUS_PENDING', language_code='en', translation_value='Pending'
translation_key='CARGO_STATUS_PENDING', language_code='tr', translation_value='Beklemede'

translation_key='CARGO_STATUS_IN_TRANSIT', language_code='en', translation_value='In Transit'
translation_key='CARGO_STATUS_IN_TRANSIT', language_code='tr', translation_value='Taşınıyor'
```

**Frontend** (Future):
```typescript
// Dropdown component:
const statuses = ['pending', 'in_transit', 'delivered', 'cancelled'];
const localizedOptions = statuses.map(status => ({
  value: status,
  label: t(`CARGO_STATUS_${status.toUpperCase()}`)
}));
// Displays Turkish labels if user language is Turkish
```

**Migration 025 Role**: Stores enum translations via `translation` table.

---

### Scenario 4: Legal Document Display

**Use Case**: Show Terms & Conditions to customer before checkout

**Implementation** (Future):
```typescript
@Get('legal/terms-and-conditions')
async getTermsAndConditions(@Query('lang') lang: string) {
  const terms = await this.termsConditionsRepo.findActiveVersion(lang);
  
  if (!terms) {
    throw new NotFoundException('Terms not available in requested language');
  }
  
  return terms;
}
```

**Database**:
```sql
SELECT * FROM terms_conditions_version
WHERE language_code = 'tr' AND is_active = true
ORDER BY effective_date DESC
LIMIT 1;
```

**Migration 025 Role**: `terms_conditions_version` table stores versioned legal documents.

---

### Scenario 5: Regional Date/Time Formatting

**Use Case**: Display shipment timestamps in user's local format

**Backend** (Future):
```typescript
// Service formats date based on locale
const locale = await this.localeSettingRepo.findByCode(user.localeCode);

const formattedDate = moment(cargo.createdAt)
  .format(locale.dateFormat);  // 'DD.MM.YYYY' for TR, 'MM/DD/YYYY' for US

return {
  cargoId: cargo.id,
  createdAt: formattedDate  // "15.01.2024" for Turkish user
};
```

**Migration 025 Role**: `locale_setting` table defines date format per locale.

---

### Scenario 6: Dynamic Content Localization

**Use Case**: Warehouse description in user's language

**Schema**:
```sql
-- localized_content table:
content_type='warehouse_description', content_key='WH-IST-001', language_code='en', content_value='Istanbul Main Warehouse - Central distribution hub'
content_type='warehouse_description', content_key='WH-IST-001', language_code='tr', content_value='İstanbul Ana Depo - Merkezi dağıtım merkezi'
```

**Backend** (Future):
```typescript
const description = await this.localizedContentRepo.getContent(
  'warehouse_description',
  'WH-IST-001',
  userLanguage
);
```

**Migration 025 Role**: `localized_content` table stores polymorphic content translations.

---

## 🔍 Table Design Explained

### 1. translation Table

**Purpose**: Key-value translation pairs for UI and API messages

**Key Fields**:
- `translation_key`: Unique identifier (e.g., `CARGO_NOT_FOUND`, `BUTTON_SUBMIT`)
- `language_code`: FK to `language` table (e.g., `en`, `tr`, `de`)
- `translation_value`: Translated string
- `context`: Optional disambiguation (e.g., `menu`, `button`, `error_message`)
- `is_approved`: Translation quality control flag

**Unique Constraint**:
```sql
UNIQUE (translation_key, language_code, context)
```

**Why `context` Field?**

**Problem**: Same word, different meanings
```
English word "Save" can mean:
- "Save" (verb) → "Kaydet" (Turkish)
- "Savings" (noun) → "Tasarruf" (Turkish)

Key: SAVE
Context: button → translation: "Kaydet"
Context: financial → translation: "Tasarruf"
```

**Why `is_approved` Flag?**

**Translation Workflow** (future):
```
1. Translator adds translation (is_approved=false)
2. Reviewer approves (is_approved=true)
3. Application only shows approved translations (WHERE is_approved=true)
```

---

### 2. localized_content Table

**Purpose**: Entity-specific content localization (polymorphic)

**Pattern**: `content_type` + `content_key` polymorphism

**Examples**:
```sql
-- Warehouse descriptions:
content_type='warehouse_description', content_key='WH-001', language_code='en', content_value='...'

-- Promotion banners:
content_type='promotion_banner', content_key='PROMO-2024-JAN', language_code='tr', content_value='...'

-- FAQ answers:
content_type='faq_answer', content_key='FAQ-SHIPPING-001', language_code='de', content_value='...'
```

**Why Separate from `translation`?**

`translation`: Fixed keys (UI strings, error messages)
`localized_content`: Dynamic content (entity-specific, changes frequently)

---

### 3. locale_setting Table

**Purpose**: Regional formatting preferences

**Key Fields**:
- `locale_code`: ISO locale (e.g., `en-US`, `tr-TR`, `de-DE`)
- `country_id`: Optional FK to country (allows country-specific overrides)
- `date_format`, `time_format`, `currency_format`, `number_format`: Display preferences
- `timezone`: Default timezone for region

**Examples**:
```sql
-- United States:
locale_code='en-US', date_format='MM/DD/YYYY', time_format='hh:mm A', timezone='America/New_York'

-- Turkey:
locale_code='tr-TR', date_format='DD.MM.YYYY', time_format='HH:mm', timezone='Europe/Istanbul'

-- Germany:
locale_code='de-DE', date_format='DD.MM.YYYY', time_format='HH:mm', timezone='Europe/Berlin'
```

**Usage** (Future):
```typescript
const userLocale = await localeRepo.findByCode(user.localeCode);
const formatted = formatCurrency(amount, userLocale.currencyFormat);
```

---

### 4. regional_config Table

**Purpose**: Country/region-specific business configurations

**Pattern**: JSONB for flexibility

**Examples**:
```sql
-- Turkey tax rules:
country_id=90, config_key='tax_rate', config_value='{"vat": 18, "cargo_tax": 5}'

-- Germany customs rules:
country_id=49, config_key='customs_threshold', config_value='{"exempt_below_eur": 150}'

-- UAE language preferences:
country_id=971, config_key='default_languages', config_value='["ar", "en"]'
```

**CHECK Constraint**:
```sql
CHECK (country_id IS NOT NULL OR region_id IS NOT NULL)
```

**Ensures**: Every config belongs to either country or region (not orphan configs).

---

### 5. legal_document Table

**Purpose**: Localized legal documents (privacy policy, terms, etc.)

**Key Fields**:
- `document_type`: Category (e.g., `privacy_policy`, `shipping_terms`, `liability_waiver`)
- `language_code`: Document language
- `content`: Full document text (TEXT field, large)
- `version`: Version number (e.g., `v1.0`, `2024-01-15`)
- `effective_date`: When document becomes active

**Unique Constraint**:
```sql
UNIQUE (document_type, language_code, version)
```

**Use Case**: Compliance requirement: "Show version 1.2 of Privacy Policy in Turkish to user before data collection"

---

### 6. terms_conditions_version Table

**Purpose**: Terms & Conditions versioning with acceptance tracking

**Key Fields**:
- `version_number`: Semantic version (e.g., `1.0.0`, `1.1.0`)
- `requires_acceptance`: Flag indicating if user must explicitly accept
- `effective_date`: When this version becomes enforceable

**Why Separate from `legal_document`?**

**Terms & Conditions**: Special legal status
- Requires explicit user acceptance (checkboxes)
- Version tracking critical (which version did user accept?)
- Effective date matters for disputes

**Other Legal Docs**: Informational
- No acceptance required
- Version less critical

**Future Link** (not in Migration 025):
```sql
-- User acceptance tracking (future table):
CREATE TABLE user_terms_acceptance (
  user_id INTEGER,
  terms_version_id INTEGER REFERENCES terms_conditions_version(id),
  accepted_at TIMESTAMP,
  ip_address VARCHAR(45)
);
```

---

## 🚨 Why This Is Incomplete by Design

### Explicitly Missing Components

#### 1. ❌ Translation Resolution Service

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
@Injectable()
export class TranslationService {
  async translate(key: string, lang: string, context?: string): Promise<string> {
    // Database query
    // Fallback logic
    // Caching
  }
}
```

**Why Omitted**:
- Fallback strategy undefined (see above)
- Caching strategy unclear (Redis? In-memory?)
- Performance requirements unknown

**When Added**: Migration 026 (Application-Layer Localization Services)

---

#### 2. ❌ Language Detection Middleware

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
@Injectable()
export class LanguageDetectionMiddleware implements NestMiddleware {
  use(req, res, next) {
    const lang = req.headers['accept-language'] || req.user?.preferredLanguage || 'en';
    req.language = lang;
    next();
  }
}
```

**Why Omitted**:
- User preferences not yet defined (where stored?)
- Cookie vs header vs user profile strategy unclear
- Belongs to auth/middleware layer (separate concern)

**When Added**: Migration 027 (User Preferences & Settings)

---

#### 3. ❌ Translation Admin UI / API

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
@Post('translations')
async createTranslation(@Body() dto: CreateTranslationDto) {}

@Put('translations/:id')
async updateTranslation(@Param('id') id: number, @Body() dto: UpdateTranslationDto) {}

@Post('translations/:id/approve')
async approveTranslation(@Param('id') id: number) {}
```

**Why Omitted**:
- Migration 025 is READ-ONLY infrastructure pattern
- Admin UI design not scoped
- Translation workflow (who can add/approve?) undefined

**When Added**: Migration 028 (Admin Translation Management)

---

#### 4. ❌ Translation Bundle Endpoint

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
@Get('translations/bundle')
async getTranslationBundle(@Query('lang') lang: string) {
  const translations = await this.translationRepo.getAllByLanguage(lang);
  return translations.reduce((acc, t) => {
    acc[t.translationKey] = t.translationValue;
    return acc;
  }, {});
  // Returns: { "CARGO_NOT_FOUND": "Kargo bulunamadı", ... }
}
```

**Why Omitted**:
- Bundle format not decided (flat object? nested by context?)
- Caching strategy unclear (CDN? Redis? ETag?)
- Versioning needs (bundle hash for cache busting?)

**When Added**: Migration 026 (Translation API Endpoints)

---

#### 5. ❌ Missing Translation Alerts

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
async checkMissingTranslations(lang: string): Promise<string[]> {
  const allKeys = await this.getAllTranslationKeys();
  const existingKeys = await this.getKeysForLanguage(lang);
  return allKeys.filter(key => !existingKeys.includes(key));
}
```

**Why Omitted**:
- Monitoring/alerting infrastructure not in scope
- Translation coverage reports future feature
- Belongs in admin/ops tooling

**When Added**: Migration 029 (Translation Monitoring & Quality Tools)

---

#### 6. ❌ Automatic Translation (Google Translate API)

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
async autoTranslate(key: string, sourceLanguage: string, targetLanguage: string) {
  const sourceText = await this.translationRepo.findOne(key, sourceLanguage);
  const translated = await googleTranslate.translate(sourceText.value, targetLanguage);
  return this.translationRepo.create({
    translationKey: key,
    languageCode: targetLanguage,
    translationValue: translated,
    isApproved: false  // Machine translation, needs review
  });
}
```

**Why Omitted**:
- External API integration out of scope
- Machine translation quality control process undefined
- Cost implications (Google Translate pricing)

**Future Consideration**: Evaluate necessity vs quality vs cost

---

#### 7. ❌ Pluralization Rules

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
// No support for plural forms:
// English: "1 item" vs "2 items"
// Turkish: different plural rules
// Arabic: different plural forms (1, 2, 3-10, 11+)
```

**Why Omitted**:
- Complex linguistic rules (varies by language)
- Requires specialized i18n library (ICU MessageFormat)
- Database schema would be significantly more complex

**Recommendation**: Use frontend i18n library (i18next) for pluralization

---

#### 8. ❌ Context-Aware Translation Interpolation

**Omitted**:
```typescript
// NOT IN MIGRATION 025:
// No support for variable interpolation:
// "Welcome, {{username}}!" → "Hoş geldiniz, Mehmet!"
// "You have {{count}} items" → "{{count}} ürününüz var"
```

**Why Omitted**:
- Template syntax not standardized
- Variable escaping/sanitization concerns
- Frontend templating sufficient (React, Vue handle this)

**Recommendation**: Store plain translation strings, handle interpolation in application layer

---

## 🔮 Future Evolution Path

### Planned Migrations for Localization Enhancement

#### Migration 026: Application-Layer Localization Services

**Scope**:
1. **Translation Resolution Service**:
   - Fallback logic (user lang → default lang → key)
   - Redis caching layer
   - Translation bundle generation

2. **Language Detection**:
   - Accept-Language header parsing
   - User preference storage
   - Cookie/session management

3. **API Endpoints**:
   - GET /translations/bundle?lang=tr
   - GET /translations/:key?lang=tr&context=error

#### Migration 027: User Language Preferences

**Scope**:
1. **User Profile Extension**:
   - Add `preferred_language` to user table
   - Add `locale_code` to user table

2. **Customer Language Settings**:
   - Customer can set default language
   - Override per-session language

3. **API Response Localization**:
   - Error messages in user language
   - Validation messages localized

#### Migration 028: Admin Translation Management

**Scope**:
1. **Translation CRUD**:
   - POST /admin/translations
   - PUT /admin/translations/:id
   - DELETE /admin/translations/:id (soft delete)

2. **Translation Approval Workflow**:
   - POST /admin/translations/:id/approve
   - POST /admin/translations/:id/reject
   - Reviewer role authorization

3. **Translation Coverage Reports**:
   - Missing translations per language
   - Translation completion percentage
   - Last updated dates

#### Migration 029: Advanced Localization Features

**Scope**:
1. **Translation Import/Export**:
   - CSV export for translators
   - CSV import for bulk updates
   - JSON export for CDN deployment

2. **Translation Versioning**:
   - Track translation history
   - Rollback to previous versions
   - Diff views

3. **Translation Quality Metrics**:
   - Missing translations alerts
   - Stale translations (not updated in 6+ months)
   - Translation consistency checks

---

## 📐 Indexing Strategy

### Read-Heavy Optimization

**Composite Indexes**:
```sql
idx_translation_key_lang ON (translation_key, language_code)
idx_localized_content_type_key ON (content_type, content_key)
```

**Query Pattern**: `WHERE translation_key = 'X' AND language_code = 'tr'`
→ Composite index allows single index lookup

**Unique Indexes** (enforce constraints + performance):
```sql
idx_translation_unique ON (translation_key, language_code, context)
idx_localized_content_unique ON (content_type, content_key, language_code)
```

**Partial Indexes** (exclude soft-deleted):
```sql
WHERE deleted_at IS NULL
```

**Benefit**: Smaller indexes, faster queries (ignores deleted records)

---

## 🛡️ Data Integrity & Constraints

### Referential Integrity

**FK to `language` Table**:
```sql
language_code REFERENCES language(language_code) ON DELETE RESTRICT
```

**Benefit**: Cannot delete language if translations exist (data safety)

**FK to `country` Table**:
```sql
country_id REFERENCES country(id) ON DELETE SET NULL
```

**Benefit**: If country deleted, locale settings remain (soft orphan acceptable)

### Business Rule Constraints

**`regional_config` CHECK**:
```sql
CHECK (country_id IS NOT NULL OR region_id IS NOT NULL)
```

**Ensures**: Config always belongs to country or region (no orphan configs)

**`terms_conditions_version` UNIQUE**:
```sql
UNIQUE (version_number, language_code)
```

**Ensures**: One Turkish version 1.0, one English version 1.0 (no duplicates)

---

## 🚨 Önemli Notlar

1. **Data-Driven Infrastructure**: Bu migration SADECE data layer oluşturur. Translation resolution, fallback logic, ve caching future migrations.

2. **No Runtime Logic**: Migration 025 does NOT automatically translate, detect language, or apply fallbacks.

3. **Backend Minimal**: No controllers/services created (READ-ONLY admin endpoints future migration).

4. **Frontend Integration**: Frontend applications (React, Vue) expected to handle localization rendering via libraries like i18next.

5. **`language` Table**: Referenced but NOT created in this migration (assumed to exist from earlier migration or seed data).

6. **JSONB Flexibility**: `regional_config` uses JSONB for country-specific rules (tax rates, customs, etc.).

7. **Legal Compliance**: `legal_document` and `terms_conditions_version` support multi-language legal requirements.

8. **Soft Delete**: All tables support soft delete (historical translation tracking).

9. **Approval Workflow**: `translation.is_approved` enables translation quality control (future workflow).

10. **Context Disambiguation**: `translation.context` allows same key different meanings in different contexts.

---

## ✅ Why This Design Approach?

### Summary of Design Philosophy

**Data-Driven Over Code-Driven**:
- Translations managed by non-developers
- No deployment for translation updates
- Scalable to 100+ languages

**Deferred Complexity**:
- Fallback logic deferred (domain-specific needs)
- Frontend vs backend resolution deferred (business decision)
- Translation workflow deferred (admin UI scoping)

**Foundation for Future**:
- Supports both frontend and backend localization strategies
- Extensible to pluralization, interpolation (via libraries)
- Ready for admin UI and translation management tools

**Compliance-Ready**:
- Legal documents versioned per language
- Terms & conditions acceptance tracking foundation
- Audit trail via timestamps

**Performance-Conscious**:
- Indexed for fast lookups
- Supports caching layer (future)
- Partial indexes exclude deleted records

---
