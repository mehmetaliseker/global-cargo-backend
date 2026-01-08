import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  EmployeePerformanceRewardEntity,
  IEmployeePerformanceRewardRepository,
} from './employee-performance-reward.repository.interface';

@Injectable()
export class EmployeePerformanceRewardRepository
  implements IEmployeePerformanceRewardRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
    );
  }

  async findById(id: number): Promise<EmployeePerformanceRewardEntity | null> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<EmployeePerformanceRewardEntity>(
      query,
      [id],
    );
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
      [employeeId],
    );
  }

  async findByRewardType(
    rewardType: string,
  ): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE reward_type = $1 AND deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
      [rewardType],
    );
  }

  async findByStatus(status: string): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
      [status],
    );
  }

  async findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE employee_id = $1 AND status = $2 AND deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
      [employeeId, status],
    );
  }

  async findByPerformancePeriod(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<EmployeePerformanceRewardEntity[]> {
    const query = `
      SELECT id, employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_date,
             awarded_by, status, created_at, updated_at, deleted_at
      FROM employee_performance_reward
      WHERE performance_period_start >= $1 
        AND (performance_period_end IS NULL OR performance_period_end <= $2)
        AND deleted_at IS NULL
      ORDER BY awarded_date DESC
    `;
    return await this.databaseService.query<EmployeePerformanceRewardEntity>(
      query,
      [periodStart, periodEnd],
    );
  }

  async create(
    employeeId: number,
    rewardType: string,
    rewardAmount: number | null,
    rewardDescription: string | null,
    performancePeriodStart: Date | null,
    performancePeriodEnd: Date | null,
    awardedBy: number | null,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity> {
    return await this.databaseService.transaction(
      async (
        client: PoolClient,
      ): Promise<EmployeePerformanceRewardEntity> => {
        const insertQuery = `
          INSERT INTO employee_performance_reward 
            (employee_id, reward_type, reward_amount, reward_description,
             performance_period_start, performance_period_end, awarded_by, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, employee_id, reward_type, reward_amount, reward_description,
                    performance_period_start, performance_period_end, awarded_date,
                    awarded_by, status, created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeePerformanceRewardEntity>(
          insertQuery,
          [
            employeeId,
            rewardType,
            rewardAmount,
            rewardDescription,
            performancePeriodStart,
            performancePeriodEnd,
            awardedBy,
            status,
          ],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    rewardType: string,
    rewardAmount: number | null,
    rewardDescription: string | null,
    performancePeriodStart: Date | null,
    performancePeriodEnd: Date | null,
    status: string,
  ): Promise<EmployeePerformanceRewardEntity> {
    return await this.databaseService.transaction(
      async (
        client: PoolClient,
      ): Promise<EmployeePerformanceRewardEntity> => {
        const updateQuery = `
          UPDATE employee_performance_reward
          SET reward_type = $2,
              reward_amount = $3,
              reward_description = $4,
              performance_period_start = $5,
              performance_period_end = $6,
              status = $7,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, reward_type, reward_amount, reward_description,
                    performance_period_start, performance_period_end, awarded_date,
                    awarded_by, status, created_at, updated_at, deleted_at
        `;
        const result = await client.query<EmployeePerformanceRewardEntity>(
          updateQuery,
          [
            id,
            rewardType,
            rewardAmount,
            rewardDescription,
            performancePeriodStart,
            performancePeriodEnd,
            status,
          ],
        );
        if (result.rows.length === 0) {
          throw new Error(
            `Employee performance reward with id ${id} not found`,
          );
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE employee_performance_reward
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(
            `Employee performance reward with id ${id} not found`,
          );
        }
      },
    );
  }
}

