import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    VehicleTypeEntity,
    IVehicleTypeRepository,
} from './vehicle-type.repository.interface';

@Injectable()
export class VehicleTypeRepository implements IVehicleTypeRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<VehicleTypeEntity[]> {
        const query = `
      SELECT id, type_code, type_name, description,
             default_capacity_weight_kg, default_capacity_volume_cubic_meter,
             is_active, created_at, updated_at, deleted_at
      FROM vehicle_type
      WHERE deleted_at IS NULL
      ORDER BY type_name
    `;
        return await this.databaseService.query<VehicleTypeEntity>(query);
    }

    async findById(id: number): Promise<VehicleTypeEntity | null> {
        const query = `
      SELECT id, type_code, type_name, description,
             default_capacity_weight_kg, default_capacity_volume_cubic_meter,
             is_active, created_at, updated_at, deleted_at
      FROM vehicle_type
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleTypeEntity>(query, [id]);
    }

    async findByTypeCode(typeCode: string): Promise<VehicleTypeEntity | null> {
        const query = `
      SELECT id, type_code, type_name, description,
             default_capacity_weight_kg, default_capacity_volume_cubic_meter,
             is_active, created_at, updated_at, deleted_at
      FROM vehicle_type
      WHERE type_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<VehicleTypeEntity>(query, [
            typeCode,
        ]);
    }

    async findActive(): Promise<VehicleTypeEntity[]> {
        const query = `
      SELECT id, type_code, type_name, description,
             default_capacity_weight_kg, default_capacity_volume_cubic_meter,
             is_active, created_at, updated_at, deleted_at
      FROM vehicle_type
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY type_name
    `;
        return await this.databaseService.query<VehicleTypeEntity>(query);
    }
}
