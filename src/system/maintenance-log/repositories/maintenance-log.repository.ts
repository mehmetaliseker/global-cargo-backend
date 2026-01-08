import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  MaintenanceLogEntity,
  IMaintenanceLogRepository,
} from './maintenance-log.repository.interface';

@Injectable()
export class MaintenanceLogRepository implements IMaintenanceLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<MaintenanceLogEntity[]> {
    const query = `
      SELECT id, maintenance_type, execution_date, status, duration_seconds,
             details, executed_by, created_at, updated_at
      FROM maintenance_log
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<MaintenanceLogEntity>(query);
  }

  async findById(id: number): Promise<MaintenanceLogEntity | null> {
    const query = `
      SELECT id, maintenance_type, execution_date, status, duration_seconds,
             details, executed_by, created_at, updated_at
      FROM maintenance_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<MaintenanceLogEntity>(query, [
      id,
    ]);
  }

  async findByMaintenanceType(
    maintenanceType: string,
  ): Promise<MaintenanceLogEntity[]> {
    const query = `
      SELECT id, maintenance_type, execution_date, status, duration_seconds,
             details, executed_by, created_at, updated_at
      FROM maintenance_log
      WHERE maintenance_type = $1
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<MaintenanceLogEntity>(query, [
      maintenanceType,
    ]);
  }

  async findByStatus(status: string): Promise<MaintenanceLogEntity[]> {
    const query = `
      SELECT id, maintenance_type, execution_date, status, duration_seconds,
             details, executed_by, created_at, updated_at
      FROM maintenance_log
      WHERE status = $1
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<MaintenanceLogEntity>(query, [
      status,
    ]);
  }

  async findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceLogEntity[]> {
    const query = `
      SELECT id, maintenance_type, execution_date, status, duration_seconds,
             details, executed_by, created_at, updated_at
      FROM maintenance_log
      WHERE execution_date >= $1 AND execution_date <= $2
      ORDER BY execution_date DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<MaintenanceLogEntity>(query, [
      startDate,
      endDate,
    ]);
  }
}
