import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeeSalaryEntity,
  IEmployeeSalaryRepository,
} from './employee-salary.repository.interface';

@Injectable()
export class EmployeeSalaryRepository
  implements IEmployeeSalaryRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeeSalaryEntity[]> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE deleted_at IS NULL
      ORDER BY period_start_date DESC
    `;
    return await this.databaseService.query<EmployeeSalaryEntity>(query);
  }

  async findById(id: number): Promise<EmployeeSalaryEntity | null> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeeSalaryEntity>(query, [
      id,
    ]);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeSalaryEntity[]> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY period_start_date DESC
    `;
    return await this.databaseService.query<EmployeeSalaryEntity>(query, [
      employeeId,
    ]);
  }

  async findByEmployeeIdAndDateRange(
    employeeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeSalaryEntity[]> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE employee_id = $1 
        AND period_start_date >= $2 
        AND (period_end_date IS NULL OR period_end_date <= $3)
        AND deleted_at IS NULL
      ORDER BY period_start_date DESC
    `;
    return await this.databaseService.query<EmployeeSalaryEntity>(query, [
      employeeId,
      startDate,
      endDate,
    ]);
  }

  async findByStatus(status: string): Promise<EmployeeSalaryEntity[]> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY period_start_date DESC
    `;
    return await this.databaseService.query<EmployeeSalaryEntity>(query, [
      status,
    ]);
  }

  async findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<EmployeeSalaryEntity[]> {
    const query = `
      SELECT id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status,
             created_at, updated_at, deleted_at
      FROM employee_salary
      WHERE period_start_date >= $1 
        AND (period_end_date IS NULL OR period_end_date <= $2)
        AND deleted_at IS NULL
      ORDER BY period_start_date DESC
    `;
    return await this.databaseService.query<EmployeeSalaryEntity>(query, [
      periodStartDate,
      periodEndDate,
    ]);
  }

  async create(
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
  ): Promise<EmployeeSalaryEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeSalaryEntity> => {
        const insertQuery = `
          INSERT INTO employee_salary 
            (employee_id, base_salary, bonus_amount, prim_amount, total_amount,
             currency_id, period_start_date, period_end_date, payment_date, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
                    currency_id, period_start_date, period_end_date, payment_date, status,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeSalaryEntity>(insertQuery, [
          employeeId,
          baseSalary,
          bonusAmount,
          primAmount,
          totalAmount,
          currencyId,
          periodStartDate,
          periodEndDate,
          paymentDate,
          status,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    baseSalary: number,
    bonusAmount: number,
    primAmount: number,
    totalAmount: number,
    paymentDate: Date | null,
    status: string,
  ): Promise<EmployeeSalaryEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<EmployeeSalaryEntity> => {
        const updateQuery = `
          UPDATE employee_salary
          SET base_salary = $2,
              bonus_amount = $3,
              prim_amount = $4,
              total_amount = $5,
              payment_date = $6,
              status = $7,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, base_salary, bonus_amount, prim_amount, total_amount,
                    currency_id, period_start_date, period_end_date, payment_date, status,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeeSalaryEntity>(updateQuery, [
          id,
          baseSalary,
          bonusAmount,
          primAmount,
          totalAmount,
          paymentDate,
          status,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Employee salary with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE employee_salary
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Employee salary with id ${id} not found`);
        }
      },
    );
  }
}

