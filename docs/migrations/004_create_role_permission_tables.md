# Migration 004: Role ve Permission Tabloları (RBAC)

## Migration Özeti

Bu migration, global kargo yönetim sistemi için RBAC (Role-Based Access Control) sisteminin temelini oluşturur. Role ve permission tabloları ile çalışanların yetkilendirmesi için gerekli yapı kurulur.

### Oluşturulan Tablolar

1. **role** - Rol tablosu
2. **permission** - İzin tablosu
3. **role_permission** - Role ve permission arasındaki many-to-many ilişki tablosu
4. **employee_role** - Employee ve role arasındaki many-to-many ilişki tablosu

## RBAC Temel Açıklaması

### RBAC Nedir?

RBAC (Role-Based Access Control), kullanıcıların yetkilendirmesini roller üzerinden yöneten bir güvenlik modelidir. Bu modelde:

1. **Permission (İzin)**: Sistemde yapılabilecek eylemleri tanımlar
   - Örnek: `cargo.create`, `cargo.read`, `cargo.update`, `cargo.delete`
   - Her permission bir **resource** (kaynak) ve bir **action** (eylem) içerir

2. **Role (Rol)**: Bir grup permission'ı temsil eder
   - Örnek: `warehouse_manager`, `customer_service`, `admin`
   - Roller, permission'ları gruplar ve mantıksal birimler oluşturur

3. **Role-Permission İlişkisi**: Many-to-many
   - Bir role birden fazla permission'a sahip olabilir
   - Bir permission birden fazla role'de bulunabilir

4. **Employee-Role İlişkisi**: Many-to-many
   - Bir çalışan birden fazla role'e sahip olabilir
   - Bir role birden fazla çalışana atanabilir

### Neden Role ve Permission Ayrımı?

#### 1. Esneklik ve Ölçeklenebilirlik

- **Permission'lar**: Sistemdeki tüm eylemleri tanımlar
- **Roller**: Permission'ları mantıksal gruplara ayırır
- Yeni bir role oluştururken mevcut permission'ları kullanabilirsiniz
- Yeni bir permission eklediğinizde, birden fazla role'e atayabilirsiniz

#### 2. Bakım Kolaylığı

- Permission'lar merkezi olarak yönetilir
- Role'ler değiştiğinde sadece role-permission ilişkileri güncellenir
- Çalışan yetkilendirmesi sadece role ataması ile yapılır

#### 3. Güvenlik ve Denetim

- Her permission ataması `granted_at` ve `granted_by` ile kaydedilir
- Her role ataması `assigned_at` ve `assigned_by` ile kaydedilir
- Kim ne zaman hangi yetkiyi verdi takip edilebilir

### Global Kargo Şirketi İçin Uygunluk

Bu tasarım, global bir kargo şirketi için idealdir çünkü:

1. **Farklı Departmanlar**: 
   - Warehouse Manager: Depo işlemleri
   - Customer Service: Müşteri hizmetleri
   - Operations: Operasyon yönetimi
   - Finance: Finansal işlemler

2. **Farklı Seviyeler**:
   - Junior: Sınırlı yetkiler
   - Senior: Geniş yetkiler
   - Manager: Yönetim yetkileri
   - Admin: Tüm yetkiler

3. **Çoklu Role Desteği**:
   - Bir çalışan hem warehouse manager hem de customer service olabilir
   - Geçici yetkilendirmeler kolayca yapılabilir

## Backend Implementasyonu

### Oluşturulan Modüller

Her tablo ve ilişki için ayrı bir NestJS modülü oluşturulmuştur:

1. **RoleModule** - `src/rbac/role/role.module.ts`
   - Rol yönetimi
   - Code bazlı arama
   - Aktif/pasif yönetimi

2. **PermissionModule** - `src/rbac/permission/permission.module.ts`
   - İzin yönetimi
   - Resource bazlı filtreleme
   - Action bazlı sorgular

3. **RolePermissionModule** - `src/rbac/role-permission/role-permission.module.ts`
   - Role-permission ilişki yönetimi
   - Role'e göre permission listeleme
   - Permission'a göre role listeleme
   - Detaylı bilgi ile sorgular

4. **EmployeeRoleModule** - `src/rbac/employee-role/employee-role.module.ts`
   - Employee-role ilişki yönetimi
   - Employee'e göre role listeleme
   - Role'e göre employee listeleme
   - Aktif role filtreleme

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

**Interface**: Entity tipi ve repository metodları tanımlanır
```typescript
interface IRolePermissionRepository {
  findAll(): Promise<RolePermissionEntity[]>;
  findByRoleId(roleId: number): Promise<RolePermissionEntity[]>;
  findByPermissionId(permissionId: number): Promise<RolePermissionEntity[]>;
  findByRoleIdAndPermissionId(roleId: number, permissionId: number): Promise<RolePermissionEntity | null>;
}
```

