import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PartnerEntity,
  IPartnerRepository,
} from './partner.repository.interface';

@Injectable()
export class PartnerRepository implements IPartnerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PartnerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerEntity>(query);
  }

  async findById(id: number): Promise<PartnerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<PartnerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerEntity>(query, [uuid]);
  }

  async findByActorId(actorId: number): Promise<PartnerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE actor_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerEntity>(query, [actorId]);
  }

  async findByCountryId(countryId: number): Promise<PartnerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerEntity>(query, [countryId]);
  }

  async findActive(): Promise<PartnerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerEntity>(query);
  }

  async findApiActive(): Promise<PartnerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE api_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerEntity>(query);
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<PartnerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, company_name, tax_number, country_id, api_active, is_active, created_at, updated_at, deleted_at
      FROM partner
      WHERE country_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerEntity>(query, [countryId]);
  }
}

