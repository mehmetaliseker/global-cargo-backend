# Migration 009: İnsan Kaynakları (HR) Tabloları

## Migration Özeti

Bu migration, global kargo yönetim sistemi için insan kaynakları yönetimi, çalışan performans takibi, maaş yönetimi, izin talepleri, eğitim kayıtları ve performans ödülleri tablolarını oluşturur. Çalışan yaşam döngüsü yönetimi, KPI takibi, maaş ve prim hesaplamaları, izin yönetimi ve eğitim sertifikasyonu için gerekli yapı kurulur.

### Oluşturulan Tablolar

1. **hr_kpi** - Çalışan KPI (Key Performance Indicator) kayıtları
2. **employee_salary** - Çalışan maaş kayıtları
3. **employee_leave_request** - Çalışan izin talepleri
4. **employee_training** - Çalışan eğitim kayıtları
5. **employee_performance_reward** - Çalışan performans ödülleri

## İnsan Kaynakları Modeli Açıklaması

### İnsan Kaynakları Yönetimi Nedir?

İnsan kaynakları yönetimi, organizasyon içindeki çalışanların yaşam döngüsünü yöneten, performans takibi yapan, maaş ve ödül sistemini yöneten ve çalışan gelişimini destekleyen süreçler bütünüdür. Sistem şunları sağlar:

- **KPI Takibi**: Çalışan performans metriklerinin ölçümü
- **Maaş Yönetimi**: Maaş, prim ve bonus hesaplamaları
- **İzin Yönetimi**: İzin talepleri ve onay süreçleri
- **Eğitim Yönetimi**: Eğitim kayıtları ve sertifikasyon takibi
- **Performans Ödülleri**: Performans bazlı ödül ve takdir sistemi

### Gerçek Dünya Eşleştirmesi

#### 1. KPI (Key Performance Indicator) Yönetimi

1. **KPI Tanımları**:
   - Her çalışan için performans göstergeleri
   - KPI tipi (örneğin: "delivery_success_rate", "customer_satisfaction", "on_time_delivery")
   - KPI değeri (sayısal metrik)
   - Dönem bazlı takip (aylık, çeyreklik, yıllık)

2. **KPI Hesaplama**:
   - Belirli dönemler için KPI değerleri hesaplanır
   - Hesaplama tarihi ve hesaplayan çalışan kaydedilir
   - Dönem başlangıç ve bitiş tarihleri ile takip

3. **Kullanım Senaryoları**:
   - Performans değerlendirmeleri
   - Prim hesaplamaları
   - Terfi ve kariyer planlaması
   - Eğitim ihtiyaç analizi

#### 2. Maaş Yönetimi

1. **Maaş Bileşenleri**:
   - **Base Salary**: Temel maaş (ana gelir)
   - **Bonus Amount**: Bonus tutarı (performans bonusu)
   - **Prim Amount**: Prim tutarı (ek ödeme)
   - **Total Amount**: Toplam tutar (otomatik hesaplanır)

2. **Maaş Dönemleri**:
   - Her maaş kaydı belirli bir dönem için geçerlidir
   - Dönem başlangıç tarihi zorunlu
   - Dönem bitiş tarihi opsiyonel (devam eden maaşlar için)

3. **Maaş Durumları**:
   - **pending**: Beklemede
   - **approved**: Onaylandı
   - **paid**: Ödendi
   - **cancelled**: İptal edildi

4. **İş Kuralları**:
   - Toplam tutar = Temel maaş + Bonus + Prim (CHECK constraint ile garanti)
   - Maaş geçmişi immutable (değiştirilemez)
   - Para birimi bazlı maaş yönetimi

#### 3. İzin Yönetimi

1. **İzin Tipleri**:
   - **annual_leave**: Yıllık izin
   - **sick_leave**: Hastalık izni
   - **maternity_leave**: Doğum izni
   - **paternity_leave**: Babalık izni
   - **unpaid_leave**: Ücretsiz izin
   - **emergency_leave**: Acil izin

