import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CourierRoutePlanEntity,
  ICourierRoutePlanRepository,
} from './courier-route-plan.repository.interface';

@Injectable()
export class CourierRoutePlanRepository
  implements ICourierRoutePlanRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE deleted_at IS NULL
      ORDER BY plan_date DESC, created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query);
  }

  async findById(id: number): Promise<CourierRoutePlanEntity | null> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CourierRoutePlanEntity>(query, [
      id,
    ]);
  }

  async findByEmployeeId(employeeId: number): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY plan_date DESC, created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query, [
      employeeId,
    ]);
  }

  async findByRouteId(routeId: number): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE route_id = $1 AND deleted_at IS NULL
      ORDER BY plan_date DESC, created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query, [
      routeId,
    ]);
  }

  async findByPlanDate(planDate: Date): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE plan_date = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query, [
      planDate,
    ]);
  }

  async findByStatus(status: string): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY plan_date DESC, created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query, [
      status,
    ]);
  }

  async findByEmployeeIdAndDate(
    employeeId: number,
    planDate: Date,
  ): Promise<CourierRoutePlanEntity[]> {
    const query = `
      SELECT id, employee_id, route_id, plan_date, status, start_time, end_time,
             total_cargo_count, created_at, updated_at, deleted_at
      FROM courier_route_plan
      WHERE employee_id = $1 AND plan_date = $2 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CourierRoutePlanEntity>(query, [
      employeeId,
      planDate,
    ]);
  }

  async create(
    employeeId: number,
    routeId: number,
    planDate: Date,
    status: string,
    startTime: Date | null,
    endTime: Date | null,
    totalCargoCount: number,
  ): Promise<CourierRoutePlanEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CourierRoutePlanEntity> => {
        const insertQuery = `
          INSERT INTO courier_route_plan 
            (employee_id, route_id, plan_date, status, start_time, end_time, total_cargo_count)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, employee_id, route_id, plan_date, status, start_time, end_time,
                    total_cargo_count, created_at, updated_at, deleted_at
        `;
        const result = await client.query<CourierRoutePlanEntity>(insertQuery, [
          employeeId,
          routeId,
          planDate,
          status,
          startTime,
          endTime,
          totalCargoCount,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    status: string,
    startTime: Date | null,
    endTime: Date | null,
    totalCargoCount: number,
  ): Promise<CourierRoutePlanEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CourierRoutePlanEntity> => {
        const updateQuery = `
          UPDATE courier_route_plan
          SET status = $2,
              start_time = $3,
              end_time = $4,
              total_cargo_count = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, route_id, plan_date, status, start_time, end_time,
                    total_cargo_count, created_at, updated_at, deleted_at
        `;
        const result = await client.query<CourierRoutePlanEntity>(updateQuery, [
          id,
          status,
          startTime,
          endTime,
          totalCargoCount,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Courier route plan with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE courier_route_plan
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Courier route plan with id ${id} not found`);
        }
      },
    );
  }
}

