export interface EmployeeLeaveRequestEntity {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  total_days: number;
  reason?: string;
  status: string;
  requested_date: Date;
  approved_date?: Date;
  approver_id?: number;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IEmployeeLeaveRequestRepository {
  findAll(): Promise<EmployeeLeaveRequestEntity[]>;
  findById(id: number): Promise<EmployeeLeaveRequestEntity | null>;
  findByEmployeeId(employeeId: number): Promise<EmployeeLeaveRequestEntity[]>;
  findByStatus(status: string): Promise<EmployeeLeaveRequestEntity[]>;
  findByLeaveType(leaveType: string): Promise<EmployeeLeaveRequestEntity[]>;
  findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeeLeaveRequestEntity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<EmployeeLeaveRequestEntity[]>;
  create(
    employeeId: number,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    reason: string | null,
    status: string,
  ): Promise<EmployeeLeaveRequestEntity>;
  update(
    id: number,
    status: string,
    approvedDate: Date | null,
    approverId: number | null,
    rejectionReason: string | null,
  ): Promise<EmployeeLeaveRequestEntity>;
  softDelete(id: number): Promise<void>;
}

