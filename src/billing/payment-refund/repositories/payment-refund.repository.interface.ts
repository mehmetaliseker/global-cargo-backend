export interface PaymentRefundEntity {
  id: number;
  payment_id: number;
  refund_reason: string;
  refund_amount: number;
  refund_status: string;
  requested_date: Date;
  processed_date?: Date;
  processed_by?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPaymentRefundRepository {
  findAll(): Promise<PaymentRefundEntity[]>;
  findById(id: number): Promise<PaymentRefundEntity | null>;
  findByPaymentId(paymentId: number): Promise<PaymentRefundEntity[]>;
  findByRefundStatus(refundStatus: string): Promise<PaymentRefundEntity[]>;
}

