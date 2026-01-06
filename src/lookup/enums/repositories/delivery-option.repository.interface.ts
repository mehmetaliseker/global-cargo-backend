export interface DeliveryOptionEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface IDeliveryOptionRepository {
  findAll(): Promise<DeliveryOptionEntity[]>;
  findById(id: number): Promise<DeliveryOptionEntity | null>;
  findByCode(code: string): Promise<DeliveryOptionEntity | null>;
  findActive(): Promise<DeliveryOptionEntity[]>;
}

