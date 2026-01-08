import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { WarehouseResponseDto } from '../dto/warehouse.dto';
import { WarehouseEntity } from '../repositories/warehouse.repository.interface';

@Injectable()
export class WarehouseService {
    constructor(private readonly warehouseRepository: WarehouseRepository) { }

    private mapToDto(entity: WarehouseEntity): WarehouseResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            warehouseCode: entity.warehouse_code,
            warehouseName: entity.warehouse_name,
            countryId: entity.country_id,
            cityId: entity.city_id ?? undefined,
            address: entity.address ?? undefined,
            latitude: entity.latitude ? parseFloat(entity.latitude.toString()) : undefined,
            longitude: entity.longitude ? parseFloat(entity.longitude.toString()) : undefined,
            capacityVolumeCubicMeter: entity.capacity_volume_cubic_meter
                ? parseFloat(entity.capacity_volume_cubic_meter.toString())
                : undefined,
            capacityWeightKg: entity.capacity_weight_kg
                ? parseFloat(entity.capacity_weight_kg.toString())
                : undefined,
            currentUtilizationPercentage: entity.current_utilization_percentage
                ? parseFloat(entity.current_utilization_percentage.toString())
                : undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<WarehouseResponseDto[]> {
        const entities = await this.warehouseRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<WarehouseResponseDto> {
        const entity = await this.warehouseRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Warehouse with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<WarehouseResponseDto> {
        const entity = await this.warehouseRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Warehouse with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByWarehouseCode(
        warehouseCode: string,
    ): Promise<WarehouseResponseDto> {
        const entity =
            await this.warehouseRepository.findByWarehouseCode(warehouseCode);
        if (!entity) {
            throw new NotFoundException(
                `Warehouse with code ${warehouseCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByCountryId(countryId: number): Promise<WarehouseResponseDto[]> {
        const entities = await this.warehouseRepository.findByCountryId(countryId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<WarehouseResponseDto[]> {
        const entities = await this.warehouseRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
