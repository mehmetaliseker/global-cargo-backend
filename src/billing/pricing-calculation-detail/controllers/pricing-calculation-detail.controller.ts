import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PricingCalculationDetailService } from '../services/pricing-calculation-detail.service';
import { PricingCalculationDetailResponseDto } from '../dto/pricing-calculation-detail.dto';

@Controller('billing/pricing-calculation-details')
export class PricingCalculationDetailController {
  constructor(
    private readonly pricingCalculationDetailService: PricingCalculationDetailService,
  ) {}

  @Get()
  async findAll(): Promise<PricingCalculationDetailResponseDto[]> {
    return await this.pricingCalculationDetailService.findAll();
  }

  @Get('pricing-calculation/:pricingCalculationId')
  async findByPricingCalculationId(
    @Param('pricingCalculationId', ParseIntPipe) pricingCalculationId: number,
  ): Promise<PricingCalculationDetailResponseDto[]> {
    return await this.pricingCalculationDetailService.findByPricingCalculationId(
      pricingCalculationId,
    );
  }

  @Get('cost-type/:costType')
  async findByCostType(
    @Param('costType') costType: string,
  ): Promise<PricingCalculationDetailResponseDto[]> {
    return await this.pricingCalculationDetailService.findByCostType(costType);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PricingCalculationDetailResponseDto> {
    return await this.pricingCalculationDetailService.findById(id);
  }
}

