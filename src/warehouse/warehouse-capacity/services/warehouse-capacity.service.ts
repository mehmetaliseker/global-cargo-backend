import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseCapacityRepository } from '../repositories/warehouse-capacity.repository';
import { WarehouseCapacityResponseDto } from '../dto/warehouse-capacity.dto';
import { WarehouseCapacityEntity } from '../repositories/warehouse-capacity.repository.interface';

@Injectable()
export class WarehouseCapacityService {
    constructor(
        private readonly warehouseCapacityRepository: WarehouseCapacityRepository,
    ) { }

    private mapToDto(
        entity: WarehouseCapacityEntity,
    ): WarehouseCapacityResponseDto {
        return {
            id: entity.id,
            warehouseId: entity.warehouse_id,
            capacityType: entity.capacity_type,
            maxCapacity: parseFloat(entity.max_capacity.toString()),
            currentUsage: parseFloat(entity.current_usage.toString()),
            alertThresholdPercentage: parseFloat(
                entity.alert_threshold_percentage.toString(),
            ),
            measurementDate: entity.measurement_date.toISOString(),
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<WarehouseCapacityResponseDto[]> {
        const entities = await this.warehouseCapacityRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<WarehouseCapacityResponseDto> {
        const entity = await this.warehouseCapacityRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Warehouse capacity with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByWarehouseId(
        warehouseId: number,
    ): Promise<WarehouseCapacityResponseDto[]> {
        const entities =
            await this.warehouseCapacityRepository.findByWarehouseId(warehouseId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByCapacityType(
        capacityType: string,
    ): Promise<WarehouseCapacityResponseDto[]> {
        const entities =
            await this.warehouseCapacityRepository.findByCapacityType(capacityType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findAlerts(): Promise<WarehouseCapacityResponseDto[]> {
        const entities = await this.warehouseCapacityRepository.findAlerts();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
