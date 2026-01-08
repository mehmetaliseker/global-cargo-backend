import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    DashboardMetricEntity,
    IDashboardMetricRepository,
} from './dashboard-metric.repository.interface';

@Injectable()
export class DashboardMetricRepository implements IDashboardMetricRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<DashboardMetricEntity[]> {
        const query = `
      SELECT id, metric_code, metric_name, metric_type, data_source,
             calculation_query, refresh_interval_seconds, is_active,
             created_at, updated_at, deleted_at
      FROM dashboard_metric
      WHERE deleted_at IS NULL
      ORDER BY metric_code ASC
    `;
        return await this.databaseService.query<DashboardMetricEntity>(query);
    }

    async findById(id: number): Promise<DashboardMetricEntity | null> {
        const query = `
      SELECT id, metric_code, metric_name, metric_type, data_source,
             calculation_query, refresh_interval_seconds, is_active,
             created_at, updated_at, deleted_at
      FROM dashboard_metric
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DashboardMetricEntity>(query, [id]);
    }

    async findByMetricCode(metricCode: string): Promise<DashboardMetricEntity | null> {
        const query = `
      SELECT id, metric_code, metric_name, metric_type, data_source,
             calculation_query, refresh_interval_seconds, is_active,
             created_at, updated_at, deleted_at
      FROM dashboard_metric
      WHERE metric_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DashboardMetricEntity>(query, [metricCode]);
    }

    async findByMetricType(metricType: string): Promise<DashboardMetricEntity[]> {
        const query = `
      SELECT id, metric_code, metric_name, metric_type, data_source,
             calculation_query, refresh_interval_seconds, is_active,
             created_at, updated_at, deleted_at
      FROM dashboard_metric
      WHERE metric_type = $1 AND deleted_at IS NULL
      ORDER BY metric_code ASC
    `;
        return await this.databaseService.query<DashboardMetricEntity>(query, [metricType]);
    }

    async findActive(): Promise<DashboardMetricEntity[]> {
        const query = `
      SELECT id, metric_code, metric_name, metric_type, data_source,
             calculation_query, refresh_interval_seconds, is_active,
             created_at, updated_at, deleted_at
      FROM dashboard_metric
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY metric_code ASC
    `;
        return await this.databaseService.query<DashboardMetricEntity>(query);
    }
}
