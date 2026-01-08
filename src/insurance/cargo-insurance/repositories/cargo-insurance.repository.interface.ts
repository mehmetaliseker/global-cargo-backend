export interface CargoInsuranceEntity {
  id: number;
  cargo_id: number;
  insurance_policy_number: string;
  insured_value: number;
  premium_amount: number;
  currency_id: number;
  coverage_type?: string;
  policy_data?: Record<string, unknown>;
  issue_date: Date;
  expiry_date?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface ICargoInsuranceRepository {
  findAll(): Promise<CargoInsuranceEntity[]>;
  findById(id: number): Promise<CargoInsuranceEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoInsuranceEntity | null>;
  findByPolicyNumber(policyNumber: string): Promise<CargoInsuranceEntity | null>;
  findActive(): Promise<CargoInsuranceEntity[]>;
  findByActiveStatus(isActive: boolean): Promise<CargoInsuranceEntity[]>;
  create(
    cargoId: number,
    insurancePolicyNumber: string,
    insuredValue: number,
    premiumAmount: number,
    currencyId: number,
    coverageType: string | null,
    policyData: Record<string, unknown> | null,
    issueDate: Date,
    expiryDate: Date | null,
  ): Promise<CargoInsuranceEntity>;
  // Migration 014: UPDATE operation disabled via database trigger
  // update method removed - cargo_insurance records are immutable
}

