import { Injectable, NotFoundException } from '@nestjs/common';
import { ContainerRepository } from '../repositories/container.repository';
import { ContainerResponseDto } from '../dto/container.dto';
import { ContainerEntity } from '../repositories/container.repository.interface';

@Injectable()
export class ContainerService {
    constructor(private readonly containerRepository: ContainerRepository) { }

    private mapToDto(entity: ContainerEntity): ContainerResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            containerCode: entity.container_code,
            containerType: entity.container_type ?? undefined,
            warehouseId: entity.warehouse_id ?? undefined,
            dimensionsLengthCm: entity.dimensions_length_cm
                ? parseFloat(entity.dimensions_length_cm.toString())
                : undefined,
            dimensionsWidthCm: entity.dimensions_width_cm
                ? parseFloat(entity.dimensions_width_cm.toString())
                : undefined,
            dimensionsHeightCm: entity.dimensions_height_cm
                ? parseFloat(entity.dimensions_height_cm.toString())
                : undefined,
            weightCapacityKg: entity.weight_capacity_kg
                ? parseFloat(entity.weight_capacity_kg.toString())
                : undefined,
            volumeCapacityCubicMeter: entity.volume_capacity_cubic_meter
                ? parseFloat(entity.volume_capacity_cubic_meter.toString())
                : undefined,
            isActive: entity.is_active,
            isInUse: entity.is_in_use,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<ContainerResponseDto[]> {
        const entities = await this.containerRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<ContainerResponseDto> {
        const entity = await this.containerRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Container with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<ContainerResponseDto> {
        const entity = await this.containerRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Container with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByContainerCode(
        containerCode: string,
    ): Promise<ContainerResponseDto> {
        const entity =
            await this.containerRepository.findByContainerCode(containerCode);
        if (!entity) {
            throw new NotFoundException(
                `Container with code ${containerCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByWarehouseId(warehouseId: number): Promise<ContainerResponseDto[]> {
        const entities =
            await this.containerRepository.findByWarehouseId(warehouseId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<ContainerResponseDto[]> {
        const entities = await this.containerRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findInUse(): Promise<ContainerResponseDto[]> {
        const entities = await this.containerRepository.findInUse();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
