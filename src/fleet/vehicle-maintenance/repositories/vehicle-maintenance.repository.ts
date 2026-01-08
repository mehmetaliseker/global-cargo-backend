import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    VehicleMaintenanceEntity,
    IVehicleMaintenanceRepository,
} from './vehicle-maintenance.repository.interface';

@Injectable()
export class VehicleMaintenanceRepository
    implements IVehicleMaintenanceRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<VehicleMaintenanceEntity[]> {
        const query = `
      SELECT id, vehicle_id, maintenance_type, maintenance_date,
             next_maintenance_date, cost, description, service_provider,
             odometer_reading, created_at, updated_at
      FROM vehicle_maintenance
      ORDER BY maintenance_date DESC
    `;
        return await this.databaseService.query<VehicleMaintenanceEntity>(query);
    }

    async findById(id: number): Promise<VehicleMaintenanceEntity | null> {
        const query = `
      SELECT id, vehicle_id, maintenance_type, maintenance_date,
             next_maintenance_date, cost, description, service_provider,
             odometer_reading, created_at, updated_at
      FROM vehicle_maintenance
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<VehicleMaintenanceEntity>(query, [
            id,
        ]);
    }

    async findByVehicleId(vehicleId: number): Promise<VehicleMaintenanceEntity[]> {
        const query = `
      SELECT id, vehicle_id, maintenance_type, maintenance_date,
             next_maintenance_date, cost, description, service_provider,
             odometer_reading, created_at, updated_at
      FROM vehicle_maintenance
      WHERE vehicle_id = $1
      ORDER BY maintenance_date DESC
    `;
        return await this.databaseService.query<VehicleMaintenanceEntity>(query, [
            vehicleId,
        ]);
    }

    async findUpcomingMaintenance(): Promise<VehicleMaintenanceEntity[]> {
        const query = `
      SELECT id, vehicle_id, maintenance_type, maintenance_date,
             next_maintenance_date, cost, description, service_provider,
             odometer_reading, created_at, updated_at
      FROM vehicle_maintenance
      WHERE next_maintenance_date IS NOT NULL
        AND next_maintenance_date >= CURRENT_DATE
      ORDER BY next_maintenance_date ASC
    `;
        return await this.databaseService.query<VehicleMaintenanceEntity>(query);
    }
}
