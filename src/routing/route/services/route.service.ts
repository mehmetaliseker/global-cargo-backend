import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RouteRepository } from '../repositories/route.repository';
import {
  RouteResponseDto,
  CreateRouteDto,
  UpdateRouteDto,
} from '../dto/route.dto';
import { RouteEntity } from '../repositories/route.repository.interface';

@Injectable()
export class RouteService {
  constructor(private readonly routeRepository: RouteRepository) {}

  private mapToDto(entity: RouteEntity): RouteResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      originDistributionCenterId: entity.origin_distribution_center_id,
      destinationDistributionCenterId:
        entity.destination_distribution_center_id,
      shipmentTypeId: entity.shipment_type_id,
      routeCode: entity.route_code ?? undefined,
      estimatedDurationHours: entity.estimated_duration_hours ?? undefined,
      distanceKm: entity.distance_km
        ? parseFloat(entity.distance_km.toString())
        : undefined,
      isAlternativeRoute: entity.is_alternative_route,
      mainRouteId: entity.main_route_id ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<RouteResponseDto[]> {
    const entities = await this.routeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<RouteResponseDto> {
    const entity = await this.routeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Route with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<RouteResponseDto> {
    const entity = await this.routeRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Route with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByRouteCode(routeCode: string): Promise<RouteResponseDto> {
    const entity = await this.routeRepository.findByRouteCode(routeCode);
    if (!entity) {
      throw new NotFoundException(`Route with route code ${routeCode} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByOriginDistributionCenterId(
    originId: number,
  ): Promise<RouteResponseDto[]> {
    const entities =
      await this.routeRepository.findByOriginDistributionCenterId(originId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDestinationDistributionCenterId(
    destinationId: number,
  ): Promise<RouteResponseDto[]> {
    const entities =
      await this.routeRepository.findByDestinationDistributionCenterId(
        destinationId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByShipmentTypeId(
    shipmentTypeId: number,
  ): Promise<RouteResponseDto[]> {
    const entities = await this.routeRepository.findByShipmentTypeId(
      shipmentTypeId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<RouteResponseDto[]> {
    const entities = await this.routeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByMainRouteId(mainRouteId: number): Promise<RouteResponseDto[]> {
    const entities = await this.routeRepository.findByMainRouteId(mainRouteId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findAlternativeRoutes(mainRouteId: number): Promise<RouteResponseDto[]> {
    const entities = await this.routeRepository.findAlternativeRoutes(
      mainRouteId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(createDto: CreateRouteDto): Promise<RouteResponseDto> {
    if (
      createDto.originDistributionCenterId ===
      createDto.destinationDistributionCenterId
    ) {
      throw new BadRequestException(
        'Origin and destination distribution centers cannot be the same',
      );
    }

    if (createDto.isAlternativeRoute && !createDto.mainRouteId) {
      throw new BadRequestException(
        'Main route ID is required for alternative routes',
      );
    }

    if (!createDto.isAlternativeRoute && createDto.mainRouteId) {
      throw new BadRequestException(
        'Main route ID cannot be set for non-alternative routes',
      );
    }

    if (createDto.routeCode) {
      const existing = await this.routeRepository.findByRouteCode(
        createDto.routeCode,
      );
      if (existing) {
        throw new BadRequestException(
          `Route with code ${createDto.routeCode} already exists`,
        );
      }
    }

    const entity = await this.routeRepository.create(
      createDto.originDistributionCenterId,
      createDto.destinationDistributionCenterId,
      createDto.shipmentTypeId,
      createDto.routeCode ?? null,
      createDto.estimatedDurationHours ?? null,
      createDto.distanceKm ?? null,
      createDto.isAlternativeRoute,
      createDto.mainRouteId ?? null,
    );

    return this.mapToDto(entity);
  }

  async update(id: number, updateDto: UpdateRouteDto): Promise<RouteResponseDto> {
    const existing = await this.routeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Route with id ${id} not found`);
    }

    if (updateDto.routeCode && updateDto.routeCode !== existing.route_code) {
      const existingByCode = await this.routeRepository.findByRouteCode(
        updateDto.routeCode,
      );
      if (existingByCode && existingByCode.id !== id) {
        throw new BadRequestException(
          `Route with code ${updateDto.routeCode} already exists`,
        );
      }
    }

    const entity = await this.routeRepository.update(
      id,
      updateDto.routeCode ?? null,
      updateDto.estimatedDurationHours ?? null,
      updateDto.distanceKm ?? null,
      updateDto.isActive,
    );

    return this.mapToDto(entity);
  }
}

