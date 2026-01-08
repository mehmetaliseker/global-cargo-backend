import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCargoAssignmentRepository } from '../repositories/vehicle-cargo-assignment.repository';
import { VehicleCargoAssignmentResponseDto } from '../dto/vehicle-cargo-assignment.dto';
import { VehicleCargoAssignmentEntity } from '../repositories/vehicle-cargo-assignment.repository.interface';

@Injectable()
export class VehicleCargoAssignmentService {
    constructor(
        private readonly vehicleCargoAssignmentRepository: VehicleCargoAssignmentRepository,
    ) { }

    private mapToDto(
        entity: VehicleCargoAssignmentEntity,
    ): VehicleCargoAssignmentResponseDto {
        return {
            id: entity.id,
            vehicleId: entity.vehicle_id,
            cargoId: entity.cargo_id,
            routeId: entity.route_id ?? undefined,
            assignedDate: entity.assigned_date.toISOString(),
            loadedDate: entity.loaded_date?.toISOString(),
            unloadedDate: entity.unloaded_date?.toISOString(),
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<VehicleCargoAssignmentResponseDto[]> {
        const entities = await this.vehicleCargoAssignmentRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<VehicleCargoAssignmentResponseDto> {
        const entity = await this.vehicleCargoAssignmentRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(
                `Vehicle cargo assignment with id ${id} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByVehicleId(
        vehicleId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        const entities =
            await this.vehicleCargoAssignmentRepository.findByVehicleId(vehicleId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByCargoId(
        cargoId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        const entities =
            await this.vehicleCargoAssignmentRepository.findByCargoId(cargoId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByRouteId(
        routeId: number,
    ): Promise<VehicleCargoAssignmentResponseDto[]> {
        const entities =
            await this.vehicleCargoAssignmentRepository.findByRouteId(routeId);
        return entities.map((entity) => this.mapToDto(entity));
    }
}
