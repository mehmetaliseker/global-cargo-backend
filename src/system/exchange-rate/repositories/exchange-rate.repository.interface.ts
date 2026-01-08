export interface ExchangeRateEntity {
  id: number;
  from_currency_id: number;
  to_currency_id: number;
  rate_value: number;
  effective_date: Date;
  timestamp: Date;
  source?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IExchangeRateRepository {
  findAll(): Promise<ExchangeRateEntity[]>;
  findById(id: number): Promise<ExchangeRateEntity | null>;
  findByCurrencies(
    fromCurrencyId: number,
    toCurrencyId: number,
  ): Promise<ExchangeRateEntity[]>;
  findByEffectiveDate(effectiveDate: Date): Promise<ExchangeRateEntity[]>;
  findByCurrenciesAndDate(
    fromCurrencyId: number,
    toCurrencyId: number,
    effectiveDate: Date,
  ): Promise<ExchangeRateEntity | null>;
  findActive(): Promise<ExchangeRateEntity[]>;
  findByCurrencyFrom(currencyId: number): Promise<ExchangeRateEntity[]>;
  findByCurrencyTo(currencyId: number): Promise<ExchangeRateEntity[]>;
}
