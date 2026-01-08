import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomsDocumentTypeEntity,
  ICustomsDocumentTypeRepository,
} from './customs-document-type.repository.interface';

@Injectable()
export class CustomsDocumentTypeRepository
  implements ICustomsDocumentTypeRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomsDocumentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CustomsDocumentTypeEntity>(query);
  }

  async findById(id: number): Promise<CustomsDocumentTypeEntity | null> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomsDocumentTypeEntity>(
      query,
      [id],
    );
  }

  async findByCode(code: string): Promise<CustomsDocumentTypeEntity | null> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomsDocumentTypeEntity>(
      query,
      [code],
    );
  }

  async findByCountryId(
    countryId: number,
  ): Promise<CustomsDocumentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CustomsDocumentTypeEntity>(
      query,
      [countryId],
    );
  }

  async findActive(): Promise<CustomsDocumentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CustomsDocumentTypeEntity>(query);
  }

  async findActiveByCountryId(
    countryId: number,
  ): Promise<CustomsDocumentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, required_fields, country_specific, country_id,
             is_active, created_at, updated_at, deleted_at
      FROM customs_document_type
      WHERE is_active = true 
        AND (country_specific = false OR country_id = $1)
        AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CustomsDocumentTypeEntity>(
      query,
      [countryId],
    );
  }

  async create(
    code: string,
    name: string,
    description: string | null,
    requiredFields: Record<string, unknown> | null,
    countrySpecific: boolean,
    countryId: number | null,
  ): Promise<CustomsDocumentTypeEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CustomsDocumentTypeEntity> => {
        const insertQuery = `
          INSERT INTO customs_document_type 
            (code, name, description, required_fields, country_specific, country_id, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, true)
          RETURNING id, code, name, description, required_fields, country_specific, country_id,
                    is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<CustomsDocumentTypeEntity>(
          insertQuery,
          [
            code,
            name,
            description,
            requiredFields ? JSON.stringify(requiredFields) : null,
            countrySpecific,
            countryId,
          ],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    name: string,
    description: string | null,
    requiredFields: Record<string, unknown> | null,
    isActive: boolean,
  ): Promise<CustomsDocumentTypeEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CustomsDocumentTypeEntity> => {
        const updateQuery = `
          UPDATE customs_document_type
          SET name = $2,
              description = $3,
              required_fields = $4,
              is_active = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, code, name, description, required_fields, country_specific, country_id,
                    is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<CustomsDocumentTypeEntity>(
          updateQuery,
          [
            id,
            name,
            description,
            requiredFields ? JSON.stringify(requiredFields) : null,
            isActive,
          ],
        );
        if (result.rows.length === 0) {
          throw new Error(`Customs document type with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE customs_document_type
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Customs document type with id ${id} not found`);
        }
      },
    );
  }
}

