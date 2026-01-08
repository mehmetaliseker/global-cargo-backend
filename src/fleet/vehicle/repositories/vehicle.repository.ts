import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    VehicleEntity,
    IVehicleRepository,
} from './vehicle.repository.interface';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<VehicleEntity[]> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<VehicleEntity>(query);
    }

    async findById(id: number): Promise<VehicleEntity | null> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<VehicleEntity | null> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleEntity>(query, [uuid]);
    }

    async findByVehicleCode(vehicleCode: string): Promise<VehicleEntity | null> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE vehicle_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleEntity>(query, [
            vehicleCode,
        ]);
    }

    async findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE license_plate = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleEntity>(query, [
            licensePlate,
        ]);
    }

    async findActive(): Promise<VehicleEntity[]> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<VehicleEntity>(query);
    }

    async findInUse(): Promise<VehicleEntity[]> {
        const query = `
      SELECT id, uuid, vehicle_code, license_plate, vehicle_type_id,
             vehicle_type_override, brand, model, year, capacity_weight_kg,
             capacity_volume_cubic_meter, is_active, is_in_use,
             created_at, updated_at, deleted_at
      FROM vehicle
      WHERE is_in_use = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<VehicleEntity>(query);
    }
}