2. **İzin Talebi Süreci**:
   - Çalışan izin talebi oluşturur
   - Durum: **pending** (beklemede)
   - Onaylayıcı (approver) izni onaylar/reddeder
   - Durum: **approved** (onaylandı) veya **rejected** (reddedildi)

3. **İzin Süresi Hesaplama**:
   - Başlangıç ve bitiş tarihleri arasındaki gün sayısı
   - GENERATED ALWAYS AS (end_date - start_date + 1) STORED
   - Otomatik hesaplanır, değiştirilemez

4. **Red Sebepleri**:
   - Reddedilen izinler için gerekçe kaydedilir
   - Şeffaflık ve denetim için önemli

#### 4. Eğitim Yönetimi

1. **Eğitim Seviyeleri**:
   - **beginner**: Başlangıç seviyesi
   - **intermediate**: Orta seviye
   - **advanced**: İleri seviye
   - **expert**: Uzman seviyesi

2. **Eğitim Tipleri**:
   - **safety_training**: Güvenlik eğitimi
   - **technical_training**: Teknik eğitim
   - **soft_skills**: Yumuşak beceriler
   - **certification**: Sertifikasyon

3. **Sertifikasyon**:
   - Eğitim tamamlandığında sertifika verilebilir
   - Sertifika numarası ve dosya referansı kaydedilir
   - Sertifikalı eğitimler için `is_certified = true`

4. **Yeterlilik Kriterleri**:
   - Her eğitim için yeterlilik kriterleri tanımlanır
   - Metin formatında detaylı kriterler

#### 5. Performans Ödülleri

1. **Ödül Tipleri**:
   - **monetary**: Para ödülü
   - **recognition**: Takdir ödülü
   - **promotion**: Terfi
   - **gift**: Hediye

2. **Performans Dönemleri**:
   - Ödül hangi performans dönemi için verildiği kaydedilir
   - Dönem başlangıç ve bitiş tarihleri
   - Yıllık, çeyreklik performans değerlendirmeleri

3. **Ödül Durumları**:
   - **pending**: Beklemede
   - **approved**: Onaylandı
   - **awarded**: Verildi
   - **cancelled**: İptal edildi

4. **Ödül Tutarı**:
   - Para ödülleri için tutar belirtilir
   - Para birimi bilgisi (currency_id) gelecekte eklenebilir
   - Ödül açıklaması detaylı bilgi içerir

## Tablo İlişkileri

### Ana İlişkiler

```
hr_kpi
  ├── employee (employee_id) - CASCADE
  └── employee (calculated_by) - SET NULL

employee_salary
  ├── employee (employee_id) - RESTRICT
  └── currency_enum (currency_id) - RESTRICT

employee_leave_request
  ├── employee (employee_id) - RESTRICT
  └── employee (approver_id) - SET NULL

employee_training
  └── employee (employee_id) - RESTRICT

employee_performance_reward
  ├── employee (employee_id) - RESTRICT
  └── employee (awarded_by) - SET NULL
```

### Foreign Key Stratejileri

- **RESTRICT**: Çalışan bilgileri (employee) silinemez
- **CASCADE**: Çalışan silinirse KPI'ları silinir
- **SET NULL**: Onaylayan/ödül veren çalışan silinirse referanslar NULL olur

## Backend Implementasyonu

### Oluşturulan Modüller

Her tablo için ayrı bir NestJS modülü oluşturulmuştur:

1. **HrKpiModule** - `src/hr/hr-kpi/hr-kpi.module.ts`
   - KPI yönetimi
   - Çalışan bazlı KPI sorguları
   - Dönem bazlı filtreleme

2. **EmployeeSalaryModule** - `src/hr/employee-salary/employee-salary.module.ts`
   - Maaş yönetimi
   - Çalışan bazlı maaş sorguları
   - Dönem ve durum bazlı filtreleme

