export interface TimeSeriesDataEntity {
    id: number;
    entity_type: string;
    entity_id?: number;
    metric_name: string;
    metric_value: number;
    timestamp: Date;
    additional_data?: any;
    created_at: Date;
}

export interface ITimeSeriesDataRepository {
    findAll(): Promise<TimeSeriesDataEntity[]>;
    findById(id: number): Promise<TimeSeriesDataEntity | null>;
    findByEntity(entityType: string, entityId: number): Promise<TimeSeriesDataEntity[]>;
    findByMetricName(metricName: string): Promise<TimeSeriesDataEntity[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<TimeSeriesDataEntity[]>;
    findByEntityAndDateRange(entityType: string, entityId: number, startDate: Date, endDate: Date): Promise<TimeSeriesDataEntity[]>;
}
