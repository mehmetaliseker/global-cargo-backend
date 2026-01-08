import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleMaintenanceRepository } from '../repositories/vehicle-maintenance.repository';
import { VehicleMaintenanceResponseDto } from '../dto/vehicle-maintenance.dto';
import { VehicleMaintenanceEntity } from '../repositories/vehicle-maintenance.repository.interface';

@Injectable()
export class VehicleMaintenanceService {
    constructor(
        private readonly vehicleMaintenanceRepository: VehicleMaintenanceRepository,
    ) { }

    private mapToDto(
        entity: VehicleMaintenanceEntity,
    ): VehicleMaintenanceResponseDto {
        return {
            id: entity.id,
            vehicleId: entity.vehicle_id,
            maintenanceType: entity.maintenance_type,
            maintenanceDate: entity.maintenance_date.toISOString(),
            nextMaintenanceDate: entity.next_maintenance_date?.toISOString(),
            cost: entity.cost ? parseFloat(entity.cost.toString()) : undefined,
            description: entity.description ?? undefined,
            serviceProvider: entity.service_provider ?? undefined,
            odometerReading: entity.odometer_reading ?? undefined,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<VehicleMaintenanceResponseDto[]> {
        const entities = await this.vehicleMaintenanceRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<VehicleMaintenanceResponseDto> {
        const entity = await this.vehicleMaintenanceRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(
                `Vehicle maintenance record with id ${id} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByVehicleId(
        vehicleId: number,
    ): Promise<VehicleMaintenanceResponseDto[]> {
        const entities =
            await this.vehicleMaintenanceRepository.findByVehicleId(vehicleId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findUpcomingMaintenance(): Promise<VehicleMaintenanceResponseDto[]> {
        const entities =
            await this.vehicleMaintenanceRepository.findUpcomingMaintenance();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