3. **EmployeeLeaveRequestModule** - `src/hr/employee-leave-request/employee-leave-request.module.ts`
   - İzin talebi yönetimi
   - Onay süreçleri
   - Tarih bazlı filtreleme

4. **EmployeeTrainingModule** - `src/hr/employee-training/employee-training.module.ts`
   - Eğitim kayıt yönetimi
   - Sertifikasyon takibi
   - Eğitim seviyesi ve tipi bazlı filtreleme

5. **EmployeePerformanceRewardModule** - `src/hr/employee-performance-reward/employee-performance-reward.module.ts`
   - Performans ödülü yönetimi
   - Ödül durumu takibi
   - Performans dönemi bazlı filtreleme

### Mimari Yapı

Her modül aşağıdaki katmanları içerir:

#### 1. Repository Katmanı

- **Interface**: Entity tipi ve repository metodları
- **Implementation**: Raw SQL sorguları
- Parameterized queries ile güvenlik
- Transaction desteği (write işlemleri için)
- Soft delete desteği

#### 2. Service Katmanı

- Business logic ve validasyon
- Entity'den DTO'ya mapping
- Decimal/Number dönüşümleri
- Exception handling
- İş kuralı kontrolleri (toplam tutar validasyonu, tarih kontrolleri vb.)

#### 3. Controller Katmanı

- HTTP endpoint'leri
- RESTful API tasarımı
- Validation pipe'ları
- Query parameter desteği

#### 4. DTO Katmanı

- Request/Response kontratları
- class-validator decorator'ları
- Decimal validasyonları (@Min)
- Date string validasyonları

### Tasarım Kararları

1. **KPI Yönetimi**: 
   - Dönem bazlı KPI takibi
   - KPI tipi bazlı filtreleme
   - Hesaplama tarihi otomatik kaydedilir
   - Soft delete desteği

2. **Maaş Yönetimi**: 
   - Toplam tutar = Temel maaş + Bonus + Prim (CHECK constraint)
   - Para birimi bazlı maaş yönetimi
   - Dönem bazlı maaş geçmişi
   - Soft delete desteği

3. **İzin Yönetimi**: 
   - İzin gün sayısı otomatik hesaplanır (GENERATED column)
   - Onay süreci yönetimi
   - Red sebepleri kaydedilir
   - Soft delete desteği

4. **Eğitim Yönetimi**: 
   - Sertifikasyon takibi
   - Sertifika numarası ve dosya referansı
   - Eğitim seviyesi ve tipi yönetimi
   - Soft delete desteği

5. **Performans Ödülleri**: 
   - Ödül tipi ve tutarı yönetimi
   - Performans dönemi bazlı takip
   - Ödül durumu takibi
   - Soft delete desteği

## API Genel Bakış

### HR KPI Endpoint'leri

- `GET /hr/kpis` - Tüm KPI'ları listele
- `GET /hr/kpis/employee/:employeeId` - Çalışana göre KPI'ları listele
- `GET /hr/kpis/employee/:employeeId/kpi-type/:kpiType` - Çalışan ve KPI tipine göre KPI'ları listele
- `GET /hr/kpis/kpi-type/:kpiType` - KPI tipine göre KPI'ları listele
- `GET /hr/kpis/period?startDate=2024-01-01&endDate=2024-12-31` - Dönem bazlı KPI'ları listele
- `GET /hr/kpis/:id` - ID ile KPI bul
- `POST /hr/kpis` - Yeni KPI oluştur
- `PUT /hr/kpis/:id` - KPI güncelle

### Employee Salary Endpoint'leri

- `GET /hr/salaries` - Tüm maaşları listele
- `GET /hr/salaries/employee/:employeeId` - Çalışana göre maaşları listele
- `GET /hr/salaries/employee/:employeeId/date-range?startDate=2024-01-01&endDate=2024-12-31` - Çalışan ve tarih aralığına göre maaşları listele
- `GET /hr/salaries/status/:status` - Duruma göre maaşları listele
- `GET /hr/salaries/period?startDate=2024-01-01&endDate=2024-12-31` - Dönem bazlı maaşları listele
- `GET /hr/salaries/:id` - ID ile maaş bul
- `POST /hr/salaries` - Yeni maaş kaydı oluştur
- `PUT /hr/salaries/:id` - Maaş kaydı güncelle

