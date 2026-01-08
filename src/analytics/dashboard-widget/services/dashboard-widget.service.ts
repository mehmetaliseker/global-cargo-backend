import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardWidgetRepository } from '../repositories/dashboard-widget.repository';
import { DashboardWidgetResponseDto } from '../dto/dashboard-widget.dto';
import { DashboardWidgetEntity } from '../repositories/dashboard-widget.repository.interface';

@Injectable()
export class DashboardWidgetService {
    constructor(
        private readonly dashboardWidgetRepository: DashboardWidgetRepository,
    ) { }

    private mapToDto(entity: DashboardWidgetEntity): DashboardWidgetResponseDto {
        return {
            id: entity.id,
            dashboardConfigId: entity.dashboard_config_id,
            widgetType: entity.widget_type,
            widgetConfig: entity.widget_config,
            positionX: entity.position_x,
            positionY: entity.position_y,
            width: entity.width,
            height: entity.height,
            refreshIntervalSeconds: entity.refresh_interval_seconds,
            widgetOrder: entity.widget_order,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<DashboardWidgetResponseDto[]> {
        const entities = await this.dashboardWidgetRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<DashboardWidgetResponseDto> {
        const entity = await this.dashboardWidgetRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Dashboard widget with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByDashboardConfigId(dashboardConfigId: number): Promise<DashboardWidgetResponseDto[]> {
        const entities = await this.dashboardWidgetRepository.findByDashboardConfigId(dashboardConfigId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDashboardConfigIdOrdered(dashboardConfigId: number): Promise<DashboardWidgetResponseDto[]> {
        const entities = await this.dashboardWidgetRepository.findByDashboardConfigIdOrdered(dashboardConfigId);
        return entities.map((entity) => this.mapToDto(entity));
    }
}
