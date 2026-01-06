import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentMethodService } from '../services/payment-method.service';
import { PaymentMethodResponseDto } from '../dto/payment-method.dto';

@Controller('lookup/payment-methods')
export class PaymentMethodController {
  constructor(
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  @Get()
  async findAll(): Promise<PaymentMethodResponseDto[]> {
    return await this.paymentMethodService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PaymentMethodResponseDto[]> {
    return await this.paymentMethodService.findActive();
  }

  @Get('code/:code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<PaymentMethodResponseDto> {
    return await this.paymentMethodService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentMethodResponseDto> {
    return await this.paymentMethodService.findById(id);
  }
}