### Employee Leave Request Endpoint'leri

- `GET /hr/leave-requests` - Tüm izin taleplerini listele
- `GET /hr/leave-requests/employee/:employeeId` - Çalışana göre izin taleplerini listele
- `GET /hr/leave-requests/employee/:employeeId/status/:status` - Çalışan ve duruma göre izin taleplerini listele
- `GET /hr/leave-requests/status/:status` - Duruma göre izin taleplerini listele
- `GET /hr/leave-requests/leave-type/:leaveType` - İzin tipine göre izin taleplerini listele
- `GET /hr/leave-requests/date-range?startDate=2024-01-01&endDate=2024-12-31` - Tarih aralığına göre izin taleplerini listele
- `GET /hr/leave-requests/:id` - ID ile izin talebi bul
- `POST /hr/leave-requests` - Yeni izin talebi oluştur
- `PUT /hr/leave-requests/:id` - İzin talebi güncelle (onaylama/reddetme)

### Employee Training Endpoint'leri

- `GET /hr/trainings` - Tüm eğitim kayıtlarını listele
- `GET /hr/trainings/employee/:employeeId` - Çalışana göre eğitim kayıtlarını listele
- `GET /hr/trainings/employee/:employeeId/certified?certified=true` - Çalışan ve sertifikasyon durumuna göre eğitim kayıtlarını listele
- `GET /hr/trainings/training-level/:trainingLevel` - Eğitim seviyesine göre eğitim kayıtlarını listele
- `GET /hr/trainings/training-type/:trainingType` - Eğitim tipine göre eğitim kayıtlarını listele
- `GET /hr/trainings/certified?certified=true` - Sertifikasyon durumuna göre eğitim kayıtlarını listele
- `GET /hr/trainings/:id` - ID ile eğitim kaydı bul
- `POST /hr/trainings` - Yeni eğitim kaydı oluştur
- `PUT /hr/trainings/:id` - Eğitim kaydı güncelle

### Employee Performance Reward Endpoint'leri

- `GET /hr/performance-rewards` - Tüm performans ödüllerini listele
- `GET /hr/performance-rewards/employee/:employeeId` - Çalışana göre performans ödüllerini listele
- `GET /hr/performance-rewards/employee/:employeeId/status/:status` - Çalışan ve duruma göre performans ödüllerini listele
- `GET /hr/performance-rewards/reward-type/:rewardType` - Ödül tipine göre performans ödüllerini listele
- `GET /hr/performance-rewards/status/:status` - Duruma göre performans ödüllerini listele
- `GET /hr/performance-rewards/performance-period?startDate=2024-01-01&endDate=2024-12-31` - Performans dönemine göre performans ödüllerini listele
- `GET /hr/performance-rewards/:id` - ID ile performans ödülü bul
- `POST /hr/performance-rewards` - Yeni performans ödülü oluştur
- `PUT /hr/performance-rewards/:id` - Performans ödülü güncelle

### Örnek Response'lar

**HR KPI Response:**
```json
{
  "id": 1,
  "employeeId": 5,
  "kpiType": "delivery_success_rate",
  "kpiValue": 95.75,
  "kpiPeriod": "Q1-2024",
  "periodStartDate": "2024-01-01T00:00:00.000Z",
  "periodEndDate": "2024-03-31T23:59:59.000Z",
  "calculationDate": "2024-04-01T00:00:00.000Z",
  "calculatedBy": 10,
  "description": "Q1 2024 delivery success rate",
  "createdAt": "2024-04-01T00:00:00.000Z",
  "updatedAt": "2024-04-01T00:00:00.000Z",
  "deletedAt": null
}
```

