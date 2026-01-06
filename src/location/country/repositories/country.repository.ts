import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CountryEntity,
  ICountryRepository,
} from './country.repository.interface';

@Injectable()
export class CountryRepository implements ICountryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CountryEntity[]> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CountryEntity>(query);
  }

  async findById(id: number): Promise<CountryEntity | null> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<CountryEntity | null> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryEntity>(query, [uuid]);
  }

  async findByIsoCode(isoCode: string): Promise<CountryEntity | null> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE iso_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryEntity>(query, [
      isoCode,
    ]);
  }

  async findByIsoCode2(isoCode2: string): Promise<CountryEntity | null> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE iso_code_2 = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryEntity>(query, [
      isoCode2,
    ]);
  }

  async findActive(): Promise<CountryEntity[]> {
    const query = `
      SELECT id, uuid, iso_code, iso_code_2, name, is_active, created_at, updated_at, deleted_at
      FROM country
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<CountryEntity>(query);
  }
}

