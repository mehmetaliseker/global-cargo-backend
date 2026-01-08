import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  PartnerCountryMappingEntity,
  IPartnerCountryMappingRepository,
} from './partner-country-mapping.repository.interface';

@Injectable()
export class PartnerCountryMappingRepository
  implements IPartnerCountryMappingRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PartnerCountryMappingEntity[]> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerCountryMappingEntity>(
      query,
    );
  }

  async findById(id: number): Promise<PartnerCountryMappingEntity | null> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerCountryMappingEntity>(
      query,
      [id],
    );
  }

  async findByPartnerId(
    partnerId: number,
  ): Promise<PartnerCountryMappingEntity[]> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE partner_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerCountryMappingEntity>(
      query,
      [partnerId],
    );
  }

  async findByCountryId(
    countryId: number,
  ): Promise<PartnerCountryMappingEntity[]> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerCountryMappingEntity>(
      query,
      [countryId],
    );
  }

  async findByPartnerIdAndCountryId(
    partnerId: number,
    countryId: number,
  ): Promise<PartnerCountryMappingEntity | null> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE partner_id = $1 AND country_id = $2 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerCountryMappingEntity>(
      query,
      [partnerId, countryId],
    );
  }

  async findActive(): Promise<PartnerCountryMappingEntity[]> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerCountryMappingEntity>(
      query,
    );
  }

  async findByPartnerIdActive(
    partnerId: number,
  ): Promise<PartnerCountryMappingEntity[]> {
    const query = `
      SELECT id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
      FROM partner_country_mapping
      WHERE partner_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerCountryMappingEntity>(
      query,
      [partnerId],
    );
  }

  async create(
    partnerId: number,
    countryId: number,
    isActive: boolean,
    mappingData: Record<string, unknown> | null,
  ): Promise<PartnerCountryMappingEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const existing = await client.query(
          `
          SELECT id FROM partner_country_mapping
          WHERE partner_id = $1 AND country_id = $2 AND deleted_at IS NULL AND is_active = true
        `,
          [partnerId, countryId],
        );
        if (existing.rows.length > 0) {
          throw new Error(
            `Active mapping already exists for partner ${partnerId} and country ${countryId}`,
          );
        }

        const insertQuery = `
          INSERT INTO partner_country_mapping (partner_id, country_id, is_active, mapping_data)
          VALUES ($1, $2, $3, $4)
          RETURNING id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
        `;
        const result = await client.query<PartnerCountryMappingEntity>(
          insertQuery,
          [
            partnerId,
            countryId,
            isActive,
            mappingData ? JSON.stringify(mappingData) : null,
          ],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    isActive: boolean,
    mappingData: Record<string, unknown> | null,
  ): Promise<PartnerCountryMappingEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const updateQuery = `
          UPDATE partner_country_mapping
          SET is_active = $2,
              mapping_data = COALESCE($3, mapping_data),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, partner_id, country_id, is_active, mapping_data, created_at, updated_at, deleted_at
        `;
        const result = await client.query<PartnerCountryMappingEntity>(
          updateQuery,
          [
            id,
            isActive,
            mappingData !== null ? JSON.stringify(mappingData) : null,
          ],
        );
        if (result.rows.length === 0) {
          throw new Error(
            `Partner country mapping with id ${id} not found`,
          );
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      const updateQuery = `
        UPDATE partner_country_mapping
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;
      const result = await client.query(updateQuery, [id]);
      if (result.rowCount === 0) {
        throw new Error(
          `Partner country mapping with id ${id} not found`,
        );
      }
    });
  }
}

