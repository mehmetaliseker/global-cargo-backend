import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CityEntity, ICityRepository } from './city.repository.interface';

@Injectable()
export class CityRepository implements ICityRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CityEntity[]> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CityEntity>(query);
  }

  async findById(id: number): Promise<CityEntity | null> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CityEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<CityEntity | null> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CityEntity>(query, [uuid]);
  }

  async findByRegionId(regionId: number): Promise<CityEntity[]> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE region_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CityEntity>(query, [regionId]);
  }

  async findActive(): Promise<CityEntity[]> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CityEntity>(query);
  }

  async findByRegionIdAndActive(regionId: number): Promise<CityEntity[]> {
    const query = `
      SELECT id, uuid, region_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM city
      WHERE region_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CityEntity>(query, [regionId]);
  }
}

