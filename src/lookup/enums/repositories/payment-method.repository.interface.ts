export interface PaymentMethodEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface IPaymentMethodRepository {
  findAll(): Promise<PaymentMethodEntity[]>;
  findById(id: number): Promise<PaymentMethodEntity | null>;
  findByCode(code: string): Promise<PaymentMethodEntity | null>;
  findActive(): Promise<PaymentMethodEntity[]>;
}

