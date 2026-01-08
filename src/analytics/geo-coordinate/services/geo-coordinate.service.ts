import { Injectable, NotFoundException } from '@nestjs/common';
import { GeoCoordinateRepository } from '../repositories/geo-coordinate.repository';
import { GeoCoordinateResponseDto } from '../dto/geo-coordinate.dto';
import { GeoCoordinateEntity } from '../repositories/geo-coordinate.repository.interface';

@Injectable()
export class GeoCoordinateService {
    constructor(
        private readonly geoCoordinateRepository: GeoCoordinateRepository,
    ) { }

    private mapToDto(entity: GeoCoordinateEntity): GeoCoordinateResponseDto {
        return {
            id: entity.id,
            entityType: entity.entity_type,
            entityId: entity.entity_id,
            latitude: parseFloat(entity.latitude.toString()),
            longitude: parseFloat(entity.longitude.toString()),
            accuracyMeters: entity.accuracy_meters ? parseFloat(entity.accuracy_meters.toString()) : undefined,
            recordedAt: entity.recorded_at.toISOString(),
            createdAt: entity.created_at.toISOString(),
        };
    }

    async findAll(): Promise<GeoCoordinateResponseDto[]> {
        const entities = await this.geoCoordinateRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<GeoCoordinateResponseDto> {
        const entity = await this.geoCoordinateRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Geo coordinate with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByEntity(entityType: string, entityId: number): Promise<GeoCoordinateResponseDto[]> {
        const entities = await this.geoCoordinateRepository.findByEntity(entityType, entityId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByEntityLatest(entityType: string, entityId: number): Promise<GeoCoordinateResponseDto | null> {
        const entity = await this.geoCoordinateRepository.findByEntityLatest(entityType, entityId);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByDateRange(startDate: string, endDate: string): Promise<GeoCoordinateResponseDto[]> {
        const entities = await this.geoCoordinateRepository.findByDateRange(
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
    ): Promise<GeoCoordinateResponseDto[]> {
        const entities = await this.geoCoordinateRepository.findByEntityAndDateRange(
            entityType,
            entityId,
            new Date(startDate),
            new Date(endDate),
        );
        return entities.map((entity) => this.mapToDto(entity));
    }
}
