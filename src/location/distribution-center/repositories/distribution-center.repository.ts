import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  DistributionCenterEntity,
  IDistributionCenterRepository,
} from './distribution-center.repository.interface';

@Injectable()
export class DistributionCenterRepository
  implements IDistributionCenterRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query);
  }

  async findById(id: number): Promise<DistributionCenterEntity | null> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DistributionCenterEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<DistributionCenterEntity | null> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DistributionCenterEntity>(
      query,
      [uuid],
    );
  }

  async findByCountryId(
    countryId: number,
  ): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query, [
      countryId,
    ]);
  }

  async findByCityId(cityId: number): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE city_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query, [
      cityId,
    ]);
  }

  async findActive(): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query);
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE country_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query, [
      countryId,
    ]);
  }

  async findTransferPoints(): Promise<DistributionCenterEntity[]> {
    const query = `
      SELECT id, uuid, country_id, city_id, name, code, address, latitude, longitude, is_active, is_transfer_point, created_at, updated_at, deleted_at
      FROM distribution_center
      WHERE is_transfer_point = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<DistributionCenterEntity>(query);
  }
}

