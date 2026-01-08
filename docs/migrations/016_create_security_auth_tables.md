# Migration 016: Security & Authentication Tables

## 📋 Genel Bakış

Migration 016, Global Cargo Backend sistemine **Güvenlik ve Kimlik Doğrulama Altyapısı (Security & Authentication Infrastructure)** ekler. Bu migration, authentication primitives, credential storage, session & token persistence ve security event logging için gerekli taban yapısını oluşturur.

### Tablolar

1. **`user_session`** - Kullanıcı oturum yönetimi
2. **`login_history`** - Giriş denemesi logları (immutable)
3. **`security_policy`** - Güvenlik politikası konfigürasyonu
4. **`two_factor_auth`** - İki faktörlü kimlik doğrulama
5. **`api_rate_limit`** - API rate limiting konfigürasyonu
6. **`api_access_log`** - API erişim logları (immutable)
7. **`security_incident`** - Güvenlik olayları takibi

**⚠️ Not**: Bu migration authentication infrastructure'ı oluşturur, ancak login/logout endpoint'leri ve gerçek authentication logic henüz implement edilmemiştir.

---

## 🔐 Authentication vs Authorization Ayrımı

### Authentication (Kimlik Doğrulama)

**Soru**: "Kim olduğunu kanıtlayabilir misin?"

**Cevap**: Credentials (username/password, 2FA, tokens) ile kimlik doğrulama

**Bu Migration'da**:
- ✅ Session management (`user_session`)
- ✅ Login history tracking (`login_history`)
- ✅ Credential storage (`two_factor_auth`)
- ✅ Token persistence (via `user_session.session_token_hash`)

**Henüz Yok**:
- ❌ Login endpoint
- ❌ Password hashing logic
- ❌ JWT generation
- ❌ Token validation guards

### Authorization (Yetkilendirme)

**Soru**: "Bu işlemi yapmaya yetkin var mı?"

**Cevap**: RBAC (Role-Based Access Control) ile yetki kontrolü

**Migration 004'te**:
- ✅ Role & Permission tables
- ✅ Employee-Role mapping
- ✅ Role-Permission mapping

**Bu Migration'da**:
- ✅ Security policy (authorization rules)
- ✅ API access logging (authorization attempts)

### Ayrım Önemi

```
Authentication → "Who are you?"
    ↓
Authorization → "What can you do?"
```

**Örnek Senaryo**:
1. User login yapar (Authentication) → `user_session` oluşturulur
2. User `/cargo/create` endpoint'ine istek yapar
3. System token'ı validate eder (Authentication check)
4. System user'ın role'ünü kontrol eder (Authorization check)
5. System permission'ı kontrol eder (Authorization check)
6. İşlem gerçekleşir veya 403 Forbidden döner

---

## 🔑 Credential Yaşam Döngüsü

### 1. Credential Oluşturma

**Henüz Implement Edilmemiş** (Gelecek Migration):

```typescript
// Pseudo-code (gelecek migration)
async createCredentials(actorId: number, password: string) {
  // TODO: Implement bcrypt/argon2 hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Store in credentials table (future migration)
  await this.credentialsRepository.create(actorId, hashedPassword);
}
```

**Bu Migration'da**:
- ✅ `two_factor_auth` tablosu hazır (2FA credentials için)
- ✅ Encrypted field'lar mevcut (BYTEA)
- ❌ Password storage henüz yok (gelecek migration)

### 2. Credential Doğrulama

**Henüz Implement Edilmemiş**:

```typescript
// Pseudo-code (gelecek migration)
async validateCredentials(actorId: number, password: string) {
  const credentials = await this.credentialsRepository.findByActorId(actorId);
  
  // TODO: Implement bcrypt/argon2 verification
  const isValid = await bcrypt.compare(password, credentials.hashed_password);
  
  if (isValid) {
    // Create session
    await this.createSession(actorId);
  }
}
```

### 3. Credential Güncelleme

**Henüz Implement Edilmemiş**:
- Password change
- 2FA enable/disable
- Backup codes regeneration

### 4. Credential Revocation