**Employee Salary Response:**
```json
{
  "id": 1,
  "employeeId": 5,
  "baseSalary": 15000.00,
  "bonusAmount": 2000.00,
  "primAmount": 1000.00,
  "totalAmount": 18000.00,
  "currencyId": 1,
  "periodStartDate": "2024-01-01T00:00:00.000Z",
  "periodEndDate": "2024-12-31T23:59:59.000Z",
  "paymentDate": "2024-01-05T00:00:00.000Z",
  "status": "paid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-05T00:00:00.000Z",
  "deletedAt": null
}
```

**Employee Leave Request Response:**
```json
{
  "id": 1,
  "employeeId": 5,
  "leaveType": "annual_leave",
  "startDate": "2024-07-01T00:00:00.000Z",
  "endDate": "2024-07-10T00:00:00.000Z",
  "totalDays": 10,
  "reason": "Summer vacation",
  "status": "approved",
  "requestedDate": "2024-06-15T00:00:00.000Z",
  "approvedDate": "2024-06-16T00:00:00.000Z",
  "approverId": 10,
  "rejectionReason": null,
  "createdAt": "2024-06-15T00:00:00.000Z",
  "updatedAt": "2024-06-16T00:00:00.000Z",
  "deletedAt": null
}
```

**Employee Training Response:**
```json
{
  "id": 1,
  "employeeId": 5,
  "trainingLevel": "advanced",
  "competencyCriteria": "Must complete all modules with 80% success rate",
  "trainingType": "safety_training",
  "completionDate": "2024-05-15T00:00:00.000Z",
  "certificateNumber": "CERT-2024-001",
  "certificateFileReference": "files/certificates/cert-2024-001.pdf",
  "isCertified": true,
  "createdAt": "2024-05-01T00:00:00.000Z",
  "updatedAt": "2024-05-15T00:00:00.000Z",
  "deletedAt": null
}
```

**Employee Performance Reward Response:**
```json
{
  "id": 1,
  "employeeId": 5,
  "rewardType": "monetary",
  "rewardAmount": 5000.00,
  "rewardDescription": "Outstanding performance in Q1 2024",
  "performancePeriodStart": "2024-01-01T00:00:00.000Z",
  "performancePeriodEnd": "2024-03-31T23:59:59.000Z",
  "awardedDate": "2024-04-15T00:00:00.000Z",
  "awardedBy": 10,
  "status": "awarded",
  "createdAt": "2024-04-15T00:00:00.000Z",
  "updatedAt": "2024-04-15T00:00:00.000Z",
  "deletedAt": null
}
```

## İşlem Akışı

### KPI Hesaplama Akışı

1. **KPI Hesaplama**:
   - Belirli dönem için KPI değeri hesaplanır
   - KPI tipi ve dönem bilgileri kaydedilir
   - Hesaplama tarihi ve hesaplayan çalışan kaydedilir

2. **KPI Kullanımı**:
   - Performans değerlendirmeleri için kullanılır
   - Prim hesaplamalarına dahil edilir
   - Terfi ve kariyer planlaması için veri sağlar

### Maaş Yönetimi Akışı

1. **Maaş Kaydı Oluşturma**:
   - Çalışan için maaş kaydı oluşturulur
   - Temel maaş, bonus ve prim tutarları belirlenir
   - Toplam tutar otomatik hesaplanır (CHECK constraint ile doğrulanır)
   - Dönem başlangıç tarihi belirlenir

2. **Maaş Onay Süreci**:
   - Durum: **pending** (beklemede)
   - Onaylandıktan sonra: **approved**
   - Ödeme yapıldıktan sonra: **paid**
   - Ödeme tarihi kaydedilir

3. **Maaş Geçmişi**:
   - Her dönem için ayrı maaş kaydı
   - Geçmiş kayıtlar immutable (değiştirilemez)
   - Raporlama ve denetim için korunur

### İzin Yönetimi Akışı

