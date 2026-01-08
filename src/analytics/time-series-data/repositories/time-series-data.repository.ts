import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    TimeSeriesDataEntity,
    ITimeSeriesDataRepository,
} from './time-series-data.repository.interface';

@Injectable()
export class TimeSeriesDataRepository implements ITimeSeriesDataRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<TimeSeriesDataEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
        return await this.databaseService.query<TimeSeriesDataEntity>(query);
    }

    async findById(id: number): Promise<TimeSeriesDataEntity | null> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<TimeSeriesDataEntity>(query, [id]);
    }

    async findByEntity(entityType: string, entityId: number): Promise<TimeSeriesDataEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY timestamp DESC
    `;
        return await this.databaseService.query<TimeSeriesDataEntity>(query, [entityType, entityId]);
    }

    async findByMetricName(metricName: string): Promise<TimeSeriesDataEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      WHERE metric_name = $1
      ORDER BY timestamp DESC
      LIMIT 1000
    `;
        return await this.databaseService.query<TimeSeriesDataEntity>(query, [metricName]);
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<TimeSeriesDataEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      WHERE timestamp BETWEEN $1 AND $2
      ORDER BY timestamp DESC
    `;
        return await this.databaseService.query<TimeSeriesDataEntity>(query, [startDate, endDate]);
    }

    async findByEntityAndDateRange(
        entityType: string,
        entityId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<TimeSeriesDataEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, metric_name, metric_value,
             timestamp, additional_data, created_at
      FROM time_series_data
      WHERE entity_type = $1 
        AND entity_id = $2
        AND timestamp BETWEEN $3 AND $4
      ORDER BY timestamp DESC
    `;
        return await this.databaseService.query<TimeSeriesDataEntity>(query, [
            entityType,
            entityId,
            startDate,
            endDate,
        ]);
    }
}
