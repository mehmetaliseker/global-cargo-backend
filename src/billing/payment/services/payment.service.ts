import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentResponseDto } from '../dto/payment.dto';
import { PaymentEntity } from '../repositories/payment.repository.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  private mapToDto(entity: PaymentEntity): PaymentResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      invoiceId: entity.invoice_id,
      cargoId: entity.cargo_id,
      paymentMethodId: entity.payment_method_id,
      paymentStatusId: entity.payment_status_id,
      amount: parseFloat(entity.amount.toString()),
      currencyId: entity.currency_id,
      maskedCardNumber: entity.masked_card_number,
      cardLastFour: entity.card_last_four,
      cardToken: entity.card_token,
      transactionId: entity.transaction_id,
      transactionDate: entity.transaction_date.toISOString(),
      approvalStatus: entity.approval_status,
      approvedAt: entity.approved_at?.toISOString(),
      approvedBy: entity.approved_by,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    const entities = await this.paymentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PaymentResponseDto> {
    const entity = await this.paymentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<PaymentResponseDto> {
    const entity = await this.paymentRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Payment with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByInvoiceId(invoiceId: number): Promise<PaymentResponseDto[]> {
    const entities = await this.paymentRepository.findByInvoiceId(invoiceId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoId(cargoId: number): Promise<PaymentResponseDto[]> {
    const entities = await this.paymentRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPaymentStatusId(
    paymentStatusId: number,
  ): Promise<PaymentResponseDto[]> {
    const entities =
      await this.paymentRepository.findByPaymentStatusId(paymentStatusId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<PaymentResponseDto> {
    const entity =
      await this.paymentRepository.findByTransactionId(transactionId);
    if (!entity) {
      throw new NotFoundException(
        `Payment with transaction id ${transactionId} not found`,
      );
    }
    return this.mapToDto(entity);
  }
}

