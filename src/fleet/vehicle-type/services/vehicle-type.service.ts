import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleTypeRepository } from '../repositories/vehicle-type.repository';
import { VehicleTypeResponseDto } from '../dto/vehicle-type.dto';
import { VehicleTypeEntity } from '../repositories/vehicle-type.repository.interface';

@Injectable()
export class VehicleTypeService {
    constructor(private readonly vehicleTypeRepository: VehicleTypeRepository) { }

    private mapToDto(entity: VehicleTypeEntity): VehicleTypeResponseDto {
        return {
            id: entity.id,
            typeCode: entity.type_code,
            typeName: entity.type_name,
            description: entity.description ?? undefined,
            defaultCapacityWeightKg: entity.default_capacity_weight_kg
                ? parseFloat(entity.default_capacity_weight_kg.toString())
                : undefined,
            defaultCapacityVolumeCubicMeter: entity.default_capacity_volume_cubic_meter
                ? parseFloat(entity.default_capacity_volume_cubic_meter.toString())
                : undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<VehicleTypeResponseDto[]> {
        const entities = await this.vehicleTypeRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<VehicleTypeResponseDto> {
        const entity = await this.vehicleTypeRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Vehicle type with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByTypeCode(typeCode: string): Promise<VehicleTypeResponseDto> {
        const entity = await this.vehicleTypeRepository.findByTypeCode(typeCode);
        if (!entity) {
            throw new NotFoundException(
                `Vehicle type with code ${typeCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<VehicleTypeResponseDto[]> {
        const entities = await this.vehicleTypeRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
