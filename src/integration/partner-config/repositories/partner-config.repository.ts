import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  PartnerConfigEntity,
  IPartnerConfigRepository,
} from './partner-config.repository.interface';

@Injectable()
export class PartnerConfigRepository implements IPartnerConfigRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PartnerConfigEntity[]> {
    const query = `
      SELECT id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
      FROM partner_config
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerConfigEntity>(query);
  }

  async findById(id: number): Promise<PartnerConfigEntity | null> {
    const query = `
      SELECT id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
      FROM partner_config
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerConfigEntity>(query, [
      id,
    ]);
  }

  async findByPartnerId(
    partnerId: number,
  ): Promise<PartnerConfigEntity | null> {
    const query = `
      SELECT id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
      FROM partner_config
      WHERE partner_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PartnerConfigEntity>(query, [
      partnerId,
    ]);
  }

  async findActive(): Promise<PartnerConfigEntity[]> {
    const query = `
      SELECT id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
      FROM partner_config
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PartnerConfigEntity>(query);
  }

  async create(
    partnerId: number,
    configData: Record<string, unknown> | null,
    apiKeyEncrypted: Buffer | null,
    isActive: boolean,
  ): Promise<PartnerConfigEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const insertQuery = `
          INSERT INTO partner_config (partner_id, config_data, api_key_encrypted, is_active)
          VALUES ($1, $2, $3, $4)
          RETURNING id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<PartnerConfigEntity>(insertQuery, [
          partnerId,
          configData ? JSON.stringify(configData) : null,
          apiKeyEncrypted,
          isActive,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    configData: Record<string, unknown> | null,
    apiKeyEncrypted: Buffer | null,
    isActive: boolean,
  ): Promise<PartnerConfigEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const updateQuery = `
          UPDATE partner_config
          SET config_data = COALESCE($2, config_data),
              api_key_encrypted = COALESCE($3, api_key_encrypted),
              is_active = $4,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, partner_id, config_data, api_key_encrypted, is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<PartnerConfigEntity>(updateQuery, [
          id,
          configData ? JSON.stringify(configData) : null,
          apiKeyEncrypted,
          isActive,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Partner config with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      const updateQuery = `
        UPDATE partner_config
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;
      const result = await client.query(updateQuery, [id]);
      if (result.rowCount === 0) {
        throw new Error(`Partner config with id ${id} not found`);
      }
    });
  }
}

