import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CountryRiskEntity,
  ICountryRiskRepository,
} from './country-risk.repository.interface';

@Injectable()
export class CountryRiskRepository implements ICountryRiskRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CountryRiskEntity[]> {
    const query = `
      SELECT id, country_id, risk_level, risk_score, updated_at, deleted_at
      FROM country_risk
      WHERE deleted_at IS NULL
      ORDER BY risk_score DESC
    `;
    return await this.databaseService.query<CountryRiskEntity>(query);
  }

  async findById(id: number): Promise<CountryRiskEntity | null> {
    const query = `
      SELECT id, country_id, risk_level, risk_score, updated_at, deleted_at
      FROM country_risk
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryRiskEntity>(query, [id]);
  }

  async findByCountryId(countryId: number): Promise<CountryRiskEntity | null> {
    const query = `
      SELECT id, country_id, risk_level, risk_score, updated_at, deleted_at
      FROM country_risk
      WHERE country_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CountryRiskEntity>(query, [
      countryId,
    ]);
  }
}

