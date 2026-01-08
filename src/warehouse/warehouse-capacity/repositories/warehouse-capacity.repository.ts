import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    WarehouseCapacityEntity,
    IWarehouseCapacityRepository,
} from './warehouse-capacity.repository.interface';

@Injectable()
export class WarehouseCapacityRepository
    implements IWarehouseCapacityRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<WarehouseCapacityEntity[]> {
        const query = `
      SELECT id, warehouse_id, capacity_type, max_capacity, current_usage,
             alert_threshold_percentage, measurement_date, created_at, updated_at
      FROM warehouse_capacity
      ORDER BY warehouse_id, capacity_type
    `;
        return await this.databaseService.query<WarehouseCapacityEntity>(query);
    }

    async findById(id: number): Promise<WarehouseCapacityEntity | null> {
        const query = `
      SELECT id, warehouse_id, capacity_type, max_capacity, current_usage,
             alert_threshold_percentage, measurement_date, created_at, updated_at
      FROM warehouse_capacity
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<WarehouseCapacityEntity>(query, [
            id,
        ]);
    }

    async findByWarehouseId(
        warehouseId: number,
    ): Promise<WarehouseCapacityEntity[]> {
        const query = `
      SELECT id, warehouse_id, capacity_type, max_capacity, current_usage,
             alert_threshold_percentage, measurement_date, created_at, updated_at
      FROM warehouse_capacity
      WHERE warehouse_id = $1
      ORDER BY capacity_type
    `;
        return await this.databaseService.query<WarehouseCapacityEntity>(query, [
            warehouseId,
        ]);
    }

    async findByCapacityType(
        capacityType: string,
    ): Promise<WarehouseCapacityEntity[]> {
        const query = `
      SELECT id, warehouse_id, capacity_type, max_capacity, current_usage,
             alert_threshold_percentage, measurement_date, created_at, updated_at
      FROM warehouse_capacity
      WHERE capacity_type = $1
      ORDER BY warehouse_id
    `;
        return await this.databaseService.query<WarehouseCapacityEntity>(query, [
            capacityType,
        ]);
    }

    async findAlerts(): Promise<WarehouseCapacityEntity[]> {
        const query = `
      SELECT id, warehouse_id, capacity_type, max_capacity, current_usage,
             alert_threshold_percentage, measurement_date, created_at, updated_at
      FROM warehouse_capacity
      WHERE (current_usage / max_capacity * 100) >= alert_threshold_percentage
      ORDER BY warehouse_id, capacity_type
    `;
        return await this.databaseService.query<WarehouseCapacityEntity>(query);
    }
}
