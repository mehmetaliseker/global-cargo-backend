import { Injectable, NotFoundException } from '@nestjs/common';
import { DashboardMetricRepository } from '../repositories/dashboard-metric.repository';
import { DashboardMetricResponseDto } from '../dto/dashboard-metric.dto';
import { DashboardMetricEntity } from '../repositories/dashboard-metric.repository.interface';

@Injectable()
export class DashboardMetricService {
    constructor(
        private readonly dashboardMetricRepository: DashboardMetricRepository,
    ) { }

    private mapToDto(entity: DashboardMetricEntity): DashboardMetricResponseDto {
        return {
            id: entity.id,
            metricCode: entity.metric_code,
            metricName: entity.metric_name,
            metricType: entity.metric_type,
            dataSource: entity.data_source,
            calculationQuery: entity.calculation_query ?? undefined,
            refreshIntervalSeconds: entity.refresh_interval_seconds,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<DashboardMetricResponseDto[]> {
        const entities = await this.dashboardMetricRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<DashboardMetricResponseDto> {
        const entity = await this.dashboardMetricRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Dashboard metric with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByMetricCode(metricCode: string): Promise<DashboardMetricResponseDto> {
        const entity = await this.dashboardMetricRepository.findByMetricCode(metricCode);
        if (!entity) {
            throw new NotFoundException(`Dashboard metric with code ${metricCode} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByMetricType(metricType: string): Promise<DashboardMetricResponseDto[]> {
        const entities = await this.dashboardMetricRepository.findByMetricType(metricType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<DashboardMetricResponseDto[]> {
        const entities = await this.dashboardMetricRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
