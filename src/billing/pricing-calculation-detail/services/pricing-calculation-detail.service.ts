import { Injectable, NotFoundException } from '@nestjs/common';
import { PricingCalculationDetailRepository } from '../repositories/pricing-calculation-detail.repository';
import { PricingCalculationDetailResponseDto } from '../dto/pricing-calculation-detail.dto';
import { PricingCalculationDetailEntity } from '../repositories/pricing-calculation-detail.repository.interface';

@Injectable()
export class PricingCalculationDetailService {
  constructor(
    private readonly pricingCalculationDetailRepository: PricingCalculationDetailRepository,
  ) {}

  private mapToDto(
    entity: PricingCalculationDetailEntity,
  ): PricingCalculationDetailResponseDto {
    return {
      id: entity.id,
      pricingCalculationId: entity.pricing_calculation_id,
      costType: entity.cost_type,
      amount: parseFloat(entity.amount.toString()),
      description: entity.description,
      calculationFactor: entity.calculation_factor
        ? (entity.calculation_factor as Record<string, unknown>)
        : undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<PricingCalculationDetailResponseDto[]> {
    const entities = await this.pricingCalculationDetailRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PricingCalculationDetailResponseDto> {
    const entity = await this.pricingCalculationDetailRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Pricing calculation detail with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByPricingCalculationId(
    pricingCalculationId: number,
  ): Promise<PricingCalculationDetailResponseDto[]> {
    const entities =
      await this.pricingCalculationDetailRepository.findByPricingCalculationId(
        pricingCalculationId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCostType(
    costType: string,
  ): Promise<PricingCalculationDetailResponseDto[]> {
    const entities =
      await this.pricingCalculationDetailRepository.findByCostType(costType);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

