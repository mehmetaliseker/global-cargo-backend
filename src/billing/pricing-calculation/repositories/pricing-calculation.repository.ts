import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PricingCalculationEntity,
  IPricingCalculationRepository,
} from './pricing-calculation.repository.interface';

@Injectable()
export class PricingCalculationRepository
  implements IPricingCalculationRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PricingCalculationEntity[]> {
    const query = `
      SELECT id, uuid, cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost,
             total_amount, currency_id, shipment_type_id, calculation_timestamp, calculated_by, created_at
      FROM pricing_calculation
      ORDER BY calculation_timestamp DESC
    `;
    return await this.databaseService.query<PricingCalculationEntity>(query);
  }

  async findById(id: number): Promise<PricingCalculationEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost,
             total_amount, currency_id, shipment_type_id, calculation_timestamp, calculated_by, created_at
      FROM pricing_calculation
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<PricingCalculationEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<PricingCalculationEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost,
             total_amount, currency_id, shipment_type_id, calculation_timestamp, calculated_by, created_at
      FROM pricing_calculation
      WHERE uuid = $1
    `;
    return await this.databaseService.queryOne<PricingCalculationEntity>(
      query,
      [uuid],
    );
  }

  async findByCargoId(cargoId: number): Promise<PricingCalculationEntity[]> {
    const query = `
      SELECT id, uuid, cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost,
             total_amount, currency_id, shipment_type_id, calculation_timestamp, calculated_by, created_at
      FROM pricing_calculation
      WHERE cargo_id = $1
      ORDER BY calculation_timestamp DESC
    `;
    return await this.databaseService.query<PricingCalculationEntity>(query, [
      cargoId,
    ]);
  }

  async findByCargoIdLatest(
    cargoId: number,
  ): Promise<PricingCalculationEntity | null> {
    const query = `
      SELECT id, uuid, cargo_id, base_price, shipping_cost, insurance_cost, tax_cost, customs_cost,
             total_amount, currency_id, shipment_type_id, calculation_timestamp, calculated_by, created_at
      FROM pricing_calculation
      WHERE cargo_id = $1
      ORDER BY calculation_timestamp DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<PricingCalculationEntity>(
      query,
      [cargoId],
    );
  }
}

