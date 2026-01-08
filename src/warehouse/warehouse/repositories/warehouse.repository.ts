import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    WarehouseEntity,
    IWarehouseRepository,
} from './warehouse.repository.interface';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<WarehouseEntity[]> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WarehouseEntity>(query);
    }

    async findById(id: number): Promise<WarehouseEntity | null> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WarehouseEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<WarehouseEntity | null> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WarehouseEntity>(query, [uuid]);
    }

    async findByWarehouseCode(
        warehouseCode: string,
    ): Promise<WarehouseEntity | null> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE warehouse_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WarehouseEntity>(query, [
            warehouseCode,
        ]);
    }

    async findByCountryId(countryId: number): Promise<WarehouseEntity[]> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WarehouseEntity>(query, [
            countryId,
        ]);
    }

    async findActive(): Promise<WarehouseEntity[]> {
        const query = `
      SELECT id, uuid, warehouse_code, warehouse_name, country_id, city_id,
             address, latitude, longitude, capacity_volume_cubic_meter,
             capacity_weight_kg, current_utilization_percentage, is_active,
             created_at, updated_at, deleted_at
      FROM warehouse
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WarehouseEntity>(query);
    }
}
