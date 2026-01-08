import { Injectable, NotFoundException } from '@nestjs/common';
import { ExchangeRateRepository } from '../repositories/exchange-rate.repository';
import { ExchangeRateResponseDto } from '../dto/exchange-rate.dto';
import { ExchangeRateEntity } from '../repositories/exchange-rate.repository.interface';

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly exchangeRateRepository: ExchangeRateRepository,
  ) {}

  private mapToDto(entity: ExchangeRateEntity): ExchangeRateResponseDto {
    return {
      id: entity.id,
      fromCurrencyId: entity.from_currency_id,
      toCurrencyId: entity.to_currency_id,
      rateValue: parseFloat(entity.rate_value.toString()),
      effectiveDate: entity.effective_date.toISOString().split('T')[0],
      timestamp: entity.timestamp.toISOString(),
      source: entity.source ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<ExchangeRateResponseDto[]> {
    const entities = await this.exchangeRateRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ExchangeRateResponseDto> {
    const entity = await this.exchangeRateRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Exchange rate with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCurrencies(
    fromCurrencyId: number,
    toCurrencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    const entities = await this.exchangeRateRepository.findByCurrencies(
      fromCurrencyId,
      toCurrencyId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEffectiveDate(
    effectiveDate: Date,
  ): Promise<ExchangeRateResponseDto[]> {
    const entities =
      await this.exchangeRateRepository.findByEffectiveDate(effectiveDate);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCurrenciesAndDate(
    fromCurrencyId: number,
    toCurrencyId: number,
    effectiveDate: Date,
  ): Promise<ExchangeRateResponseDto | null> {
    const entity =
      await this.exchangeRateRepository.findByCurrenciesAndDate(
        fromCurrencyId,
        toCurrencyId,
        effectiveDate,
      );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<ExchangeRateResponseDto[]> {
    const entities = await this.exchangeRateRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCurrencyFrom(
    currencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    const entities =
      await this.exchangeRateRepository.findByCurrencyFrom(currencyId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCurrencyTo(
    currencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    const entities =
      await this.exchangeRateRepository.findByCurrencyTo(currencyId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}
