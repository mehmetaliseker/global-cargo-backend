import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { VehicleResponseDto } from '../dto/vehicle.dto';
import { VehicleEntity } from '../repositories/vehicle.repository.interface';

@Injectable()
export class VehicleService {
    constructor(private readonly vehicleRepository: VehicleRepository) { }

    private mapToDto(entity: VehicleEntity): VehicleResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            vehicleCode: entity.vehicle_code,
            licensePlate: entity.license_plate,
            vehicleTypeId: entity.vehicle_type_id ?? undefined,
            vehicleTypeOverride: entity.vehicle_type_override ?? undefined,
            brand: entity.brand ?? undefined,
            model: entity.model ?? undefined,
            year: entity.year ?? undefined,
            capacityWeightKg: entity.capacity_weight_kg
                ? parseFloat(entity.capacity_weight_kg.toString())
                : undefined,
            capacityVolumeCubicMeter: entity.capacity_volume_cubic_meter
                ? parseFloat(entity.capacity_volume_cubic_meter.toString())
                : undefined,
            isActive: entity.is_active,
            isInUse: entity.is_in_use,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<VehicleResponseDto[]> {
        const entities = await this.vehicleRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<VehicleResponseDto> {
        const entity = await this.vehicleRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Vehicle with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<VehicleResponseDto> {
        const entity = await this.vehicleRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Vehicle with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByVehicleCode(vehicleCode: string): Promise<VehicleResponseDto> {
        const entity = await this.vehicleRepository.findByVehicleCode(vehicleCode);
        if (!entity) {
            throw new NotFoundException(
                `Vehicle with code ${vehicleCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByLicensePlate(licensePlate: string): Promise<VehicleResponseDto> {
        const entity = await this.vehicleRepository.findByLicensePlate(licensePlate);
        if (!entity) {
            throw new NotFoundException(
                `Vehicle with license plate ${licensePlate} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<VehicleResponseDto[]> {
        const entities = await this.vehicleRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findInUse(): Promise<VehicleResponseDto[]> {
        const entities = await this.vehicleRepository.findInUse();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