1. **İzin Talebi Oluşturma**:
   - Çalışan izin talebi oluşturur
   - İzin tipi, başlangıç ve bitiş tarihleri belirlenir
   - İzin gün sayısı otomatik hesaplanır
   - Durum: **pending**

2. **İzin Onay Süreci**:
   - Onaylayıcı (approver) izni inceler
   - Onaylandığında: Durum **approved**, onay tarihi ve onaylayan kaydedilir
   - Reddedildiğinde: Durum **rejected**, red sebebi kaydedilir

3. **İzin Takibi**:
   - Onaylanmış izinler takip edilir
   - İzin geçmişi raporlama için kullanılır
   - İzin bakiyesi hesaplamaları için veri sağlar

### Eğitim Yönetimi Akışı

1. **Eğitim Kaydı Oluşturma**:
   - Çalışan için eğitim kaydı oluşturulur
   - Eğitim seviyesi, tipi ve yeterlilik kriterleri belirlenir
   - Başlangıçta `is_certified = false`

2. **Eğitim Tamamlama**:
   - Eğitim tamamlandığında tamamlanma tarihi kaydedilir
   - Sertifika verilecekse sertifika numarası ve dosya referansı eklenir
   - `is_certified = true` olarak güncellenir

3. **Sertifikasyon Takibi**:
   - Sertifikalı eğitimler sorgulanabilir
   - Sertifika geçerliliği kontrol edilebilir
   - Yetkinlik matrisi için veri sağlar

### Performans Ödülü Akışı

1. **Ödül Oluşturma**:
   - Çalışan için performans ödülü oluşturulur
   - Ödül tipi, tutarı ve açıklaması belirlenir
   - Performans dönemi kaydedilir
   - Durum: **pending**

2. **Ödül Onay Süreci**:
   - Ödül onaylandığında: Durum **approved**
   - Ödül verildiğinde: Durum **awarded**, veren çalışan kaydedilir
   - Ödül tarihi otomatik kaydedilir

3. **Ödül Takibi**:
   - Performans dönemi bazlı ödüller takip edilir
   - Ödül geçmişi raporlama için kullanılır
   - Performans analizi için veri sağlar

## İş Kuralları ve Validasyonlar

### KPI Kuralları

1. **Dönem Kuralı**:
   - Dönem bitiş tarihi, başlangıç tarihinden önce olamaz (CHECK constraint)
   - Dönem bazlı KPI takibi için önemli

2. **KPI Değeri**:
   - Sayısal değer (DECIMAL(10, 2))
   - Negatif değerler geçerli olabilir (gerileme göstergesi)

### Maaş Kuralları

1. **Toplam Tutar Kuralı**:
   - Toplam tutar = Temel maaş + Bonus + Prim
   - CHECK constraint ile zorunlu kontrol
   - Service katmanında tolerance ile doğrulama

2. **Dönem Kuralı**:
   - Dönem bitiş tarihi, başlangıç tarihinden önce olamaz
   - Dönem başlangıç tarihi zorunlu

3. **Immutable Geçmiş**:
   - Ödenmiş maaşlar değiştirilemez
   - Geçmiş kayıtlar korunur (soft delete)

### İzin Kuralları

1. **Tarih Kuralı**:
   - Bitiş tarihi, başlangıç tarihinden önce olamaz (CHECK constraint)
   - İzin gün sayısı otomatik hesaplanır

2. **Onay Süreci**:
   - Sadece pending durumundaki izinler onaylanabilir/reddedilebilir
   - Onaylama için approver ID zorunlu
   - Reddetme için red sebebi zorunlu

3. **İzin Durumları**:
   - **pending**: Beklemede
   - **approved**: Onaylandı
   - **rejected**: Reddedildi
   - **cancelled**: İptal edildi

### Eğitim Kuralları

1. **Sertifikasyon Kuralı**:
   - Sertifikalı eğitimler için sertifika numarası zorunlu
   - Sertifika numarası olmadan `is_certified = true` yapılamaz

