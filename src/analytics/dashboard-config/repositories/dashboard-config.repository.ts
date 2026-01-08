import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    DashboardConfigEntity,
    IDashboardConfigRepository,
} from './dashboard-config.repository.interface';

@Injectable()
export class DashboardConfigRepository implements IDashboardConfigRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<DashboardConfigEntity[]> {
        const query = `
      SELECT id, uuid, user_id, user_type, dashboard_name, layout,
             is_default, created_at, updated_at, deleted_at
      FROM dashboard_config
      WHERE deleted_at IS NULL
      ORDER BY dashboard_name ASC
    `;
        return await this.databaseService.query<DashboardConfigEntity>(query);
    }

    async findById(id: number): Promise<DashboardConfigEntity | null> {
        const query = `
      SELECT id, uuid, user_id, user_type, dashboard_name, layout,
             is_default, created_at, updated_at, deleted_at
      FROM dashboard_config
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DashboardConfigEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<DashboardConfigEntity | null> {
        const query = `
      SELECT id, uuid, user_id, user_type, dashboard_name, layout,
             is_default, created_at, updated_at, deleted_at
      FROM dashboard_config
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<DashboardConfigEntity>(query, [uuid]);
    }

    async findByUserId(userId: number, userType: string): Promise<DashboardConfigEntity[]> {
        const query = `
      SELECT id, uuid, user_id, user_type, dashboard_name, layout,
             is_default, created_at, updated_at, deleted_at
      FROM dashboard_config
      WHERE user_id = $1 AND user_type = $2 AND deleted_at IS NULL
      ORDER BY is_default DESC, dashboard_name ASC
    `;
        return await this.databaseService.query<DashboardConfigEntity>(query, [userId, userType]);
    }

    async findDefaultByUserId(userId: number, userType: string): Promise<DashboardConfigEntity | null> {
        const query = `
      SELECT id, uuid, user_id, user_type, dashboard_name, layout,
             is_default, created_at, updated_at, deleted_at
      FROM dashboard_config
      WHERE user_id = $1 AND user_type = $2 AND is_default = true AND deleted_at IS NULL
      LIMIT 1
    `;
        return await this.databaseService.queryOne<DashboardConfigEntity>(query, [userId, userType]);
    }
}
