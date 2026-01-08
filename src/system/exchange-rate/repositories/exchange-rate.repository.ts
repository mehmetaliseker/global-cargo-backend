import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  ExchangeRateEntity,
  IExchangeRateRepository,
} from './exchange-rate.repository.interface';

@Injectable()
export class ExchangeRateRepository implements IExchangeRateRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE deleted_at IS NULL
      ORDER BY effective_date DESC, timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query);
  }

  async findById(id: number): Promise<ExchangeRateEntity | null> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ExchangeRateEntity>(query, [id]);
  }

  async findByCurrencies(
    fromCurrencyId: number,
    toCurrencyId: number,
  ): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE from_currency_id = $1 AND to_currency_id = $2 AND deleted_at IS NULL
      ORDER BY effective_date DESC, timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query, [
      fromCurrencyId,
      toCurrencyId,
    ]);
  }

  async findByEffectiveDate(effectiveDate: Date): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE effective_date = $1 AND deleted_at IS NULL
      ORDER BY timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query, [
      effectiveDate,
    ]);
  }

  async findByCurrenciesAndDate(
    fromCurrencyId: number,
    toCurrencyId: number,
    effectiveDate: Date,
  ): Promise<ExchangeRateEntity | null> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE from_currency_id = $1 AND to_currency_id = $2 
        AND effective_date = $3 AND deleted_at IS NULL
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<ExchangeRateEntity>(query, [
      fromCurrencyId,
      toCurrencyId,
      effectiveDate,
    ]);
  }

  async findActive(): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY effective_date DESC, timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query);
  }

  async findByCurrencyFrom(currencyId: number): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE from_currency_id = $1 AND deleted_at IS NULL
      ORDER BY effective_date DESC, timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query, [
      currencyId,
    ]);
  }

  async findByCurrencyTo(currencyId: number): Promise<ExchangeRateEntity[]> {
    const query = `
      SELECT id, from_currency_id, to_currency_id, rate_value, effective_date,
             timestamp, source, is_active, created_at, updated_at, deleted_at
      FROM exchange_rate
      WHERE to_currency_id = $1 AND deleted_at IS NULL
      ORDER BY effective_date DESC, timestamp DESC
    `;
    return await this.databaseService.query<ExchangeRateEntity>(query, [
      currencyId,
    ]);
  }
}
