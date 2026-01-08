import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    ContainerEntity,
    IContainerRepository,
} from './container.repository.interface';

@Injectable()
export class ContainerRepository implements IContainerRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<ContainerEntity[]> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ContainerEntity>(query);
    }

    async findById(id: number): Promise<ContainerEntity | null> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<ContainerEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<ContainerEntity | null> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<ContainerEntity>(query, [uuid]);
    }

    async findByContainerCode(
        containerCode: string,
    ): Promise<ContainerEntity | null> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE container_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<ContainerEntity>(query, [
            containerCode,
        ]);
    }

    async findByWarehouseId(warehouseId: number): Promise<ContainerEntity[]> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE warehouse_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ContainerEntity>(query, [
            warehouseId,
        ]);
    }

    async findActive(): Promise<ContainerEntity[]> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ContainerEntity>(query);
    }

    async findInUse(): Promise<ContainerEntity[]> {
        const query = `
      SELECT id, uuid, container_code, container_type, warehouse_id,
             dimensions_length_cm, dimensions_width_cm, dimensions_height_cm,
             weight_capacity_kg, volume_capacity_cubic_meter, is_active,
             is_in_use, created_at, updated_at, deleted_at
      FROM container
      WHERE is_in_use = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ContainerEntity>(query);
    }
}
