export interface EmployeePerformanceRewardEntity {
  id: number;
  employee_id: number;
  reward_type: string;
  reward_amount?: number;
  reward_description?: string;
  performance_period_start?: Date;
  performance_period_end?: Date;
  awarded_date: Date;
  awarded_by?: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IEmployeePerformanceRewardRepository {
  findAll(): Promise<EmployeePerformanceRewardEntity[]>;
  findById(id: number): Promise<EmployeePerformanceRewardEntity | null>;
  findByEmployeeId(employeeId: number): Promise<EmployeePerformanceRewardEntity[]>;
  findByRewardType(rewardType: string): Promise<EmployeePerformanceRewardEntity[]>;
  findByStatus(status: string): Promise<EmployeePerformanceRewardEntity[]>;
  findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity[]>;
  findByPerformancePeriod(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<EmployeePerformanceRewardEntity[]>;
  create(
    employeeId: number,
    rewardType: string,
    rewardAmount: number | null,
    rewardDescription: string | null,
    performancePeriodStart: Date | null,
    performancePeriodEnd: Date | null,
    awardedBy: number | null,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity>;
  update(
    id: number,
    rewardType: string,
    rewardAmount: number | null,
    rewardDescription: string | null,
    performancePeriodStart: Date | null,
    performancePeriodEnd: Date | null,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity>;
  softDelete(id: number): Promise<void>;
}

