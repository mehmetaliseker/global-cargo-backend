import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  TaxRegulationVersionEntity,
  ITaxRegulationVersionRepository,
} from './tax-regulation-version.repository.interface';

@Injectable()
export class TaxRegulationVersionRepository
  implements ITaxRegulationVersionRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<TaxRegulationVersionEntity[]> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE deleted_at IS NULL
      ORDER BY country_id, year DESC
    `;
    return await this.databaseService.query<TaxRegulationVersionEntity>(query);
  }

  async findById(id: number): Promise<TaxRegulationVersionEntity | null> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<TaxRegulationVersionEntity>(
      query,
      [id],
    );
  }

  async findByCountryId(
    countryId: number,
  ): Promise<TaxRegulationVersionEntity[]> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY year DESC
    `;
    return await this.databaseService.query<TaxRegulationVersionEntity>(
      query,
      [countryId],
    );
  }

  async findByCountryIdAndYear(
    countryId: number,
    year: number,
  ): Promise<TaxRegulationVersionEntity | null> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE country_id = $1 AND year = $2 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<TaxRegulationVersionEntity>(
      query,
      [countryId, year],
    );
  }

  async findActiveByCountryId(
    countryId: number,
  ): Promise<TaxRegulationVersionEntity[]> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE country_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY year DESC
    `;
    return await this.databaseService.query<TaxRegulationVersionEntity>(
      query,
      [countryId],
    );
  }

  async findActiveByCountryIdAndDate(
    countryId: number,
    date: Date,
  ): Promise<TaxRegulationVersionEntity | null> {
    const query = `
      SELECT id, country_id, year, regulation_data, effective_from, effective_to,
             is_active, created_at, updated_at, deleted_at
      FROM tax_regulation_version
      WHERE country_id = $1 
        AND is_active = true
        AND effective_from <= $2
        AND (effective_to IS NULL OR effective_to >= $2)
        AND deleted_at IS NULL
      ORDER BY year DESC, effective_from DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<TaxRegulationVersionEntity>(
      query,
      [countryId, date],
    );
  }

  async create(
    countryId: number,
    year: number,
    regulationData: Record<string, unknown>,
    effectiveFrom: Date,
    effectiveTo: Date | null,
  ): Promise<TaxRegulationVersionEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<TaxRegulationVersionEntity> => {
        const insertQuery = `
          INSERT INTO tax_regulation_version 
            (country_id, year, regulation_data, effective_from, effective_to, is_active)
          VALUES ($1, $2, $3, $4, $5, true)
          RETURNING id, country_id, year, regulation_data, effective_from, effective_to,
                    is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<TaxRegulationVersionEntity>(
          insertQuery,
          [
            countryId,
            year,
            JSON.stringify(regulationData),
            effectiveFrom,
            effectiveTo,
          ],
        );
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    regulationData: Record<string, unknown>,
    effectiveFrom: Date,
    effectiveTo: Date | null,
    isActive: boolean,
  ): Promise<TaxRegulationVersionEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<TaxRegulationVersionEntity> => {
        const updateQuery = `
          UPDATE tax_regulation_version
          SET regulation_data = $2,
              effective_from = $3,
              effective_to = $4,
              is_active = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, country_id, year, regulation_data, effective_from, effective_to,
                    is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<TaxRegulationVersionEntity>(
          updateQuery,
          [id, JSON.stringify(regulationData), effectiveFrom, effectiveTo, isActive],
        );
        if (result.rows.length === 0) {
          throw new Error(`Tax regulation version with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE tax_regulation_version
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Tax regulation version with id ${id} not found`);
        }
      },
    );
  }
}

