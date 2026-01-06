export interface PricingCalculationDetailEntity {
  id: number;
  pricing_calculation_id: number;
  cost_type: string;
  amount: number;
  description?: string;
  calculation_factor: Record<string, unknown> | null;
  created_at: Date;
}

export interface IPricingCalculationDetailRepository {
  findAll(): Promise<PricingCalculationDetailEntity[]>;
  findById(id: number): Promise<PricingCalculationDetailEntity | null>;
  findByPricingCalculationId(
    pricingCalculationId: number,
  ): Promise<PricingCalculationDetailEntity[]>;
  findByCostType(costType: string): Promise<PricingCalculationDetailEntity[]>;
}

