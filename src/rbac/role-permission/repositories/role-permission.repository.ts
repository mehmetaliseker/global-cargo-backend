import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  RolePermissionEntity,
  IRolePermissionRepository,
} from './role-permission.repository.interface';

@Injectable()
export class RolePermissionRepository implements IRolePermissionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<RolePermissionEntity[]> {
    const query = `
      SELECT id, role_id, permission_id, granted_at, granted_by
      FROM role_permission
      ORDER BY granted_at DESC
    `;
    return await this.databaseService.query<RolePermissionEntity>(query);
  }

  async findById(id: number): Promise<RolePermissionEntity | null> {
    const query = `
      SELECT id, role_id, permission_id, granted_at, granted_by
      FROM role_permission
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<RolePermissionEntity>(query, [
      id,
    ]);
  }

  async findByRoleId(roleId: number): Promise<RolePermissionEntity[]> {
    const query = `
      SELECT id, role_id, permission_id, granted_at, granted_by
      FROM role_permission
      WHERE role_id = $1
      ORDER BY granted_at DESC
    `;
    return await this.databaseService.query<RolePermissionEntity>(query, [
      roleId,
    ]);
  }

  async findByPermissionId(
    permissionId: number,
  ): Promise<RolePermissionEntity[]> {
    const query = `
      SELECT id, role_id, permission_id, granted_at, granted_by
      FROM role_permission
      WHERE permission_id = $1
      ORDER BY granted_at DESC
    `;
    return await this.databaseService.query<RolePermissionEntity>(query, [
      permissionId,
    ]);
  }

  async findByRoleIdAndPermissionId(
    roleId: number,
    permissionId: number,
  ): Promise<RolePermissionEntity | null> {
    const query = `
      SELECT id, role_id, permission_id, granted_at, granted_by
      FROM role_permission
      WHERE role_id = $1 AND permission_id = $2
    `;
    return await this.databaseService.queryOne<RolePermissionEntity>(query, [
      roleId,
      permissionId,
    ]);
  }
}

