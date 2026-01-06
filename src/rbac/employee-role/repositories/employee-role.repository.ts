import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeeRoleEntity,
  IEmployeeRoleRepository,
} from './employee-role.repository.interface';

@Injectable()
export class EmployeeRoleRepository implements IEmployeeRoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeeRoleEntity[]> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE deleted_at IS NULL
      ORDER BY assigned_at DESC
    `;
    return await this.databaseService.query<EmployeeRoleEntity>(query);
  }

  async findById(id: number): Promise<EmployeeRoleEntity | null> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeRoleEntity>(query, [
      id,
    ]);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeRoleEntity[]> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY assigned_at DESC
    `;
    return await this.databaseService.query<EmployeeRoleEntity>(query, [
      employeeId,
    ]);
  }

  async findByRoleId(roleId: number): Promise<EmployeeRoleEntity[]> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE role_id = $1 AND deleted_at IS NULL
      ORDER BY assigned_at DESC
    `;
    return await this.databaseService.query<EmployeeRoleEntity>(query, [
      roleId,
    ]);
  }

  async findByEmployeeIdAndActive(
    employeeId: number,
  ): Promise<EmployeeRoleEntity[]> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE employee_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY assigned_at DESC
    `;
    return await this.databaseService.query<EmployeeRoleEntity>(query, [
      employeeId,
    ]);
  }

  async findByEmployeeIdAndRoleId(
    employeeId: number,
    roleId: number,
  ): Promise<EmployeeRoleEntity | null> {
    const query = `
      SELECT id, employee_id, role_id, assigned_at, assigned_by, is_active, deleted_at
      FROM employee_role
      WHERE employee_id = $1 AND role_id = $2 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeRoleEntity>(query, [
      employeeId,
      roleId,
    ]);
  }
}

