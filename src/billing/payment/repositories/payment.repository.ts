import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { PaymentEntity, IPaymentRepository } from './payment.repository.interface';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentEntity[]> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE deleted_at IS NULL
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<PaymentEntity>(query);
  }

  async findById(id: number): Promise<PaymentEntity | null> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<PaymentEntity | null> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentEntity>(query, [uuid]);
  }

  async findByInvoiceId(invoiceId: number): Promise<PaymentEntity[]> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE invoice_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<PaymentEntity>(query, [invoiceId]);
  }

  async findByCargoId(cargoId: number): Promise<PaymentEntity[]> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<PaymentEntity>(query, [cargoId]);
  }

  async findByPaymentStatusId(
    paymentStatusId: number,
  ): Promise<PaymentEntity[]> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE payment_status_id = $1 AND deleted_at IS NULL
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<PaymentEntity>(query, [
      paymentStatusId,
    ]);
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<PaymentEntity | null> {
    const query = `
      SELECT id, uuid, invoice_id, cargo_id, payment_method_id, payment_status_id, amount, currency_id,
             masked_card_number, card_last_four, card_token, cardholder_name_encrypted, transaction_id,
             transaction_date, approval_status, approved_at, approved_by, created_at, updated_at, deleted_at
      FROM payment
      WHERE transaction_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentEntity>(query, [
      transactionId,
    ]);
  }
}

