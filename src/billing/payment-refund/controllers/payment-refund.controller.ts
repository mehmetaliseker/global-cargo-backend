import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentRefundService } from '../services/payment-refund.service';
import { PaymentRefundResponseDto } from '../dto/payment-refund.dto';

@Controller('billing/payment-refunds')
export class PaymentRefundController {
  constructor(private readonly paymentRefundService: PaymentRefundService) {}

  @Get()
  async findAll(): Promise<PaymentRefundResponseDto[]> {
    return await this.paymentRefundService.findAll();
  }

  @Get('payment/:paymentId')
  async findByPaymentId(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<PaymentRefundResponseDto[]> {
    return await this.paymentRefundService.findByPaymentId(paymentId);
  }

  @Get('refund-status/:refundStatus')
  async findByRefundStatus(
    @Param('refundStatus') refundStatus: string,
  ): Promise<PaymentRefundResponseDto[]> {
    return await this.paymentRefundService.findByRefundStatus(refundStatus);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentRefundResponseDto> {
    return await this.paymentRefundService.findById(id);
  }
}

