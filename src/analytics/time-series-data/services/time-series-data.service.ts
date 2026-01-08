import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeSeriesDataRepository } from '../repositories/time-series-data.repository';
import { TimeSeriesDataResponseDto } from '../dto/time-series-data.dto';
import { TimeSeriesDataEntity } from '../repositories/time-series-data.repository.interface';

@Injectable()
export class TimeSeriesDataService {
    constructor(
        private readonly timeSeriesDataRepository: TimeSeriesDataRepository,
    ) { }

    private mapToDto(entity: TimeSeriesDataEntity): TimeSeriesDataResponseDto {
        return {
            id: entity.id,
            entityType: entity.entity_type,
            entityId: entity.entity_id ?? undefined,
            metricName: entity.metric_name,
            metricValue: parseFloat(entity.metric_value.toString()),
            timestamp: entity.timestamp.toISOString(),
            additionalData: entity.additional_data ?? undefined,
            createdAt: entity.created_at.toISOString(),
        };
    }

    async findAll(): Promise<TimeSeriesDataResponseDto[]> {
        const entities = await this.timeSeriesDataRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<TimeSeriesDataResponseDto> {
        const entity = await this.timeSeriesDataRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Time series data with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByEntity(
        entityType: string,
        entityId: number,
    ): Promise<TimeSeriesDataResponseDto[]> {
        const entities = await this.timeSeriesDataRepository.findByEntity(
            entityType,
            entityId,
        );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByMetricName(metricName: string): Promise<TimeSeriesDataResponseDto[]> {
        const entities = await this.timeSeriesDataRepository.findByMetricName(metricName);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDateRange(
        startDate: string,
        endDate: string,
    ): Promise<TimeSeriesDataResponseDto[]> {
        const entities = await this.timeSeriesDataRepository.findByDateRange(
            new Date(startDate),
            new Date(endDate),
        );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByEntityAndDateRange(
        entityType: string,
        entityId: number,
        startDate: string,
        endDate: string,
    ): Promise<TimeSeriesDataResponseDto[]> {
        const entities = await this.timeSeriesDataRepository.findByEntityAndDateRange(
            entityType,
            entityId,
            new Date(startDate),
            new Date(endDate),
        );
        return entities.map((entity) => this.mapToDto(entity));
    }
}
