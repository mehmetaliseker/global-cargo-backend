import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { PaymentResponseDto } from '../dto/payment.dto';

@Controller('billing/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll(): Promise<PaymentResponseDto[]> {
    return await this.paymentService.findAll();
  }

  @Get('invoice/:invoiceId')
  async findByInvoiceId(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Promise<PaymentResponseDto[]> {
    return await this.paymentService.findByInvoiceId(invoiceId);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<PaymentResponseDto[]> {
    return await this.paymentService.findByCargoId(cargoId);
  }

  @Get('payment-status/:paymentStatusId')
  async findByPaymentStatusId(
    @Param('paymentStatusId', ParseIntPipe) paymentStatusId: number,
  ): Promise<PaymentResponseDto[]> {
    return await this.paymentService.findByPaymentStatusId(paymentStatusId);
  }

  @Get('transaction/:transactionId')
  async findByTransactionId(
    @Param('transactionId') transactionId: string,
  ): Promise<PaymentResponseDto> {
    return await this.paymentService.findByTransactionId(transactionId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<PaymentResponseDto> {
    return await this.paymentService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentResponseDto> {
    return await this.paymentService.findById(id);
  }
}

