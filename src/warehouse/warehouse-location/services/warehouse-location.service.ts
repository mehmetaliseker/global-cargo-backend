import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseLocationRepository } from '../repositories/warehouse-location.repository';
import { WarehouseLocationResponseDto } from '../dto/warehouse-location.dto';
import { WarehouseLocationEntity } from '../repositories/warehouse-location.repository.interface';

@Injectable()
export class WarehouseLocationService {
    constructor(
        private readonly warehouseLocationRepository: WarehouseLocationRepository,
    ) { }

    private mapToDto(
        entity: WarehouseLocationEntity,
    ): WarehouseLocationResponseDto {
        return {
            id: entity.id,
            warehouseId: entity.warehouse_id,
            locationCode: entity.location_code,
            locationType: entity.location_type ?? undefined,
            coordinatesX: entity.coordinates_x
                ? parseFloat(entity.coordinates_x.toString())
                : undefined,
            coordinatesY: entity.coordinates_y
                ? parseFloat(entity.coordinates_y.toString())
                : undefined,
            coordinatesZ: entity.coordinates_z
                ? parseFloat(entity.coordinates_z.toString())
                : undefined,
            capacityVolume: entity.capacity_volume
                ? parseFloat(entity.capacity_volume.toString())
                : undefined,
            capacityWeight: entity.capacity_weight
                ? parseFloat(entity.capacity_weight.toString())
                : undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<WarehouseLocationResponseDto[]> {
        const entities = await this.warehouseLocationRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<WarehouseLocationResponseDto> {
        const entity = await this.warehouseLocationRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Warehouse location with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByWarehouseId(
        warehouseId: number,
    ): Promise<WarehouseLocationResponseDto[]> {
        const entities =
            await this.warehouseLocationRepository.findByWarehouseId(warehouseId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByLocationCode(
        warehouseId: number,
        locationCode: string,
    ): Promise<WarehouseLocationResponseDto> {
        const entity = await this.warehouseLocationRepository.findByLocationCode(
            warehouseId,
            locationCode,
        );
        if (!entity) {
            throw new NotFoundException(
                `Location ${locationCode} in warehouse ${warehouseId} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<WarehouseLocationResponseDto[]> {
        const entities = await this.warehouseLocationRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
