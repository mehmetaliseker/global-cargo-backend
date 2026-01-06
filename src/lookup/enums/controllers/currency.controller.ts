import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CurrencyService } from '../services/currency.service';
import { CurrencyResponseDto } from '../dto/currency.dto';

@Controller('lookup/currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async findAll(): Promise<CurrencyResponseDto[]> {
    return await this.currencyService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CurrencyResponseDto[]> {
    return await this.currencyService.findActive();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<CurrencyResponseDto> {
    return await this.currencyService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CurrencyResponseDto> {
    return await this.currencyService.findById(id);
  }
}

