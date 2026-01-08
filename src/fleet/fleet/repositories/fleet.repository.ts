import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { FleetEntity, IFleetRepository } from './fleet.repository.interface';

@Injectable()
export class FleetRepository implements IFleetRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<FleetEntity[]> {
        const query = `
      SELECT id, uuid, fleet_code, fleet_name, branch_id, is_active,
             created_at, updated_at, deleted_at
      FROM fleet
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<FleetEntity>(query);
    }

    async findById(id: number): Promise<FleetEntity | null> {
        const query = `
      SELECT id, uuid, fleet_code, fleet_name, branch_id, is_active,
             created_at, updated_at, deleted_at
      FROM fleet
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<FleetEntity>(query, [id]);
    }

    async findByFleetCode(fleetCode: string): Promise<FleetEntity | null> {
        const query = `
      SELECT id, uuid, fleet_code, fleet_name, branch_id, is_active,
             created_at, updated_at, deleted_at
      FROM fleet
      WHERE fleet_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<FleetEntity>(query, [fleetCode]);
    }

    async findActive(): Promise<FleetEntity[]> {
        const query = `
      SELECT id, uuid, fleet_code, fleet_name, branch_id, is_active,
             created_at, updated_at, deleted_at
      FROM fleet
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<FleetEntity>(query);
    }
}
