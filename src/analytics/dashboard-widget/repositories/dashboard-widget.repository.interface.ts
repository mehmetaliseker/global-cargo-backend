export interface DashboardWidgetEntity {
    id: number;
    dashboard_config_id: number;
    widget_type: string;
    widget_config: any;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    refresh_interval_seconds: number;
    widget_order: number;
    created_at: Date;
    updated_at: Date;
}

export interface IDashboardWidgetRepository {
    findAll(): Promise<DashboardWidgetEntity[]>;
    findById(id: number): Promise<DashboardWidgetEntity | null>;
    findByDashboardConfigId(dashboardConfigId: number): Promise<DashboardWidgetEntity[]>;
    findByDashboardConfigIdOrdered(dashboardConfigId: number): Promise<DashboardWidgetEntity[]>;
}
