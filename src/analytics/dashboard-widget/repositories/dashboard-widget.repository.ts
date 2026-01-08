import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    DashboardWidgetEntity,
    IDashboardWidgetRepository,
} from './dashboard-widget.repository.interface';

@Injectable()
export class DashboardWidgetRepository implements IDashboardWidgetRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<DashboardWidgetEntity[]> {
        const query = `
      SELECT id, dashboard_config_id, widget_type, widget_config,
             position_x, position_y, width, height, refresh_interval_seconds,
             widget_order, created_at, updated_at
      FROM dashboard_widget
      ORDER BY widget_order ASC, created_at ASC
    `;
        return await this.databaseService.query<DashboardWidgetEntity>(query);
    }

    async findById(id: number): Promise<DashboardWidgetEntity | null> {
        const query = `
      SELECT id, dashboard_config_id, widget_type, widget_config,
             position_x, position_y, width, height, refresh_interval_seconds,
             widget_order, created_at, updated_at
      FROM dashboard_widget
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<DashboardWidgetEntity>(query, [id]);
    }

    async findByDashboardConfigId(dashboardConfigId: number): Promise<DashboardWidgetEntity[]> {
        const query = `
      SELECT id, dashboard_config_id, widget_type, widget_config,
             position_x, position_y, width, height, refresh_interval_seconds,
             widget_order, created_at, updated_at
      FROM dashboard_widget
      WHERE dashboard_config_id = $1
      ORDER BY widget_order ASC, created_at ASC
    `;
        return await this.databaseService.query<DashboardWidgetEntity>(query, [dashboardConfigId]);
    }

    async findByDashboardConfigIdOrdered(dashboardConfigId: number): Promise<DashboardWidgetEntity[]> {
        const query = `
      SELECT id, dashboard_config_id, widget_type, widget_config,
             position_x, position_y, width, height, refresh_interval_seconds,
             widget_order, created_at, updated_at
      FROM dashboard_widget
      WHERE dashboard_config_id = $1
      ORDER BY widget_order ASC, position_y ASC, position_x ASC
    `;
        return await this.databaseService.query<DashboardWidgetEntity>(query, [dashboardConfigId]);
    }
}
