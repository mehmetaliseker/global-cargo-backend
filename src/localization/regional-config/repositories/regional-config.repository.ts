import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    RegionalConfigEntity,
    IRegionalConfigRepository,
} from './regional-config.repository.interface';

@Injectable()
export class RegionalConfigRepository implements IRegionalConfigRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<RegionalConfigEntity[]> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE deleted_at IS NULL
      ORDER BY country_id ASC, region_id ASC, config_key ASC
    `;
        return await this.databaseService.query<RegionalConfigEntity>(query);
    }

    async findById(id: number): Promise<RegionalConfigEntity | null> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<RegionalConfigEntity>(query, [id]);
    }

    async findByCountryId(countryId: number): Promise<RegionalConfigEntity[]> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY config_key ASC
    `;
        return await this.databaseService.query<RegionalConfigEntity>(query, [countryId]);
    }

    async findByRegionId(regionId: number): Promise<RegionalConfigEntity[]> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE region_id = $1 AND deleted_at IS NULL
      ORDER BY config_key ASC
    `;
        return await this.databaseService.query<RegionalConfigEntity>(query, [regionId]);
    }

    async findByConfigKey(configKey: string): Promise<RegionalConfigEntity[]> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE config_key = $1 AND deleted_at IS NULL
      ORDER BY country_id ASC, region_id ASC
    `;
        return await this.databaseService.query<RegionalConfigEntity>(query, [configKey]);
    }

    async findByCountryAndConfigKey(countryId: number, configKey: string): Promise<RegionalConfigEntity | null> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE country_id = $1 AND config_key = $2 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<RegionalConfigEntity>(query, [countryId, configKey]);
    }

    async findByRegionAndConfigKey(regionId: number, configKey: string): Promise<RegionalConfigEntity | null> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE region_id = $1 AND config_key = $2 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<RegionalConfigEntity>(query, [regionId, configKey]);
    }

    async findActive(): Promise<RegionalConfigEntity[]> {
        const query = `
      SELECT id, country_id, region_id, config_key, config_value,
             description, is_active, created_at, updated_at, deleted_at
      FROM regional_config
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY country_id ASC, region_id ASC, config_key ASC
    `;
        return await this.databaseService.query<RegionalConfigEntity>(query);
    }
}
