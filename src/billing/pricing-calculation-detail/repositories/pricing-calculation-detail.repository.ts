import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PricingCalculationDetailEntity,
  IPricingCalculationDetailRepository,
} from './pricing-calculation-detail.repository.interface';

@Injectable()
export class PricingCalculationDetailRepository
  implements IPricingCalculationDetailRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PricingCalculationDetailEntity[]> {
    const query = `
      SELECT id, pricing_calculation_id, cost_type, amount, description, calculation_factor, created_at
      FROM pricing_calculation_detail
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PricingCalculationDetailEntity>(
      query,
    );
  }

  async findById(
    id: number,
  ): Promise<PricingCalculationDetailEntity | null> {
    const query = `
      SELECT id, pricing_calculation_id, cost_type, amount, description, calculation_factor, created_at
      FROM pricing_calculation_detail
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<PricingCalculationDetailEntity>(
      query,
      [id],
    );
  }

  async findByPricingCalculationId(
    pricingCalculationId: number,
  ): Promise<PricingCalculationDetailEntity[]> {
    const query = `
      SELECT id, pricing_calculation_id, cost_type, amount, description, calculation_factor, created_at
      FROM pricing_calculation_detail
      WHERE pricing_calculation_id = $1
      ORDER BY created_at ASC
    `;
    return await this.databaseService.query<PricingCalculationDetailEntity>(
      query,
      [pricingCalculationId],
    );
  }

  async findByCostType(
    costType: string,
  ): Promise<PricingCalculationDetailEntity[]> {
    const query = `
      SELECT id, pricing_calculation_id, cost_type, amount, description, calculation_factor, created_at
      FROM pricing_calculation_detail
      WHERE cost_type = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<PricingCalculationDetailEntity>(
      query,
      [costType],
    );
  }
}