2. **Tamamlanma Tarihi**:
   - Sertifikalı eğitimler için tamamlanma tarihi zorunlu değil
   - Ancak genellikle tamamlanma tarihi ile sertifika tarihi aynıdır

### Performans Ödülü Kuralları

1. **Performans Dönemi Kuralı**:
   - Performans dönemi bitiş tarihi, başlangıç tarihinden önce olamaz
   - CHECK constraint ile zorunlu kontrol

2. **Ödül Durumları**:
   - **pending**: Beklemede
   - **approved**: Onaylandı
   - **awarded**: Verildi
   - **cancelled**: İptal edildi

## SQL Kullanım Örnekleri

### Transaction İle Maaş Oluşturma

```typescript
// Service katmanında
await this.employeeSalaryRepository.create(
  employeeId,
  baseSalary,
  bonusAmount,
  primAmount,
  totalAmount,
  currencyId,
  periodStartDate,
  periodEndDate,
  paymentDate,
  status
);
// CHECK constraint otomatik olarak toplam tutarı doğrular
```

### İzin Onaylama

```typescript
// Service katmanında
await this.employeeLeaveRequestRepository.update(
  id,
  'approved',
  new Date(), // approved_date
  approverId,
  null // rejection_reason
);
```

### KPI Hesaplama

```typescript
// Service katmanında
await this.hrKpiRepository.create(
  employeeId,
  kpiType,
  kpiValue,
  kpiPeriod,
  periodStartDate,
  periodEndDate,
  calculatedBy,
  description
);
```

## Veri Gizliliği ve Güvenlik

### Hassas Veriler

1. **Maaş Bilgileri**:
   - Maaş, bonus ve prim tutarları hassas verilerdir
   - Sadece yetkili çalışanlar erişebilir
   - Gelecekte RBAC ile korunacak

2. **KPI Verileri**:
   - Performans metrikleri hassas verilerdir
   - Çalışan kendi KPI'larını görebilir
   - Yöneticiler ekip KPI'larını görebilir

3. **İzin Talepleri**:
   - İzin talepleri çalışan mahremiyeti içerir
   - Red sebepleri hassas olabilir
   - Yetkili personel erişebilir

### Audit Hazırlığı

1. **Soft Delete**:
   - Tüm tablolarda soft delete desteği
   - Geçmiş veriler korunur
   - Denetim için hazır

2. **Timestamp Alanları**:
   - created_at: Oluşturma zamanı
   - updated_at: Güncelleme zamanı
   - deleted_at: Silme zamanı (soft delete)

3. **Onaylayan/Ödül Veren**:
   - Onaylayan çalışan kaydedilir
   - Ödül veren çalışan kaydedilir
   - Denetim izi için önemli

## Proje Akışı

### Bu Migration'ın Rolü

Bu migration, çalışan yönetiminin temelini oluşturur:

1. **Performans Yönetimi**: KPI takibi ve performans ölçümü
2. **Maaş Yönetimi**: Maaş, bonus ve prim yönetimi
3. **İzin Yönetimi**: İzin talepleri ve onay süreçleri
4. **Eğitim Yönetimi**: Eğitim kayıtları ve sertifikasyon
5. **Ödül Yönetimi**: Performans bazlı ödül ve takdir

### Migration 001-008 ile İlişkisi

- **Migration 001**: Enum tabloları (currency)
- **Migration 003**: Actor sistemi (employee - HR verilerinin sahibi)
- **Migration 004**: RBAC sistemi (gelecekte HR verilerine erişim kontrolü)

### Gelecek Migration'larla İlişkisi

- **Migration 016**: Authentication tabloları (HR verilerine erişim kontrolü)
- **Migration 020**: Filo yönetimi (çalışan-filo ilişkisi)
- **Migration 024**: Analytics ve raporlama (HR metrikleri)
- **Migration 028**: Kalite ve uyumluluk (eğitim uyumluluğu)

### Veri Bütünlüğü

