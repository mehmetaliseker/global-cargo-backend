export interface PaymentStatusEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface IPaymentStatusRepository {
  findAll(): Promise<PaymentStatusEntity[]>;
  findById(id: number): Promise<PaymentStatusEntity | null>;
  findByCode(code: string): Promise<PaymentStatusEntity | null>;
  findActive(): Promise<PaymentStatusEntity[]>;
}

