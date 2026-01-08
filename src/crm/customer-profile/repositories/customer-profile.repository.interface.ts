export interface LoyaltyProgramEntity {
  id: number;
  uuid: string;
  program_name: string;
  description?: string;
  point_conversion_rate: number;
  tier_levels?: Record<string, unknown>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CustomerLoyaltyPointsEntity {
  id: number;
  customer_id: number;
  loyalty_program_id: number;
  total_points: number;
  available_points: number;
  expired_points: number;
  current_tier?: string;
  last_updated_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerCreditLimitEntity {
  id: number;
  customer_id: number;
  credit_limit_amount: number;
  used_amount: number;
  available_amount: number;
  currency_id: number;
  last_updated_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ILoyaltyProgramRepository {
  findAll(): Promise<LoyaltyProgramEntity[]>;
  findById(id: number): Promise<LoyaltyProgramEntity | null>;
  findByUuid(uuid: string): Promise<LoyaltyProgramEntity | null>;
  findActive(): Promise<LoyaltyProgramEntity[]>;
}

export interface ICustomerLoyaltyPointsRepository {
  findAll(): Promise<CustomerLoyaltyPointsEntity[]>;
  findById(id: number): Promise<CustomerLoyaltyPointsEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerLoyaltyPointsEntity | null>;
  findByLoyaltyProgramId(loyaltyProgramId: number): Promise<CustomerLoyaltyPointsEntity[]>;
}

export interface ICustomerCreditLimitRepository {
  findAll(): Promise<CustomerCreditLimitEntity[]>;
  findById(id: number): Promise<CustomerCreditLimitEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerCreditLimitEntity | null>;
}
