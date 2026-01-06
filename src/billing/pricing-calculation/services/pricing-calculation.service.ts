import { Injectable, NotFoundException } from '@nestjs/common';
import { PricingCalculationRepository } from '../repositories/pricing-calculation.repository';
import { PricingCalculationResponseDto } from '../dto/pricing-calculation.dto';
import { PricingCalculationEntity } from '../repositories/pricing-calculation.repository.interface';

@Injectable()
export class PricingCalculationService {
  constructor(
    private readonly pricingCalculationRepository: PricingCalculationRepository,
  ) {}

  private mapToDto(
    entity: PricingCalculationEntity,
  ): PricingCalculationResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      cargoId: entity.cargo_id,
      basePrice: parseFloat(entity.base_price.toString()),
      shippingCost: parseFloat(entity.shipping_cost.toString()),
      insuranceCost: parseFloat(entity.insurance_cost.toString()),
      taxCost: parseFloat(entity.tax_cost.toString()),
      customsCost: parseFloat(entity.customs_cost.toString()),
      totalAmount: parseFloat(entity.total_amount.toString()),
      currencyId: entity.currency_id,
      shipmentTypeId: entity.shipment_type_id,
      calculationTimestamp: entity.calculation_timestamp.toISOString(),
      calculatedBy: entity.calculated_by,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<PricingCalculationResponseDto[]> {
    const entities = await this.pricingCalculationRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PricingCalculationResponseDto> {
    const entity = await this.pricingCalculationRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Pricing calculation with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<PricingCalculationResponseDto> {
    const entity = await this.pricingCalculationRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Pricing calculation with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<PricingCalculationResponseDto[]> {
    const entities =
      await this.pricingCalculationRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdLatest(
    cargoId: number,
  ): Promise<PricingCalculationResponseDto> {
    const entity =
      await this.pricingCalculationRepository.findByCargoIdLatest(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Pricing calculation for cargo id ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }
}

