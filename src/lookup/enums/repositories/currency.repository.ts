import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CurrencyEntity,
  ICurrencyRepository,
} from './currency.repository.interface';

@Injectable()
export class CurrencyRepository implements ICurrencyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CurrencyEntity[]> {
    const query = `
      SELECT id, code, name, symbol, is_active, created_at, deleted_at
      FROM currency_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CurrencyEntity>(query);
  }

  async findById(id: number): Promise<CurrencyEntity | null> {
    const query = `
      SELECT id, code, name, symbol, is_active, created_at, deleted_at
      FROM currency_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CurrencyEntity>(query, [id]);
  }

  async findByCode(code: string): Promise<CurrencyEntity | null> {
    const query = `
      SELECT id, code, name, symbol, is_active, created_at, deleted_at
      FROM currency_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CurrencyEntity>(query, [code]);
  }

  async findActive(): Promise<CurrencyEntity[]> {
    const query = `
      SELECT id, code, name, symbol, is_active, created_at, deleted_at
      FROM currency_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<CurrencyEntity>(query);
  }
}

