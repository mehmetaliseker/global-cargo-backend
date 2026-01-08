import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    VehicleCargoAssignmentEntity,
    IVehicleCargoAssignmentRepository,
} from './vehicle-cargo-assignment.repository.interface';

@Injectable()
export class VehicleCargoAssignmentRepository
    implements IVehicleCargoAssignmentRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<VehicleCargoAssignmentEntity[]> {
        const query = `
      SELECT id, vehicle_id, cargo_id, route_id, assigned_date, loaded_date,
             unloaded_date, created_at, updated_at
      FROM vehicle_cargo_assignment
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<VehicleCargoAssignmentEntity>(query);
    }

    async findById(id: number): Promise<VehicleCargoAssignmentEntity | null> {
        const query = `
      SELECT id, vehicle_id, cargo_id, route_id, assigned_date, loaded_date,
             unloaded_date, created_at, updated_at
      FROM vehicle_cargo_assignment
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<VehicleCargoAssignmentEntity>(
            query,
            [id],
        );
    }

    async findByVehicleId(
        vehicleId: number,
    ): Promise<VehicleCargoAssignmentEntity[]> {
        const query = `
      SELECT id, vehicle_id, cargo_id, route_id, assigned_date, loaded_date,
             unloaded_date, created_at, updated_at
      FROM vehicle_cargo_assignment
      WHERE vehicle_id = $1
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<VehicleCargoAssignmentEntity>(
            query,
            [vehicleId],
        );
    }

    async findByCargoId(cargoId: number): Promise<VehicleCargoAssignmentEntity[]> {
        const query = `
      SELECT id, vehicle_id, cargo_id, route_id, assigned_date, loaded_date,
             unloaded_date, created_at, updated_at
      FROM vehicle_cargo_assignment
      WHERE cargo_id = $1
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<VehicleCargoAssignmentEntity>(
            query,
            [cargoId],
        );
    }

    async findByRouteId(routeId: number): Promise<VehicleCargoAssignmentEntity[]> {
        const query = `
      SELECT id, vehicle_id, cargo_id, route_id, assigned_date, loaded_date,
             unloaded_date, created_at, updated_at
      FROM vehicle_cargo_assignment
      WHERE route_id = $1
      ORDER BY assigned_date DESC
    `;
        return await this.databaseService.query<VehicleCargoAssignmentEntity>(
            query,
            [routeId],
        );
    }
}
