import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteVisualizationRepository } from '../repositories/route-visualization.repository';
import { RouteVisualizationResponseDto } from '../dto/route-visualization.dto';
import { RouteVisualizationEntity } from '../repositories/route-visualization.repository.interface';

@Injectable()
export class RouteVisualizationService {
    constructor(
        private readonly routeVisualizationRepository: RouteVisualizationRepository,
    ) { }

    private mapToDto(entity: RouteVisualizationEntity): RouteVisualizationResponseDto {
        return {
            id: entity.id,
            routeId: entity.route_id ?? undefined,
            visualizationData: entity.visualization_data,
            mapStyle: entity.map_style ?? undefined,
            zoomLevel: entity.zoom_level,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<RouteVisualizationResponseDto[]> {
        const entities = await this.routeVisualizationRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<RouteVisualizationResponseDto> {
        const entity = await this.routeVisualizationRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Route visualization with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByRouteId(routeId: number): Promise<RouteVisualizationResponseDto[]> {
        const entities = await this.routeVisualizationRepository.findByRouteId(routeId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByRouteIdLatest(routeId: number): Promise<RouteVisualizationResponseDto | null> {
        const entity = await this.routeVisualizationRepository.findByRouteIdLatest(routeId);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }
}