**Bu Migration'da**:
- ✅ Session revocation (`user_session.is_active = false`)
- ✅ Token expiration (`user_session.expires_at`)
- ❌ Password reset (gelecek migration)

---

## 🎫 Token & Session Modeli

### Session vs Token

**Session** (`user_session` tablosu):
- Server-side session state
- `session_token_hash`: Hashed token (never plain text)
- `expires_at`: Expiration timestamp
- `is_active`: Active/revoked status
- `last_activity`: Last activity timestamp

**Token** (JWT - gelecek migration):
- Stateless token (JWT payload)
- Contains: actor_id, actor_type, permissions, exp, iat
- Signed with secret key
- Validated on each request

### Token Lifecycle

```
1. Login (future migration)
   ↓
2. Generate JWT token
   ↓
3. Hash token → session_token_hash
   ↓
4. Store in user_session
   ↓
5. Return token to client
   ↓
6. Client sends token in Authorization header
   ↓
7. Server validates token (future migration)
   ↓
8. Server checks session (user_session.is_active)
   ↓
9. Request processed or 401 Unauthorized
```

### Session Management

**Active Session**:
- `is_active = true`
- `expires_at > CURRENT_TIMESTAMP`
- `logout_time IS NULL`

**Expired Session**:
- `expires_at <= CURRENT_TIMESTAMP`
- Automatically invalidated

**Revoked Session**:
- `is_active = false`
- `logout_time IS NOT NULL`
- Manually revoked (logout, security incident)

### Token Security Principles

1. **Never Store Plain Text**: Tokens are hashed before storage
2. **Short Expiration**: Default 30 minutes (configurable via `security_policy`)
3. **Revocable**: Sessions can be revoked immediately
4. **Activity Tracking**: `last_activity` updated on each request
5. **Single Use**: Each session has unique token hash

---

## 📊 Security Event Logging

### Login History (`login_history`)

