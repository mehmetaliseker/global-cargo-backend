import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentStatusService } from '../services/payment-status.service';
import { PaymentStatusResponseDto } from '../dto/payment-status.dto';

@Controller('lookup/payment-statuses')
export class PaymentStatusController {
  constructor(
    private readonly paymentStatusService: PaymentStatusService,
  ) {}

  @Get()
  async findAll(): Promise<PaymentStatusResponseDto[]> {
    return await this.paymentStatusService.findAll();
  }

  @Get('active')
  async findActive(): Promise<PaymentStatusResponseDto[]> {
    return await this.paymentStatusService.findActive();
  }

  @Get('code/:code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<PaymentStatusResponseDto> {
    return await this.paymentStatusService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentStatusResponseDto> {
    return await this.paymentStatusService.findById(id);
  }
}