**Implementation**: Raw SQL sorguları ile veritabanı işlemleri yapılır
- Many-to-many ilişki sorguları
- Soft delete desteği (employee_role için)
- Unique constraint kontrolü

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- İlişkili verileri birleştirme (join benzeri işlemler)
- Exception handling

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları
- Detaylı bilgi endpoint'leri

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Detaylı response DTO'ları (ilişkili verilerle)

### Tasarım Kararları

1. **Many-to-Many İlişkiler**: 
   - `role_permission`: Role ve permission arasındaki ilişki
   - `employee_role`: Employee ve role arasındaki ilişki
   - Her ikisi de UNIQUE constraint ile tekrar atama önlenir

2. **CASCADE DELETE**: 
   - `role_permission`: Role veya permission silinirse ilişki silinir
   - `employee_role`: Employee silinirse role atamaları silinir

3. **RESTRICT DELETE**: 
   - `employee_role`: Role silinemez (employee'lar bu role'e sahipse)

4. **SET NULL**: 
   - `granted_by` ve `assigned_by`: Employee silinirse NULL olur
   - Veri bütünlüğü korunur, audit trail kaybolmaz

5. **Soft Delete**: 
   - `employee_role`: `deleted_at` ve `is_active` ile yönetim
   - Role atamaları geçici olarak devre dışı bırakılabilir

6. **Audit Trail**: 
   - `granted_at`, `granted_by`: Permission atama bilgileri
   - `assigned_at`, `assigned_by`: Role atama bilgileri

## API Genel Bakış

### Role Endpoint'leri

- `GET /rbac/roles` - Tüm rolleri listele
- `GET /rbac/roles/active` - Aktif rolleri listele
- `GET /rbac/roles/code/:code` - Code ile rol bul
- `GET /rbac/roles/uuid/:uuid` - UUID ile rol bul
- `GET /rbac/roles/:id` - ID ile rol bul

### Permission Endpoint'leri

- `GET /rbac/permissions` - Tüm izinleri listele
- `GET /rbac/permissions/active` - Aktif izinleri listele
- `GET /rbac/permissions/resource/:resource` - Resource'a göre izinleri listele
- `GET /rbac/permissions/resource/:resource/active` - Resource'a göre aktif izinleri listele
- `GET /rbac/permissions/code/:code` - Code ile izin bul
- `GET /rbac/permissions/uuid/:uuid` - UUID ile izin bul
- `GET /rbac/permissions/:id` - ID ile izin bul

### Role-Permission Endpoint'leri

- `GET /rbac/role-permissions` - Tüm role-permission ilişkilerini listele
- `GET /rbac/role-permissions/role/:roleId` - Role'e göre permission'ları listele
- `GET /rbac/role-permissions/role/:roleId/details` - Role'e göre detaylı permission listesi
- `GET /rbac/role-permissions/permission/:permissionId` - Permission'a göre rolleri listele
- `GET /rbac/role-permissions/permission/:permissionId/details` - Permission'a göre detaylı role listesi
- `GET /rbac/role-permissions/:id` - ID ile role-permission ilişkisi bul

### Employee-Role Endpoint'leri

- `GET /rbac/employee-roles` - Tüm employee-role ilişkilerini listele
- `GET /rbac/employee-roles/employee/:employeeId` - Employee'e göre rolleri listele
- `GET /rbac/employee-roles/employee/:employeeId/active` - Employee'e göre aktif rolleri listele
- `GET /rbac/employee-roles/employee/:employeeId/details` - Employee'e göre detaylı role listesi
- `GET /rbac/employee-roles/role/:roleId` - Role'e göre employee'ları listele
- `GET /rbac/employee-roles/role/:roleId/details` - Role'e göre detaylı employee listesi
- `GET /rbac/employee-roles/:id` - ID ile employee-role ilişkisi bul

### Örnek Response'lar

**Role Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "code": "WAREHOUSE_MANAGER",
  "name": "Warehouse Manager",
  "description": "Depo yöneticisi rolü",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Permission Response:**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "code": "CARGO_CREATE",
  "name": "Create Cargo",
  "resource": "cargo",
  "action": "create",
  "description": "Kargo oluşturma yetkisi",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Role-Permission With Details Response:**
```json
{
  "id": 1,
  "roleId": 1,
  "roleCode": "WAREHOUSE_MANAGER",
  "roleName": "Warehouse Manager",
  "permissionId": 1,
  "permissionCode": "CARGO_CREATE",
  "permissionName": "Create Cargo",
  "resource": "cargo",
  "action": "create",
  "grantedAt": "2024-01-01T00:00:00.000Z",
  "grantedBy": 5
}
```

**Employee-Role With Details Response:**
```json
{
  "id": 1,
  "employeeId": 10,
  "employeeNumber": "EMP-001",
  "employeeFirstName": "Mehmet",
  "employeeLastName": "Demir",
  "roleId": 1,
  "roleCode": "WAREHOUSE_MANAGER",
  "roleName": "Warehouse Manager",
  "assignedAt": "2024-01-01T00:00:00.000Z",
  "assignedBy": 5,
  "isActive": true,
  "deletedAt": null
}
```

