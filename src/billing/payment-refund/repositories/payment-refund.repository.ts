import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PaymentRefundEntity,
  IPaymentRefundRepository,
} from './payment-refund.repository.interface';

@Injectable()
export class PaymentRefundRepository implements IPaymentRefundRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentRefundEntity[]> {
    const query = `
      SELECT id, payment_id, refund_reason, refund_amount, refund_status, requested_date,
             processed_date, processed_by, created_at, updated_at, deleted_at
      FROM payment_refund
      WHERE deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<PaymentRefundEntity>(query);
  }

  async findById(id: number): Promise<PaymentRefundEntity | null> {
    const query = `
      SELECT id, payment_id, refund_reason, refund_amount, refund_status, requested_date,
             processed_date, processed_by, created_at, updated_at, deleted_at
      FROM payment_refund
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentRefundEntity>(query, [
      id,
    ]);
  }

  async findByPaymentId(paymentId: number): Promise<PaymentRefundEntity[]> {
    const query = `
      SELECT id, payment_id, refund_reason, refund_amount, refund_status, requested_date,
             processed_date, processed_by, created_at, updated_at, deleted_at
      FROM payment_refund
      WHERE payment_id = $1 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<PaymentRefundEntity>(query, [
      paymentId,
    ]);
  }

  async findByRefundStatus(
    refundStatus: string,
  ): Promise<PaymentRefundEntity[]> {
    const query = `
      SELECT id, payment_id, refund_reason, refund_amount, refund_status, requested_date,
             processed_date, processed_by, created_at, updated_at, deleted_at
      FROM payment_refund
      WHERE refund_status = $1 AND deleted_at IS NULL
      ORDER BY requested_date DESC
    `;
    return await this.databaseService.query<PaymentRefundEntity>(query, [
      refundStatus,
    ]);
  }
}

