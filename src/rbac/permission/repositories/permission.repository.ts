import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PermissionEntity,
  IPermissionRepository,
} from './permission.repository.interface';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PermissionEntity[]> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE deleted_at IS NULL
      ORDER BY resource, action ASC
    `;
    return await this.databaseService.query<PermissionEntity>(query);
  }

  async findById(id: number): Promise<PermissionEntity | null> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PermissionEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<PermissionEntity | null> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PermissionEntity>(query, [uuid]);
  }

  async findByCode(code: string): Promise<PermissionEntity | null> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PermissionEntity>(query, [
      code,
    ]);
  }

  async findByResource(resource: string): Promise<PermissionEntity[]> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE resource = $1 AND deleted_at IS NULL
      ORDER BY action ASC
    `;
    return await this.databaseService.query<PermissionEntity>(query, [
      resource,
    ]);
  }

  async findActive(): Promise<PermissionEntity[]> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY resource, action ASC
    `;
    return await this.databaseService.query<PermissionEntity>(query);
  }

  async findByResourceAndActive(
    resource: string,
  ): Promise<PermissionEntity[]> {
    const query = `
      SELECT id, uuid, code, name, resource, action, description, is_active, created_at, updated_at, deleted_at
      FROM permission
      WHERE resource = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY action ASC
    `;
    return await this.databaseService.query<PermissionEntity>(query, [
      resource,
    ]);
  }
}