### Validation Kuralları

- **ID**: Pozitif tam sayı olmalı (ParseIntPipe)
- **UUID**: Geçerli UUID formatında olmalı
- **Code**: Unique olmalı (role ve permission için)
- **Resource**: String, permission'ın hangi kaynağa ait olduğunu belirtir
- **Action**: String, permission'ın hangi eylemi temsil ettiğini belirtir
- **Unique Constraints**: 
  - `role_permission`: (role_id, permission_id) unique
  - `employee_role`: (employee_id, role_id) unique (aktif ve silinmemiş kayıtlar için)

## Güvenlik ve Yetkilendirme Akışı

### RBAC Akışı

1. **Permission Tanımlama**: 
   - Sistemdeki tüm eylemler permission olarak tanımlanır
   - Her permission bir resource ve action içerir
   - Örnek: `cargo.create`, `cargo.read`, `cargo.update`, `cargo.delete`

2. **Role Oluşturma**: 
   - Mantıksal gruplar oluşturulur
   - Örnek: `warehouse_manager`, `customer_service`, `admin`

3. **Role-Permission Atama**: 
   - Rollere permission'lar atanır
   - Bir role birden fazla permission'a sahip olabilir
   - `granted_by` ile kim atadı kaydedilir

4. **Employee-Role Atama**: 
   - Çalışanlara roller atanır
   - Bir çalışan birden fazla role'e sahip olabilir
   - `assigned_by` ile kim atadı kaydedilir

5. **Yetkilendirme Kontrolü**: 
   - Çalışan bir eylem yapmak istediğinde:
     - Çalışanın rolleri kontrol edilir
     - Rollerin permission'ları kontrol edilir
     - İstenen eylem için permission varsa yetki verilir

### Gelecekteki Authentication Entegrasyonu

Bu yapı, gelecekteki authentication sistemine hazırdır:

1. **JWT Token**: 
   - Token'da employee ID ve rolleri bulunur
   - Her request'te token'dan rolleri çıkarılır

2. **Permission Check**: 
   - Middleware veya guard ile permission kontrolü yapılır
   - Örnek: `@RequirePermission('cargo.create')`

3. **Role Check**: 
   - Middleware veya guard ile role kontrolü yapılır
   - Örnek: `@RequireRole('warehouse_manager')`

4. **Dynamic Authorization**: 
   - Permission'lar runtime'da kontrol edilir
   - Yeni permission'lar eklenebilir, mevcut rollere atanabilir

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, RBAC sisteminin temelini oluşturur:

1. **Role Yönetimi**: Sistemdeki tüm rolleri tanımlar
2. **Permission Yönetimi**: Sistemdeki tüm izinleri tanımlar
3. **İlişki Yönetimi**: Role-permission ve employee-role ilişkilerini yönetir
4. **Audit Trail**: Tüm atamalar kaydedilir

### Migration 003 ile İlişkisi

- **Migration 003**: Actor sistemi (employee tablosu) oluşturuldu
- **Migration 004**: Employee'lere role atama sistemi eklendi
- **employee_role**: Employee tablosuna foreign key ile bağlı
- **granted_by / assigned_by**: Employee ID'si ile audit trail

### Gelecek Migration'larla İlişkisi

- **Migration 016**: Authentication tabloları bu yapıya entegre olacak
- **Migration 005+**: Cargo, pricing gibi tablolar permission kontrolü ile korunacak
- **Middleware/Guards**: Permission kontrolü için guard'lar oluşturulacak

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - `role_permission`: CASCADE DELETE (role veya permission silinirse ilişki silinir)
  - `employee_role`: CASCADE DELETE (employee silinirse atamalar silinir), RESTRICT (role silinemez)
- **Unique Constraints**: 
  - `role`: code unique
  - `permission`: code unique
  - `role_permission`: (role_id, permission_id) unique
  - `employee_role`: (employee_id, role_id) unique (aktif ve silinmemiş kayıtlar için)
- **SET NULL**: 
  - `granted_by`, `assigned_by`: Employee silinirse NULL olur
- **Soft Delete**: 
  - `employee_role`: `deleted_at` ve `is_active` ile yönetim
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: 
  - `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
  - `employee_role`: `is_active = true` koşulu ile sadece aktif atamalar index'lenir
- **Composite Index'ler**: 
  - Unique constraint'ler otomatik olarak index oluşturur
  - Many-to-many sorgular için optimize edilmiştir

## Notlar

- RBAC sistemi read-only endpoint'ler ile başlar
- Write endpoint'leri (create, update, delete) gelecekte authentication ile korunacak
- Permission'lar resource ve action kombinasyonu ile tanımlanır
- Role atamaları geçici olarak devre dışı bırakılabilir (`is_active = false`)
- Audit trail ile tüm atamalar takip edilebilir
- Çoklu role desteği ile esnek yetkilendirme sağlanır