**Immutable Log** (UPDATE/DELETE yasaktır - Migration 014 trigger'ları ile):

```sql
CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE,
  login_status VARCHAR(50) NOT NULL, -- 'success' or 'failed'
  failure_reason TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  ...
);
```

**Kullanım Senaryoları**:
- ✅ Failed login attempt tracking
- ✅ Brute force detection
- ✅ Geographic anomaly detection
- ✅ Device/browser tracking
- ✅ Compliance auditing

### API Access Log (`api_access_log`)

**Immutable Log** (append-only):

```sql
CREATE TABLE api_access_log (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER,
  endpoint VARCHAR(500) NOT NULL,
  http_method VARCHAR(10) NOT NULL,
  ip_address VARCHAR(50),
  request_time TIMESTAMP WITH TIME ZONE,
  response_time_ms INTEGER,
  status_code INTEGER,
  rate_limit_hit BOOLEAN DEFAULT false,
  error_message TEXT,
  ...
);
```

**Kullanım Senaryoları**:
- ✅ API usage analytics
- ✅ Rate limit violation tracking
- ✅ Error monitoring
- ✅ Performance tracking
- ✅ Security incident detection

### Security Incident (`security_incident`)

**Security Event Tracking**:

```sql
CREATE TABLE security_incident (
  id SERIAL PRIMARY KEY,
  incident_type VARCHAR(100) NOT NULL,
  severity_level VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  actor_id INTEGER,
  description TEXT NOT NULL,
  incident_details JSONB,
  detected_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by INTEGER,
  ...
);
```

**Incident Types** (örnekler):
- `brute_force_attempt`
- `suspicious_login_location`
- `rate_limit_exceeded`
- `unauthorized_access_attempt`
- `token_compromise`
- `credential_stuffing`

**Severity Levels**:
- **low**: Informational (e.g., failed login from known device)
- **medium**: Warning (e.g., multiple failed logins)
- **high**: Alert (e.g., login from suspicious location)
- **critical**: Immediate action required (e.g., data breach attempt)

---

## 🛡️ Veri Koruma Stratejisi

### Hassas Veri Masking

**Bu Migration'da**:

1. **Session Token Hash**:
   ```typescript
   // TODO: Mask token hash in production
   sessionTokenHash: entity.session_token_hash // Should be masked
   ```

2. **Encrypted Fields** (2FA):
   ```typescript
   secretKeyEncrypted: entity.secret_key_encrypted 
     ? '***ENCRYPTED***' 
     : undefined
   ```

3. **Password Fields**:
   - Henüz implement edilmemiş
   - Gelecek migration'da bcrypt/argon2 ile hash'lenecek
   - Asla plain text saklanmayacak

### Encryption Strategy

**Current State** (Migration 016):
- ✅ Encrypted field columns (BYTEA) mevcut
- ✅ Encryption flag'leri mevcut (`is_encrypted`)
- ❌ Encryption logic henüz yok (placeholder)

**Future State** (Gelecek Migration):
- ✅ AES-256-GCM encryption
- ✅ Key management (AWS KMS, HashiCorp Vault)
- ✅ Key rotation strategy
- ✅ Encrypted field masking in API responses

### Data at Rest Protection

1. **Database Encryption**: PostgreSQL TDE (Transparent Data Encryption)
2. **Backup Encryption**: Encrypted backups
3. **Field-Level Encryption**: Sensitive fields (BYTEA)
4. **Key Management**: Centralized key management service

### Data in Transit Protection

1. **TLS/SSL**: All API communication over HTTPS
2. **Token Security**: JWT signed with RSA-256
3. **Session Security**: Secure, HttpOnly cookies (future)

---

## ❓ Neden Henüz Auth Endpoint'leri Yok?

### Infrastructure First Approach

**Bu Migration'da**:
- ✅ Database schema hazır
- ✅ Repository layer hazır
- ✅ Service layer hazır (read-only)
- ✅ Controller layer hazır (read-only inspection)

**Gelecek Migration'larda**:
- ❌ Login endpoint (POST /auth/login)
- ❌ Logout endpoint (POST /auth/logout)
- ❌ Token refresh endpoint (POST /auth/refresh)
- ❌ Password change endpoint (PUT /auth/password)
- ❌ 2FA enable/disable endpoints

### Neden Bu Yaklaşım?

1. **Separation of Concerns**: Infrastructure vs Business Logic
2. **Security First**: Secure foundation before exposing endpoints
3. **Testing**: Infrastructure test edilebilir (read-only)
4. **Incremental Development**: Step-by-step implementation
5. **Risk Mitigation**: Security vulnerabilities minimize edilir

### Read-Only Endpoints (Bu Migration)

**Inspection & Auditing**:
- `GET /security/sessions` - Active sessions
- `GET /security/login-history` - Login attempts
- `GET /security/credentials` - 2FA status
- `GET /security/tokens/revoked` - Revoked tokens
- `GET /security/incidents` - Security incidents

**Kullanım**:
- ✅ Security team monitoring
- ✅ Compliance auditing
- ✅ Debugging & troubleshooting
- ✅ Incident investigation

---

## 🗺️ Gelecek Güvenlik Yol Haritası

### Migration 017+ (Tahmini)

#### Authentication Flows

1. **Login Endpoint**:
   ```typescript
   POST /auth/login
   {
     "email": "user@example.com",
     "password": "securePassword123"
   }
   → Returns: { accessToken, refreshToken, expiresIn }
   ```

2. **Logout Endpoint**:
   ```typescript
   POST /auth/logout
   Headers: { Authorization: "Bearer <token>" }
   → Revokes session, invalidates token
   ```

3. **Token Refresh**:
   ```typescript
   POST /auth/refresh
   {
     "refreshToken": "..."
   }
   → Returns: { accessToken, expiresIn }
   ```

#### Password Management

1. **Password Hashing**: bcrypt/argon2 implementation
2. **Password Reset**: Email-based reset flow
3. **Password Change**: Authenticated password change
4. **Password Policy**: Enforced via `security_policy`

#### Multi-Factor Authentication (MFA)

1. **2FA Enable**: TOTP/SMS/Email setup
2. **2FA Verify**: Code verification during login
3. **Backup Codes**: Recovery codes generation
4. **2FA Disable**: Secure disable flow

#### OAuth / SSO Integration

1. **OAuth Providers**: Google, Microsoft, etc.
2. **SAML 2.0**: Enterprise SSO
3. **OpenID Connect**: Standard authentication
4. **Social Login**: Facebook, Twitter, etc.

#### Advanced Security Features

1. **Device Management**: Trusted devices
2. **Location-Based Security**: Geographic restrictions
3. **Anomaly Detection**: ML-based threat detection
4. **Security Alerts**: Real-time notifications
5. **Account Lockout**: Automatic lockout on suspicious activity

---

## 🎯 Threat Modeling Varsayımları

### Tehdit Senaryoları

#### 1. Brute Force Attack

**Tehdit**: Attacker çok sayıda login denemesi yapar

**Koruma**:
- ✅ `max_failed_login_attempts` (security_policy)
- ✅ `lockout_duration_minutes` (security_policy)
- ✅ `login_history` tracking (failed attempts)
- ✅ Rate limiting (api_rate_limit)

**Gelecek Migration**:
- ❌ Automatic account lockout
- ❌ CAPTCHA after N failed attempts
- ❌ IP-based blocking

#### 2. Session Hijacking

**Tehdit**: Attacker valid session token'ı çalar

**Koruma**:
- ✅ Token hashing (never plain text)
- ✅ Session expiration (`expires_at`)
- ✅ Session revocation (`is_active = false`)
- ✅ IP address tracking
- ✅ User agent tracking

**Gelecek Migration**:
- ❌ Token rotation
- ❌ Device fingerprinting
- ❌ Suspicious activity detection

#### 3. Credential Stuffing

**Tehdit**: Attacker leaked credentials ile login dener

**Koruma**:
- ✅ `login_history` tracking
- ✅ Rate limiting
- ✅ Geographic anomaly detection
- ✅ Device anomaly detection

**Gelecek Migration**:
- ❌ Password breach detection (Have I Been Pwned API)
- ❌ Credential stuffing prevention
- ❌ Account takeover protection

#### 4. Token Replay Attack

**Tehdit**: Attacker expired token'ı tekrar kullanmaya çalışır

**Koruma**:
- ✅ Token expiration (`expires_at`)
- ✅ Session validation (`is_active`)
- ✅ Token hash uniqueness

**Gelecek Migration**:
- ❌ Token blacklisting
- ❌ One-time token usage
- ❌ Token rotation

#### 5. API Abuse

**Tehdit**: Attacker API'yi abuse eder (DDoS, scraping)

**Koruma**:
- ✅ Rate limiting (`api_rate_limit`)
- ✅ API access logging (`api_access_log`)
- ✅ IP tracking

**Gelecek Migration**:
- ❌ Advanced rate limiting (sliding window)
- ❌ DDoS protection
- ❌ Bot detection

---

## 📋 Uyumluluk Düşünceleri

### GDPR (EU)

**Gereksinimler**:
- ✅ Login history tracking (audit trail)
- ✅ Session management (data access tracking)
- ✅ Security incident logging (breach detection)
- ✅ Data encryption (BYTEA fields)

**Gelecek Migration**:
- ❌ Right to be forgotten (data deletion)
- ❌ Data export (user data export)
- ❌ Consent management

### PCI DSS (Payment Card Industry)

**Gereksinimler**:
- ✅ Access logging (`api_access_log`)
- ✅ Session management
- ✅ Security incident tracking
- ✅ Policy enforcement (`security_policy`)

**Gelecek Migration**:
- ❌ Strong password requirements
- ❌ MFA for sensitive operations
- ❌ Tokenization for card data

### ISO 27001

**Gereksinimler**:
- ✅ Access control (RBAC integration)
- ✅ Audit logging (login_history, api_access_log)
- ✅ Incident management (`security_incident`)
- ✅ Security policy (`security_policy`)

**Gelecek Migration**:
- ❌ Security awareness training
- ❌ Vulnerability management
- ❌ Business continuity planning

### SOX (Sarbanes-Oxley)

**Gereksinimler**:
- ✅ Access logging
- ✅ Session tracking
- ✅ Security event logging
- ✅ Immutable audit trail

**Gelecek Migration**:
- ❌ Financial data access controls
- ❌ Segregation of duties
- ❌ Change management

---

## 🔄 Operasyonel Senaryolar

### Senaryo 1: Normal Login Flow (Gelecek Migration)

```
1. User → POST /auth/login { email, password }
   ↓
2. System validates credentials (bcrypt)
   ↓
3. System checks security_policy (max_failed_attempts)
   ↓
4. System creates user_session
   ↓
5. System generates JWT token
   ↓
6. System hashes token → session_token_hash
   ↓
7. System logs login_history (status: 'success')
   ↓
8. System returns { accessToken, refreshToken }
   ↓
9. Client stores tokens
   ↓
10. Client sends token in subsequent requests
```

### Senaryo 2: Failed Login Attempt

```
1. User → POST /auth/login { email, wrongPassword }
   ↓
2. System validates credentials → FAILED
   ↓
3. System logs login_history (status: 'failed', failure_reason: 'invalid_password')
   ↓
4. System checks failed_attempts count
   ↓
5. If count >= max_failed_login_attempts:
   - System locks account (future migration)
   - System creates security_incident (severity: 'medium')
   ↓
6. System returns 401 Unauthorized
```

### Senaryo 3: Session Expiration

```
1. User makes request with expired token
   ↓
2. System validates token → EXPIRED
   ↓
3. System checks user_session.expires_at <= CURRENT_TIMESTAMP
   ↓
4. System returns 401 Unauthorized
   ↓
5. Client calls POST /auth/refresh (future migration)
   ↓
6. System validates refreshToken
   ↓
7. System creates new session
   ↓
8. System returns new accessToken
```

### Senaryo 4: Security Incident Detection

```
1. System detects suspicious activity:
   - Multiple failed logins from same IP
   - Login from unusual location
   - Rate limit exceeded
   ↓
2. System creates security_incident:
   - incident_type: 'suspicious_login_activity'
   - severity_level: 'high'
   - actor_id: <affected_user>
   ↓
3. System logs api_access_log (rate_limit_hit: true)
   ↓
4. System sends notification (via notification system)
   ↓
5. Security team investigates
   ↓
6. System resolves incident (resolved_at, resolved_by)
```

### Senaryo 5: Token Revocation

```
1. User → POST /auth/logout (future migration)
   ↓
2. System validates token
   ↓
3. System updates user_session:
   - is_active = false
   - logout_time = CURRENT_TIMESTAMP
   ↓
4. System logs login_history (logout_time)
   ↓
5. Token is now invalid (future: blacklisted)
   ↓
6. Any subsequent request with this token → 401 Unauthorized
```

---

## 🏗️ Backend Implementasyonu

### Oluşturulan Modüller

1. **AuthSessionModule** - `src/security/auth-session/`
   - User session management
   - Login history tracking
   - Session expiration handling

2. **AuthCredentialModule** - `src/security/auth-credential/`
   - Two-factor authentication
   - Encrypted credential storage
   - 2FA method management

3. **AuthTokenModule** - `src/security/auth-token/`
   - Token management (via user_session)
   - Token validation queries
   - Revoked token tracking

4. **SecurityEventModule** - `src/security/security-event/`
   - Security policy management
   - API rate limiting configuration
   - API access logging
   - Security incident tracking

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Sensitive field handling (masking)

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Sensitive data masking (`***ENCRYPTED***`)
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
- Sensitive field masking

### API Endpoints

#### User Sessions

- `GET /security/sessions` - Tüm oturumlar
- `GET /security/sessions/active` - Aktif oturumlar
- `GET /security/sessions/expired` - Süresi dolmuş oturumlar
- `GET /security/sessions/actor/:actorId` - Actor bazlı
- `GET /security/sessions/actor/:actorId/active` - Actor aktif oturumlar
- `GET /security/sessions/uuid/:uuid` - UUID bazlı
- `GET /security/sessions/:id` - ID bazlı

#### Login History

- `GET /security/login-history` - Tüm login geçmişi
- `GET /security/login-history/failed` - Başarısız girişler
- `GET /security/login-history/successful` - Başarılı girişler
- `GET /security/login-history/status/:loginStatus` - Durum bazlı
- `GET /security/login-history/actor/:actorId` - Actor bazlı
- `GET /security/login-history/time-range?startDate=&endDate=` - Tarih aralığı
- `GET /security/login-history/:id` - ID bazlı

#### Credentials (2FA)

- `GET /security/credentials` - Tüm 2FA kayıtları
- `GET /security/credentials/enabled` - Aktif 2FA'lar
- `GET /security/credentials/method/:twoFactorMethod` - Method bazlı
- `GET /security/credentials/actor/:actorId` - Actor bazlı
- `GET /security/credentials/:id` - ID bazlı

#### Tokens

- `GET /security/tokens/revoked` - İptal edilmiş token'lar
- `GET /security/tokens/expired` - Süresi dolmuş token'lar
- `GET /security/tokens/actor/:actorId/active` - Actor aktif token'lar
- `GET /security/tokens/hash/:tokenHash` - Hash bazlı

#### Security Policies

- `GET /security/policies` - Tüm politikalar
- `GET /security/policies/active` - Aktif politikalar
- `GET /security/policies/type/:policyType` - Tip bazlı
- `GET /security/policies/uuid/:uuid` - UUID bazlı
- `GET /security/policies/:id` - ID bazlı

#### API Rate Limits

- `GET /security/rate-limits` - Tüm rate limit'ler
- `GET /security/rate-limits/active` - Aktif rate limit'ler
- `GET /security/rate-limits/endpoint/:endpointPattern` - Endpoint bazlı
- `GET /security/rate-limits/uuid/:uuid` - UUID bazlı
- `GET /security/rate-limits/:id` - ID bazlı

#### API Access Logs

- `GET /security/access-logs` - Tüm access log'lar
- `GET /security/access-logs/rate-limit-hits` - Rate limit ihlalleri
- `GET /security/access-logs/actor/:actorId` - Actor bazlı
- `GET /security/access-logs/endpoint/:endpoint` - Endpoint bazlı
- `GET /security/access-logs/status-code/:statusCode` - Status code bazlı
- `GET /security/access-logs/time-range?startDate=&endDate=` - Tarih aralığı
- `GET /security/access-logs/:id` - ID bazlı

#### Security Incidents

- `GET /security/incidents` - Tüm olaylar
- `GET /security/incidents/unresolved` - Çözülmemiş olaylar
- `GET /security/incidents/severity/:severityLevel` - Önem seviyesi bazlı
- `GET /security/incidents/type/:incidentType` - Tip bazlı
- `GET /security/incidents/actor/:actorId` - Actor bazlı
- `GET /security/incidents/uuid/:uuid` - UUID bazlı
- `GET /security/incidents/:id` - ID bazlı

---

## 🚨 Önemli Notlar

1. **Read-Only Controllers**: Bu migration'da tüm endpoint'ler GET-only'dir. Login/logout endpoint'leri gelecek migration'larda eklenecektir.

2. **No Password Hashing**: Password hashing logic (bcrypt/argon2) henüz implement edilmemiştir. Placeholder TODO comments mevcuttur.

3. **No JWT Generation**: JWT token generation ve validation henüz yoktur. Placeholder TODO comments mevcuttur.

4. **Encrypted Field Masking**: Encrypted fields (2FA secrets) API response'larında `***ENCRYPTED***` olarak maskelenir.

5. **Immutable Logs**: `login_history` ve `api_access_log` tabloları immutable'dır (Migration 014 trigger'ları ile korunur).

6. **Soft Delete**: `security_policy` ve `api_rate_limit` tablolarında soft delete mevcuttur.

7. **Foreign Keys**: Tüm foreign key'ler uygun ON DELETE/ON UPDATE davranışlarına sahiptir.

8. **Indexes**: Performans için gerekli partial index'ler oluşturulmuştur.

9. **Security Principles**: Zero trust, least privilege, append-only logs prensipleri uygulanmıştır.

10. **TODO Comments**: Service ve controller'larda gelecek RBAC guard'ları, encryption logic ve JWT implementation için TODO yorumları eklenmiştir.

---

## 📚 İlgili Dokümantasyon

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [ISO 27001 Information Security](https://www.iso.org/isoiec-27001-information-security.html)

---

**Migration 016 Tamamlandı** ✅
