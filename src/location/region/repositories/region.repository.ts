import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { RegionEntity, IRegionRepository } from './region.repository.interface';

@Injectable()
export class RegionRepository implements IRegionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<RegionEntity[]> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<RegionEntity>(query);
  }

  async findById(id: number): Promise<RegionEntity | null> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RegionEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<RegionEntity | null> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RegionEntity>(query, [uuid]);
  }

  async findByCountryId(countryId: number): Promise<RegionEntity[]> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<RegionEntity>(query, [countryId]);
  }

  async findActive(): Promise<RegionEntity[]> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<RegionEntity>(query);
  }

  async findByCountryIdAndActive(countryId: number): Promise<RegionEntity[]> {
    const query = `
      SELECT id, uuid, country_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM region
      WHERE country_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<RegionEntity>(query, [countryId]);
  }
}

