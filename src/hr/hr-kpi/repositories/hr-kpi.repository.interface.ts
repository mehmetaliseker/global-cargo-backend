export interface HrKpiEntity {
  id: number;
  employee_id: number;
  kpi_type: string;
  kpi_value: number;
  kpi_period?: string;
  period_start_date?: Date;
  period_end_date?: Date;
  calculation_date: Date;
  calculated_by?: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IHrKpiRepository {
  findAll(): Promise<HrKpiEntity[]>;
  findById(id: number): Promise<HrKpiEntity | null>;
  findByEmployeeId(employeeId: number): Promise<HrKpiEntity[]>;
  findByKpiType(kpiType: string): Promise<HrKpiEntity[]>;
  findByEmployeeIdAndKpiType(
    employeeId: number,
    kpiType: string,
  ): Promise<HrKpiEntity[]>;
  findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<HrKpiEntity[]>;
  create(
    employeeId: number,
    kpiType: string,
    kpiValue: number,
    kpiPeriod: string | null,
    periodStartDate: Date | null,
    periodEndDate: Date | null,
    calculatedBy: number | null,
    description: string | null,
  ): Promise<HrKpiEntity>;
  update(
    id: number,
    kpiValue: number,
    kpiPeriod: string | null,
    periodStartDate: Date | null,
    periodEndDate: Date | null,
    description: string | null,
  ): Promise<HrKpiEntity>;
  softDelete(id: number): Promise<void>;
}

