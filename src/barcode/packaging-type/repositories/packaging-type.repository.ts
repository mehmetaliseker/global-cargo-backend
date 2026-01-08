import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PackagingTypeEntity,
  IPackagingTypeRepository,
} from './packaging-type.repository.interface';

@Injectable()
export class PackagingTypeRepository implements IPackagingTypeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PackagingTypeEntity[]> {
    const query = `
      SELECT id, uuid, type_code, type_name, description, special_requirements,
             cost_additional, is_active, created_at, updated_at, deleted_at
      FROM packaging_type
      WHERE deleted_at IS NULL
      ORDER BY type_name ASC
    `;
    return await this.databaseService.query<PackagingTypeEntity>(query);
  }

  async findById(id: number): Promise<PackagingTypeEntity | null> {
    const query = `
      SELECT id, uuid, type_code, type_name, description, special_requirements,
             cost_additional, is_active, created_at, updated_at, deleted_at
      FROM packaging_type
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PackagingTypeEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<PackagingTypeEntity | null> {
    const query = `
      SELECT id, uuid, type_code, type_name, description, special_requirements,
             cost_additional, is_active, created_at, updated_at, deleted_at
      FROM packaging_type
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PackagingTypeEntity>(query, [
      uuid,
    ]);
  }

  async findByCode(typeCode: string): Promise<PackagingTypeEntity | null> {
    const query = `
      SELECT id, uuid, type_code, type_name, description, special_requirements,
             cost_additional, is_active, created_at, updated_at, deleted_at
      FROM packaging_type
      WHERE type_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PackagingTypeEntity>(query, [
      typeCode,
    ]);
  }

  async findActive(): Promise<PackagingTypeEntity[]> {
    const query = `
      SELECT id, uuid, type_code, type_name, description, special_requirements,
             cost_additional, is_active, created_at, updated_at, deleted_at
      FROM packaging_type
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY type_name ASC
    `;
    return await this.databaseService.query<PackagingTypeEntity>(query);
  }
}
