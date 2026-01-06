export interface PaymentEntity {
  id: number;
  uuid: string;
  invoice_id: number;
  cargo_id: number;
  payment_method_id: number;
  payment_status_id: number;
  amount: number;
  currency_id: number;
  masked_card_number?: string;
  card_last_four?: string;
  card_token?: string;
  cardholder_name_encrypted?: Buffer;
  transaction_id?: string;
  transaction_date: Date;
  approval_status: string;
  approved_at?: Date;
  approved_by?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPaymentRepository {
  findAll(): Promise<PaymentEntity[]>;
  findById(id: number): Promise<PaymentEntity | null>;
  findByUuid(uuid: string): Promise<PaymentEntity | null>;
  findByInvoiceId(invoiceId: number): Promise<PaymentEntity[]>;
  findByCargoId(cargoId: number): Promise<PaymentEntity[]>;
  findByPaymentStatusId(paymentStatusId: number): Promise<PaymentEntity[]>;
  findByTransactionId(transactionId: string): Promise<PaymentEntity | null>;
}

