export interface DashboardMetricEntity {
    id: number;
    metric_code: string;
    metric_name: string;
    metric_type: string;
    data_source: string;
    calculation_query?: any;
    refresh_interval_seconds: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IDashboardMetricRepository {
    findAll(): Promise<DashboardMetricEntity[]>;
    findById(id: number): Promise<DashboardMetricEntity | null>;
    findByMetricCode(metricCode: string): Promise<DashboardMetricEntity | null>;
    findByMetricType(metricType: string): Promise<DashboardMetricEntity[]>;
    findActive(): Promise<DashboardMetricEntity[]>;
}
