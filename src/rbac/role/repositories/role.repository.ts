import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { RoleEntity, IRoleRepository } from './role.repository.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<RoleEntity[]> {
    const query = `
      SELECT id, uuid, code, name, description, is_active, created_at, updated_at, deleted_at
      FROM role
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<RoleEntity>(query);
  }

  async findById(id: number): Promise<RoleEntity | null> {
    const query = `
      SELECT id, uuid, code, name, description, is_active, created_at, updated_at, deleted_at
      FROM role
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RoleEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<RoleEntity | null> {
    const query = `
      SELECT id, uuid, code, name, description, is_active, created_at, updated_at, deleted_at
      FROM role
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RoleEntity>(query, [uuid]);
  }

  async findByCode(code: string): Promise<RoleEntity | null> {
    const query = `
      SELECT id, uuid, code, name, description, is_active, created_at, updated_at, deleted_at
      FROM role
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RoleEntity>(query, [code]);
  }

  async findActive(): Promise<RoleEntity[]> {
    const query = `
      SELECT id, uuid, code, name, description, is_active, created_at, updated_at, deleted_at
      FROM role
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<RoleEntity>(query);
  }
}

