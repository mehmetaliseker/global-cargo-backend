export interface PricingCalculationEntity {
  id: number;
  uuid: string;
  cargo_id: number;
  base_price: number;
  shipping_cost: number;
  insurance_cost: number;
  tax_cost: number;
  customs_cost: number;
  total_amount: number;
  currency_id: number;
  shipment_type_id: number;
  calculation_timestamp: Date;
  calculated_by?: number;
  created_at: Date;
}

export interface IPricingCalculationRepository {
  findAll(): Promise<PricingCalculationEntity[]>;
  findById(id: number): Promise<PricingCalculationEntity | null>;
  findByUuid(uuid: string): Promise<PricingCalculationEntity | null>;
  findByCargoId(cargoId: number): Promise<PricingCalculationEntity[]>;
  findByCargoIdLatest(cargoId: number): Promise<PricingCalculationEntity | null>;
}

