import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeeLeaveRequestEntity,
  IEmployeeLeaveRequestRepository,
} from './employee-leave-request.repository.interface';

@Injectable()
export class EmployeeLeaveRequestRepository
  implements IEmployeeLeaveRequestRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(query);
  }

  async findById(id: number): Promise<EmployeeLeaveRequestEntity | null> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeLeaveRequestEntity>(
      query,
      [id],
    );
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(
      query,
      [employeeId],
    );
  }

  async findByStatus(status: string): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(
      query,
      [status],
    );
  }

  async findByLeaveType(leaveType: string): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE leave_type = $1 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(
      query,
      [leaveType],
    );
  }

  async findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE employee_id = $1 AND status = $2 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(
      query,
      [employeeId, status],
    );
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeLeaveRequestEntity[]> {
    const query = `
      SELECT id, employee_id, leave_type, start_date, end_date, total_days, reason,
             status, requested_date, approved_date, approver_id, rejection_reason,
             created_at, updated_at, deleted_at
      FROM employee_leave_request
      WHERE (start_date <= $2 AND end_date >= $1) AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<EmployeeLeaveRequestEntity>(
      query,
      [startDate, endDate],
    );
  }

  async create(
    employeeId: number,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    reason: string | null,
    status: string,
  ): Promise<EmployeeLeaveRequestEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeLeaveRequestEntity> => {
        const insertQuery = `
          INSERT INTO employee_leave_request 
            (employee_id, leave_type, start_date, end_date, reason, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, employee_id, leave_type, start_date, end_date, total_days, reason,
                    status, requested_date, approved_date, approver_id, rejection_reason,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeLeaveRequestEntity>(
          insertQuery,
          [employeeId, leaveType, startDate, endDate, reason, status],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    status: string,
    approvedDate: Date | null,
    approverId: number | null,
    rejectionReason: string | null,
  ): Promise<EmployeeLeaveRequestEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeLeaveRequestEntity> => {
        const updateQuery = `
          UPDATE employee_leave_request
          SET status = $2,
              approved_date = $3,
              approver_id = $4,
              rejection_reason = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, leave_type, start_date, end_date, total_days, reason,
                    status, requested_date, approved_date, approver_id, rejection_reason,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeLeaveRequestEntity>(
          updateQuery,
          [id, status, approvedDate, approverId, rejectionReason],
        );
        if (result.rows.length === 0) {
          throw new Error(`Employee leave request with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE employee_leave_request
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Employee leave request with id ${id} not found`);
        }
      },
    );
  }
}

