import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  SystemConfigEntity,
  ISystemConfigRepository,
} from './system-config.repository.interface';

@Injectable()
export class SystemConfigRepository implements ISystemConfigRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<SystemConfigEntity[]> {
    const query = `
      SELECT id, config_key, config_value, config_type, description, is_encrypted,
             updated_by, created_at, updated_at, deleted_at
      FROM system_config
      WHERE deleted_at IS NULL
      ORDER BY config_key ASC
    `;
    return await this.databaseService.query<SystemConfigEntity>(query);
  }

  async findById(id: number): Promise<SystemConfigEntity | null> {
    const query = `
      SELECT id, config_key, config_value, config_type, description, is_encrypted,
             updated_by, created_at, updated_at, deleted_at
      FROM system_config
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<SystemConfigEntity>(query, [id]);
  }

  async findByKey(configKey: string): Promise<SystemConfigEntity | null> {
    const query = `
      SELECT id, config_key, config_value, config_type, description, is_encrypted,
             updated_by, created_at, updated_at, deleted_at
      FROM system_config
      WHERE config_key = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<SystemConfigEntity>(query, [
      configKey,
    ]);
  }

  async findByType(configType: string): Promise<SystemConfigEntity[]> {
    const query = `
      SELECT id, config_key, config_value, config_type, description, is_encrypted,
             updated_by, created_at, updated_at, deleted_at
      FROM system_config
      WHERE config_type = $1 AND deleted_at IS NULL
      ORDER BY config_key ASC
    `;
    return await this.databaseService.query<SystemConfigEntity>(query, [
      configType,
    ]);
  }

  async findActive(): Promise<SystemConfigEntity[]> {
    const query = `
      SELECT id, config_key, config_value, config_type, description, is_encrypted,
             updated_by, created_at, updated_at, deleted_at
      FROM system_config
      WHERE deleted_at IS NULL
      ORDER BY config_key ASC
    `;
    return await this.databaseService.query<SystemConfigEntity>(query);
  }
}
