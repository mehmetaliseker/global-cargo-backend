import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    WarehouseLocationEntity,
    IWarehouseLocationRepository,
} from './warehouse-location.repository.interface';

@Injectable()
export class WarehouseLocationRepository
    implements IWarehouseLocationRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<WarehouseLocationEntity[]> {
        const query = `
      SELECT id, warehouse_id, location_code, location_type, coordinates_x,
             coordinates_y, coordinates_z, capacity_volume, capacity_weight,
             is_active, created_at, updated_at, deleted_at
      FROM warehouse_location
      WHERE deleted_at IS NULL
      ORDER BY warehouse_id, location_code
    `;
        return await this.databaseService.query<WarehouseLocationEntity>(query);
    }

    async findById(id: number): Promise<WarehouseLocationEntity | null> {
        const query = `
      SELECT id, warehouse_id, location_code, location_type, coordinates_x,
             coordinates_y, coordinates_z, capacity_volume, capacity_weight,
             is_active, created_at, updated_at, deleted_at
      FROM warehouse_location
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WarehouseLocationEntity>(query, [
            id,
        ]);
    }

    async findByWarehouseId(
        warehouseId: number,
    ): Promise<WarehouseLocationEntity[]> {
        const query = `
      SELECT id, warehouse_id, location_code, location_type, coordinates_x,
             coordinates_y, coordinates_z, capacity_volume, capacity_weight,
             is_active, created_at, updated_at, deleted_at
      FROM warehouse_location
      WHERE warehouse_id = $1 AND deleted_at IS NULL
      ORDER BY location_code
    `;
        return await this.databaseService.query<WarehouseLocationEntity>(query, [
            warehouseId,
        ]);
    }

    async findByLocationCode(
        warehouseId: number,
        locationCode: string,
    ): Promise<WarehouseLocationEntity | null> {
        const query = `
      SELECT id, warehouse_id, location_code, location_type, coordinates_x,
             coordinates_y, coordinates_z, capacity_volume, capacity_weight,
             is_active, created_at, updated_at, deleted_at
      FROM warehouse_location
      WHERE warehouse_id = $1 AND location_code = $2 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WarehouseLocationEntity>(query, [
            warehouseId,
            locationCode,
        ]);
    }

    async findActive(): Promise<WarehouseLocationEntity[]> {
        const query = `
      SELECT id, warehouse_id, location_code, location_type, coordinates_x,
             coordinates_y, coordinates_z, capacity_volume, capacity_weight,
             is_active, created_at, updated_at, deleted_at
      FROM warehouse_location
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY warehouse_id, location_code
    `;
        return await this.databaseService.query<WarehouseLocationEntity>(query);
    }
}
