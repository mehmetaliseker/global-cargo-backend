export interface EmployeeRoleEntity {
  id: number;
  employee_id: number;
  role_id: number;
  assigned_at: Date;
  assigned_by?: number;
  is_active: boolean;
  deleted_at?: Date;
}

export interface IEmployeeRoleRepository {
  findAll(): Promise<EmployeeRoleEntity[]>;
  findById(id: number): Promise<EmployeeRoleEntity | null>;
  findByEmployeeId(employeeId: number): Promise<EmployeeRoleEntity[]>;
  findByRoleId(roleId: number): Promise<EmployeeRoleEntity[]>;
  findByEmployeeIdAndActive(employeeId: number): Promise<EmployeeRoleEntity[]>;
  findByEmployeeIdAndRoleId(
    employeeId: number,
    roleId: number,
  ): Promise<EmployeeRoleEntity | null>;
}

