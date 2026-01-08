import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { HrKpiEntity, IHrKpiRepository } from './hr-kpi.repository.interface';

@Injectable()
export class HrKpiRepository implements IHrKpiRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<HrKpiEntity[]> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE deleted_at IS NULL
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<HrKpiEntity>(query);
  }

  async findById(id: number): Promise<HrKpiEntity | null> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<HrKpiEntity>(query, [id]);
  }

  async findByEmployeeId(employeeId: number): Promise<HrKpiEntity[]> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<HrKpiEntity>(query, [employeeId]);
  }

  async findByKpiType(kpiType: string): Promise<HrKpiEntity[]> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE kpi_type = $1 AND deleted_at IS NULL
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<HrKpiEntity>(query, [kpiType]);
  }

  async findByEmployeeIdAndKpiType(
    employeeId: number,
    kpiType: string,
  ): Promise<HrKpiEntity[]> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE employee_id = $1 AND kpi_type = $2 AND deleted_at IS NULL
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<HrKpiEntity>(query, [
      employeeId,
      kpiType,
    ]);
  }

  async findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<HrKpiEntity[]> {
    const query = `
      SELECT id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculation_date, calculated_by, description,
             created_at, updated_at, deleted_at
      FROM hr_kpi
      WHERE period_start_date >= $1 AND period_end_date <= $2 AND deleted_at IS NULL
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<HrKpiEntity>(query, [
      periodStartDate,
      periodEndDate,
    ]);
  }

  async create(
    employeeId: number,
    kpiType: string,
    kpiValue: number,
    kpiPeriod: string | null,
    periodStartDate: Date | null,
    periodEndDate: Date | null,
    calculatedBy: number | null,
    description: string | null,
  ): Promise<HrKpiEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<HrKpiEntity> => {
        const insertQuery = `
          INSERT INTO hr_kpi 
            (employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
             period_end_date, calculated_by, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
                    period_end_date, calculation_date, calculated_by, description,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<HrKpiEntity>(insertQuery, [
          employeeId,
          kpiType,
          kpiValue,
          kpiPeriod,
          periodStartDate,
          periodEndDate,
          calculatedBy,
          description,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    kpiValue: number,
    kpiPeriod: string | null,
    periodStartDate: Date | null,
    periodEndDate: Date | null,
    description: string | null,
  ): Promise<HrKpiEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<HrKpiEntity> => {
        const updateQuery = `
          UPDATE hr_kpi
          SET kpi_value = $2,
              kpi_period = $3,
              period_start_date = $4,
              period_end_date = $5,
              description = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, employee_id, kpi_type, kpi_value, kpi_period, period_start_date,
                    period_end_date, calculation_date, calculated_by, description,
                    created_at, updated_at, deleted_at
        `;
        const result = await client.query<HrKpiEntity>(updateQuery, [
          id,
          kpiValue,
          kpiPeriod,
          periodStartDate,
          periodEndDate,
          description,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`HR KPI with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE hr_kpi
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`HR KPI with id ${id} not found`);
        }
      },
    );
  }
}

