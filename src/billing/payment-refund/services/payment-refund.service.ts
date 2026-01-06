import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRefundRepository } from '../repositories/payment-refund.repository';
import { PaymentRefundResponseDto } from '../dto/payment-refund.dto';
import { PaymentRefundEntity } from '../repositories/payment-refund.repository.interface';

@Injectable()
export class PaymentRefundService {
  constructor(
    private readonly paymentRefundRepository: PaymentRefundRepository,
  ) {}

  private mapToDto(entity: PaymentRefundEntity): PaymentRefundResponseDto {
    return {
      id: entity.id,
      paymentId: entity.payment_id,
      refundReason: entity.refund_reason,
      refundAmount: parseFloat(entity.refund_amount.toString()),
      refundStatus: entity.refund_status,
      requestedDate: entity.requested_date.toISOString(),
      processedDate: entity.processed_date?.toISOString(),
      processedBy: entity.processed_by,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PaymentRefundResponseDto[]> {
    const entities = await this.paymentRefundRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PaymentRefundResponseDto> {
    const entity = await this.paymentRefundRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Payment refund with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByPaymentId(paymentId: number): Promise<PaymentRefundResponseDto[]> {
    const entities =
      await this.paymentRefundRepository.findByPaymentId(paymentId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRefundStatus(
    refundStatus: string,
  ): Promise<PaymentRefundResponseDto[]> {
    const entities =
      await this.paymentRefundRepository.findByRefundStatus(refundStatus);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

