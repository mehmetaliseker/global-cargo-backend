import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { ExchangeRateResponseDto } from '../dto/exchange-rate.dto';

@Controller('system/exchange-rates')
export class ExchangeRateController {
  constructor(
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  // TODO: Add AdminGuard for write operations in future migrations

  @Get()
  async findAll(): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findAll();
  }

  @Get('active')
  async findActive(): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findActive();
  }

  @Get('from/:fromCurrencyId/to/:toCurrencyId')
  async findByCurrencies(
    @Param('fromCurrencyId', ParseIntPipe) fromCurrencyId: number,
    @Param('toCurrencyId', ParseIntPipe) toCurrencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findByCurrencies(
      fromCurrencyId,
      toCurrencyId,
    );
  }

  @Get('from/:fromCurrencyId/to/:toCurrencyId/date/:effectiveDate')
  async findByCurrenciesAndDate(
    @Param('fromCurrencyId', ParseIntPipe) fromCurrencyId: number,
    @Param('toCurrencyId', ParseIntPipe) toCurrencyId: number,
    @Param('effectiveDate') effectiveDate: string,
  ): Promise<ExchangeRateResponseDto | null> {
    return await this.exchangeRateService.findByCurrenciesAndDate(
      fromCurrencyId,
      toCurrencyId,
      new Date(effectiveDate),
    );
  }

  @Get('effective-date/:effectiveDate')
  async findByEffectiveDate(
    @Param('effectiveDate') effectiveDate: string,
  ): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findByEffectiveDate(
      new Date(effectiveDate),
    );
  }

  @Get('from-currency/:currencyId')
  async findByCurrencyFrom(
    @Param('currencyId', ParseIntPipe) currencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findByCurrencyFrom(currencyId);
  }

  @Get('to-currency/:currencyId')
  async findByCurrencyTo(
    @Param('currencyId', ParseIntPipe) currencyId: number,
  ): Promise<ExchangeRateResponseDto[]> {
    return await this.exchangeRateService.findByCurrencyTo(currencyId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ExchangeRateResponseDto> {
    return await this.exchangeRateService.findById(id);
  }
}
