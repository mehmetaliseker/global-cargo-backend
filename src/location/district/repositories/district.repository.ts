import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  DistrictEntity,
  IDistrictRepository,
} from './district.repository.interface';

@Injectable()
export class DistrictRepository implements IDistrictRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<DistrictEntity[]> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistrictEntity>(query);
  }

  async findById(id: number): Promise<DistrictEntity | null> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DistrictEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<DistrictEntity | null> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DistrictEntity>(query, [uuid]);
  }

  async findByCityId(cityId: number): Promise<DistrictEntity[]> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE city_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistrictEntity>(query, [cityId]);
  }

  async findActive(): Promise<DistrictEntity[]> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistrictEntity>(query);
  }

  async findByCityIdAndActive(cityId: number): Promise<DistrictEntity[]> {
    const query = `
      SELECT id, uuid, city_id, name, code, is_active, created_at, updated_at, deleted_at
      FROM district
      WHERE city_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistrictEntity>(query, [cityId]);
  }
}