- **Foreign Key Constraints**: 
  - RESTRICT: Çalışan bilgileri (employee) silinemez
  - CASCADE: Çalışan silinirse KPI'ları silinir
  - SET NULL: Onaylayan/ödül veren çalışan silinirse referanslar NULL olur
- **Check Constraints**: 
  - employee_salary: total_amount = base_salary + bonus_amount + prim_amount
  - employee_salary: period_end_date >= period_start_date
  - hr_kpi: period_end_date >= period_start_date
  - employee_leave_request: end_date >= start_date
  - employee_performance_reward: performance_period_end >= performance_period_start
- **Generated Columns**: 
  - employee_leave_request: total_days (GENERATED ALWAYS AS)
- **Index'ler**: Sık kullanılan sorgular için optimize edilmiş index'ler

### Performans Optimizasyonları

- **Partial Index'ler**: `deleted_at IS NULL` koşulu ile sadece aktif kayıtlar index'lenir
- **Foreign Key Index'leri**: Tüm foreign key'ler otomatik olarak index'lenir
- **Time-based Index'ler**: Dönem tarihleri, izin tarihleri için index'ler
- **Composite Index'ler**: Çalışan-durum, çalışan-KPI tipi için index'ler

## Actor ve RBAC Entegrasyonu

### Employee Entegrasyonu

- Tüm HR verileri employee tablosuna bağlıdır
- Çalışan silinirse KPI'ları otomatik silinir (CASCADE)
- Çalışan bilgileri RESTRICT ile korunur
- HR profili sorguları employee bilgileri ile birleştirilebilir

### RBAC Entegrasyonu (Gelecek)

1. **Rol Tabanlı Erişim**:
   - **hr_admin**: Tüm HR verilerine erişim
   - **hr_manager**: Ekip HR verilerine erişim
   - **employee**: Kendi HR verilerine erişim
   - **manager**: Ekibi HR verilerine erişim

2. **İzin Yönetimi**:
   - İzin onaylama yetkisi
   - Maaş görüntüleme yetkisi
   - KPI görüntüleme yetkisi

## Gelecek Extensions

### Payroll Entegrasyonu

1. **Otomatik Maaş Hesaplama**:
   - KPI bazlı prim hesaplama
   - Otomatik maaş ödeme
   - Vergi hesaplamaları

2. **Ödeme Entegrasyonu**:
   - Banka havalesi entegrasyonu
   - Ödeme durumu takibi
   - Ödeme geçmişi

### Performans Değerlendirme Sistemi

1. **360 Derece Değerlendirme**:
   - Ekip değerlendirmeleri
   - Müşteri geri bildirimleri
   - Self-assessment

2. **Hedef Yönetimi**:
   - Yıllık hedefler
   - Çeyreklik hedefler
   - Hedef takibi

### Eğitim Planlama

1. **Eğitim İhtiyaç Analizi**:
   - KPI bazlı eğitim ihtiyacı belirleme
   - Eğitim planları
   - Eğitim takvimi

2. **Sertifika Yönetimi**:
   - Sertifika geçerlilik takibi
   - Sertifika yenileme hatırlatıcıları
   - Sertifika matrisi

### Raporlama ve Analitik

1. **HR Dashboard**:
   - Çalışan performans özeti
   - Eğitim durumu
   - İzin kullanımı
   - Maaş dağılımı

2. **Trend Analizi**:
   - KPI trendleri
   - Eğitim tamamlanma oranları
   - Performans karşılaştırmaları

## Notlar

- Tüm para tutarları DECIMAL tipinde, float kullanılmaz
- Maaş toplam tutarı CHECK constraint ile garanti edilir
- İzin gün sayısı GENERATED column ile otomatik hesaplanır
- Soft delete ile geçmiş veriler korunur
- HR verileri hassas olduğu için gelecekte RBAC ile korunacak
- Audit hazırlığı: Tüm değişiklikler timestamp ile takip edilir
- Çalışan bilgileri RESTRICT ile korunur (sadece KPI'lar CASCADE)

