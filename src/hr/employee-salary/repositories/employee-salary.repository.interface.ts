export interface EmployeeSalaryEntity {
  id: number;
  employee_id: number;
  base_salary: number;
  bonus_amount: number;
  prim_amount: number;
  total_amount: number;
  currency_id: number;
  period_start_date: Date;
  period_end_date?: Date;
  payment_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IEmployeeSalaryRepository {
  findAll(): Promise<EmployeeSalaryEntity[]>;
  findById(id: number): Promise<EmployeeSalaryEntity | null>;
  findByEmployeeId(employeeId: number): Promise<EmployeeSalaryEntity[]>;
  findByEmployeeIdAndDateRange(
    employeeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeSalaryEntity[]>;
  findByStatus(status: string): Promise<EmployeeSalaryEntity[]>;
  findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<EmployeeSalaryEntity[]>;
  create(
    employeeId: number,
    baseSalary: number,
    bonusAmount: number,
    primAmount: number,
    totalAmount: number,
    currencyId: number,
    periodStartDate: Date,
    periodEndDate: Date | null,
    paymentDate: Date | null,
    status: string,
  ): Promise<EmployeeSalaryEntity>;
  update(
    id: number,
    baseSalary: number,
    bonusAmount: number,
    primAmount: number,
    totalAmount: number,
    paymentDate: Date | null,
    status: string,
  ): Promise<EmployeeSalaryEntity>;
  softDelete(id: number): Promise<void>;
}

